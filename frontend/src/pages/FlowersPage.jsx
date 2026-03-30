import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function FlowersPage() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCartContext();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const [wishToast, setWishToast] = useState("");
  const [toast, setToast] = useState("");
  const [lastAdded, setLastAdded] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [activeType, setActiveType] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tab, setTab] = useState('flowers');

  function handleAddToCart(f) {
    addToCart(f);
    setLastAdded(f);
    setToast(f.name);
    setTimeout(() => setToast(""), 8000);
  }

  function handleWishlist(f) {
    toggleWishlist(f);
    setWishToast(inWishlist(f._id) ? `Removed from wishlist` : `${f.name} added to wishlist 💖`);
    setTimeout(() => setWishToast(""), 2000);
  }

  useEffect(() => {
    fetch(`${API}/api/flowers`)
      .then(r => r.json())
      .then(data => setFlowers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const individualFlowers = flowers.filter(f => f.type !== 'Bouquet');
  const readyBouquets     = flowers.filter(f => f.type === 'Bouquet');

  const priceMax = individualFlowers.length ? Math.max(...individualFlowers.map(f => f.pricePerStem || 0)) : 1000;
  const flowerTypes = [...new Set(individualFlowers.map(f => f.category).filter(Boolean))];

  const filtered = individualFlowers.filter(f => {
    const q = search.toLowerCase();
    const matchSearch =
      f.name.toLowerCase().includes(q) ||
      (f.category && f.category.toLowerCase().includes(q)) ||
      (f.color && f.color.toLowerCase().includes(q)) ||
      (f.emotion && f.emotion.toLowerCase().includes(q)) ||
      (f.city && f.city.toLowerCase().includes(q));
    const price = f.pricePerStem || 0;
    const matchPrice = price >= minPrice && price <= (maxPrice === Infinity ? priceMax : maxPrice);
    const matchType = !activeType || f.category === activeType;
    return matchSearch && matchPrice && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return (a.pricePerStem || 0) - (b.pricePerStem || 0);
    if (sortBy === "price_desc") return (b.pricePerStem || 0) - (a.pricePerStem || 0);
    if (sortBy === "new") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  const activeCount = [minPrice > 0 || maxPrice !== Infinity, !!activeType, sortBy !== "recommended"].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-pink-50 p-6">

      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD whitespace-nowrap">
          🌸 All Flowers
        </h2>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => { setSearchOpen(v => { if (v) setSearch(""); return !v; }); }}
            className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${searchOpen ? "bg-pink-500 border-pink-500 text-white" : "bg-white border-pink-200 text-pink-400 hover:border-pink-400"}`}>
            {searchOpen ? "✕" : "🔍"}
          </button>
          <div className="overflow-hidden transition-all duration-500" style={{ width: searchOpen ? "200px" : "0px", opacity: searchOpen ? 1 : 0 }}>
            <div className="flex items-center bg-white border-2 border-pink-300 rounded-full px-3 py-1.5 shadow-sm gap-2">
              <span className="text-pink-300 text-xs">✿</span>
              <input autoFocus={searchOpen} type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="rose, red, love..."
                className="flex-1 outline-none text-xs text-gray-600 bg-transparent placeholder-pink-200 w-full"/>
              {search && <button onClick={() => setSearch("")} className="text-pink-300 hover:text-pink-500 text-xs">✕</button>}
            </div>
          </div>
          {search && <span className="text-[0.7rem] font-semibold bg-pink-100 text-pink-500 px-2.5 py-1 rounded-full border border-pink-200">{filtered.length} found ✨</span>}

          <button onClick={() => setFilterOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all ${filterOpen ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-pink-200 text-pink-500 hover:border-pink-400'}`}>
            🎛 Filters
            {activeCount > 0 && (
              <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold ${filterOpen ? 'bg-white text-pink-500' : 'bg-pink-500 text-white'}`}>
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[['flowers','🌸 Individual Flowers'],['bouquets','💐 Ready Bouquets']].map(([t,label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${tab===t ? 'bg-pink-500 border-pink-500 text-white shadow-soft-s' : 'bg-white border-pink-200 text-pink-500 hover:border-pink-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Ready Bouquets tab */}
      {tab === 'bouquets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading && <p className="text-pink-400 text-sm col-span-full">🌸 Loading bouquets...</p>}
          {!loading && readyBouquets.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full text-center py-10">No bouquets found.</p>
          )}
          {readyBouquets.map(b => (
            <div key={b._id}
              className="bg-white rounded-2xl border-2 border-pink-100 hover:border-pink-400 shadow-soft-s hover:shadow-soft-m transition-all cursor-pointer hover:-translate-y-1 group overflow-hidden"
              onClick={() => handleAddToCart(b)}>
              <div className="h-48 overflow-hidden">
                {b.image
                  ? <img src={b.image} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  : <div className="w-full h-full bg-pink-50 flex items-center justify-center text-4xl">💐</div>
                }
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-bold text-roseDD mb-1">{b.name}</h3>
                <p className="text-xs text-gray-400 mb-1">💫 {b.emotion}</p>
                <p className="text-xs text-gray-400 mb-1">🏷 {b.category}</p>
                {b.occasion?.length > 0 && <p className="text-xs text-gray-400 mb-2">🎉 {b.occasion.join(', ')}</p>}
                <p className="text-xs font-semibold text-roseD mb-3">₹{b.priceRange?.min} – ₹{b.priceRange?.max}</p>
                <button
                  onClick={e => { e.stopPropagation(); handleAddToCart(b); }}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-1.5 rounded-lg transition active:scale-95">
                  {cartItems.find(i => i._id === b._id) ? `In Cart (${cartItems.find(i => i._id === b._id).quantity}) 🛒` : 'Add to Cart 🛒'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual Flowers tab */}
      {tab === 'flowers' && (
        <div className="flex gap-4 items-start">

          {/* Flowers grid */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="flex gap-2 items-center text-pink-400 text-sm">
                <span className="animate-spin">🌸</span> Loading flowers...
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🥀</div>
                <p className="text-gray-400 font-medium">No flowers match your filters</p>
                <p className="text-xs text-gray-300 mt-1">Try adjusting the price range, type, or search</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sorted.map((f, i) => {
                const outOfStock = !f.inStock;
                const isMatch = search && filtered.includes(f);
                return (
                  <div key={f._id}
                    className={`relative bg-white rounded-xl border-2 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      outOfStock ? "border-red-200 opacity-75" : isMatch ? "border-pink-400 shadow-md ring-2 ring-pink-100" : "border-pink-100 hover:border-pink-300"
                    }`}
                    style={{ animation: isMatch ? "popIn 0.3s cubic-bezier(.34,1.56,.64,1) both" : undefined, animationDelay: isMatch ? `${i * 0.04}s` : undefined }}>
                    <button onClick={() => handleWishlist(f)}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 ${inWishlist(f._id) ? 'bg-rose text-white shadow-soft-s' : 'bg-pink-50 text-pink-300 hover:bg-pink-100'}`}>
                      {inWishlist(f._id) ? '❤️' : '🤍'}
                    </button>
                    {f.image && f.image !== "PASTE_LINK_HERE"
                      ? <img src={f.image} alt={f.name} className="w-full h-28 object-cover rounded-lg mb-3"/>
                      : <div className="text-3xl text-center mb-3">🌸</div>
                    }
                    <h3 className="font-playfair font-semibold text-sm text-roseDD mb-1">{f.name}</h3>
                    {f.emotion && <p className="text-xs text-gray-400 mb-1">💫 {f.emotion}</p>}
                    {f.color && <p className="text-xs text-gray-400 mb-1">🎨 {f.color}</p>}
                    {f.category && <p className="text-xs text-gray-400 mb-1">🏷 {f.category}</p>}
                    {f.city && <p className="text-xs text-gray-400 mb-1">📍 {f.city}</p>}
                    <p className="text-xs font-semibold text-roseD mb-1">₹{f.pricePerStem}/stem</p>
                    <p className={`text-xs font-medium mb-2 ${outOfStock ? "text-red-500" : "text-green-600"}`}>
                      {outOfStock ? "❌ Out of Stock" : "✅ In Stock"}
                    </p>
                    {f.retailer?.name && (
                      <p className="text-xs text-pink-400 cursor-pointer hover:underline mb-2" onClick={() => navigate(`/shop/${f.retailer._id}`)}>
                        🏪 {f.retailer.name}
                      </p>
                    )}
                    {!outOfStock && (
                      <button onClick={() => handleAddToCart(f)}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-1.5 rounded-lg transition active:scale-95">
                        {cartItems.find(i => i._id === f._id) ? `In Cart (${cartItems.find(i => i._id === f._id).quantity}) 🛒` : 'Add to Cart 🛒'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right filter panel */}
          {filterOpen && (
            <aside className="w-[210px] flex-shrink-0 bg-white border border-pink-100 rounded-2xl shadow-soft-s p-4 flex flex-col gap-4 sticky top-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-roseDD">🎛 Filters & Sort</span>
                <button onClick={() => setFilterOpen(false)} className="text-pink-300 hover:text-pink-500 text-sm">✕</button>
              </div>

              {/* Price */}
              <div>
                <p className="text-[0.7rem] font-semibold text-roseDD uppercase tracking-wide mb-2">💰 Price / stem</p>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-[0.65rem] text-gray-400">Min — ₹{minPrice}</span>
                    <input type="range" min={0} max={priceMax} step={1} value={minPrice}
                      onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice === Infinity ? priceMax : maxPrice))}
                      className="w-full accent-pink-500 h-1.5"/>
                  </div>
                  <div>
                    <span className="text-[0.65rem] text-gray-400">Max — ₹{maxPrice === Infinity ? priceMax : maxPrice}</span>
                    <input type="range" min={0} max={priceMax} step={1}
                      value={maxPrice === Infinity ? priceMax : maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value) >= priceMax ? Infinity : Math.max(Number(e.target.value), minPrice))}
                      className="w-full accent-pink-500 h-1.5"/>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-[0.7rem] font-semibold text-roseDD uppercase tracking-wide mb-2">🌺 Type</p>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setActiveType("")}
                    className={`text-[0.7rem] px-3 py-1 rounded-full border transition-all ${!activeType ? "bg-pink-500 border-pink-500 text-white" : "bg-pink-50 border-pink-200 text-pink-500 hover:border-pink-400"}`}>
                    All
                  </button>
                  {flowerTypes.map(type => (
                    <button key={type} onClick={() => setActiveType(t => t === type ? "" : type)}
                      className={`text-[0.7rem] px-3 py-1 rounded-full border transition-all capitalize ${activeType === type ? "bg-pink-500 border-pink-500 text-white" : "bg-pink-50 border-pink-200 text-pink-500 hover:border-pink-400"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-[0.7rem] font-semibold text-roseDD uppercase tracking-wide mb-2">↕ Sort By</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { value:"recommended", label:"⭐ Recommended" },
                    { value:"new",         label:"🆕 New" },
                    { value:"price_asc",   label:"₹ Low to High" },
                    { value:"price_desc",  label:"₹ High to Low" },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value)}
                      className={`text-left text-[0.7rem] px-3 py-1.5 rounded-xl border transition-all ${sortBy === opt.value ? "bg-pink-500 border-pink-500 text-white font-semibold" : "bg-pink-50 border-pink-100 text-gray-500 hover:border-pink-300"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeCount > 0 && (
                <button onClick={() => { setMinPrice(0); setMaxPrice(Infinity); setActiveType(""); setSortBy("recommended"); }}
                  className="text-[0.7rem] text-pink-400 hover:text-pink-600 underline text-left">
                  Clear all filters
                </button>
              )}
            </aside>
          )}

        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-white border-2 border-pink-200 shadow-xl px-5 py-3 rounded-full" style={{animation:'popIn 0.3s ease both'}}>
          <span className="text-sm font-semibold text-roseDD">🛒 {toast} added!</span>
          <button onClick={() => navigate('/postcard', { state: { item: lastAdded } })}
            className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-full transition-all font-semibold">
            ✉️ Personalise
          </button>
          <button onClick={() => navigate('/cart')}
            className="text-xs border border-pink-300 text-pink-500 hover:bg-pink-50 px-3 py-1.5 rounded-full transition-all font-semibold">
            View Cart
          </button>
          <button onClick={() => setToast('')} className="text-gray-300 hover:text-gray-500 text-sm ml-1">✕</button>
        </div>
      )}

      {wishToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-rose text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2" style={{animation:'pageIn 0.3s ease both'}}>
          {wishToast}
        </div>
      )}

      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
