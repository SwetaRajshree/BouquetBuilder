import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const API = import.meta.env.VITE_API_URL;

const categories = ["Flower Plants", "Indoor Plants", "Outdoor Plants", "Succulents", "Air Purifying"];

const nurseries = [
  { name: "Kolkata Phool Bazar",   location: "Kolkata, WB",  type: "Wholesale Market",   plants: "Roses, Marigold, Mogra, Chrysanthemum, Hibiscus",        emoji: "🌺", savings: "Up to 50% off", color: "#FFF0F0", cat: "Flower Plants"  },
  { name: "Green Valley Nursery",  location: "Pune, MH",     type: "Direct Nursery",     plants: "Bamboo, Bougainvillea, Lily, Dahlia, Lavender, Orchid",   emoji: "🌿", savings: "Up to 45% off", color: "#F0FAF0", cat: "Flower Plants"  },
  { name: "Delhi Plant Bazaar",    location: "Delhi, DL",    type: "Wholesale Market",   plants: "Money Plant, Peace Lily, Jasmine, Arrowhead",             emoji: "🪴", savings: "Up to 40% off", color: "#F5FFF0", cat: "Indoor Plants"  },
  { name: "Roots & Leaves",        location: "Bangalore, KA",type: "Direct Nursery",     plants: "Snake Plant, Aloe Vera, Sunflower, Orchid, Boston Fern",  emoji: "🌱", savings: "Up to 42% off", color: "#F0FFF5", cat: "Indoor Plants"  },
  { name: "City Greens Wholesale", location: "Mumbai, MH",   type: "Wholesale Market",   plants: "Syngonium, Spider Plant, Tulip, Croton, Areca Palm",      emoji: "🍃", savings: "Up to 38% off", color: "#F2FAF0", cat: "Indoor Plants"  },
  { name: "Desert Dreams",         location: "Jodhpur, RJ",  type: "Specialist Nursery", plants: "Cactus, Succulents, Lavender, Jade Plant, Aloe",          emoji: "🌵", savings: "Up to 48% off", color: "#FAFAF0", cat: "Succulents"     },
];

const priceRanges = [
  { label: "Under ₹99",  max: 99 },
  { label: "Under ₹199", max: 199 },
  { label: "All Prices", max: Infinity },
];

export default function PlantShop() {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useCartContext();

  const [plants, setPlants]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState("Flower Plants");
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [activeSection, setActiveSection] = useState("shop");
  const [wishlist, setWishlist]           = useState(() => {
    try { return JSON.parse(localStorage.getItem("plant_wishlist") || "[]"); }
    catch { return []; }
  });
  const [showWishlist, setShowWishlist]   = useState(false);
  const [toast, setToast]                 = useState("");

  // Fetch plants from API
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/plants`)
      .then(r => r.json())
      .then(data => setPlants(Array.isArray(data) ? data : []))
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  }, []);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("plant_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const handleAddToCart = (plant) => {
    const item = cartItems.find(i => i._id === plant._id);
    if (item) {
      removeFromCart(plant._id);
    } else {
      addToCart({ _id: plant._id, name: plant.name, price: plant.price, pricePerStem: plant.price, image: plant.img, category: plant.category, color: "", city: "" });
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

  const wishlistPlants = plants.filter(p => wishlist.includes(p._id));

  const handleCheckout = () => {
    if (cartItems.length === 0) { setToast("Add plants to cart first!"); setTimeout(() => setToast(""), 2200); return; }
    navigate("/cart");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7FAF5", minHeight: "100vh", color: "#1C1C1C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
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
        .ps-nursery { border-radius:16px;padding:24px;border:1.5px solid #E0EED8;transition:all 0.3s;cursor:pointer; }
        .ps-nursery:hover { border-color:#2D6A27;transform:translateY(-4px);box-shadow:0 12px 30px rgba(45,106,39,0.12); }
      `}</style>

      {/* WISHLIST DRAWER */}
      {showWishlist && <div className="ps-overlay" onClick={() => setShowWishlist(false)} />}
      <div className={`ps-drawer ${showWishlist ? "" : "closed"}`}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"24px", fontWeight:700 }}>Wishlist ❤️</h3>
          <button onClick={() => setShowWishlist(false)} style={{ background:"none", border:"none", fontSize:"22px", cursor:"pointer", color:"#888" }}>✕</button>
        </div>
        {wishlistPlants.length === 0 ? (
          <p style={{ color:"#aaa", textAlign:"center", marginTop:"80px", fontSize:"15px" }}>Your wishlist is empty 🌸<br /><span style={{ fontSize:"13px" }}>Heart plants you love!</span></p>
        ) : (
          <>
            {wishlistPlants.map(p => (
              <div key={p._id} style={{ display:"flex", gap:"12px", padding:"14px 0", borderBottom:"1px solid #F0F0F0", alignItems:"center" }}>
                <span style={{ fontSize:"30px" }}>{p.img}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"13px", fontWeight:600, marginBottom:"3px" }}>{p.name}</p>
                  <p style={{ fontSize:"11px", color:"#aaa" }}>🏪 {p.nursery}</p>
                  <p style={{ fontWeight:700, color:"#2D6A27", fontSize:"14px", marginTop:"4px" }}>₹{p.price}</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px", alignItems:"flex-end" }}>
                  <button onClick={() => handleAddToCart(p)} style={{ background:"#2D6A27", color:"white", border:"none", borderRadius:"6px", padding:"6px 12px", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
                    {inCart(p._id) ? "✓ In Cart" : "+ Cart"}
                  </button>
                  <button onClick={() => toggleWishlist(p._id)} style={{ fontSize:"11px", color:"#E55", background:"none", border:"none", cursor:"pointer" }}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => wishlistPlants.forEach(p => !inCart(p._id) && handleAddToCart(p))}
              style={{ marginTop:"16px", width:"100%", padding:"12px", background:"#2D6A27", color:"white", border:"none", borderRadius:"8px", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
              Add All to Cart 🛒
            </button>
          </>
        )}
      </div>

      {/* SECTION NAV TABS */}
      <div style={{ background:"white", borderBottom:"1px solid #E0EED8", padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:"62px", zIndex:90, height:"52px" }}>
        <div style={{ display:"flex", gap:"4px" }}>
          {categories.map(cat => (
            <button key={cat} className={`ps-tab ${activeSection === "shop" && activeCategory === cat ? "active" : ""}`}
              onClick={() => { setActiveSection("shop"); setActiveCategory(cat); }}>
              {cat === "Flower Plants" ? "🌸" : cat === "Indoor Plants" ? "🪴" : cat === "Outdoor Plants" ? "🌳" : cat === "Succulents" ? "🌵" : "💨"} {cat}
            </button>
          ))}
          <button className={`ps-tab ${activeSection === "nurseries" ? "active" : ""}`} onClick={() => setActiveSection("nurseries")}>
            🏪 Nurseries
          </button>
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <button onClick={() => setShowWishlist(true)} style={{ background:"none", border:"none", fontSize:"19px", cursor:"pointer", position:"relative", color:"#4A6A45" }}>
            ❤️ {wishlist.length > 0 && <span style={{ position:"absolute", top:"-4px", right:"-5px", background:"#E55", color:"white", borderRadius:"50%", width:"15px", height:"15px", fontSize:"9px", display:"flex", alignItems:"center", justifyContent:"center" }}>{wishlist.length}</span>}
          </button>
          <button onClick={handleCheckout} style={{ background:"#2D6A27", border:"none", borderRadius:"8px", padding:"6px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", color:"white", fontWeight:600, fontSize:"13px" }}>
            🛒 {cartItems.length > 0 ? `Cart (${cartItems.length})` : "Cart"}
          </button>
        </div>
      </div>

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
              <button onClick={() => { setActiveSection("shop"); setActiveCategory("Flower Plants"); }} style={{ background:"#2D6A27", color:"white", border:"none", padding:"13px 32px", fontSize:"14px", fontWeight:600, borderRadius:"8px", cursor:"pointer" }}>Shop Flower Plants 🌸</button>
              <button onClick={() => setActiveSection("nurseries")} style={{ background:"transparent", color:"#2D6A27", border:"2px solid #2D6A27", padding:"11px 28px", fontSize:"14px", fontWeight:600, borderRadius:"8px", cursor:"pointer" }}>Our Nurseries 🏪</button>
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
            {[["🌹","Roses & Gerberas","Starting ₹129"],["🌷","Tulips & Lilies","Starting ₹149"],["🌻","Sunflowers & Marigold","Starting ₹49"],["🪷","Jasmine & Lavender","Starting ₹99"],["🌸","Chrysanthemum & Dahlia","Starting ₹69"]].map(([emoji,label,price]) => (
              <div key={label} onClick={() => { setActiveSection("shop"); setActiveCategory("Flower Plants"); }}
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
      {activeSection === "shop" && (
        <section style={{ padding:"56px 60px", background:"#F7FAF5" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", fontWeight:700, textAlign:"center", marginBottom:"8px" }}>
            {activeCategory === "Flower Plants" ? "🌸 Flower Plants" : activeCategory}
          </h2>
          <p style={{ textAlign:"center", color:"#888", fontSize:"14px", marginBottom:"36px" }}>
            {activeCategory === "Flower Plants" ? "Roses, Lilies, Tulips, Marigold, Jasmine & more — sourced from flower mandis" : "Sourced directly from nurseries & wholesale markets across India"}
          </p>

          {/* Category tabs */}
          <div style={{ display:"flex", justifyContent:"center", borderBottom:"1px solid #DCE8D8", marginBottom:"20px", overflowX:"auto" }}>
            {categories.map(cat => (
              <button key={cat} className={`ps-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                {cat === "Flower Plants" ? "🌸" : cat === "Indoor Plants" ? "🪴" : cat === "Outdoor Plants" ? "🌳" : cat === "Succulents" ? "🌵" : "💨"} {cat}
              </button>
            ))}
          </div>

          {/* Price filter */}
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
                  <button className="ps-wish" onClick={() => toggleWishlist(plant._id)}>
                    {wishlist.includes(plant._id) ? "❤️" : "🤍"}
                  </button>
                  {plant.discount >= 40 && (
                    <div style={{ position:"absolute", top:"10px", left:"10px", background:"#E55", color:"white", fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"4px" }}>
                      🔥 {plant.discount}% OFF
                    </div>
                  )}
                  <div style={{ background:"linear-gradient(135deg,#F2FAF0,#E6F5E0)", padding:"36px", textAlign:"center", fontSize:"58px" }}>
                    {plant.img}
                  </div>
                  <div style={{ padding:"14px 14px 0" }}>
                    <p style={{ fontSize:"13.5px", fontWeight:600, color:"#1A1A1A", marginBottom:"5px", lineHeight:1.3 }}>{plant.name}</p>
                    <p style={{ fontSize:"11px", color:"#99AA99", marginBottom:"10px" }}>🏪 {plant.nursery}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:700, color:"#2D6A27" }}>₹{plant.price}</span>
                      <span style={{ fontSize:"12px", color:"#ccc", textDecoration:"line-through" }}>₹{plant.original}</span>
                      {plant.discount < 40 && <span style={{ fontSize:"11px", color:"#E88", fontWeight:600 }}>{plant.discount}% off</span>}
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
            <p style={{ textAlign:"center", color:"#aaa", marginTop:"40px" }}>No plants match this filter.</p>
          )}
        </section>
      )}

      {/* NURSERIES SECTION */}
      {activeSection === "nurseries" && (
        <section style={{ padding:"56px 60px", background:"#F7FAF5" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", fontWeight:700, textAlign:"center", marginBottom:"8px" }}>🏪 Our Nursery & Wholesale Partners</h2>
          <p style={{ textAlign:"center", color:"#888", fontSize:"14px", marginBottom:"36px" }}>Zero middlemen, fair prices — direct from verified nurseries across India.</p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", maxWidth:"1100px", margin:"0 auto 56px" }}>
            {nurseries.map(n => (
              <div key={n.name} className="ps-nursery" style={{ background:n.color }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                  <span style={{ fontSize:"38px" }}>{n.emoji}</span>
                  <span style={{ background:"#2D6A27", color:"white", fontSize:"11px", fontWeight:700, padding:"4px 10px", borderRadius:"20px" }}>{n.savings}</span>
                </div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontWeight:700, marginBottom:"4px" }}>{n.name}</h3>
                <p style={{ fontSize:"12px", color:"#888", marginBottom:"10px" }}>📍 {n.location} · <span style={{ color:"#2D6A27", fontWeight:500 }}>{n.type}</span></p>
                <p style={{ fontSize:"13px", color:"#555", lineHeight:1.6 }}><strong>Plants:</strong> {n.plants}</p>
                <button onClick={() => { setActiveSection("shop"); setActiveCategory(n.cat); }}
                  style={{ marginTop:"14px", background:"white", color:"#2D6A27", border:"1.5px solid #B8D9B3", padding:"8px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}
                  onMouseEnter={e => { e.target.style.background="#2D6A27"; e.target.style.color="white"; }}
                  onMouseLeave={e => { e.target.style.background="white"; e.target.style.color="#2D6A27"; }}>
                  Browse Their Plants →
                </button>
              </div>
            ))}
          </div>

          <div style={{ background:"white", borderRadius:"20px", padding:"44px", maxWidth:"1100px", margin:"0 auto", border:"1.5px solid #DCE8D8" }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"30px", fontWeight:700, textAlign:"center", marginBottom:"36px" }}>How You Save 40–50%</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"28px" }}>
              {[["🌱","Nurseries List Directly","Local nurseries list plants directly — no distributors."],["💰","No Retail Markup","You pay close to wholesale price."],["✅","Quality Inspected","Healthy roots, pest-free, ready for your home."],["🚚","Packed & Delivered","Fresh delivery within 1–3 days."]].map(([icon,title,desc]) => (
                <div key={title} style={{ textAlign:"center" }}>
                  <div style={{ width:"54px", height:"54px", background:"#EAF5E6", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", margin:"0 auto 12px" }}>{icon}</div>
                  <p style={{ fontWeight:700, fontSize:"14px", marginBottom:"8px" }}>{title}</p>
                  <p style={{ fontSize:"13px", color:"#777", lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)", background:"#2D6A27", color:"white", padding:"12px 24px", borderRadius:"40px", fontSize:"13px", fontWeight:600, zIndex:9999, boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
