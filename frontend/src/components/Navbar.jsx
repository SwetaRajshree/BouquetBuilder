import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const LINKS = [
  { to: '/',          label: 'Home'        },
  { to: '/buy',       label: '🛍️ Buy'      },
  { to: '/cake',      label: '🎂 Cake'     },
  { to: '/gifts',     label: '🎁 Gifts'    },
  { to: '/digilove',  label: '💌 DigiLove' },
  { to: '/shops',     label: 'Shops'       },
  { to: '/calendar',  label: 'My Calendar' },
  { to: '/tracking',  label: '📦 Orders'   },
  { to: '/story',     label: 'Our Story'   },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCartContext();
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { addToCart, cartItems } = useCartContext();
  const [dropOpen, setDropOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  function handleLogout() {
    logout();
    setDropOpen(false);
    navigate('/');
  }

  return (
    <>
      {/* WISHLIST DRAWER */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black/40 z-[999]" onClick={() => setShowWishlist(false)} />
      )}
      <div className={`fixed right-0 top-0 h-full w-[340px] bg-white shadow-2xl z-[1000] flex flex-col transition-transform duration-300 ${
        showWishlist ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
          <h3 className="font-playfair font-bold text-lg text-roseDD">Wishlist ❤️</h3>
          <button onClick={() => setShowWishlist(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {wishlist.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-4xl mb-3">🤍</p>
              <p className="text-gray-400 text-sm">Your wishlist is empty</p>
              <p className="text-gray-300 text-xs mt-1">Heart items you love!</p>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item._id} className="flex items-center gap-3 py-3 border-b border-pink-50">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image && item.image !== 'PASTE_LINK_HERE'
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="text-xl">{item.img || '🌸'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category || item.nursery || ''}</p>
                  <p className="text-sm font-bold text-roseD">₹{item.price || item.pricePerStem}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <button
                    onClick={() => { addToCart({ ...item, pricePerStem: item.price || item.pricePerStem }); }}
                    className="text-xs bg-rose text-white px-3 py-1 rounded-full font-semibold hover:bg-roseD transition-all">
                    {cartItems.find(c => c._id === item._id) ? '✓ In Cart' : '+ Cart'}
                  </button>
                  <button onClick={() => toggleWishlist(item)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {wishlist.length > 0 && (
          <div className="px-5 py-4 border-t border-pink-100">
            <button
              onClick={() => { wishlist.forEach(item => { if (!cartItems.find(c => c._id === item._id)) addToCart({ ...item, pricePerStem: item.price || item.pricePerStem }); }); }}
              className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3 rounded-full text-sm hover:-translate-y-0.5 transition-all">
              Add All to Cart 🛒
            </button>
          </div>
        )}
      </div>

    <nav className="
      sticky top-0 z-50 h-[62px]
      flex items-center justify-between
      px-6 gap-4
      bg-cream/92 backdrop-blur-xl
      border-b border-blush/25
      shadow-soft-s
    ">
      <Link to="/" className="font-playfair font-extrabold text-xl text-roseDD whitespace-nowrap hover:opacity-75 transition-opacity">
        BouquetBuilder 💐
      </Link>

      <div className="hidden md:flex items-center gap-0.5 flex-wrap">
        {LINKS.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-[.82rem] font-medium px-3 py-1.5 rounded-full transition-all whitespace-nowrap
              ${pathname === l.to ? 'bg-blush text-roseDD font-semibold' : 'text-textM hover:bg-blushL hover:text-roseDD'}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Wishlist button */}
        <button
          onClick={() => setShowWishlist(true)}
          className="relative bg-lavL hover:bg-blush rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all hover:scale-105"
        >
          ❤️
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose text-white text-[.6rem] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <Link to="/cart" className="relative bg-lavL hover:bg-blush rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all hover:scale-105">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose text-white text-[.6rem] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropOpen(v => !v)}
              className="flex items-center gap-2 bg-gradient-to-br from-blush to-lavender text-roseDD text-[.82rem] font-semibold px-4 py-2 rounded-full hover:-translate-y-0.5 transition-all"
            >
              <span>🌸</span>
              <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
              <span className="text-[.7rem]">{dropOpen ? '▲' : '▼'}</span>
            </button>

            {dropOpen && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-[0_8px_32px_rgba(201,132,138,0.2)] border border-pink-100 py-2 min-w-[160px] z-50"
                style={{ animation: 'pageIn 0.2s ease both' }}
              >
                <div className="px-4 py-2 border-b border-pink-50">
                  <p className="text-xs font-semibold text-roseDD truncate">{user.name}</p>
                  <p className="text-[.7rem] text-gray-400 truncate">{user.email}</p>
                </div>
                <Link to="/account" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-pink-50 hover:text-roseD transition-all">
                  👤 My Account
                </Link>
                <Link to="/tracking" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-pink-50 hover:text-roseD transition-all">
                  📦 My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-purple-600 hover:bg-purple-50 transition-all font-semibold">
                    🛡️ Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-50 transition-all">
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.85rem] font-semibold px-4 py-2 rounded-full shadow-[0_3px_12px_rgba(201,132,138,.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,132,138,.45)] transition-all">
            Sign In
          </Link>
        )}
      </div>
    </nav>
    </>
  );
}
