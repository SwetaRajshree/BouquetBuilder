import { useState, useEffect, useRef } from "react";
import { useCartContext } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL;

const nearbyBakers = [
  { id: 1, name: "Sweet Alchemy Bakery", rating: 4.9, reviews: 312, distance: "0.8 km", minOrder: 399, deliveryTime: "45–60 min", tags: ["Custom", "Fondant", "Wedding"], open: true, specialty: "Designer cakes", avatar: "SA", color: "#e53935" },
  { id: 2, name: "The Cake Studio", rating: 4.8, reviews: 189, distance: "1.2 km", minOrder: 499, deliveryTime: "50–70 min", tags: ["Photo Cakes", "Theme", "Birthday"], open: true, specialty: "Photo & theme cakes", avatar: "TC", color: "#8b4513" },
  { id: 3, name: "Cloud9 Kitchen", rating: 4.7, reviews: 256, distance: "1.9 km", minOrder: 349, deliveryTime: "30–45 min", tags: ["Classic", "Eggless", "Budget"], open: true, specialty: "Eggless classics", avatar: "C9", color: "#2e7d32" },
  { id: 4, name: "Bake & Bloom", rating: 4.9, reviews: 421, distance: "2.3 km", minOrder: 599, deliveryTime: "60–80 min", tags: ["Floral", "Luxury", "Tier"], open: false, specialty: "Floral & tier cakes", avatar: "BB", color: "#6a1b9a" },
  { id: 5, name: "Krispy Layers", rating: 4.6, reviews: 98, distance: "2.7 km", minOrder: 299, deliveryTime: "40–55 min", tags: ["Dessert Boxes", "Cupcakes", "Fast"], open: true, specialty: "Dessert boxes", avatar: "KL", color: "#f57f17" },
  { id: 6, name: "Sugar & Spice Co.", rating: 4.8, reviews: 167, distance: "3.1 km", minOrder: 450, deliveryTime: "55–75 min", tags: ["Vegan", "Keto", "Healthy"], open: true, specialty: "Vegan & keto cakes", avatar: "SS", color: "#00796b" },
];

const quickReplies = {
  start: ["Birthday cake 🎂", "Anniversary cake 💑", "Wedding cake 👰", "Custom design 🎨"],
  flavour: ["Chocolate 🍫", "Red velvet 🍓", "Vanilla ☁️", "Butterscotch 🧡", "Mango 🥭", "Custom flavour"],
  size: ["Small (0.5 kg)", "Medium (1 kg)", "Large (1.5 kg)", "Party (2 kg)", "Grand (3 kg+)"],
  frosting: ["Buttercream", "Whipped cream", "Fondant", "Ganache", "Mirror glaze"],
  tiers: ["1 tier", "2 tiers", "3 tiers", "4+ tiers"],
  budget: ["Under ₹500", "₹500–₹1000", "₹1000–₹2000", "₹2000–₹5000", "No limit 💸"],
  confirm: ["Yes, find bakers! 🎉", "Change something", "Start over"],
};

const chatFlow = [
  { key: "occasion", bot: "🎂 Welcome! What's the occasion?", replies: "start" },
  { key: "flavour", bot: "Yum! What flavour would you like?", replies: "flavour" },
  { key: "size", bot: "Great choice! What size do you need?", replies: "size" },
  { key: "frosting", bot: "Perfect! Which frosting do you prefer?", replies: "frosting" },
  { key: "tiers", bot: "How many tiers?", replies: "tiers" },
  { key: "name", bot: "What name or message should go on the cake?", replies: null },
  { key: "budget", bot: "What's your budget?", replies: "budget" },
  { key: "confirm", bot: null, replies: "confirm" },
];

function StarRating({ rating }) {
  return <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>;
}

const CATEGORIES = ['All', 'Wedding', 'Birthday', 'Anniversary', 'Dessert', 'Occasion'];

function CakeGrid() {
  const { addToCart, cartItems } = useCartContext();
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/cakes`)
      .then(r => r.json())
      .then(data => setCakes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? cakes : cakes.filter(c => c.category === activeCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const handleAdd = (cake) => {
    addToCart({ _id: cake._id, name: cake.name, pricePerStem: cake.price, image: cake.image, category: 'cake' });
    setToast(cake.name);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div style={{ padding: '32px 48px', background: '#fafafa', fontFamily: "'Poppins',sans-serif" }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: '8px 20px', borderRadius: 20, border: '1.5px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'all 0.2s',
              borderColor: activeCategory === cat ? '#e53935' : '#e0e0e0',
              background: activeCategory === cat ? '#e53935' : '#fff',
              color: activeCategory === cat ? '#fff' : '#555' }}>
            {cat}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", outline: 'none', background: '#fff', color: '#555' }}>
            <option value="recommended">⭐ Recommended</option>
            <option value="rating">🏆 Top Rated</option>
            <option value="price_asc">₹ Low to High</option>
            <option value="price_desc">₹ High to Low</option>
          </select>
        </div>
      </div>

      {loading && <p style={{ color: '#e53935', fontSize: 14 }}>🎂 Loading cakes...</p>}
      {!loading && sorted.length === 0 && <p style={{ color: '#aaa', fontSize: 14 }}>No cakes found in this category.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 24 }}>
        {sorted.map(cake => (
          <div key={cake._id} style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', transition: 'all 0.25s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(229,57,53,0.15)'; e.currentTarget.style.borderColor = '#e53935'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#f0f0f0'; }}>
            <div style={{ height: 180, overflow: 'hidden', background: '#fff5f5' }}>
              {cake.image
                ? <img src={cake.image} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎂</div>}
            </div>
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: 13, color: '#e53935', fontWeight: 600, marginBottom: 4 }}>{cake.category}</p>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#222', marginBottom: 6, fontFamily: "'Playfair Display',serif" }}>{cake.name}</h3>
              {cake.rating && <p style={{ fontSize: 12, color: '#f59e0b', marginBottom: 6 }}>{'★'.repeat(Math.floor(cake.rating))} <span style={{ color: '#aaa' }}>{cake.rating}</span></p>}
              <p style={{ fontSize: 15, fontWeight: 700, color: '#e53935', marginBottom: 12 }}>₹{cake.price}</p>
              <button onClick={() => handleAdd(cake)}
                style={{ width: '100%', background: cartItems.find(i => i._id === cake._id) ? '#2e7d32' : '#e53935', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'background 0.2s' }}>
                {cartItems.find(i => i._id === cake._id) ? '✓ In Cart 🛒' : 'Add to Cart 🛒'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#2e7d32', color: '#fff', borderRadius: 30, padding: '14px 28px', fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}

function MainTabs({ active, onNav }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', fontFamily: "'Poppins',sans-serif", padding: '0 48px', display: 'flex', gap: 4 }}>
      {[['cakes', '🎂 Cakes'], ['bakers', '🏪 Choose Your Baker']].map(([key, label]) => (
        <button key={key} onClick={() => onNav(key)}
          style={{ background: 'none', border: 'none', padding: '14px 20px', fontSize: 14, fontWeight: active === key ? 700 : 500, color: active === key ? '#e53935' : '#555', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", borderBottom: active === key ? '2.5px solid #e53935' : '2.5px solid transparent', transition: 'all 0.2s' }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function HeroSlider({ onCustomize }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const slides = [
    {
      id: 0,
      tag: "CLASSIC COLLECTION",
      headline: "Never Stop",
      headlineAccent: "Wishing",
      sub: "Timeless cakes for every celebration",
      bg: "linear-gradient(120deg, #f5ede8 0%, #f0d9cc 40%, #e8c5b0 100%)",
      accentBg: "linear-gradient(135deg, #e53935, #b71c1c)",
      textDark: "#4a1810",
      textMid: "#8b3626",
      accent: "#e53935",
      sparkColor: "#ffb300",
      shimmerColor: "rgba(229,57,53,0.15)",
      wave: "#f5ede8",
      cakeEmoji: "🎂",
      decorEmoji: ["🍓", "🍫", "🌸"],
      stats: [{ n: "50+", l: "Flavours" }, { n: "4.9★", l: "Rating" }, { n: "2hr", l: "Delivery" }],
    },
    {
      id: 1,
      tag: "THEME CAKES",
      headline: "Find Your",
      headlineAccent: "Wonder",
      sub: "Magical designs crafted with love",
      bg: "linear-gradient(120deg, #0a2e1a 0%, #0d4a2a 50%, #1a6b3c 100%)",
      accentBg: "linear-gradient(135deg, #2e7d32, #1b5e20)",
      textDark: "#c8f0d8",
      textMid: "#88d4a4",
      accent: "#4caf50",
      sparkColor: "#ffd700",
      shimmerColor: "rgba(76,175,80,0.2)",
      wave: "#0a2e1a",
      cakeEmoji: "🦁",
      decorEmoji: ["🌿", "⭐", "🎪"],
      stats: [{ n: "100+", l: "Themes" }, { n: "4.8★", l: "Rating" }, { n: "Custom", l: "Design" }],
    },
    {
      id: 2,
      tag: "GOURMET COLLECTION",
      headline: "Crafted Like",
      headlineAccent: "Fine Art",
      sub: "Premium ingredients, extraordinary taste",
      bg: "linear-gradient(120deg, #fdf6ed 0%, #f5e6c8 40%, #edd5a0 100%)",
      accentBg: "linear-gradient(135deg, #8b4513, #5d2d0a)",
      textDark: "#3b1f08",
      textMid: "#7a4520",
      accent: "#8b4513",
      sparkColor: "#ffd700",
      shimmerColor: "rgba(139,69,19,0.15)",
      wave: "#fdf6ed",
      cakeEmoji: "🍰",
      decorEmoji: ["✨", "🏆", "🎖️"],
      stats: [{ n: "Chef", l: "Crafted" }, { n: "4.9★", l: "Rating" }, { n: "Fresh", l: "Daily" }],
    },
    {
      id: 3,
      tag: "ANNIVERSARY CAKES",
      headline: "Every Slice,",
      headlineAccent: "A Love Story",
      sub: "Make your special moment unforgettable",
      bg: "linear-gradient(120deg, #2a0a1a 0%, #4a1030 50%, #6b1a40 100%)",
      accentBg: "linear-gradient(135deg, #c2185b, #880e4f)",
      textDark: "#fce4ec",
      textMid: "#f48fb1",
      accent: "#e91e63",
      sparkColor: "#ffd700",
      shimmerColor: "rgba(233,30,99,0.2)",
      wave: "#2a0a1a",
      cakeEmoji: "💕",
      decorEmoji: ["🌹", "💌", "🌸"],
      stats: [{ n: "Couples", l: "Choice" }, { n: "4.9★", l: "Rating" }, { n: "Same", l: "Day" }],
    },
  ];

  const goTo = (idx, dir) => {
    if (animating || idx === cur) return;
    setPrev(cur);
    setDirection(dir);
    setAnimating(true);
    setCur(idx);
    setTimeout(() => { setAnimating(false); setPrev(null); }, 700);
  };

  const next = () => goTo((cur + 1) % slides.length, 1);
  const prev2 = () => goTo((cur - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [cur, paused, animating]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev2(); }
    touchStartX.current = null;
  };

  const s = slides[cur];

  return (
    <div
      style={{ position: "relative", overflow: "hidden", fontFamily: "'Poppins',sans-serif", userSelect: "none" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide */}
      <div
        key={cur}
        style={{
          background: s.bg,
          minHeight: 480,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          animation: `slideIn${direction > 0 ? "Right" : "Left"} 0.65s cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        {/* Decorative shimmer orbs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: s.shimmerColor, top: "-100px", right: "15%", filter: "blur(60px)", pointerEvents: "none", animation: "orbFloat 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: s.shimmerColor, bottom: "-60px", left: "30%", filter: "blur(40px)", pointerEvents: "none", animation: "orbFloat 8s ease-in-out infinite reverse" }} />

        {/* Floating deco emojis */}
        {s.decorEmoji.map((em, i) => (
          <div key={i} style={{
            position: "absolute",
            fontSize: 22 + i * 6,
            opacity: 0.2,
            pointerEvents: "none",
            top: `${15 + i * 25}%`,
            right: `${8 + i * 5}%`,
            animation: `floatDeco${i} ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}>{em}</div>
        ))}

        {/* Left: Text content */}
        <div style={{ flex: 1, padding: "60px 64px 60px 80px", position: "relative", zIndex: 2, animation: "textReveal 0.7s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.1s" }}>
          {/* Tag pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
            border: `1px solid ${s.accent}44`,
            borderRadius: 24, padding: "5px 16px", marginBottom: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: 2, color: s.accent,
            animation: "tagPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both", animationDelay: "0.2s",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, display: "inline-block", animation: "pulseDot 1.5s ease infinite" }} />
            {s.tag}
          </div>

          {/* Headline */}
          <div style={{ fontSize: "clamp(36px,4vw,58px)", fontFamily: "'Playfair Display',serif", lineHeight: 1.1, marginBottom: 6 }}>
            <span style={{ color: s.textDark, display: "block", animation: "slideWord 0.6s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.15s" }}>
              {s.headline}
            </span>
            <span style={{
              fontStyle: "italic", color: "transparent",
              backgroundImage: s.accentBg,
              WebkitBackgroundClip: "text", backgroundClip: "text",
              display: "block",
              animation: "slideWord 0.6s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.25s",
            }}>
              {s.headlineAccent}
            </span>
          </div>

          <p style={{ color: s.textMid, fontSize: 15, marginBottom: 32, opacity: 0.9, animation: "fadeUpSub 0.6s ease both", animationDelay: "0.35s" }}>
            {s.sub}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeUpSub 0.6s ease both", animationDelay: "0.45s" }}>
            <button
              onClick={onCustomize}
              style={{
                backgroundImage: s.accentBg, color: "#fff", border: "none",
                borderRadius: 8, padding: "14px 36px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                boxShadow: `0 8px 28px ${s.accent}55`,
                transition: "transform 0.2s, box-shadow 0.2s",
                letterSpacing: 0.5,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow = `0 14px 36px ${s.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 28px ${s.accent}55`; }}
            >
              ORDER NOW
            </button>
            <button
              style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                color: s.textDark, border: `1.5px solid ${s.textDark}33`,
                borderRadius: 8, padding: "14px 28px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "none"; }}
            >
              Explore All
            </button>
          </div>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: 28, marginTop: 36, animation: "fadeUpSub 0.6s ease both", animationDelay: "0.55s" }}>
            {s.stats.map((st, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.textDark, fontFamily: "'Playfair Display',serif" }}>{st.n}</div>
                <div style={{ fontSize: 11, color: s.textMid, fontWeight: 500, marginTop: 2, letterSpacing: 0.5 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Big emoji */}
        <div style={{
          flex: "0 0 340px", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", padding: "40px 40px 40px 0",
          animation: "cakeReveal 0.8s cubic-bezier(0.22,1,0.36,1) both", animationDelay: "0.2s",
        }}>
          {/* Glow ring */}
          <div style={{
            position: "absolute", width: 260, height: 260, borderRadius: "50%",
            background: `radial-gradient(circle, ${s.shimmerColor} 0%, transparent 70%)`,
            animation: "glowPulse 3s ease-in-out infinite",
          }} />
          <div style={{
            fontSize: 160, lineHeight: 1,
            filter: `drop-shadow(0 20px 40px ${s.accent}44)`,
            animation: "heroCakeFloat 3.5s ease-in-out infinite",
            position: "relative", zIndex: 2,
          }}>
            {s.cakeEmoji}
          </div>
          {/* Sparkles */}
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: 8, height: 8, borderRadius: "50%",
              background: s.sparkColor,
              top: `${20 + i * 18}%`, left: `${10 + i * 20}%`,
              animation: `sparkle ${1.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>

        {/* Scallop wave bottom */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 32, pointerEvents: "none" }}>
          <svg viewBox="0 0 1200 32" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,32 C0,32 100,0 200,16 C300,32 400,0 500,16 C600,32 700,0 800,16 C900,32 1000,0 1100,16 C1200,32 1200,32 1200,32 Z" fill="#fafafa" />
          </svg>
        </div>
      </div>

      {/* Arrow nav buttons */}
      <button
        onClick={prev2}
        style={{
          position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)",
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
          border: "none", cursor: "pointer", fontSize: 18, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 10,
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1.12)"; e.currentTarget.style.background = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}
      >‹</button>
      <button
        onClick={next}
        style={{
          position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)",
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
          border: "none", cursor: "pointer", fontSize: 18, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 10,
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1.12)"; e.currentTarget.style.background = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}
      >›</button>

      {/* Dot indicators */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
        {slides.map((sl, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > cur ? 1 : -1)}
            style={{
              width: i === cur ? 32 : 10, height: 10, borderRadius: 5,
              background: i === cur ? s.accent : "rgba(255,255,255,0.55)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: i === cur ? `0 2px 8px ${s.accent}66` : "none",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: s.accent, zIndex: 10, animation: "progressBar 5s linear both", animationIterationCount: 1 }} />
      )}

      <style>{`
        @keyframes slideInRight{from{opacity:0;transform:translateX(60px);}to{opacity:1;transform:translateX(0);}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-60px);}to{opacity:1;transform:translateX(0);}}
        @keyframes textReveal{from{opacity:0;transform:translateX(-30px);}to{opacity:1;transform:translateX(0);}}
        @keyframes slideWord{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeUpSub{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes cakeReveal{from{opacity:0;transform:scale(0.7) rotate(-10deg);}to{opacity:1;transform:scale(1) rotate(0deg);}}
        @keyframes tagPop{from{opacity:0;transform:scale(0.7);}to{opacity:1;transform:scale(1);}}
        @keyframes heroCakeFloat{0%,100%{transform:translateY(0) rotate(-2deg);}50%{transform:translateY(-18px) rotate(2deg);}}
        @keyframes glowPulse{0%,100%{transform:scale(1);opacity:0.7;}50%{transform:scale(1.15);opacity:1;}}
        @keyframes sparkle{0%,100%{transform:scale(0);opacity:0;}50%{transform:scale(1);opacity:1;}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.5);opacity:0.6;}}
        @keyframes orbFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-30px);}}
        @keyframes floatDeco0{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-12px) rotate(10deg);}}
        @keyframes floatDeco1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-18px) rotate(-8deg);}}
        @keyframes floatDeco2{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-10px) rotate(6deg);}}
        @keyframes progressBar{from{width:0%;}to{width:100%;}}
        @keyframes floatCake{0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-16px) rotate(3deg);}}
        @keyframes fadeSlide{from{opacity:0;transform:translateX(30px);}to{opacity:1;transform:translateX(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes typingDot{0%,80%,100%{transform:scale(0);}40%{transform:scale(1);}}
        @keyframes popIn{from{transform:scale(0.85);opacity:0;}to{transform:scale(1);opacity:1;}}
        @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 rgba(229,57,53,0.35);}50%{box-shadow:0 0 0 12px rgba(229,57,53,0);}}
        @keyframes bounceY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#e53935;border-radius:3px;}
      `}</style>
    </div>
  );
}

function ChatCustomizer({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [order, setOrder] = useState({});
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  const addBot = (text) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text }]);
    }, 900 + Math.random() * 300);
  };

  useEffect(() => {
    setTimeout(() => addBot("👋 Hi! I'm your cake consultant. Let's build your perfect cake together!"), 500);
    setTimeout(() => addBot(chatFlow[0].bot), 1700);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const handleReply = (text) => {
    const currentStep = chatFlow[step];
    const newOrder = { ...order, [currentStep.key]: text };
    setOrder(newOrder);
    setMessages(m => [...m, { from: "user", text }]);

    if (step < chatFlow.length - 2) {
      const next = chatFlow[step + 1];
      setStep(step + 1);
      setTimeout(() => addBot(next.bot), 900);
    } else if (step === chatFlow.length - 2) {
      setStep(step + 1);
      const summary = `🎉 Amazing! Here's your order:\n\n🎂 Occasion: ${newOrder.occasion}\n🍫 Flavour: ${newOrder.flavour}\n⚖️ Size: ${newOrder.size}\n🎨 Frosting: ${newOrder.frosting}\n🏗️ Tiers: ${newOrder.tiers}\n✍️ Message: "${newOrder.name || "None"}"\n💰 Budget: ${newOrder.budget}\n\nShall I find the best nearby bakers for you?`;
      setTimeout(() => addBot(summary), 900);
    } else {
      if (text.includes("find")) {
        setDone(true);
        setTimeout(() => addBot("🔍 Found 6 nearby bakers ready to craft your cake! Scroll down to pick your baker."), 700);
        setTimeout(() => onComplete(newOrder), 2200);
      } else if (text.includes("Change")) {
        setStep(0); setOrder({}); setMessages([]);
        setTimeout(() => addBot("No problem! Let's start fresh."), 400);
        setTimeout(() => addBot(chatFlow[0].bot), 1400);
      } else {
        setStep(0); setOrder({}); setMessages([]);
        setTimeout(() => addBot(chatFlow[0].bot), 500);
      }
    }
  };

  const handleTextSubmit = () => { if (!inputVal.trim()) return; handleReply(inputVal.trim()); setInputVal(""); };
  const currentStep = step < chatFlow.length ? chatFlow[step] : null;
  const showReplies = currentStep?.replies && !done;
  const showInput = currentStep?.replies === null && !done;

  return (
    <div style={{ fontFamily: "'Poppins',sans-serif", maxWidth: 680, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #e0e0e0", overflow: "hidden", boxShadow: "0 16px 64px rgba(0,0,0,0.12)" }}>
        <div style={{ background: "#075e54", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎂</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Bakingo Cake Consultant</div>
            <div style={{ color: "#a0e8b0", fontSize: 12 }}>🟢 Online — replies instantly</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}>
            {["📞", "⋮"].map(i => <span key={i} style={{ color: "#fff", fontSize: 20, cursor: "pointer" }}>{i}</span>)}
          </div>
        </div>

        <div style={{ background: "#e5ddd5", minHeight: 400, maxHeight: 440, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", animation: "popIn 0.25s ease" }}>
              <div style={{ maxWidth: "75%", background: msg.from === "user" ? "#dcf8c6" : "#fff", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,0.12)", whiteSpace: "pre-wrap" }}>
                {msg.text}
                <div style={{ fontSize: 11, color: "#999", textAlign: "right", marginTop: 2 }}>
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {msg.from === "user" ? "✓✓" : ""}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", width: 72, boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#999", animation: "typingDot 1.4s ease infinite", animationDelay: `${i * 0.2}s` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showReplies && !typing && (
          <div style={{ background: "#f0f0f0", padding: "12px 14px", borderTop: "1px solid #e0e0e0" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 8, letterSpacing: 0.5 }}>QUICK REPLIES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickReplies[currentStep.replies]?.map(r => (
                <button key={r} onClick={() => handleReply(r)} style={{ background: "#fff", border: "1.5px solid #25d366", color: "#075e54", borderRadius: 20, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#25d366"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#075e54"; }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {showInput && !typing && (
          <div style={{ background: "#f0f0f0", padding: "12px 14px", display: "flex", gap: 10, borderTop: "1px solid #e0e0e0" }}>
            <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTextSubmit()} placeholder="Type your message…" style={{ flex: 1, border: "none", borderRadius: 22, padding: "10px 16px", fontSize: 14, outline: "none", background: "#fff", fontFamily: "'Poppins',sans-serif" }} />
            <button onClick={handleTextSubmit} style={{ background: "#25d366", border: "none", borderRadius: "50%", width: 44, height: 44, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
          </div>
        )}

        {done && (
          <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderTop: "2px solid #25d366" }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <span style={{ color: "#075e54", fontWeight: 600, fontSize: 14 }}>Order summary sent! Scroll down to choose your baker.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NearbyBakers({ orderDetails, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  const sorted = [...nearbyBakers]
    .sort((a, b) => sortBy === "distance" ? parseFloat(a.distance) - parseFloat(b.distance) : sortBy === "rating" ? b.rating - a.rating : a.minOrder - b.minOrder)
    .filter(b => filterOpen ? b.open : true);

  return (
    <div style={{ padding: "60px 48px", background: "#fafafa", fontFamily: "'Poppins',sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📍 6 bakers near you in Bhubaneswar</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: "#222", fontFamily: "'Playfair Display',serif" }}>Choose Your Baker</h2>
        <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>
          {orderDetails ? `Showing bakers for your ${orderDetails.occasion || "custom"} cake` : "All accepting custom orders today"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          {[["distance", "📍 Nearest"], ["rating", "⭐ Top Rated"], ["price", "💰 Price"]].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)} style={{ padding: "8px 20px", borderRadius: 20, border: "1.5px solid", borderColor: sortBy === val ? "#e53935" : "#e0e0e0", background: sortBy === val ? "#e53935" : "#fff", color: sortBy === val ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
          <button onClick={() => setFilterOpen(!filterOpen)} style={{ padding: "8px 20px", borderRadius: 20, border: "1.5px solid", borderColor: filterOpen ? "#2e7d32" : "#e0e0e0", background: filterOpen ? "#e8f5e9" : "#fff", color: filterOpen ? "#2e7d32" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s" }}>
            🟢 Open Now
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
        {sorted.map(baker => (
          <div key={baker.id} onMouseEnter={() => setHovered(baker.id)} onMouseLeave={() => setHovered(null)}
            style={{ background: "#fff", borderRadius: 20, border: hovered === baker.id ? "2px solid #e53935" : "1.5px solid #f0f0f0", boxShadow: hovered === baker.id ? "0 16px 48px rgba(229,57,53,0.15)" : "0 4px 16px rgba(0,0,0,0.06)", transform: hovered === baker.id ? "translateY(-6px)" : "translateY(0)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", overflow: "hidden", cursor: "pointer" }}>
            <div style={{ background: `${baker.color}18`, padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: baker.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0, animation: hovered === baker.id ? "bounceY 0.8s ease infinite" : "none" }}>
                  {baker.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{baker.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{baker.specialty}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: baker.open ? "#e8f5e9" : "#f5f5f5", borderRadius: 10, padding: "3px 10px" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: baker.open ? "#4caf50" : "#bbb" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: baker.open ? "#2e7d32" : "#999" }}>{baker.open ? "OPEN" : "CLOSED"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderBottom: "1px solid #f5f5f5" }}>
              {[{ label: "Rating", val: `⭐ ${baker.rating}` }, { label: "Distance", val: `📍 ${baker.distance}` }, { label: "Delivery", val: `⏱ ${baker.deliveryTime}` }].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 20px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {baker.tags.map(tag => <span key={tag} style={{ background: "#f5f5f5", color: "#555", borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{tag}</span>)}
              <span style={{ background: "#fff3e0", color: "#e65100", borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>Min ₹{baker.minOrder}</span>
            </div>

            <div style={{ padding: "4px 20px 8px" }}>
              <StarRating rating={baker.rating} />
              <span style={{ fontSize: 12, color: "#aaa", marginLeft: 4 }}>{baker.reviews} reviews</span>
            </div>

            <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10 }}>
              <button onClick={() => onSelect(baker)} disabled={!baker.open}
                style={{ flex: 1, background: baker.open ? "#e53935" : "#e0e0e0", color: baker.open ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: baker.open ? "pointer" : "not-allowed", fontFamily: "'Poppins',sans-serif", transition: "background 0.2s", animation: baker.open && hovered === baker.id ? "pulse2 1.5s ease infinite" : "none" }}>
                {baker.open ? "Send My Order 🎂" : "Opens Tomorrow"}
              </button>
              <button style={{ background: "#f5f5f5", border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 16, cursor: "pointer" }}>💬</button>
            </div>
          </div>
        ))}
      </div>

      {/* Baker join CTA */}
      <div style={{ maxWidth: 700, margin: "56px auto 0", background: "linear-gradient(135deg,#e53935,#b71c1c)", borderRadius: 20, padding: "40px 48px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 36, marginBottom: 12, animation: "bounceY 2s ease infinite" }}>🏪</div>
        <h3 style={{ fontSize: 24, fontFamily: "'Playfair Display',serif", fontStyle: "italic", marginBottom: 10 }}>Are you a local baker?</h3>
        <p style={{ opacity: 0.85, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          Join hundreds of cloud kitchens & home bakers already earning on Bakingo. Get orders, grow your business, and reach thousands nearby.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {["🚀 Register as Baker", "📊 View Baker Dashboard"].map(label => (
            <button key={label} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {[["500+", "Active Bakers"], ["2 Cr+", "Orders Delivered"], ["4.8★", "Avg Baker Rating"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{num}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#2e7d32", color: "#fff", borderRadius: 14, padding: "16px 28px", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, animation: "fadeUp 0.4s ease" }}>
      <span style={{ fontSize: 22 }}>🎉</span> {msg}
    </div>
  );
}

export default function CakePage() {
  const { addToCart } = useCartContext();
  const [tab, setTab] = useState('cakes');
  const [orderDetails, setOrderDetails] = useState(null);
  const [toast, setToast] = useState(null);
  const bakerRef = useRef(null);

  const handleCustomizeComplete = (order) => {
    setOrderDetails(order);
    setTab('bakers');
    setTimeout(() => bakerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  const handleBakerSelect = (baker) => {
    if (orderDetails) {
      addToCart({ _id: baker.id, name: `${baker.name} — ${orderDetails.occasion || 'Custom'} Cake`, pricePerStem: baker.minOrder, image: null, category: 'cake', color: '', city: '' });
    }
    setToast(`Order sent to ${baker.name}! They'll confirm shortly.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ background: '#fafafa' }}>
      <MainTabs active={tab} onNav={setTab} />

      {tab === 'cakes' && (
        <>
          <HeroSlider onCustomize={() => setTab('customize')} />
          <CakeGrid />
          <div style={{ padding: '60px 48px', background: '#fff', fontFamily: "'Poppins',sans-serif" }}>
            <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, color: '#222', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>How It Works</h2>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: 48, fontSize: 15 }}>3 simple steps to your dream cake</p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
              {[
                { n: '1', icon: '💬', title: 'Chat & Customise', desc: 'Describe your dream cake in our WhatsApp-style chat. Flavour, design, occasion — anything goes.' },
                { n: '2', icon: '🏪', title: 'Pick a Local Baker', desc: 'Browse nearby bakers & cloud kitchens. Compare ratings, prices, and delivery time.' },
                { n: '3', icon: '🚀', title: 'Delivered Fresh', desc: 'Your baker crafts it fresh and delivers right to your door. Track in real-time.' },
              ].map(s => (
                <div key={s.n} style={{ flex: '1 1 240px', maxWidth: 280, textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 20px' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff5f5', border: '2px solid #ffcdd2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{s.icon}</div>
                    <div style={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, background: '#e53935', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{s.n}</div>
                  </div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, color: '#222', marginBottom: 10 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button onClick={() => setTab('customize')} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '16px 48px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 6px 24px rgba(229,57,53,0.35)', animation: 'pulse2 2.5s ease infinite' }}>
                Start Customising 🎂
              </button>
            </div>
          </div>
        </>
      )}

      {tab === 'customize' && (
        <div style={{ background: 'linear-gradient(180deg,#fff5f5,#fce4ec)', paddingTop: 48, fontFamily: "'Poppins',sans-serif" }}>
          <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
            <div style={{ display: 'inline-block', background: '#e8f5e9', color: '#2e7d32', borderRadius: 20, padding: '6px 20px', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>🎂 Dream Cake Builder</div>
            <h1 style={{ fontSize: 38, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#880e4f', marginBottom: 8 }}>Your Dream Cake, Just a Chat Away!</h1>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 520, margin: '0 auto' }}>Have a design in mind? Chat with us and let our local bakers craft the perfect custom cake for your special moment.</p>
          </div>
          <ChatCustomizer onComplete={handleCustomizeComplete} />
        </div>
      )}

      {tab === 'bakers' && (
        <>
          <div ref={bakerRef}>
            <NearbyBakers orderDetails={orderDetails} onSelect={handleBakerSelect} />
          </div>
          <div style={{ textAlign: 'center', padding: '0 0 40px' }}>
            <button onClick={() => setTab('customize')} style={{ background: 'none', border: '1.5px solid #e53935', color: '#e53935', borderRadius: 8, padding: '12px 32px', fontSize: 14, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
              ← Customise My Cake
            </button>
          </div>
        </>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
