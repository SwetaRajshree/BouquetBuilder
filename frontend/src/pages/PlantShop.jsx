import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API = import.meta.env.VITE_API_URL;

const categories = ["Flower Plants", "Indoor Plants", "Outdoor Plants", "Succulents", "Air Purifying"];

const priceRanges = [
  { label: "Under ₹99",  max: 99 },
  { label: "Under ₹199", max: 199 },
  { label: "All Prices", max: Infinity },
];

export default function PlantShop() {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useCartContext();
  const { wishlist, toggle: toggleWishlist, has: inWishlistCheck } = useWishlist();

  const [plants, setPlants]                     = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [activeCategory, setActiveCategory]     = useState("Flower Plants");
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [toast, setToast]                       = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/plants`)
      .then(r => r.json())
      .then(data => setPlants(Array.isArray(data) ? data : []))
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (plant) => {
    const item = cartItems.find(i => i._id === plant._id);
    if (item) {
      removeFromCart(plant._id);
    } else {
      addToCart({ _id: plant._id, name: plant.name, price: plant.price, pricePerStem: plant.price, image: plant.image || plant.img, category: plant.category, color: plant.color || "", city: plant.city || "" });
      setToast(plant.name);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const inCart = (id) => cartItems.some(i => i._id === id);

  const filtered = plants.filter(p => {
    const catMatch   = p.category === activeCategory;
    const priceMatch = activePriceRange ? (activePriceRange.label === "All Prices" ? true : p.price <= activePriceRange.max) : true;
    return catMatch && priceMatch;
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7FAF5", minHeight: "100vh", color: "#1C1C1C" }}>
      <style>{`
        .ps-tab { background:none;border:none;padding:10px 20px;cursor:pointer;font-size:14px;color:#888;border-bottom:2.5px solid transparent;transition:all 0.2s;white-space:nowrap; }
        .ps-tab.active { color:#2D6A27;border-bottom-color:#2D6A27;font-weight:600; }
        .ps-tab:hover { color:#2D6A27; }
        .ps-card { background:white;border-radius:16px;overflow:hidden;transition:all 0.3s;box-shadow:0 2px 10px rgba(0,0,0,0.06);border:1.5px solid #EEF5EC; }
        .ps-card:hover { transform:translateY(-6px);box-shadow:0 16px 40px rgba(45,106,39,0.14);border-color:#B8D9B3; }
        .ps-add { width:100%;padding:11px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s; }
        .ps-add.in  { background:#2D6A27;color:white; }
        .ps-add.out { background:#F0F9EE;color:#2D6A27; }
        .ps-add:hover { background:#2D6A27 !important;color:white !important; }
        .ps-wish { position:absolute;top:10px;right:10px;background:white;border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.12);transition:transform 0.2s;display:flex;align-items:center;justify-content:center; }
        .ps-wish:hover { transform:scale(1.25); }
        .ps-pill { padding:9px 22px;border-radius:40px;border:2px solid #B8D9B3;background:white;cursor:pointer;font-size:13px;font-weight:500;color:#2D6A27;transition:all 0.2s; }
        .ps-pill.active,.ps-pill:hover { background:#2D6A27;color:white;border-color:#2D6A27; }
        .ps-drawer { position:fixed;right:0;top:0;height:100vh;width:340px;background:white;box-shadow:-4px 0 24px rgba(0,0,0,0.14);z-index:1200;padding:24px;overflow-y:auto;transition:transform 0.3s ease; }
        .ps-drawer.closed { transform:translateX(100%); }
        .ps-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:1199; }
      `}</style>

      {/* Wishlist drawer moved to global Navbar */}

      {/* STICKY BAR — removed, wishlist now in global navbar */}
      <div style={{ background:"white", borderBottom:"1px solid #E0EED8", padding:"0 48px", height:"52px", position:"sticky", top:"62px", zIndex:90 }} />

      {/* HERO */}
      <section style={{ background:"linear-gradient(135deg,#EAF5E6 0%,#D8EDD2 55%,#CCE8C4 100%)", padding:"64px 60px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"center", maxWidth:"1200px", margin:"0 auto" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#2D6A27", color:"white", padding:"5px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:600, marginBottom:"18px" }}>
              🏪 Direct from Nurseries & Wholesale Markets
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"50px", fontWeight:700, lineHeight:1.1, color:"#1A2E1A", marginBottom:"16px" }}>
              Fresh Plants at<br /><span style={{ color:"#2D6A27", fontStyle:"italic" }}>Nursery Prices.</span>
            </h1>
            <p style={{ fontSize:"15px", color:"#4A6A45", lineHeight:1.7, marginBottom:"28px" }}>
              We partner directly with local nurseries & wholesale flower mandis — giving you <strong>healthy plants at 40–50% lower</strong> than any retail store.
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button onClick={() => { setActiveCategory("Flower Plants"); setTimeout(() => document.getElementById("shop-section")?.scrollIntoView({ behavior:"smooth" }), 50); }}
                style={{ background:"#2D6A27", color:"white", border:"none", padding:"13px 32px", fontSize:"14px", fontWeight:600, borderRadius:"8px", cursor:"pointer" }}>
                Shop Flower Plants 🌸
              </button>
              <button onClick={() => navigate("/shops?mode=plant")}
                style={{ background:"transparent", color:"#2D6A27", border:"2px solid #2D6A27", padding:"11px 28px", fontSize:"14px", fontWeight:600, borderRadius:"8px", cursor:"pointer" }}>
                Our Nurseries 🏪
              </button>
            </div>
            <div style={{ display:"flex", gap:"32px", marginTop:"32px" }}>
              {[["500+","Varieties"],["50+","Nurseries"],["₹49","From"]].map(([val,label]) => (
                <div key={label}>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:700, color:"#2D6A27" }}>{val}</p>
                  <p style={{ fontSize:"12px", color:"#6A8A65" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <p style={{ fontSize:"13px", fontWeight:600, color:"#6A8A65", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"4px" }}>Popular Varieties</p>
            {[
              ["🌼","Marigold & African Daisy","Starting ₹49",  "Flower Plants"],
              ["🌹","Roses & Hibiscus",        "Starting ₹149", "Flower Plants"],
              ["🌻","Sunflower & Dahlia",       "Starting ₹100", "Flower Plants"],
              ["🌴","Coconut & Mango Tree",     "Starting ₹400", "Outdoor Plants"],
              ["🌱","Snake Plant & Lucky Bamboo","Starting ₹100","Indoor Plants"],
            ].map(([emoji,label,price,cat]) => (
              <div key={label}
                onClick={() => { setActiveCategory(cat); setTimeout(() => document.getElementById("shop-section")?.scrollIntoView({ behavior:"smooth" }), 50); }}
                style={{ display:"flex", alignItems:"center", gap:"14px", background:"rgba(255,255,255,0.55)", borderRadius:"12px", padding:"12px 20px", cursor:"pointer", border:"1px solid rgba(255,255,255,0.85)", justifyContent:"space-between" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.92)"; e.currentTarget.style.transform="translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.55)"; e.currentTarget.style.transform="translateX(0)"; }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <span style={{ fontSize:"22px" }}>{emoji}</span>
                  <span style={{ fontSize:"14px", fontWeight:600, color:"#1A3A17" }}>{label}</span>
                </div>
                <span style={{ fontSize:"12px", color:"#2D6A27", fontWeight:600 }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background:"#2D6A27", padding:"16px 60px" }}>
        <div style={{ display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:"12px" }}>
          {[["🏪","Sourced from Local Nurseries"],["💰","Wholesale Mandi Prices"],["🌱","Healthy & Fresh Guaranteed"],["🚚","Free Delivery above ₹499"]].map(([icon,text]) => (
            <div key={text} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"18px" }}>{icon}</span>
              <span style={{ color:"white", fontSize:"13.5px", fontWeight:500 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop-section" style={{ padding:"56px 60px", background:"#F7FAF5" }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", fontWeight:700, textAlign:"center", marginBottom:"8px" }}>
          {activeCategory === "Flower Plants" ? "🌸 Flower Plants" : activeCategory}
        </h2>
        <p style={{ textAlign:"center", color:"#888", fontSize:"14px", marginBottom:"36px" }}>
          {activeCategory === "Flower Plants" ? "Roses, Marigold, Hibiscus, Sunflower & more — sourced from local nurseries" : "Sourced directly from nurseries & wholesale markets across India"}
        </p>

        <div style={{ display:"flex", justifyContent:"center", borderBottom:"1px solid #DCE8D8", marginBottom:"20px", overflowX:"auto" }}>
          {categories.map(cat => (
            <button key={cat} className={`ps-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {cat === "Flower Plants" ? "🌸" : cat === "Indoor Plants" ? "🪴" : cat === "Outdoor Plants" ? "🌳" : cat === "Succulents" ? "🌵" : "💨"} {cat}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:"10px", marginBottom:"36px" }}>
          {priceRanges.map(pr => (
            <button key={pr.label} className={`ps-pill ${activePriceRange?.label === pr.label ? "active" : ""}`}
              onClick={() => setActivePriceRange(activePriceRange?.label === pr.label ? null : pr)}>
              {pr.label}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign:"center", color:"#aaa", marginTop:"40px" }}>Loading plants... 🌱</p>}

        {!loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px", maxWidth:"1100px", margin:"0 auto" }}>
            {filtered.map(plant => (
              <div key={plant._id} className="ps-card" style={{ position:"relative" }}>
                <button className="ps-wish" onClick={() => toggleWishlist(plant)}>
                  {inWishlistCheck(plant._id) ? "❤️" : "🤍"}
                </button>
                {plant.discount >= 40 && (
                  <div style={{ position:"absolute", top:"10px", left:"10px", background:"#E55", color:"white", fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"4px" }}>
                    🔥 {plant.discount}% OFF
                  </div>
                )}
                <div style={{ background:"linear-gradient(135deg,#F2FAF0,#E6F5E0)", height:"140px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {plant.image ? (
                    <img src={plant.image} alt={plant.name} style={{ width:"100%", height:"140px", objectFit:"cover" }} />
                  ) : (
                    <span style={{ fontSize:"58px" }}>{plant.img}</span>
                  )}
                </div>
                <div style={{ padding:"14px 14px 0" }}>
                  <p style={{ fontSize:"13.5px", fontWeight:600, color:"#1A1A1A", marginBottom:"5px", lineHeight:1.3 }}>{plant.name}</p>
                  <p style={{ fontSize:"11px", color:"#99AA99", marginBottom:"10px" }}>🏪 {plant.nursery}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:700, color:"#2D6A27" }}>₹{plant.price}</span>
                    {plant.original && <span style={{ fontSize:"12px", color:"#ccc", textDecoration:"line-through" }}>₹{plant.original}</span>}
                    {plant.discount > 0 && plant.discount < 40 && <span style={{ fontSize:"11px", color:"#E88", fontWeight:600 }}>{plant.discount}% off</span>}
                  </div>
                </div>
                <button className={`ps-add ${inCart(plant._id) ? "in" : "out"}`} onClick={() => handleAddToCart(plant)}>
                  {inCart(plant._id) ? "✓ Added — Remove" : "+ Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign:"center", color:"#aaa", marginTop:"40px" }}>No plants in this category yet.</p>
        )}
      </section>

      {toast && (
        <div style={{ position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)", background:"#2D6A27", color:"white", padding:"12px 24px", borderRadius:"40px", fontSize:"13px", fontWeight:600, zIndex:9999, boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
