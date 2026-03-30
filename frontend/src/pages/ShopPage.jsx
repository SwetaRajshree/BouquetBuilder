import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PackageCard from "../components/PackageCard";
import CustomizationStepper from "../components/CustomizationStepper";
import { PACKAGES } from "../data/mockData";
import { useCartContext } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL;

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("ready");
  const [shop, setShop] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCartContext();
  const [toast, setToast] = useState("");

  function handleAddToCart(flower) {
    addToCart(flower);
    setToast(flower.name);
    setTimeout(() => setToast(""), 2000);
  }

  useEffect(() => {
    fetch(`${API}/api/shops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setShop(data);
        // fetch flowers by city once we have the shop
        return fetch(`${API}/api/flowers/city/${encodeURIComponent(data.city)}`);
      })
      .then((r) => r.json())
      .then((data) => setFlowers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page-enter">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] py-12 px-4 text-center border-b border-blush/25">
        <span className="text-[4rem] block mb-3">🌺</span>
        <h1 className="font-playfair font-bold text-[2rem] text-roseDD mb-2">
          {shop ? shop.name : "Shop"}
        </h1>
        {shop && (
          <p className="text-sm text-gray-500">📍 {shop.area}, {shop.city}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-blush/28 bg-white sticky top-[62px] z-40 tab-bar">
        {[
          ["ready", "🌺 Flowers"],
          ["customize", "✏️ Customize"],
          ["packages", "📦 Packages"],
        ].map(([tabId, label]) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`px-6 py-4 text-[.87rem] font-medium whitespace-nowrap border-b-[2.5px] transition-all -mb-px
              ${tab === tabId ? "text-roseD border-rose font-bold" : "text-textL border-transparent hover:text-roseD"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {tab === "ready" && (
          <>
            {loading && <p className="text-pink-400">Loading flowers...</p>}
            {!loading && flowers.length === 0 && (
              <p className="text-gray-400">No flowers available.</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {flowers.map((flower) => {
                const outOfStock = !flower.inStock;
                return (
                  <div
                    key={flower._id}
                    className={`bg-white rounded-xl border-2 p-4 relative transition-all hover:-translate-y-1 hover:shadow-md ${
                      outOfStock ? "border-red-200 opacity-75" : "border-pink-100 hover:border-pink-300"
                    }`}
                  >
                    {outOfStock && (
                      <span className="absolute top-2 right-2 text-[0.65rem] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                    {flower.image && flower.image !== "PASTE_LINK_HERE" ? (
                      <img src={flower.image} alt={flower.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    ) : (
                      <div className="text-4xl text-center mb-3">🌸</div>
                    )}
                    <h3 className="font-playfair font-semibold text-sm text-roseDD mb-1">{flower.name}</h3>
                    {flower.emotion && <p className="text-xs text-gray-400 mb-1">💫 {flower.emotion}</p>}
                    {flower.color && <p className="text-xs text-gray-400 mb-1">🎨 {flower.color}</p>}
                    {flower.category && <p className="text-xs text-gray-400 mb-1">🏷 {flower.category}</p>}
                    <p className="text-xs font-semibold text-roseD mb-2">₹{flower.pricePerStem}/stem</p>
                    <span className={`text-xs font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
                      {outOfStock ? "❌ Out of Stock" : "✅ In Stock"}
                    </span>
                    {!outOfStock && (
                      <button
                        onClick={() => handleAddToCart(flower)}
                        className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-1.5 rounded-lg transition active:scale-95"
                      >
                        {cartItems.find(i => i._id === flower._id) ? `In Cart (${cartItems.find(i => i._id === flower._id).quantity}) 🛒` : 'Add to Cart 🛒'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {tab === "customize" && <CustomizationStepper />}
        {tab === "packages" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PACKAGES.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        )}
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
