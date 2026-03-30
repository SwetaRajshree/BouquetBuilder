import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCartContext } from "../context/CartContext";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const SHOP_ICONS = ["🌺", "🌸", "🌹", "🌼", "💐", "🌷", "🪷", "🌻"];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const shopIcon = new L.DivIcon({
  html: `<div style="background:#e75480;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;">🌺</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const activeShopIcon = new L.DivIcon({
  html: `<div style="background:#a8304a;color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 14px rgba(168,48,74,0.5);border:3px solid white;">🌺</div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

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
    return (
      s.name.toLowerCase().includes(q) ||
      (s.area && s.area.toLowerCase().includes(q)) ||
      (s.city && s.city.toLowerCase().includes(q))
    );
  });

  async function openShop(shop) {
    setActiveMapShop(shop);
    setSelectedShop(shop);
    setModalLoading(true);
    setShopFlowers([]);
    try {
      const res = await fetch(`${API}/api/flowers/city/${encodeURIComponent(shop.city)}`);
      const data = await res.json();
      setShopFlowers(data);
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
        <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-roseDD mb-1">
          🌺 Find Flower Shops
        </h2>
        <p className="text-sm text-gray-400 mb-4">Search shops or explore on the map</p>

        <div className="flex items-center gap-3 bg-white rounded-2xl border-2 border-pink-100 px-4 py-3 shadow-sm max-w-lg focus-within:border-pink-400 transition-all">
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by shop name or area..."
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
            {filtered.length} shop{filtered.length !== 1 ? "s" : ""} found for "{search}"
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
                        icon={isActive ? activeShopIcon : shopIcon}
                        eventHandlers={{ click: () => openShop(shop) }}
                      >
                        <Popup>
                          <div className="text-center min-w-[120px]">
                            <p className="font-semibold text-sm text-pink-600 mb-0.5">{shop.name}</p>
                            <p className="text-xs text-gray-400 mb-2">{shop.area}</p>
                            <button
                              onClick={() => openShop(shop)}
                              className="text-xs bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600 transition"
                            >
                              View Flowers
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
              🟣 You &nbsp;|&nbsp; 🌺 Shops — click any pin to view flowers
            </p>
          </div>
        </div>

        {/* RIGHT — Shops list (scrollable) */}
        <div className="lg:w-[45%] w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-playfair font-semibold text-roseDD text-lg">
              {search ? `"${search}"` : "All Shops"}
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
                    ? "border-pink-400 shadow-md bg-pink-50"
                    : "border-pink-100 hover:border-pink-300"
                }`}
              >
                <div className="text-3xl flex-shrink-0">{SHOP_ICONS[i % SHOP_ICONS.length]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-playfair font-semibold text-roseDD text-sm leading-tight truncate">
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
            <h3 className="font-playfair font-bold text-xl text-roseDD mb-1">
              🌸 {selectedShop.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">📍 {selectedShop.area}, {selectedShop.city}</p>

            {modalLoading && <p className="text-pink-400 text-sm">Loading flowers...</p>}
            {!modalLoading && shopFlowers.length === 0 && (
              <p className="text-gray-400 text-sm">No flowers available.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shopFlowers.map((f) => {
                const outOfStock = !f.inStock;
                return (
                  <div
                    key={f._id}
                    className={`rounded-xl border p-3 ${
                      outOfStock ? "bg-red-50 border-red-200" : "bg-pink-50 border-pink-200"
                    }`}
                  >
                    {f.image && f.image !== "PASTE_LINK_HERE" && (
                      <img src={f.image} alt={f.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                    )}
                    <p className="font-semibold text-sm text-roseDD mb-1">{f.name}</p>
                    {f.emotion && <p className="text-xs text-gray-400 mb-1">💫 {f.emotion}</p>}
                    {f.color && <p className="text-xs text-gray-400 mb-1">🎨 {f.color}</p>}
                    {f.category && <p className="text-xs text-gray-400 mb-1">🏷 {f.category}</p>}
                    <p className="text-xs font-semibold text-roseD mb-1">₹{f.pricePerStem}/stem</p>
                    <span className={`text-xs font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
                      {outOfStock ? "❌ Out of Stock" : "✅ In Stock"}
                    </span>
                    {!outOfStock && (
                      <button
                        onClick={() => handleAddToCart(f)}
                        className="mt-2 w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-1.5 rounded-lg transition active:scale-95"
                      >
                        {cartItems.find(i => i._id === f._id) ? `In Cart (${cartItems.find(i => i._id === f._id).quantity}) 🛒` : 'Add to Cart 🛒'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-roseDD text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2" style={{animation:'pageIn 0.3s ease both'}}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
