import { useEffect, useState } from 'react';
import FallingPetals from '../components/FallingPetals';
import FlashSaleCard from '../components/FlashSaleCard';
import { useCartContext } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL;
const FILTERS = ['All', 'Romantic', 'Elegant', 'Bright', 'Exotic', '50% Off', '40% Off'];

function pad(n) { return String(n).padStart(2, '0'); }

function useRealCountdown(endsAt) {
  const calc = () => {
    if (!endsAt) return { h: 0, m: 0, s: 0, done: false };
    const diff = Math.max(0, new Date(endsAt) - new Date());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      done: diff === 0,
    };
  };
  const [time, setTime] = useState({ h: 0, m: 0, s: 0, done: false });
  useEffect(() => {
    if (!endsAt) return;
    setTime(calc());
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return time;
}

export default function FlashSalePage() {
  const { addToCart, cartItems } = useCartContext();
  const [sales, setSales]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [toast, setToast]     = useState('');

  const endsAt = sales[0]?.endsAt;
  const { h, m, s, done } = useRealCountdown(endsAt);

  useEffect(() => {
    fetch(`${API}/api/flashsales`)
      .then(r => r.json())
      .then(data => setSales(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sales.filter(b => {
    if (filter === '50% Off')  return b.discountPct === 50;
    if (filter === '40% Off')  return b.discountPct === 40;
    if (filter !== 'All')      return b.category === filter;
    return true;
  });

  async function handleAdd(item) {
    // Add to cart immediately — don't block on API
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.salePrice,
      image: item.image,
      category: item.category,
      color: '',
      emotion: item.occasion || '',
      city: '',
    });
    setToast(item.name);
    setTimeout(() => setToast(''), 2000);

    // Reduce stock in DB in background
    try {
      await fetch(`${API}/api/flashsales/${item._id}/reduce`, { method: 'PATCH' });
      setSales(prev => prev.map(s =>
        s._id === item._id ? { ...s, stock: Math.max(0, s.stock - 1) } : s
      ));
    } catch (e) { console.error(e); }
  }

  return (
    <div className="page-enter">
      {/* Hero banner */}
      <div className="relative overflow-hidden text-center px-4 py-16 bg-gradient-to-br from-[#ffe0e6] via-[#ffd0d8] to-[#ffe8f0]">
        <FallingPetals count={8} />
        <div className="relative z-10">
          <h1 className="font-playfair font-extrabold text-roseDD text-[clamp(2rem,5vw,3.5rem)] mb-2">
            Flash Blooms 🌸<br />Grab Before They're Gone!
          </h1>
          <p className="text-[1rem] text-textM mb-6 font-light">Real deals on real flowers — updated daily!</p>

          {/* Live countdown */}
          {endsAt && !done && (
            <div className="flex gap-3 justify-center items-center flex-wrap mb-5">
              {[{ n: h, l: 'Hours' }, { sep: ':' }, { n: m, l: 'Minutes' }, { sep: ':' }, { n: s, l: 'Seconds' }].map((it, i) =>
                it.sep ? (
                  <span key={i} className="text-[2.5rem] font-extrabold text-rose animate-[cdBlink_1s_step-end_infinite] pb-5">:</span>
                ) : (
                  <div key={i} className="text-center">
                    <div className="bg-roseDD text-white font-playfair font-extrabold text-[2.8rem] px-4 py-1.5 rounded-xl min-w-[72px] shadow-[0_4px_16px_rgba(168,104,112,.35)]">
                      {pad(it.n)}
                    </div>
                    <div className="text-[.72rem] text-textL mt-1 uppercase tracking-widest font-semibold">{it.l}</div>
                  </div>
                )
              )}
            </div>
          )}

          {done && endsAt && (
            <div className="inline-block bg-orange-50 border border-orange-200 rounded-xl px-5 py-2 text-orange-500 font-medium mb-5">
              ⏰ Sale extended — grab while stocks last!
            </div>
          )}

          {endsAt && !done && (
            <div className="inline-block bg-roseDD/10 border border-rose/30 rounded-xl px-5 py-2 text-[.85rem] text-roseDD font-medium">
              ⏰ Sale ends at midnight — hurry!
            </div>
          )}
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* Stats bar */}
        {!loading && (
          <div className="flex gap-4 flex-wrap mb-6">
            <div className="bg-white rounded-2xl border border-pink-100 px-5 py-3 text-center shadow-soft-s">
              <p className="text-2xl font-extrabold text-roseD">{sales.length}</p>
              <p className="text-xs text-gray-400">Active Deals</p>
            </div>
            <div className="bg-white rounded-2xl border border-pink-100 px-5 py-3 text-center shadow-soft-s">
              <p className="text-2xl font-extrabold text-roseD">{Math.max(...sales.map(s => s.discountPct), 0)}%</p>
              <p className="text-xs text-gray-400">Max Discount</p>
            </div>
            <div className="bg-white rounded-2xl border border-pink-100 px-5 py-3 text-center shadow-soft-s">
              <p className="text-2xl font-extrabold text-roseD">{sales.reduce((a, s) => a + s.stock, 0)}</p>
              <p className="text-xs text-gray-400">Items Left</p>
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full border-[1.5px] text-[.8rem] font-medium transition-all
                ${filter === f ? 'bg-blush border-rose text-roseD font-bold' : 'bg-white border-blush/40 text-textL hover:border-rose hover:text-roseD'}`}
            >{f}</button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-pink-100">
                <div className="w-full h-36 bg-pink-100 rounded-xl mb-3" />
                <div className="h-4 bg-pink-100 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-pink-50 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🥀</div>
            <p className="text-gray-400 font-medium">No deals found for this filter</p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {filtered.map(item => (
            <div key={item._id} className="relative">
              {cartItems.find(i => i._id === item._id) && (
                <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[.6rem] font-bold px-2 py-0.5 rounded-full">
                  In Cart ✓
                </div>
              )}
              <FlashSaleCard item={item} onAdd={handleAdd} />
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-roseDD text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
          style={{ animation: 'pageIn 0.3s ease both' }}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
