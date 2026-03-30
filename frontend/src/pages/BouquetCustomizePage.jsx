import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL;

const FILLERS = [
  { id: 'babysbreath', name: "Baby's Breath", desc: 'Soft & delicate', emoji: '🤍', price: 30 },
  { id: 'eucalyptus',  name: 'Eucalyptus',   desc: 'Fresh & modern',  emoji: '🌿', price: 40 },
  { id: 'fern',        name: 'Fern',          desc: 'Wild & dramatic', emoji: '🌱', price: 25 },
  { id: 'gypsophila',  name: 'Gypsophila',    desc: 'Airy & romantic', emoji: '☁️', price: 35 },
  { id: 'none',        name: 'No Filler',     desc: 'Flowers only',    emoji: '🚫', price: 0  },
];

const CARD_STYLES = [
  { id: 'classic',  name: 'Classic',  bg: 'linear-gradient(135deg,#fce4f0,#f8d0e8)', border: '#d4a0c8' },
  { id: 'ivory',    name: 'Ivory',    bg: 'linear-gradient(135deg,#f5e8c8,#ede0b0)', border: '#c8a860' },
  { id: 'garden',   name: 'Garden',   bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', border: '#6ee7b7' },
  { id: 'romantic', name: 'Romantic', bg: 'linear-gradient(135deg,#ffe8ed,#ffd6e0)', border: '#ffadc5' },
];

export default function BouquetCustomizePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const { addToCart } = useCartContext();

  const [flowers, setFlowers]       = useState([]);
  const [selected, setSelected]     = useState([]);
  const [filler, setFiller]         = useState(FILLERS[0]);
  const [step, setStep]             = useState(0); // 0=flowers, 1=filler, 2=card
  const [cardStyle, setCardStyle]   = useState(CARD_STYLES[0]);
  const [recipient, setRecipient]   = useState('');
  const [message, setMessage]       = useState('');
  const [sender, setSender]         = useState('');
  const [addPostcard, setAddPostcard] = useState(false);
  const [postcardAddress, setPostcardAddress] = useState('');
  const [toast, setToast]           = useState('');

  useEffect(() => {
    fetch(`${API}/api/flowers`)
      .then(r => r.json())
      .then(data => setFlowers(data.filter(f => f.category === category && f.inStock)))
      .catch(console.error);
  }, [category]);

  const totalStems = selected.reduce((s, x) => s + x.qty, 0);
  const stemTotal  = selected.reduce((s, x) => s + (x.flower.pricePerStem || 0) * x.qty, 0);
  const fillerTotal = filler.id !== 'none' ? filler.price * Math.ceil(totalStems / 3) : 0;
  const postcardFee = addPostcard ? 49 : 0;
  const grandTotal  = stemTotal + fillerTotal + postcardFee;

  const toggleFlower = (f) => {
    setSelected(prev => {
      const ex = prev.find(x => x.flower._id === f._id);
      if (ex) {
        if (ex.qty >= 10) return prev;
        return prev.map(x => x.flower._id === f._id ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, { flower: f, qty: 1 }];
    });
  };

  const removeOne = (id) => {
    setSelected(prev => {
      const ex = prev.find(x => x.flower._id === id);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter(x => x.flower._id !== id);
      return prev.map(x => x.flower._id === id ? { ...x, qty: x.qty - 1 } : x);
    });
  };

  const addToCartAndGo = () => {
    selected.forEach(({ flower, qty }) => {
      for (let i = 0; i < qty; i++) addToCart(flower);
    });
    setToast('Bouquet added to cart! 🛒');
    setTimeout(() => { setToast(''); navigate('/cart'); }, 1500);
  };

  const STEPS = ['🌸 Pick Flowers', '🌿 Choose Filler', '💌 Add Card'];

  return (
    <div className="min-h-screen bg-pink-50 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/flowers')}
          className="text-pink-400 hover:text-pink-600 text-sm font-medium">← Back</button>
        <h1 className="font-playfair font-bold text-[clamp(1.4rem,3vw,2rem)] text-roseDD capitalize">
          {category} Bouquet
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-7 max-w-lg">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${i === step ? 'bg-pink-500 text-white' : i < step ? 'bg-pink-200 text-pink-700' : 'bg-white text-gray-400 border border-pink-100'}`}>
              {label}
            </div>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? 'bg-pink-400' : 'bg-pink-100'}`}/>}
          </div>
        ))}
      </div>

      {/* Step 0 — Pick Flowers */}
      {step === 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Click flowers to add them to your bouquet. Minimum 3 stems.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {flowers.map(f => {
              const sel = selected.find(x => x.flower._id === f._id);
              return (
                <div key={f._id}
                  className={`relative bg-white rounded-xl border-2 p-3 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${sel ? 'border-pink-500 shadow-soft-s' : 'border-pink-100 hover:border-pink-300'}`}
                  onClick={() => toggleFlower(f)}>
                  {sel && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {sel.qty}
                    </div>
                  )}
                  {f.image && f.image !== 'PASTE_LINK_HERE'
                    ? <img src={f.image} alt={f.name} className="w-full h-24 object-cover rounded-lg mb-2"/>
                    : <div className="text-3xl text-center mb-2">🌸</div>
                  }
                  <p className="font-playfair font-semibold text-xs text-roseDD mb-0.5">{f.name}</p>
                  <p className="text-xs text-roseD font-semibold">₹{f.pricePerStem}/stem</p>
                  {sel && (
                    <button onClick={e => { e.stopPropagation(); removeOne(f._id); }}
                      className="mt-1.5 w-full text-[0.65rem] text-pink-400 border border-pink-200 rounded-lg py-0.5 hover:bg-pink-50">
                      − Remove one
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary bar */}
          <div className="sticky bottom-4 bg-white border border-pink-100 rounded-2xl shadow-soft-m px-5 py-3 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-sm font-semibold text-roseDD">{totalStems} stem{totalStems !== 1 ? 's' : ''} selected</span>
              <span className="text-xs text-gray-400 ml-2">₹{stemTotal} total</span>
            </div>
            <button onClick={() => setStep(1)} disabled={totalStems < 3}
              className="bg-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2 rounded-full transition-all">
              Choose Filler 🌿 →
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Filler */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-5">Choose a filler green to complement your bouquet.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {FILLERS.map(f => (
              <div key={f.id} onClick={() => setFiller(f)}
                className={`bg-white rounded-2xl border-2 p-4 text-center cursor-pointer transition-all hover:-translate-y-1 ${filler.id === f.id ? 'border-pink-500 shadow-soft-s' : 'border-pink-100 hover:border-pink-300'}`}>
                <div className="text-3xl mb-2">{f.emoji}</div>
                <p className="font-semibold text-sm text-roseDD mb-0.5">{f.name}</p>
                <p className="text-xs text-gray-400 mb-1">{f.desc}</p>
                <p className="text-xs font-semibold text-roseD">{f.price > 0 ? `+₹${f.price}/3 stems` : 'Free'}</p>
              </div>
            ))}
          </div>
          <div className="sticky bottom-4 bg-white border border-pink-100 rounded-2xl shadow-soft-m px-5 py-3 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-sm font-semibold text-roseDD">Subtotal: ₹{stemTotal + fillerTotal}</span>
              <span className="text-xs text-gray-400 ml-2">({totalStems} stems + {filler.name})</span>
            </div>
            <button onClick={() => setStep(2)}
              className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all">
              Add Card 💌 →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Card */}
      {step === 2 && (
        <div className="max-w-2xl">
          <p className="text-sm text-gray-500 mb-5">Write a message to go with your bouquet. Optionally add a real printed postcard.</p>

          {/* Card style */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-roseDD uppercase tracking-wide mb-3">Card Style</p>
            <div className="flex gap-3 flex-wrap">
              {CARD_STYLES.map(cs => (
                <div key={cs.id} onClick={() => setCardStyle(cs)}
                  className="cursor-pointer transition-all"
                  style={{ transform: cardStyle.id === cs.id ? 'scale(1.08)' : 'scale(1)' }}>
                  <div style={{ width: 80, height: 56, borderRadius: 10, background: cs.bg, border: `3px solid ${cardStyle.id === cs.id ? '#ec4899' : cs.border}`, boxShadow: cardStyle.id === cs.id ? '0 4px 14px rgba(0,0,0,0.15)' : 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#5a4030', fontFamily: 'sans-serif' }}>{cs.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message fields */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5 mb-5 flex flex-col gap-3">
            {[
              { label: 'To', val: recipient, set: setRecipient, placeholder: 'Recipient name' },
              { label: 'From', val: sender, set: setSender, placeholder: 'Your name' },
            ].map(item => (
              <div key={item.label}>
                <label className="text-xs font-semibold text-roseDD uppercase tracking-wide block mb-1">{item.label}</label>
                <input value={item.val} onChange={e => item.set(e.target.value)} placeholder={item.placeholder}
                  className="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400"/>
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-roseDD uppercase tracking-wide block mb-1">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                placeholder="Write your heartfelt message..."
                className="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 resize-none"/>
            </div>

            {/* Live preview */}
            {(recipient || message || sender) && (
              <div style={{ background: cardStyle.bg, border: `2px solid ${cardStyle.border}`, borderRadius: 12, padding: '14px 18px' }}>
                {recipient && <p className="text-sm font-bold text-gray-700 mb-1">To {recipient},</p>}
                {message && <p className="text-sm italic text-gray-600 leading-relaxed mb-2">{message}</p>}
                {sender && <p className="text-xs text-gray-500">— {sender}</p>}
              </div>
            )}
          </div>

          {/* Physical postcard option */}
          <div className={`bg-white rounded-2xl border-2 p-4 mb-5 cursor-pointer transition-all ${addPostcard ? 'border-pink-500' : 'border-pink-100 hover:border-pink-300'}`}
            onClick={() => setAddPostcard(v => !v)}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${addPostcard ? 'bg-pink-500 border-pink-500' : 'border-pink-300'}`}>
                {addPostcard && <span className="text-white text-[10px]">✓</span>}
              </div>
              <div>
                <p className="text-sm font-semibold text-roseDD">📮 Add a Real Printed Postcard <span className="text-xs font-normal text-pink-400">+₹49</span></p>
                <p className="text-xs text-gray-400">We'll print & include a physical postcard with your bouquet delivery</p>
              </div>
            </div>
            {addPostcard && (
              <div className="mt-3" onClick={e => e.stopPropagation()}>
                <label className="text-xs font-semibold text-roseDD uppercase tracking-wide block mb-1">Delivery Address for Postcard</label>
                <textarea value={postcardAddress} onChange={e => setPostcardAddress(e.target.value)} rows={2}
                  placeholder="Full address where postcard should be delivered..."
                  className="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 resize-none"/>
              </div>
            )}
          </div>

          {/* Final summary + add to cart */}
          <div className="bg-white border border-pink-100 rounded-2xl shadow-soft-m px-5 py-4">
            <div className="flex flex-col gap-1 mb-4 text-sm">
              <div className="flex justify-between text-gray-500"><span>Flowers ({totalStems} stems)</span><span>₹{stemTotal}</span></div>
              {filler.id !== 'none' && <div className="flex justify-between text-gray-500"><span>Filler ({filler.name})</span><span>₹{fillerTotal}</span></div>}
              {addPostcard && <div className="flex justify-between text-gray-500"><span>Printed Postcard</span><span>₹49</span></div>}
              <div className="flex justify-between font-bold text-roseDD border-t border-pink-100 pt-2 mt-1"><span>Total</span><span>₹{grandTotal}</span></div>
            </div>
            <button onClick={addToCartAndGo}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full text-sm transition-all">
              Add to Cart & Checkout 🛒
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-roseDD text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg" style={{animation:'pageIn 0.3s ease both'}}>
          {toast}
        </div>
      )}
    </div>
  );
}
