import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'For Her 👩', 'For Him 👨', 'For Kids 🧒', 'Couple 💑', 'Self Care 🧴'];

const GIFTS = [
  { emoji: '🧺', name: 'Luxury Gift Hamper',     desc: 'Chocolates, candles & dried flowers',       price: '₹1,299', cat: 'For Her 👩',   tag: 'Bestseller' },
  { emoji: '🕯️', name: 'Scented Candle Set',      desc: 'Rose, jasmine & sandalwood trio',           price: '₹599',   cat: 'For Her 👩',   tag: '' },
  { emoji: '🍫', name: 'Chocolate Box',            desc: 'Assorted Belgian chocolates, 16 pcs',       price: '₹449',   cat: 'For Him 👨',   tag: 'Popular' },
  { emoji: '🧸', name: 'Teddy & Roses Combo',      desc: 'Soft teddy with 6 fresh roses',             price: '₹799',   cat: 'For Kids 🧒',  tag: 'New' },
  { emoji: '💑', name: 'Couple Memory Box',        desc: 'Polaroid frame, candle & message card',     price: '₹1,099', cat: 'Couple 💑',    tag: '' },
  { emoji: '🧴', name: 'Self Care Kit',            desc: 'Bath salts, face mask & essential oils',    price: '₹899',   cat: 'Self Care 🧴', tag: 'Popular' },
  { emoji: '📿', name: 'Personalised Jewellery',   desc: 'Name-engraved bracelet or necklace',        price: '₹699',   cat: 'For Her 👩',   tag: '' },
  { emoji: '🎮', name: 'Fun Gift Box for Him',     desc: 'Snacks, gadget accessories & more',         price: '₹999',   cat: 'For Him 👨',   tag: 'New' },
];

export default function GiftsPage() {
  const navigate = useNavigate();
  const [activecat, setActivecat] = useState('All');

  const filtered = activecat === 'All' ? GIFTS : GIFTS.filter(g => g.cat === activecat);

  return (
    <div className="min-h-screen" style={{ background: '#f8f0ff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #f0e0ff 0%, #e0c8ff 60%, #d0b0ff 100%)', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎁</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#3a0060', marginBottom: 12 }}>
          Gifts That Say It All
        </h1>
        <p style={{ fontSize: 16, color: '#6a30a0', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Curated gift sets for every person, every mood, every moment 💜
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['🎂', 'Birthday'], ['💍', 'Anniversary'], ['🌸', 'Just Because'], ['🎓', 'Graduation'], ['💝', "Valentine's"]].map(([icon, label]) => (
            <span key={label} style={{ background: 'rgba(255,255,255,0.65)', border: '1.5px solid rgba(160,80,255,0.3)', borderRadius: 40, padding: '7px 18px', fontSize: 13, fontWeight: 500, color: '#5a20a0', cursor: 'pointer' }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ background: '#6020b0', padding: '14px 48px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 }}>
        {[['🎁', 'Beautiful Packaging'], ['✏️', 'Custom Messages'], ['🚚', 'Same-Day Delivery'], ['⭐', '4.8 Rated']].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 13.5, fontWeight: 500 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>{text}
          </div>
        ))}
      </div>

      {/* Category filter */}
      <section style={{ padding: '48px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActivecat(cat)}
              style={{ padding: '9px 22px', borderRadius: 40, border: '2px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                background: activecat === cat ? '#6020b0' : 'white',
                color: activecat === cat ? 'white' : '#6020b0',
                borderColor: activecat === cat ? '#6020b0' : '#d0b0ff',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, paddingBottom: 56 }}>
          {filtered.map(gift => (
            <div key={gift.name} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1.5px solid #e8d0ff', transition: 'all 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(96,32,176,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
              <div style={{ background: 'linear-gradient(135deg, #f4e8ff, #ead0ff)', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, position: 'relative' }}>
                {gift.emoji}
                {gift.tag && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#6020b0', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    {gift.tag}
                  </span>
                )}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#2a0040', marginBottom: 5 }}>{gift.name}</p>
                <p style={{ fontSize: 12, color: '#aaa', marginBottom: 12, lineHeight: 1.5 }}>{gift.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#6020b0' }}>{gift.price}</span>
                  <button style={{ background: '#6020b0', color: 'white', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
