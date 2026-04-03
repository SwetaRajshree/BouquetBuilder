import { useNavigate } from 'react-router-dom';

const CAKES = [
  { emoji: '🎂', name: 'Classic Birthday Cake',  desc: 'Vanilla sponge with buttercream frosting',  price: '₹599', tag: 'Bestseller' },
  { emoji: '🍰', name: 'Strawberry Delight',      desc: 'Fresh strawberries with whipped cream',      price: '₹749', tag: 'New' },
  { emoji: '🎂', name: 'Chocolate Truffle',        desc: 'Rich dark chocolate ganache layers',         price: '₹849', tag: 'Popular' },
  { emoji: '🍰', name: 'Red Velvet',               desc: 'Classic red velvet with cream cheese',       price: '₹699', tag: '' },
  { emoji: '🎂', name: 'Black Forest',             desc: 'Cherries, cream & chocolate shavings',       price: '₹799', tag: 'Popular' },
  { emoji: '🍰', name: 'Butterscotch Bliss',       desc: 'Caramel crunch with butterscotch cream',     price: '₹649', tag: '' },
];

const OCCASIONS = ['Birthday 🎂', 'Anniversary 💍', 'Wedding 💒', 'Baby Shower 🍼', 'Just Because 🌸'];

export default function CakePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#fff8f0', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #ffe8d0 0%, #ffd0b0 60%, #ffb890 100%)', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎂</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#5a2000', marginBottom: 12 }}>
          Cakes for Every Celebration
        </h1>
        <p style={{ fontSize: 16, color: '#8a4020', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Freshly baked, beautifully decorated — delivered right to your door with love 🍰
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {OCCASIONS.map(o => (
            <span key={o} style={{ background: 'rgba(255,255,255,0.65)', border: '1.5px solid rgba(255,160,80,0.4)', borderRadius: 40, padding: '7px 18px', fontSize: 13, fontWeight: 500, color: '#7a3010', cursor: 'pointer' }}>
              {o}
            </span>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ background: '#c0440a', padding: '14px 48px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 }}>
        {[['🧁', 'Freshly Baked Daily'], ['🚚', 'Same-Day Delivery'], ['✏️', 'Custom Messages'], ['⭐', '4.9 Rated']].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 13.5, fontWeight: 500 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>{text}
          </div>
        ))}
      </div>

      {/* Cake grid */}
      <section style={{ padding: '56px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: '#5a2000', marginBottom: 8 }}>🍰 Our Cakes</h2>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 36 }}>Handcrafted with the finest ingredients</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {CAKES.map(cake => (
            <div key={cake.name} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1.5px solid #ffe0c8', transition: 'all 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(192,68,10,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
              <div style={{ background: 'linear-gradient(135deg, #fff0e0, #ffe4c8)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, position: 'relative' }}>
                {cake.emoji}
                {cake.tag && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#c0440a', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    {cake.tag}
                  </span>
                )}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#3a1000', marginBottom: 5 }}>{cake.name}</p>
                <p style={{ fontSize: 12, color: '#aaa', marginBottom: 12, lineHeight: 1.5 }}>{cake.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#c0440a' }}>{cake.price}</span>
                  <button style={{ background: '#c0440a', color: 'white', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #ffe8d0, #ffd0b0)', padding: '56px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎂</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#5a2000', marginBottom: 10 }}>
          Want a Custom Cake?
        </h2>
        <p style={{ color: '#8a4020', fontSize: 14, marginBottom: 24 }}>Tell us your design, flavour & occasion — we'll bake it just for you!</p>
        <button style={{ background: '#c0440a', color: 'white', border: 'none', borderRadius: 40, padding: '14px 36px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Request Custom Cake ✏️
        </button>
      </section>
    </div>
  );
}
