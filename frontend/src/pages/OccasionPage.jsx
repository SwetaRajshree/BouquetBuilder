import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL;

// ── Occasion config ──────────────────────────────────────────
const OCCASIONS = {
  valentines: {
    key: 'valentines',
    label: "Valentine's Day",
    icon: '💝',
    emoji: ['❤️','💕','🌹','💋','💘','🥀','💗','💖'],
    gradient: 'from-[#ff6b8a] via-[#ff4d6d] to-[#c9184a]',
    bgGradient: 'from-[#fff0f3] via-[#ffe0e6] to-[#ffd6e0]',
    cardBg: 'from-[#fff0f3] to-[#ffe4e8]',
    accent: '#c9184a',
    tagline: 'Say it with flowers 🌹',
    headline: "Love in Full Bloom",
    subtext: "Because some feelings are too beautiful for words. Let our handpicked Valentine's bouquets speak the language of your heart — passionate, tender, and unforgettable.",
    quote: '"The best thing to hold onto in life is each other." — Audrey Hepburn',
    keywords: ['Valentine', 'Anniversary', 'Love', 'Romance', 'Romantic'],
    tips: [
      { icon: '🌹', title: 'Classic Red Roses', desc: 'Timeless symbol of deep love and passion' },
      { icon: '💐', title: 'Mixed Bouquets', desc: 'A blend of colors to express every shade of love' },
      { icon: '🎁', title: 'Add a Message', desc: 'Personalize with a handwritten note from the heart' },
    ],
  },
  birthday: {
    key: 'birthday',
    label: 'Birthday',
    icon: '🎂',
    emoji: ['🎂','🎉','🎈','🌸','✨','🎊','🌻','🎁'],
    gradient: 'from-[#f77f00] via-[#fcbf49] to-[#eae2b7]',
    bgGradient: 'from-[#fffbf0] via-[#fff3d6] to-[#ffeaa7]',
    cardBg: 'from-[#fffbf0] to-[#fff3d6]',
    accent: '#f77f00',
    tagline: 'Make their day magical ✨',
    headline: "Celebrate Every Petal",
    subtext: "Birthdays are nature's way of telling us to eat more cake — and surround ourselves with more flowers! Brighten their special day with a burst of colour and joy.",
    quote: '"A birthday is not a day to fear, it\'s a day to celebrate how far you\'ve come." — Unknown',
    keywords: ['Birthday', 'Celebration', 'Happiness', 'Cheer Up'],
    tips: [
      { icon: '🌻', title: 'Bright Sunflowers', desc: 'Radiate happiness and positive energy' },
      { icon: '🌸', title: 'Gerbera Daisies', desc: 'Cheerful and vibrant — perfect for celebrations' },
      { icon: '🎀', title: 'Wrapped in Style', desc: 'Beautiful packaging to make the gift extra special' },
    ],
  },
  anniversary: {
    key: 'anniversary',
    label: 'Anniversary',
    icon: '💍',
    emoji: ['💍','🥂','✨','🌹','💫','🕊️','💎','🌷'],
    gradient: 'from-[#7b2d8b] via-[#9d4edd] to-[#c77dff]',
    bgGradient: 'from-[#f8f0ff] via-[#ede0ff] to-[#e0cfff]',
    cardBg: 'from-[#f8f0ff] to-[#ede0ff]',
    accent: '#7b2d8b',
    tagline: 'Celebrate your forever 💍',
    headline: "Years of Beautiful Moments",
    subtext: "Every anniversary is a chapter in your love story. Mark this milestone with flowers as enduring as your bond — elegant, luxurious, and deeply meaningful.",
    quote: '"A great marriage is not when the perfect couple comes together, it is when an imperfect couple learns to enjoy their differences." — Dave Meurer',
    keywords: ['Anniversary', 'Valentine', 'Special Gift', 'Premium Gift', 'Luxury'],
    tips: [
      { icon: '🌹', title: 'Red & White Roses', desc: 'Classic elegance for a timeless celebration' },
      { icon: '💜', title: 'Orchids & Lilies', desc: 'Luxurious blooms for a luxurious love' },
      { icon: '🥂', title: 'Add Champagne', desc: 'Pair with bubbly for the perfect anniversary gift' },
    ],
  },
  justbecause: {
    key: 'justbecause',
    label: 'Just Because',
    icon: '🌸',
    emoji: ['🌸','🌿','☀️','🦋','🌼','🍃','🌺','💚'],
    gradient: 'from-[#52b788] via-[#74c69d] to-[#b7e4c7]',
    bgGradient: 'from-[#f0fff4] via-[#e8f5e9] to-[#d8f3dc]',
    cardBg: 'from-[#f0fff4] to-[#e8f5e9]',
    accent: '#2d6a4f',
    tagline: 'No reason needed 🌿',
    headline: "Because You Thought of Them",
    subtext: "The most beautiful gifts are the unexpected ones. Surprise someone you love — not for a birthday, not for an anniversary — just because they make your world brighter.",
    quote: '"Unexpected kindness is the most powerful, least costly, and most underrated agent of human change." — Bob Kerrey',
    keywords: ['Friendship', 'Cheer Up', 'Thank You', 'Get Well Soon', 'Friendship Day'],
    tips: [
      { icon: '🌼', title: 'Wildflower Mix', desc: 'Spontaneous and free-spirited, just like the gesture' },
      { icon: '💛', title: 'Yellow Roses', desc: 'Friendship, warmth, and a sunny disposition' },
      { icon: '🌿', title: 'Green & Fresh', desc: 'Calming arrangements that bring peace and joy' },
    ],
  },
};

// ── Floating emoji animation ─────────────────────────────────
function FloatingEmojis({ emojis, accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="absolute text-2xl select-none"
          style={{
            left: `${8 + (i * 11.5) % 85}%`,
            top: `${10 + (i * 17) % 75}%`,
            animation: `float${i % 3} ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.25 + (i % 3) * 0.15,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

// ── Flower card ──────────────────────────────────────────────
function FlowerCard({ flower, index, onAdd }) {
  const { cartItems } = useCartContext();
  const inCart = cartItems.find(i => i._id === flower._id);
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden shadow-soft-s hover:shadow-soft-m hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s, box-shadow 0.3s, translate 0.3s`,
      }}
    >
      {flower.image && flower.image !== 'PASTE_LINK_HERE' ? (
        <img src={flower.image} alt={flower.name} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-5xl">🌸</div>
      )}
      <div className="p-4">
        <h3 className="font-playfair font-bold text-base text-roseDD mb-1">{flower.name}</h3>
        {flower.emotion && <p className="text-xs text-gray-400 mb-1">💫 {flower.emotion}</p>}
        {flower.color && <p className="text-xs text-gray-400 mb-2">🎨 {flower.color}</p>}
        <p className="font-playfair font-extrabold text-roseD text-lg mb-3">₹{flower.pricePerStem}<span className="text-xs font-normal text-gray-400">/stem</span></p>
        <button
          onClick={() => onAdd(flower)}
          className="w-full py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{
            background: inCart ? '#22c55e' : 'linear-gradient(135deg, #C9848A, #e09099)',
            color: 'white',
          }}
        >
          {inCart ? `In Cart (${inCart.quantity}) ✓` : 'Add to Cart 🛒'}
        </button>
      </div>
    </div>
  );
}

export default function OccasionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);

  const occ = OCCASIONS[slug];

  useEffect(() => {
    if (!occ) return;
    setTimeout(() => setHeroVisible(true), 100);
    fetch(`${API}/api/flowers`)
      .then(r => r.json())
      .then(data => {
        const matched = data.filter(f =>
          f.occasion?.some(o =>
            occ.keywords.some(k => o.toLowerCase().includes(k.toLowerCase()))
          ) ||
          occ.keywords.some(k =>
            f.emotion?.toLowerCase().includes(k.toLowerCase()) ||
            f.category?.toLowerCase().includes(k.toLowerCase())
          )
        );
        // fallback: show all if none matched
        setFlowers(matched.length > 0 ? matched : data.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAdd(flower) {
    addToCart(flower);
    setToast(flower.name);
    setTimeout(() => setToast(''), 2000);
  }

  if (!occ) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
      <div className="text-5xl">🌸</div>
      <p className="text-gray-400">Occasion not found</p>
      <button onClick={() => navigate('/')} className="text-roseD underline text-sm">Go Home</button>
    </div>
  );

  return (
    <div className="page-enter overflow-hidden">
      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(8deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-24px) rotate(-6deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(12deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* ── HERO ── */}
      <section
        className={`relative min-h-[92vh] flex items-center justify-center text-center px-4 py-20 bg-gradient-to-br ${occ.bgGradient} overflow-hidden`}
      >
        <FloatingEmojis emojis={occ.emoji} accent={occ.accent} />

        {/* Big background icon */}
        <div
          className="absolute text-[22rem] select-none pointer-events-none"
          style={{ opacity: 0.04, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        >
          {occ.icon}
        </div>

        <div
          className="relative z-10 max-w-[720px]"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold mb-6 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${occ.accent}, ${occ.accent}99)`, animation: 'scaleIn 0.6s ease 0.3s both' }}
          >
            <span>{occ.icon}</span> {occ.tagline}
          </div>

          <h1
            className="font-playfair font-extrabold leading-[1.1] mb-6"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              color: occ.accent,
              animation: 'slideUp 0.7s ease 0.2s both',
              textShadow: `0 4px 30px ${occ.accent}30`,
            }}
          >
            {occ.headline}
          </h1>

          <p
            className="text-[1.05rem] text-gray-600 leading-relaxed mb-8 font-light max-w-[580px] mx-auto"
            style={{ animation: 'slideUp 0.7s ease 0.4s both' }}
          >
            {occ.subtext}
          </p>

          {/* Quote */}
          <div
            className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 mb-8 border border-white/80 shadow-sm max-w-[520px] mx-auto"
            style={{ animation: 'slideUp 0.7s ease 0.5s both' }}
          >
            <p className="text-sm text-gray-500 italic leading-relaxed">{occ.quote}</p>
          </div>

          <div
            className="flex gap-3 justify-center flex-wrap"
            style={{ animation: 'slideUp 0.7s ease 0.6s both' }}
          >
            <button
              onClick={() => document.getElementById('flowers-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 rounded-full text-white font-semibold text-[.95rem] shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
              style={{ background: `linear-gradient(135deg, ${occ.accent}, ${occ.accent}cc)` }}
            >
              Shop Flowers {occ.icon}
            </button>
            <button
              onClick={() => navigate('/shops')}
              className="px-8 py-3.5 rounded-full font-semibold text-[.95rem] bg-white/80 hover:bg-white border border-white shadow-md hover:-translate-y-1 transition-all"
              style={{ color: occ.accent }}
            >
              Find a Shop 🗺️
            </button>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1000px] mx-auto">
          <h2
            className="font-playfair font-bold text-center mb-2 text-[clamp(1.6rem,3vw,2.2rem)]"
            style={{ color: occ.accent }}
          >
            Why These Flowers?
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">Our florist's guide to the perfect {occ.label} bouquet</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {occ.tips.map((tip, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 text-center bg-gradient-to-br ${occ.cardBg} border border-white shadow-soft-s`}
                style={{ animation: `slideUp 0.6s ease ${i * 0.15}s both` }}
              >
                <div className="text-4xl mb-3">{tip.icon}</div>
                <h3 className="font-playfair font-bold text-base mb-2" style={{ color: occ.accent }}>{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOWERS ── */}
      <section
        id="flowers-section"
        className={`py-16 px-4 bg-gradient-to-br ${occ.bgGradient}`}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.2rem)] mb-2"
              style={{ color: occ.accent }}
            >
              Perfect Flowers for {occ.label}
            </h2>
            <p className="text-gray-500 text-sm">
              {loading ? 'Finding the perfect blooms...' : `${flowers.length} flowers curated just for this occasion`}
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="w-full h-44 bg-pink-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-pink-100 rounded w-3/4" />
                    <div className="h-3 bg-pink-50 rounded w-1/2" />
                    <div className="h-8 bg-pink-100 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {flowers.map((flower, i) => (
              <FlowerCard key={flower._id} flower={flower} index={i} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16 px-4 text-center">
        <div
          className="max-w-[600px] mx-auto rounded-3xl p-10 text-white shadow-xl"
          style={{ background: `linear-gradient(135deg, ${occ.accent}, ${occ.accent}99)` }}
        >
          <div className="text-5xl mb-4">{occ.icon}</div>
          <h2 className="font-playfair font-bold text-2xl mb-3">Ready to make someone smile?</h2>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">
            Find a local florist near you and order the perfect {occ.label} bouquet today.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/shops')}
              className="bg-white font-semibold px-6 py-3 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{ color: occ.accent }}
            >
              Find Shops Near Me 🗺️
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="bg-white/20 border border-white/40 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/30 transition-all"
            >
              View Cart 🛒
            </button>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
          style={{ background: occ.accent, animation: 'slideUp 0.3s ease both' }}
        >
          🛒 {toast} added to cart!
        </div>
      )}
    </div>
  );
}
