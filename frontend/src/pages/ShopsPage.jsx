import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCartContext } from "../context/CartContext";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const FLOWER_SHOP_ICONS = ["🌺", "🌸", "🌹", "🌼", "💐", "🌷", "🪷", "🌻"];
const PLANT_SHOP_ICONS  = ["🌿", "🪴", "🌱", "🌳", "🍃", "🌵", "🎋", "🍀"];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function makeShopIcon(isPlant, isActive) {
  const bg     = isPlant ? (isActive ? "#1a4a15" : "#2D6A27") : (isActive ? "#a8304a" : "#e75480");
  const emoji  = isPlant ? "🌿" : "🌺";
  const size   = isActive ? 40 : 32;
  const anchor = isActive ? 20 : 16;
  const shadow = isPlant
    ? (isActive ? "0 4px 14px rgba(26,74,21,0.5)" : "0 2px 8px rgba(0,0,0,0.25)")
    : (isActive ? "0 4px 14px rgba(168,48,74,0.5)" : "0 2px 8px rgba(0,0,0,0.25)");
  const border = isActive ? "3px solid white" : "2px solid white";
  return new L.DivIcon({
    html: `<div style="background:${bg};color:white;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${isActive?18:15}px;box-shadow:${shadow};border:${border};">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
}

const userIcon = new L.DivIcon({
  html: `<div style="background:#6c63ff;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 12px rgba(108,99,255,0.5);border:3px solid white;">📍</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function FlyToShop({ shop }) {
  const map = useMap();
  useEffect(() => {
    if (shop?.location?.coordinates) {
      const [lng, lat] = shop.location.coordinates;
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [shop, map]);
  return null;
}

export default function ShopsPage() {
  const location = useLocation();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('mode') === 'plant' ? 'plant' : 'flower';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'plant') setMode('plant');
  }, [location.search]);
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  });
  const [userPos, setUserPos] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopFlowers, setShopFlowers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeMapShop, setActiveMapShop] = useState(null);
  const { addToCart, cartItems } = useCartContext();
  const [toast, setToast] = useState("");

  function handleAddToCart(f) {
    addToCart(f);
    setToast(f.name);
    setTimeout(() => setToast(""), 2000);
  }

  useEffect(() => {
    fetch(`${API}/api/shops`)
      .then((r) => r.json())
      .then((data) => setShops(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => setUserPos([20.2961, 85.8245])
      );
    } else {
      setUserPos([20.2961, 85.8245]);
    }
  }, []);

  const filtered = shops.filter((s) => {
    const q = search.toLowerCase();
    const typeMatch = (s.type || "flower") === mode;
    const textMatch =
      s.name.toLowerCase().includes(q) ||
      (s.area && s.area.toLowerCase().includes(q)) ||
      (s.city && s.city.toLowerCase().includes(q));
    return typeMatch && textMatch;
  });

  const isPlant = mode === "plant";

  async function openShop(shop) {
    setActiveMapShop(shop);
    setSelectedShop(shop);
    setModalLoading(true);
    setShopFlowers([]);
    try {
      const url = isPlant
        ? `${API}/api/plants?city=${encodeURIComponent(shop.city)}`
        : `${API}/api/flowers/city/${encodeURIComponent(shop.city)}`;
      const res  = await fetch(url);
      const data = await res.json();
      setShopFlowers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setModalLoading(false);
    }
  }

  function closeModal() {
    setSelectedShop(null);
    setShopFlowers([]);
  }

  const mapCenter = userPos || [20.2961, 85.8245];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Top header + search */}
      <div className="px-6 pt-6 pb-4 max-w-[1400px] mx-auto">

        {/* Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => { setMode("flower"); setSearch(""); setSelectedShop(null); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              mode === "flower"
                ? "bg-pink-500 text-white border-pink-500 shadow-md"
                : "bg-white text-pink-400 border-pink-200 hover:border-pink-400"
            }`}
          >
            🌸 Flower Shops
          </button>
          <button
            onClick={() => { setMode("plant"); setSearch(""); setSelectedShop(null); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              mode === "plant"
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "bg-white text-green-600 border-green-200 hover:border-green-500"
            }`}
          >
            🌿 Plant Nurseries
          </button>
        </div>

        <h2 className={`font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] mb-1 ${
          isPlant ? "text-green-700" : "text-roseDD"
        }`}>
          {isPlant ? "🌿 Find Plant Nurseries" : "🌺 Find Flower Shops"}
        </h2>
        <p className="text-sm text-gray-400 mb-4">Search shops or explore on the map</p>

        <div className={`flex items-center gap-3 bg-white rounded-2xl border-2 px-4 py-3 shadow-sm max-w-lg transition-all ${
          isPlant ? "border-green-100 focus-within:border-green-400" : "border-pink-100 focus-within:border-pink-400"
        }`}>
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isPlant ? "Search nurseries or area..." : "Search by shop name or area..."}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 text-lg leading-none">
              ✕
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} {isPlant ? "nurser" : "shop"}{filtered.length !== 1 ? (isPlant ? "ies" : "s") : (isPlant ? "y" : "")} found for "{search}"
          </p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1400px] mx-auto px-6 pb-10 flex flex-col lg:flex-row gap-5" style={{ minHeight: "calc(100vh - 180px)" }}>

        {/* LEFT — Map (sticky) */}
        <div className="lg:w-[55%] w-full">
          <div className="sticky top-[70px]">
            <div
              className="rounded-2xl overflow-hidden border-2 border-pink-100 shadow-md"
              style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
            >
              {userPos && (
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {activeMapShop && <FlyToShop shop={activeMapShop} />}

                  {userPos && (
                    <Marker position={userPos} icon={userIcon}>
                      <Popup>
                        <div className="text-center text-sm font-semibold text-purple-600">📍 You are here</div>
                      </Popup>
                    </Marker>
                  )}

                  {filtered.map((shop) => {
                    if (!shop.location?.coordinates) return null;
                    const [lng, lat] = shop.location.coordinates;
                    const isActive = activeMapShop?._id === shop._id;
                    return (
                      <Marker
                        key={shop._id}
                        position={[lat, lng]}
                        icon={makeShopIcon(isPlant, isActive)}
                        eventHandlers={{ click: () => openShop(shop) }}
                      >
                        <Popup>
                          <div className="text-center min-w-[120px]">
                            <p className="font-semibold text-sm text-pink-600 mb-0.5">{shop.name}</p>
                            <p className="text-xs text-gray-400 mb-2">{shop.area}</p>
                            <button
                              onClick={() => openShop(shop)}
                              className={`text-xs text-white px-3 py-1 rounded-full transition ${
                                isPlant ? "bg-green-600 hover:bg-green-700" : "bg-pink-500 hover:bg-pink-600"
                              }`}
                            >
                              {isPlant ? "View Plants" : "View Flowers"}
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
              {!userPos && (
                <div className="h-full flex items-center justify-center bg-pink-50">
                  <p className="text-pink-400 text-sm">Loading map...</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              🟣 You &nbsp;|&nbsp; {isPlant ? "🌿 Nurseries — click any pin to view plants" : "🌺 Shops — click any pin to view flowers"}
            </p>
          </div>
        </div>

        {/* RIGHT — Shops list (scrollable) */}
        <div className="lg:w-[45%] w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-playfair font-semibold text-lg ${
              isPlant ? "text-green-700" : "text-roseDD"
            }`}>
              {search ? `"${search}"` : (isPlant ? "All Nurseries" : "All Shops")}
              <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
            </h3>
          </div>

          {loading && <p className="text-pink-400 text-sm">Loading shops...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-gray-400 text-sm">No shops found{search ? ` for "${search}"` : ""}.</p>
          )}

          <div className="flex flex-col gap-3">
            {filtered.map((shop, i) => (
              <div
                key={shop._id}
                onClick={() => openShop(shop)}
                className={`bg-white rounded-xl border-2 px-4 py-3 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  activeMapShop?._id === shop._id
                    ? (isPlant ? "border-green-500 shadow-md bg-green-50" : "border-pink-400 shadow-md bg-pink-50")
                    : (isPlant ? "border-green-100 hover:border-green-400" : "border-pink-100 hover:border-pink-300")
                }`}
              >
                <div className="text-3xl flex-shrink-0">
                  {isPlant ? PLANT_SHOP_ICONS[i % PLANT_SHOP_ICONS.length] : FLOWER_SHOP_ICONS[i % FLOWER_SHOP_ICONS.length]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-playfair font-semibold text-sm leading-tight truncate ${
                    isPlant ? "text-green-700" : "text-roseDD"
                  }`}>
                    {shop.name}
                  </h4>
                  {shop.area && (
                    <p className="text-xs text-gray-400 mt-0.5">📍 {shop.area}, {shop.city}</p>
                  )}
                </div>
                <span className="text-xs text-pink-400 flex-shrink-0">View →</span>
              </div>
            ))}
          </div>

          {/* ── Instagram Reels ── */}
          <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a0a2e,#2d1b3d,#1a0a2e)', padding: '28px 20px' }}>
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-3">
                <span className="text-pink-300 text-xs font-semibold">✨ Featured on Instagram</span>
              </div>
              <h3 className="font-playfair font-bold text-white text-base mb-1">🌸 heartartbysweta</h3>
              <p className="text-purple-200 text-xs">Handcrafted bouquets & floral art</p>
            </div>
            <style>{`
              .reel-card{flex-shrink:0;width:100px;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,0.12);transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;background:rgba(255,255,255,0.06);text-decoration:none;}
              .reel-card:hover{transform:translateY(-6px) scale(1.05);border-color:rgba(255,182,193,0.6);box-shadow:0 16px 32px rgba(0,0,0,0.4);}
              @keyframes shimmer{0%,100%{opacity:0.5;}50%{opacity:1;}}
            `}</style>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth:'none' }}>
              {[
                { url:'https://www.instagram.com/reel/DPtTDvPE-gn/?igsh=OWdtMWh0d2xvNG4z', emoji:'🌹', label:'Rose Bouquet' },
                { url:'https://www.instagram.com/reel/DRhiPyZk4pR/?igsh=djJkajk2eWJ4dWZz', emoji:'🌸', label:'Floral Art' },
                { url:'https://www.instagram.com/reel/DOn76waDzlk/?igsh=MXV0c2s0Zzl6dm9hYg==', emoji:'💐', label:'Mixed Blooms' },
                { url:'https://www.instagram.com/reel/DPtssgQkuHf/?igsh=MW42dDRoamZ6ZHd3cg==', emoji:'🌷', label:'Tulip Special' },
                { url:'https://www.instagram.com/reel/DR3mcNuAVIW/?igsh=cmNqYzlqNTg0NWs2', emoji:'🌺', label:'Hibiscus Art' },
                { url:'https://www.instagram.com/reel/DVqpn0fjAOb/?igsh=MWY5YWgydDJtcDYyMw==', emoji:'🪷', label:'Lotus Craft' },
              ].map((reel, i) => (
                <a key={i} href={reel.url} target="_blank" rel="noreferrer" className="reel-card">
                  <div style={{ width:'100%', aspectRatio:'9/16', background:`linear-gradient(135deg,hsl(${300+i*20},60%,20%),hsl(${320+i*15},70%,30%))`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                    <span style={{ fontSize:28, animation:`shimmer ${2+i*0.3}s ease-in-out infinite` }}>{reel.emoji}</span>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontFamily:'sans-serif', letterSpacing:1 }}>▶ REEL</span>
                  </div>
                  <div style={{ padding:'8px' }}>
                    <p style={{ margin:0, fontSize:10, color:'rgba(255,255,255,0.85)', fontWeight:600, fontFamily:'sans-serif' }}>{reel.label}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-4">
              <a href="https://www.instagram.com/heartartbysweta?igsh=eXQ0eHJ0c3RsOGdk" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold hover:-translate-y-0.5 transition-all"
                style={{ background:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color:'white', boxShadow:'0 4px 14px rgba(220,39,67,0.4)' }}>
                📸 Follow @heartartbysweta
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flower Modal */}
      {selectedShop && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <h3 className={`font-playfair font-bold text-xl mb-1 ${
              isPlant ? "text-green-700" : "text-roseDD"
            }`}>
              {isPlant ? "🌿" : "🌸"} {selectedShop.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">📍 {selectedShop.area}, {selectedShop.city}</p>

            {modalLoading && <p className="text-sm text-gray-400">Loading {isPlant ? 'plants' : 'flowers'}...</p>}
            {!modalLoading && shopFlowers.length === 0 && (
              <p className="text-gray-400 text-sm">{isPlant ? "No plants listed yet for this nursery." : "No flowers available."}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shopFlowers.map((f) => {
                const outOfStock = !f.inStock;
                const price = isPlant ? f.price : f.pricePerStem;
                const priceLabel = isPlant ? `₹${price}` : `₹${price}/stem`;
                return (
                  <div key={f._id}
                    className={`rounded-xl border p-3 ${
                      outOfStock ? "bg-red-50 border-red-200"
                      : isPlant  ? "bg-green-50 border-green-200"
                      :            "bg-pink-50 border-pink-200"
                    }`}
                  >
                    {f.image && f.image !== "PASTE_LINK_HERE" && (
                      <img src={f.image} alt={f.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                    )}
                    {!f.image && <div className="text-3xl text-center mb-2">{f.img || (isPlant ? '🌿' : '🌸')}</div>}
                    <p className={`font-semibold text-sm mb-1 ${isPlant ? 'text-green-700' : 'text-roseDD'}`}>{f.name}</p>
                    {f.category && <p className="text-xs text-gray-400 mb-1">🏷 {f.category}</p>}
                    {f.color && <p className="text-xs text-gray-400 mb-1">🎨 {f.color}</p>}
                    {f.nursery && <p className="text-xs text-gray-400 mb-1">🏪 {f.nursery}</p>}
                    <p className={`text-xs font-semibold mb-1 ${isPlant ? 'text-green-700' : 'text-roseD'}`}>{priceLabel}</p>
                    <span className={`text-xs font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
                      {outOfStock ? "❌ Out of Stock" : "✅ In Stock"}
                    </span>
                    {!outOfStock && (
                      <button
                        onClick={() => handleAddToCart(f)}
                        className={`mt-2 w-full text-white text-xs py-1.5 rounded-lg transition active:scale-95 ${
                          isPlant ? 'bg-green-600 hover:bg-green-700' : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                      >
                        {cartItems.find(i => i._id === f._id) ? `In Cart 🛒` : 'Add to Cart 🛒'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Featured Shop Reels ── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a0a2e,#2d1b3d,#1a0a2e)', padding: '40px 32px' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-4">
              <span className="text-pink-300 text-sm font-semibold">✨ Featured on Instagram</span>
            </div>
            <h2 className="font-playfair font-bold text-white text-[clamp(1.4rem,3vw,2rem)] mb-2">🌸 heartartbysweta</h2>
            <p className="text-purple-200 text-sm font-light">Beautiful handcrafted bouquets & floral art — follow for daily blooms</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            <style>{`
              .reel-card { flex-shrink: 0; width: 160px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.12); transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; background: rgba(255,255,255,0.06); }
              .reel-card:hover { transform: translateY(-8px) scale(1.04); border-color: rgba(255,182,193,0.6); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
              .reel-thumb { width: 100%; aspect-ratio: 9/16; object-fit: cover; display: block; }
              .reel-overlay { padding: 10px; }
              @keyframes shimmer { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
            `}</style>

            {[
              { url: 'https://www.instagram.com/reel/DPtTDvPE-gn/?igsh=OWdtMWh0d2xvNG4z', emoji: '🌹', label: 'Rose Bouquet' },
              { url: 'https://www.instagram.com/reel/DRhiPyZk4pR/?igsh=djJkajk2eWJ4dWZz', emoji: '🌸', label: 'Floral Art' },
              { url: 'https://www.instagram.com/reel/DOn76waDzlk/?igsh=MXV0c2s0Zzl6dm9hYg==', emoji: '💐', label: 'Mixed Blooms' },
              { url: 'https://www.instagram.com/reel/DPtssgQkuHf/?igsh=MW42dDRoamZ6ZHd3cg==', emoji: '🌷', label: 'Tulip Special' },
              { url: 'https://www.instagram.com/reel/DR3mcNuAVIW/?igsh=cmNqYzlqNTg0NWs2', emoji: '🌺', label: 'Hibiscus Art' },
              { url: 'https://www.instagram.com/reel/DVqpn0fjAOb/?igsh=MWY5YWgydDJtcDYyMw==', emoji: '🪷', label: 'Lotus Craft' },
            ].map((reel, i) => (
              <a key={i} href={reel.url} target="_blank" rel="noreferrer" className="reel-card"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: '100%', aspectRatio: '9/16',
                  background: `linear-gradient(135deg, hsl(${300 + i * 20},60%,20%), hsl(${320 + i * 15},70%,30%))`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 40, animation: `shimmer ${2 + i * 0.3}s ease-in-out infinite` }}>{reel.emoji}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', letterSpacing: 1 }}>▶ REEL</span>
                </div>
                <div className="reel-overlay">
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontFamily: 'sans-serif' }}>{reel.label}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>@heartartbysweta</p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-6">
            <a href="https://www.instagram.com/heartartbysweta?igsh=eXQ0eHJ0c3RsOGdk" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white', boxShadow: '0 6px 20px rgba(220,39,67,0.4)' }}>
              <span>📸</span> Follow @heartartbysweta
            </a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-roseDD text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2" style={{animation:'pageIn 0.3s ease both'}}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
