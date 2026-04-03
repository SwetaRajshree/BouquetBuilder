import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const TAGS = ['All', 'romantic', 'birthday', 'valentine', 'premium', 'aesthetic', 'cute'];

function Stars({ rating }) {
  return (
    <span style={{ color: '#92630a', fontSize: 12 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#9a8a94', fontSize: 11, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function ProductCard({ item, onAdd, inCart, wished, onWish }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        border: hov ? '1.5px solid #f0d898' : '1.5px solid #f0e8eb',
        boxShadow: hov ? '0 20px 48px rgba(201,168,76,0.15)' : '0 2px 12px rgba(44,26,46,0.06)',
        transition: 'all 0.25s', display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', background: '#fdf8f0' }}>
        <img src={item.image} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
        <button onClick={() => onWish(item)}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: wished ? '#fdf4dc' : 'rgba(255,252,250,0.92)',
            border: wished ? '1px solid #f0d898' : '1px solid rgba(201,168,76,0.2)',
            borderRadius: '50%', width: 34, height: 34, fontSize: 17,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: wished ? '#92630a' : '#e8909f', transition: 'all 0.2s',
          }}>
          {wished ? '♥' : '♡'}
        </button>
        {item.rating >= 4.9 && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#fdf4dc', color: '#92630a', border: '1px solid #f0d898', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
            ⭐ Top Rated
          </div>
        )}
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Stars rating={item.rating} />
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: '#2c1a2e', lineHeight: 1.3 }}>{item.name}</h3>
        <p style={{ margin: 0, fontSize: 12, color: '#9a8a94', lineHeight: 1.5 }}>{item.description}</p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
          {item.tags?.slice(0, 3).map(t => (
            <span key={t} style={{ fontSize: 10, background: '#fdf4dc', color: '#92630a', border: '1px solid #f0d898', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#2c1a2e' }}>₹{item.price}</span>
        </div>
        <button onClick={() => onAdd(item)}
          style={{
            marginTop: 8,
            background: inCart ? '#eaf4ee' : 'linear-gradient(135deg,#c9a84c,#a8863a)',
            color: inCart ? '#3d6b50' : '#fff',
            border: inCart ? '1.5px solid #b2d4bc' : 'none',
            borderRadius: 11, padding: '11px',
            fontSize: 12.5, fontWeight: 900, cursor: 'pointer',
            boxShadow: inCart ? 'none' : '0 4px 16px rgba(201,168,76,0.4)',
            transition: 'all 0.2s',
          }}>
          {inCart ? '✓ Added to Bag' : 'Add to Gift Bag'}
        </button>
      </div>
    </div>
  );
}

export default function GiftHampersPage() {
  const { addToCart, cartItems } = useCartContext();
  const { wishlist, toggle: toggleWish } = useWishlist();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [sort, setSort] = useState('default');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/gifts?category=Gift Hampers`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items
    .filter(i => activeTag === 'All' || i.tags?.includes(activeTag))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleAdd = (item) => {
    addToCart({ _id: item._id, name: item.name, pricePerStem: item.price, image: item.image, category: 'customize' });
    setToast(item.name);
    setTimeout(() => setToast(''), 2500);
  };

  const isWished = (item) => wishlist.some(w => w._id === item._id);

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: 'linear-gradient(145deg,#fdf8f0,#fdf4dc,#fdf0e8)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#2c1a00,#4a3000,#1e1200)', padding: '60px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 300, height: 300, background: 'rgba(201,168,76,0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: '15%', width: 200, height: 200, background: 'rgba(232,71,106,0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <button onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 20, left: 24, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back
        </button>
        <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 900, color: '#f0d898', letterSpacing: 4, textTransform: 'uppercase' }}>Curated with Love</p>
        <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -1 }}>
          🧺 Gift Hampers<br />
          <span style={{ background: 'linear-gradient(90deg,#f0d898,#c9a84c,#e8476a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Curated with Love
          </span>
        </h1>
        <p style={{ margin: '0 auto', fontSize: 15, color: 'rgba(253,248,240,0.75)', maxWidth: 480, lineHeight: 1.7 }}>
          Luxury hampers with chocolates, candles, spa sets & more — perfect for every occasion
        </p>
        <button
          onClick={() => navigate('/gift-shops')}
          style={{ marginTop: 28, padding: '13px 32px', background: 'linear-gradient(135deg,#c9a84c,#a8863a)', color: '#fff', border: 'none', borderRadius: 40, fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 22px rgba(201,168,76,0.45)', letterSpacing: 0.5 }}>
          🏪 Browse Gift Shops
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28 }}>
          {[['9+', 'Hampers'], ['100%', 'Curated'], ['Free', 'Wrapping']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f0d898' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(253,248,240,0.5)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 22px 80px' }}>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                style={{
                  padding: '8px 18px', borderRadius: 40, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  border: activeTag === t ? '2px solid #c9a84c' : '1.5px solid #f0e8eb',
                  background: activeTag === t ? '#fdf4dc' : '#fff',
                  color: activeTag === t ? '#92630a' : '#9a8a94',
                  boxShadow: activeTag === t ? '0 2px 12px rgba(201,168,76,0.25)' : 'none',
                }}>
                {t}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid #f0e8eb', background: '#fff', fontSize: 12.5, color: '#4a3050', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
            <option value="default">Featured</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <p style={{ margin: '0 0 24px', fontSize: 12.5, color: '#9a8a94' }}>
          Showing <strong style={{ color: '#2c1a2e' }}>{filtered.length}</strong> hampers
        </p>

        {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#c9a84c', fontSize: 15 }}>🧺 Loading hampers...</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {filtered.map(item => (
            <ProductCard key={item._id} item={item}
              onAdd={handleAdd}
              inCart={cartItems.some(c => c._id === item._id)}
              wished={isWished(item)}
              onWish={() => toggleWish({ _id: item._id, name: item.name, price: item.price, image: item.image, category: 'customize' })}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#2e7d32', color: '#fff', borderRadius: 30, padding: '12px 28px', fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          🛒 {toast} added to bag!
        </div>
      )}
    </div>
  );
}
