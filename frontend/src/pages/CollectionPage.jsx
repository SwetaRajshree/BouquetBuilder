import { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const API = import.meta.env.VITE_API_URL;

const CATEGORY_META = {
  earrings:  { label: 'Earrings',  icon: '💎' },
  bracelets: { label: 'Bracelets', icon: '✨' },
  necklaces: { label: 'Necklaces', icon: '📿' },
  rings:     { label: 'Rings',     icon: '💍' },
};

function Stars({ rating }) {
  return (
    <span style={{ color: '#d4932c', fontSize: 12 }}>
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
        border: hov ? '1.5px solid #f7b8c8' : '1.5px solid #f0e8eb',
        boxShadow: hov ? '0 20px 48px rgba(232,71,106,0.12)' : '0 2px 12px rgba(44,26,46,0.06)',
        transition: 'all 0.25s', display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', background: '#fdf6f0' }}>
        <img
          src={item.images[0]} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hov ? 'scale(1.07)' : 'scale(1)' }}
        />
        {item.isFeatured && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#e8476a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            Featured
          </span>
        )}
        <button
          onClick={() => onWish(item)}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: wished ? '#fce8ed' : 'rgba(255,252,250,0.92)', border: wished ? '1px solid #f7b8c8' : '1px solid rgba(232,71,106,0.18)', cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', color: wished ? '#e8476a' : '#e8909f', transition: 'all 0.2s' }}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Stars rating={item.rating} />
        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#2c1a2e', lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 11.5, color: '#9a8a94' }}>{item.material} · {item.reviews} reviews</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#2c1a2e' }}>₹{item.price}</span>
          <span style={{ fontSize: 11, color: item.stock < 20 ? '#e8476a' : '#5a8a6a', fontWeight: 600 }}>
            {item.stock < 20 ? `Only ${item.stock} left` : 'In Stock'}
          </span>
        </div>
        <button
          onClick={() => onAdd(item)}
          style={{
            marginTop: 8, padding: '11px', borderRadius: 11, border: inCart ? '1.5px solid #b2d4bc' : 'none',
            background: inCart ? '#eaf4ee' : 'linear-gradient(135deg,#e8476a,#c0344f)',
            color: inCart ? '#3d6b50' : '#fff', fontSize: 12.5, fontWeight: 800,
            cursor: 'pointer', transition: 'opacity 0.18s',
            boxShadow: inCart ? 'none' : '0 4px 16px rgba(232,71,106,0.3)',
          }}
        >
          {inCart ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const { addToCart, cartItems } = useCartContext();
  const { wishlist, toggle: toggleWish } = useWishlist();

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cat, setCat]           = useState('all');
  const [sort, setSort]         = useState('default');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    setLoading(true);
    const url = cat === 'all'
      ? `${API}/api/collection`
      : `${API}/api/collection?category=${cat}`;
    fetch(url)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cat]);

  const filtered = items
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.tags.some(t => t.includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'price_asc')  return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating')     return b.rating - a.rating;
      if (sort === 'featured')   return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });

  const inCart  = (id) => cartItems.some(c => c._id === id);
  const inWish  = (id) => wishlist.some(w => w._id === id);

  const handleAdd = (item) => {
    addToCart({ _id: item._id, name: item.name, pricePerStem: item.price, image: item.images[0], category: item.category, color: '', city: '' });
  };

  const handleWish = (item) => {
    toggleWish({ _id: item._id, name: item.name, price: item.price, image: item.images[0], category: item.category });
  };

  const cats = ['all', ...Object.keys(CATEGORY_META)];

  return (
    <div style={{ background: 'linear-gradient(145deg,#fdf6f0,#fce8e8 30%,#f0f4f0 65%,#fdf0f8)', minHeight: '100vh', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 22px 0' }}>
        <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 700, color: '#e8476a', letterSpacing: 3.5, textTransform: 'uppercase' }}>Jewellery Collection</p>
        <h1 style={{ margin: '0 0 10px', fontSize: 38, fontWeight: 900, color: '#2c1a2e', lineHeight: 1.1, letterSpacing: -1 }}>
          Shop by Category
        </h1>
        <p style={{ margin: '0 0 36px', color: '#9a8a94', fontSize: 14.5 }}>
          Handpicked gold plated jewellery — earrings, bracelets, necklaces & rings
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {cats.map(c => {
            const meta = CATEGORY_META[c];
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: '10px 22px', borderRadius: 40, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  border: active ? '2px solid #e8476a' : '1.5px solid #e8d8de',
                  background: active ? '#fce8ed' : '#fff',
                  color: active ? '#c0344f' : '#4a3050',
                  boxShadow: active ? '0 3px 14px rgba(232,71,106,0.2)' : 'none',
                }}
              >
                {meta ? `${meta.icon} ${meta.label}` : '✦ All'}
              </button>
            );
          })}
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #e8d8de', borderRadius: 12, padding: '9px 14px', gap: 8, flex: 1, minWidth: 200 }}>
            <span style={{ color: '#9a8a94' }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search jewellery..."
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#2c1a2e', background: 'transparent', width: '100%' }}
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e8d8de', background: '#fff', fontSize: 13, color: '#4a3050', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            <option value="default">Default</option>
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <span style={{ fontSize: 12.5, color: '#9a8a94' }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9a8a94', fontSize: 15 }}>
            Loading collection...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9a8a94' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>💎</div>
            <p style={{ fontSize: 15 }}>No items found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22, paddingBottom: 80 }}>
            {filtered.map(item => (
              <ProductCard
                key={item._id}
                item={item}
                onAdd={handleAdd}
                inCart={inCart(item._id)}
                wished={inWish(item._id)}
                onWish={handleWish}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
