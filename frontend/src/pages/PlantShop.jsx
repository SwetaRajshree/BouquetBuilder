import { useState } from "react";

const allPlants = [
  // Indoor Plants
  { id: 1, name: "Lucky Bamboo in Golden Pot", price: 199, original: 299, discount: 33, category: "Indoor Plants", nursery: "Green Valley Nursery, Pune", img: "🎋" },
  { id: 2, name: "Syngonium in Blue Ceramic Pot", price: 149, original: 199, discount: 25, category: "Indoor Plants", nursery: "City Greens Wholesale, Mumbai", img: "🌿" },
  { id: 3, name: "Money Plant in Copper Pot", price: 99, original: 149, discount: 34, category: "Indoor Plants", nursery: "Delhi Plant Bazaar", img: "🪴" },
  { id: 4, name: "Snake Plant (Sansevieria)", price: 149, original: 249, discount: 40, category: "Indoor Plants", nursery: "Roots & Leaves, Bangalore", img: "🌱" },
  // Outdoor Plants
  { id: 5, name: "Hibiscus Plant (Red)", price: 119, original: 199, discount: 40, category: "Outdoor Plants", nursery: "Kolkata Phool Bazar", img: "🌺" },
  { id: 6, name: "Bougainvillea (Pink)", price: 149, original: 249, discount: 40, category: "Outdoor Plants", nursery: "Green Valley Nursery, Pune", img: "🌸" },
  { id: 7, name: "Croton Outdoor Shrub", price: 179, original: 279, discount: 36, category: "Outdoor Plants", nursery: "City Greens Wholesale, Mumbai", img: "🍂" },
  { id: 8, name: "Areca Palm", price: 249, original: 399, discount: 38, category: "Outdoor Plants", nursery: "Delhi Plant Bazaar", img: "🌴" },
  // Succulents
  { id: 9, name: "Cactus Trio Set", price: 99, original: 179, discount: 45, category: "Succulents", nursery: "Desert Dreams, Rajasthan", img: "🌵" },
  { id: 10, name: "Echeveria Rosette", price: 79, original: 129, discount: 39, category: "Succulents", nursery: "Desert Dreams, Rajasthan", img: "🪸" },
  { id: 11, name: "Aloe Vera Pot", price: 89, original: 149, discount: 40, category: "Succulents", nursery: "Roots & Leaves, Bangalore", img: "🌿" },
  { id: 12, name: "Jade Plant", price: 129, original: 199, discount: 35, category: "Succulents", nursery: "Green Valley Nursery, Pune", img: "🌱" },
  // Air Purifying
  { id: 13, name: "Peace Lily", price: 199, original: 299, discount: 33, category: "Air Purifying", nursery: "Delhi Plant Bazaar", img: "🌸" },
  { id: 14, name: "Spider Plant", price: 99, original: 149, discount: 34, category: "Air Purifying", nursery: "City Greens Wholesale, Mumbai", img: "🌾" },
  { id: 15, name: "Arrowhead Plant", price: 149, original: 229, discount: 35, category: "Air Purifying", nursery: "Roots & Leaves, Bangalore", img: "🌿" },
  { id: 16, name: "Boston Fern", price: 119, original: 199, discount: 40, category: "Air Purifying", nursery: "Green Valley Nursery, Pune", img: "🍃" },
  // Flower Plants
  { id: 17, name: "Red Rose Bush", price: 129, original: 229, discount: 44, category: "Flower Plants", nursery: "Kolkata Phool Bazar", img: "🌹" },
  { id: 18, name: "White Lily Plant", price: 149, original: 249, discount: 40, category: "Flower Plants", nursery: "Green Valley Nursery, Pune", img: "🪷" },
  { id: 19, name: "Sunflower Sapling", price: 79, original: 129, discount: 39, category: "Flower Plants", nursery: "Roots & Leaves, Bangalore", img: "🌻" },
  { id: 20, name: "Marigold Pot (Genda)", price: 49, original: 89, discount: 45, category: "Flower Plants", nursery: "Kolkata Phool Bazar", img: "🌼" },
  { id: 21, name: "Jasmine Creeper (Mogra)", price: 99, original: 179, discount: 45, category: "Flower Plants", nursery: "Delhi Plant Bazaar", img: "🌸" },
  { id: 22, name: "Lavender Pot", price: 119, original: 199, discount: 40, category: "Flower Plants", nursery: "Desert Dreams, Rajasthan", img: "💜" },
  { id: 23, name: "Pink Tulip Bulb Pot", price: 159, original: 249, discount: 36, category: "Flower Plants", nursery: "City Greens Wholesale, Mumbai", img: "🌷" },
  { id: 24, name: "Chrysanthemum (Shevanti)", price: 69, original: 119, discount: 42, category: "Flower Plants", nursery: "Kolkata Phool Bazar", img: "🌸" },
  { id: 25, name: "Dahlia Plant", price: 89, original: 159, discount: 44, category: "Flower Plants", nursery: "Green Valley Nursery, Pune", img: "🌺" },
  { id: 26, name: "Orchid in Ceramic Pot", price: 199, original: 349, discount: 43, category: "Flower Plants", nursery: "Roots & Leaves, Bangalore", img: "🌸" },
];

const categories = ["Flower Plants", "Indoor Plants", "Outdoor Plants", "Succulents", "Air Purifying"];

const nurseries = [
  { name: "Kolkata Phool Bazar", location: "Kolkata, WB", type: "Wholesale Market", plants: "Roses, Marigold, Mogra, Chrysanthemum, Hibiscus", emoji: "🌺", savings: "Up to 50% off", color: "#FFF0F0" },
  { name: "Green Valley Nursery", location: "Pune, MH", type: "Direct Nursery", plants: "Bamboo, Bougainvillea, Lily, Dahlia, Lavender, Orchid", emoji: "🌿", savings: "Up to 45% off", color: "#F0FAF0" },
  { name: "Delhi Plant Bazaar", location: "Delhi, DL", type: "Wholesale Market", plants: "Money Plant, Peace Lily, Jasmine, Arrowhead", emoji: "🪴", savings: "Up to 40% off", color: "#F5FFF0" },
  { name: "Roots & Leaves", location: "Bangalore, KA", type: "Direct Nursery", plants: "Snake Plant, Aloe Vera, Sunflower, Orchid, Boston Fern", emoji: "🌱", savings: "Up to 42% off", color: "#F0FFF5" },
  { name: "City Greens Wholesale", location: "Mumbai, MH", type: "Wholesale Market", plants: "Syngonium, Spider Plant, Tulip, Croton, Areca Palm", emoji: "🍃", savings: "Up to 38% off", color: "#F2FAF0" },
  { name: "Desert Dreams", location: "Jodhpur, RJ", type: "Specialist Nursery", plants: "Cactus, Succulents, Lavender, Jade Plant, Aloe", emoji: "🌵", savings: "Up to 48% off", color: "#FAFAF0" },
];

const priceRanges = [
  { label: "Under ₹99", max: 99 },
  { label: "Under ₹199", max: 199 },
  { label: "All Prices", max: Infinity },
];

export default function PlantShop() {
  const [activeCategory, setActiveCategory] = useState("Flower Plants");
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeSection, setActiveSection] = useState("shop");

  const filteredPlants = allPlants.filter((p) => {
    const catMatch = p.category === activeCategory;
    const priceMatch = activePriceRange
      ? activePriceRange.label === "All Prices" ? true : p.price <= activePriceRange.max
      : true;
    return catMatch && priceMatch;
  });

  const addToCart = (id) => setCart((c) => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  const toggleWishlist = (id) => setWishlist((w) => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const cartItems = allPlants.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7FAF5", minHeight: "100vh", color: "#1C1C1C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav-link { background: none; border: none; padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500; color: #4A6A45; cursor: pointer; border-radius: 8px; transition: all 0.2s; white-space: nowrap; }
        .nav-link:hover { background: #E6F4E0; color: #1A4A15; }
        .nav-link.active { background: #2D6A27; color: white; }
        .tab-btn { background: none; border: none; padding: 10px 20px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #888; border-bottom: 2.5px solid transparent; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { color: #2D6A27; border-bottom-color: #2D6A27; font-weight: 600; }
        .tab-btn:hover { color: #2D6A27; }
        .plant-card { background: white; border-radius: 16px; overflow: hidden; transition: all 0.3s; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border: 1.5px solid #EEF5EC; }
        .plant-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(45,106,39,0.14); border-color: #B8D9B3; }
        .add-btn { width: 100%; padding: 11px; border: none; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .add-btn.in-cart { background: #2D6A27; color: white; }
        .add-btn.not-in-cart { background: #F0F9EE; color: #2D6A27; }
        .add-btn:hover { background: #2D6A27 !important; color: white !important; }
        .wish-btn { position: absolute; top: 10px; right: 10px; background: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); transition: transform 0.2s; display: flex; align-items: center; justify-content: center; }
        .wish-btn:hover { transform: scale(1.25); }
        .nursery-card { border-radius: 16px; padding: 24px; border: 1.5px solid #E0EED8; transition: all 0.3s; cursor: pointer; }
        .nursery-card:hover { border-color: #2D6A27; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(45,106,39,0.12); }
        .price-pill { padding: 9px 22px; border-radius: 40px; border: 2px solid #B8D9B3; background: white; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #2D6A27; transition: all 0.2s; }
        .price-pill.active, .price-pill:hover { background: #2D6A27; color: white; border-color: #2D6A27; }
        .hero-btn { background: #2D6A27; color: white; border: none; padding: 13px 32px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .hero-btn:hover { background: #1A4A15; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .hero-btn-outline { background: transparent; color: #2D6A27; border: 2px solid #2D6A27; padding: 11px 28px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .hero-btn-outline:hover { background: #2D6A27; color: white; }
        .cart-drawer { position: fixed; right: 0; top: 0; height: 100vh; width: 340px; background: white; box-shadow: -4px 0 24px rgba(0,0,0,0.14); z-index: 999; padding: 24px; overflow-y: auto; transition: transform 0.3s ease; }
        .cart-drawer.closed { transform: translateX(100%); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 998; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 700; color: #1A1A1A; text-align: center; margin-bottom: 8px; }
        .section-sub { text-align: center; color: #888; font-size: 14px; margin-bottom: 36px; }
      `}</style>

      {/* WISHLIST DRAWER */}
      {showWishlist && <div className="overlay" onClick={() => setShowWishlist(false)} />}
      <div className={`cart-drawer ${showWishlist ? "" : "closed"}`} style={{ background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700 }}>Wishlist ❤️</h3>
          <button onClick={() => setShowWishlist(false)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        {wishlist.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: "80px", fontSize: "15px" }}>Your wishlist is empty 🌸<br /><span style={{ fontSize: "13px" }}>Heart plants you love!</span></p>
        ) : (
          <>
            {allPlants.filter(p => wishlist.includes(p.id)).map(p => (
              <div key={p.id} style={{ display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #F0F0F0", alignItems: "center" }}>
                <span style={{ fontSize: "30px" }}>{p.img}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>{p.name}</p>
                  <p style={{ fontSize: "11px", color: "#aaa" }}>🏪 {p.nursery}</p>
                  <p style={{ fontWeight: 700, color: "#2D6A27", fontSize: "14px", marginTop: "4px" }}>₹{p.price}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                  <button onClick={() => { addToCart(p.id); }} style={{ background: "#2D6A27", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    {cart.includes(p.id) ? "✓ In Cart" : "+ Cart"}
                  </button>
                  <button onClick={() => toggleWishlist(p.id)} style={{ fontSize: "11px", color: "#E55", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "20px", background: "#FFF0F0", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "10px" }}>{wishlist.length} plant{wishlist.length > 1 ? "s" : ""} saved</p>
              <button onClick={() => { wishlist.forEach(id => addToCart(id)); }} style={{ width: "100%", padding: "12px", background: "#E55", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
                Add All to Cart 🛒
              </button>
            </div>
          </>
        )}
      </div>

      {/* CART DRAWER */}
      {showCart && <div className="overlay" onClick={() => setShowCart(false)} />}
      <div className={`cart-drawer ${showCart ? "" : "closed"}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700 }}>Your Cart 🛒</h3>
          <button onClick={() => setShowCart(false)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        {cartItems.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: "80px", fontSize: "15px" }}>Your cart is empty 🌱<br /><span style={{ fontSize: "13px" }}>Add some plants!</span></p>
        ) : (
          <>
            {cartItems.map(p => (
              <div key={p.id} style={{ display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #F0F0F0", alignItems: "center" }}>
                <span style={{ fontSize: "30px" }}>{p.img}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>{p.name}</p>
                  <p style={{ fontSize: "11px", color: "#aaa" }}>🏪 {p.nursery}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, color: "#2D6A27", fontSize: "15px" }}>₹{p.price}</p>
                  <button onClick={() => addToCart(p.id)} style={{ fontSize: "11px", color: "#E55", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "20px", background: "#F0F9EE", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px", color: "#555" }}>Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: 700, color: "#2D6A27", fontSize: "16px" }}>₹{cartTotal}</span>
              </div>
              <p style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>🚚 {cartTotal >= 499 ? "Free delivery applied!" : `Add ₹${499 - cartTotal} more for free delivery`}</p>
              <button style={{ width: "100%", padding: "13px", background: "#2D6A27", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
                Checkout → Pay ₹{cartTotal}
              </button>
            </div>
          </>
        )}
      </div>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1px solid #E0EED8", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", height: "62px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "26px" }}>🌿</span>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "21px", fontWeight: 700, color: "#2D6A27" }}>GreenNest</span>
            <p style={{ fontSize: "9px", color: "#99BB99", letterSpacing: "1.5px", textTransform: "uppercase" }}>Nursery Direct</p>
          </div>
        </div>

        {/* Plants-only nav */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button className={`nav-link ${activeSection === "shop" && activeCategory === "Flower Plants" ? "active" : ""}`}
            onClick={() => { setActiveSection("shop"); setActiveCategory("Flower Plants"); }}>
            🌸 Flower Plants
          </button>
          <button className={`nav-link ${activeCategory === "Indoor Plants" && activeSection === "shop" ? "active" : ""}`}
            onClick={() => { setActiveSection("shop"); setActiveCategory("Indoor Plants"); }}>
            🪴 Indoor Plants
          </button>
          <button className={`nav-link ${activeCategory === "Outdoor Plants" && activeSection === "shop" ? "active" : ""}`}
            onClick={() => { setActiveSection("shop"); setActiveCategory("Outdoor Plants"); }}>
            🌳 Outdoor Plants
          </button>
          <button className={`nav-link ${activeCategory === "Succulents" && activeSection === "shop" ? "active" : ""}`}
            onClick={() => { setActiveSection("shop"); setActiveCategory("Succulents"); }}>
            🌵 Succulents
          </button>
          <button className={`nav-link ${activeCategory === "Air Purifying" && activeSection === "shop" ? "active" : ""}`}
            onClick={() => { setActiveSection("shop"); setActiveCategory("Air Purifying"); }}>
            💨 Air Purifying
          </button>
          <button className={`nav-link ${activeSection === "nurseries" ? "active" : ""}`}
            onClick={() => setActiveSection("nurseries")}>
            🏪 Nurseries
          </button>
        </div>

        {/* Icons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button style={{ background: "none", border: "none", fontSize: "19px", cursor: "pointer", color: "#4A6A45" }}>🔍</button>
          <button onClick={() => setShowWishlist(true)} style={{ background: "none", border: "none", fontSize: "19px", cursor: "pointer", position: "relative", color: "#4A6A45" }}>
            ❤️ {wishlist.length > 0 && <span style={{ position: "absolute", top: "-4px", right: "-5px", background: "#E55", color: "white", borderRadius: "50%", width: "15px", height: "15px", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlist.length}</span>}
          </button>
          <button onClick={() => setShowCart(true)} style={{ background: "#2D6A27", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "white", fontWeight: 600, fontSize: "13px" }}>
            🛒 {cart.length > 0 ? `(${cart.length})` : "Cart"}
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ background: "linear-gradient(135deg, #EAF5E6 0%, #D8EDD2 55%, #CCE8C4 100%)", padding: "64px 60px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Left: text */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#2D6A27", color: "white", padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "18px" }}>
              🏪 Direct from Nurseries & Wholesale Markets
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "50px", fontWeight: 700, lineHeight: 1.1, color: "#1A2E1A", marginBottom: "16px" }}>
              Fresh Plants at<br /><span style={{ color: "#2D6A27", fontStyle: "italic" }}>Nursery Prices.</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#4A6A45", lineHeight: 1.7, marginBottom: "28px" }}>
              We partner directly with local nurseries & wholesale flower mandis — giving you <strong>healthy plants at 40–50% lower</strong> than any retail store.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="hero-btn" onClick={() => { setActiveSection("shop"); setActiveCategory("Flower Plants"); }}>Shop Flower Plants 🌸</button>
              <button className="hero-btn-outline" onClick={() => setActiveSection("nurseries")}>Our Nurseries 🏪</button>
            </div>
            <div style={{ display: "flex", gap: "32px", marginTop: "32px" }}>
              {[["500+", "Varieties"], ["50+", "Nurseries"], ["₹49", "From"]].map(([val, label]) => (
                <div key={label}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: "#2D6A27" }}>{val}</p>
                  <p style={{ fontSize: "12px", color: "#6A8A65" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right: flower variety pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#6A8A65", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Popular Varieties</p>
            {[["🌹", "Roses & Gerberas", "Starting ₹129"], ["🌷", "Tulips & Lilies", "Starting ₹149"], ["🌻", "Sunflowers & Marigold", "Starting ₹49"], ["🪷", "Jasmine & Lavender", "Starting ₹99"], ["🌸", "Chrysanthemum & Dahlia", "Starting ₹69"]].map(([emoji, label, price]) => (
              <div key={label} onClick={() => { setActiveSection("shop"); setActiveCategory("Flower Plants"); }}
                style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "12px 20px", cursor: "pointer", transition: "all 0.2s", border: "1px solid rgba(255,255,255,0.85)", justifyContent: "space-between" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.55)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "22px" }}>{emoji}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A3A17" }}>{label}</span>
                </div>
                <span style={{ fontSize: "12px", color: "#2D6A27", fontWeight: 600, whiteSpace: "nowrap" }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "#2D6A27", padding: "16px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "12px" }}>
          {[["🏪", "Sourced from Local Nurseries"], ["💰", "Wholesale Mandi Prices"], ["🌱", "Healthy & Fresh Guaranteed"], ["🚚", "Free Delivery above ₹499"]].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{ color: "white", fontSize: "13.5px", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SHOP SECTION ===== */}
      {activeSection === "shop" && (
        <section style={{ padding: "56px 60px", background: "#F7FAF5" }}>
          <h2 className="section-title">
            {activeCategory === "Flower Plants" ? "🌸 Flower Plants" : activeCategory}
          </h2>
          <p className="section-sub">
            {activeCategory === "Flower Plants"
              ? "Roses, Lilies, Tulips, Marigold, Jasmine, Lavender & more — sourced from flower mandis"
              : "All plants sourced directly from nurseries & wholesale markets across India"}
          </p>

          {/* Category tabs */}
          <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #DCE8D8", marginBottom: "20px", overflowX: "auto", gap: "0" }}>
            {categories.map(cat => (
              <button key={cat} className={`tab-btn ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                {cat === "Flower Plants" ? "🌸 " : cat === "Indoor Plants" ? "🪴 " : cat === "Outdoor Plants" ? "🌳 " : cat === "Succulents" ? "🌵 " : "💨 "}
                {cat}
              </button>
            ))}
          </div>

          {/* Price filter */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "36px" }}>
            {priceRanges.map(pr => (
              <button key={pr.label} className={`price-pill ${activePriceRange?.label === pr.label ? "active" : ""}`}
                onClick={() => setActivePriceRange(activePriceRange?.label === pr.label ? null : pr)}>
                {pr.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", maxWidth: "1100px", margin: "0 auto" }}>
            {filteredPlants.map(plant => (
              <div key={plant.id} className="plant-card" style={{ position: "relative" }}>
                <button className="wish-btn" onClick={() => toggleWishlist(plant.id)}>
                  {wishlist.includes(plant.id) ? "❤️" : "🤍"}
                </button>
                {plant.discount >= 40 && (
                  <div style={{ position: "absolute", top: "10px", left: "10px", background: "#E55", color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                    🔥 {plant.discount}% OFF
                  </div>
                )}
                <div style={{ background: "linear-gradient(135deg, #F2FAF0, #E6F5E0)", padding: "36px", textAlign: "center", fontSize: "58px" }}>
                  {plant.img}
                </div>
                <div style={{ padding: "14px 14px 0" }}>
                  <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1A1A", marginBottom: "5px", lineHeight: 1.3 }}>{plant.name}</p>
                  <p style={{ fontSize: "11px", color: "#99AA99", marginBottom: "10px" }}>🏪 {plant.nursery}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: "#2D6A27" }}>₹{plant.price}</span>
                    <span style={{ fontSize: "12px", color: "#ccc", textDecoration: "line-through" }}>₹{plant.original}</span>
                    {plant.discount < 40 && <span style={{ fontSize: "11px", color: "#E88", fontWeight: 600 }}>{plant.discount}% off</span>}
                  </div>
                </div>
                <button className={`add-btn ${cart.includes(plant.id) ? "in-cart" : "not-in-cart"}`} onClick={() => addToCart(plant.id)}>
                  {cart.includes(plant.id) ? "✓ Added" : "+ Add to Cart"}
                </button>
              </div>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>No plants match this filter. Try "All Prices".</p>
          )}
        </section>
      )}

      {/* ===== NURSERIES SECTION ===== */}
      {activeSection === "nurseries" && (
        <section style={{ padding: "56px 60px", background: "#F7FAF5" }}>
          <h2 className="section-title">🏪 Our Nursery & Wholesale Partners</h2>
          <p className="section-sub">We work directly with verified nurseries & wholesale flower mandis across India — zero middlemen, fair prices.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", maxWidth: "1100px", margin: "0 auto 56px" }}>
            {nurseries.map(n => (
              <div key={n.name} className="nursery-card" style={{ background: n.color }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <span style={{ fontSize: "38px" }}>{n.emoji}</span>
                  <span style={{ background: "#2D6A27", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" }}>{n.savings}</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 700, marginBottom: "4px", color: "#1A1A1A" }}>{n.name}</h3>
                <p style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>📍 {n.location} · <span style={{ color: "#2D6A27", fontWeight: 500 }}>{n.type}</span></p>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}><strong>Plants:</strong> {n.plants}</p>
                <button
                  onClick={() => { setActiveSection("shop"); setActiveCategory(n.plants.includes("Rose") || n.plants.includes("Lily") || n.plants.includes("Tulip") || n.plants.includes("Marigold") ? "Flower Plants" : "Indoor Plants"); }}
                  style={{ marginTop: "14px", background: "white", color: "#2D6A27", border: "1.5px solid #B8D9B3", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  onMouseEnter={e => { e.target.style.background = "#2D6A27"; e.target.style.color = "white"; }}
                  onMouseLeave={e => { e.target.style.background = "white"; e.target.style.color = "#2D6A27"; }}>
                  Browse Their Plants →
                </button>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ background: "white", borderRadius: "20px", padding: "44px", maxWidth: "1100px", margin: "0 auto", border: "1.5px solid #DCE8D8" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 700, textAlign: "center", marginBottom: "36px" }}>
              How You Save 40–50%
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
              {[
                ["🌱", "Nurseries List Directly", "Local nurseries & wholesale mandis list their plants on GreenNest — no distributors in between."],
                ["💰", "No Retail Markup", "You skip the garden centre markup. What you pay is close to what the nursery charges wholesale."],
                ["✅", "Quality Inspected", "Every plant is checked before packing — healthy roots, pest-free, and ready for your home."],
                ["🚚", "Packed & Delivered", "Safely packed with breathable packaging and delivered fresh within 1–3 days."],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ textAlign: "center" }}>
                  <div style={{ width: "54px", height: "54px", background: "#EAF5E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 12px" }}>{icon}</div>
                  <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px", color: "#1A1A1A" }}>{title}</p>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#1A2E1A", color: "#A8C8A8", padding: "40px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "22px" }}>🌿</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: "white" }}>GreenNest</span>
          <span style={{ fontSize: "11px", color: "#6A9A6A", marginLeft: "4px", letterSpacing: "1px" }}>NURSERY DIRECT</span>
        </div>
        <p style={{ fontSize: "13px", color: "#6A9A6A", marginBottom: "20px" }}>Connecting plant lovers with nurseries & wholesale mandis across India.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap" }}>
          {["About Us", "Partner Nurseries", "Plant Care Guide", "Shipping Policy", "Returns", "Contact Us"].map(link => (
            <a key={link} href="#" style={{ color: "#6A9A6A", fontSize: "13px", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#C8A030"}
              onMouseLeave={e => e.target.style.color = "#6A9A6A"}>{link}</a>
          ))}
        </div>
        <p style={{ marginTop: "24px", fontSize: "11px", color: "#3A5A3A" }}>© 2026 GreenNest. Partnered with 50+ nurseries across India.</p>
      </footer>
    </div>
  );
}