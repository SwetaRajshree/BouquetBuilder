import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderStepper from '../components/OrderStepper';

const API = import.meta.env.VITE_API_URL;

const STATUS_STEPS = [
  { key: 'placed',           icon: '✅', label: 'Order Placed'  },
  { key: 'preparing',        icon: '🌸', label: 'Preparing'     },
  { key: 'out_for_delivery', icon: '🛵', label: 'On the Way'    },
  { key: 'delivered',        icon: '🎉', label: 'Delivered'     },
];

const STATUS_COLORS = {
  placed:           'bg-blue-100 text-blue-600',
  preparing:        'bg-yellow-100 text-yellow-600',
  out_for_delivery: 'bg-orange-100 text-orange-600',
  delivered:        'bg-green-100 text-green-600',
  cancelled:        'bg-red-100 text-red-500',
};

const METHOD_ICONS = { upi: '📲', cod: '💵' };

function StatusStepper({ status }) {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <span className="text-xl">❌</span>
      <span className="text-sm font-semibold text-red-500">Order Cancelled</span>
    </div>
  );
  return (
    <div className="flex items-center gap-0 w-full">
      {STATUS_STEPS.map((step, i) => {
        const done   = i <= currentIdx;
        const active = i === currentIdx;
        const isLast = i === STATUS_STEPS.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all
                ${active  ? 'border-rose bg-blushL scale-110 shadow-md' :
                  done    ? 'border-green-400 bg-green-50' :
                            'border-gray-200 bg-white'}`}>
                {step.icon}
              </div>
              <p className={`text-[.62rem] mt-1 text-center leading-tight max-w-[56px]
                ${active ? 'text-roseD font-bold' : done ? 'text-green-600 font-medium' : 'text-gray-300'}`}>
                {step.label}
              </p>
            </div>
            {!isLast && (
              <div className={`flex-1 h-[2px] mx-1 mb-4 rounded-full transition-all
                ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onExpand, expanded }) {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
      ${expanded ? 'border-pink-300 shadow-lg' : 'border-pink-100 hover:border-pink-200 hover:shadow-md'}`}>

      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={onExpand}>
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50 flex items-center justify-center border border-pink-100">
          {order.items[0]?.image && order.items[0].image !== 'PASTE_LINK_HERE'
            ? <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
            : <span className="text-2xl">🌸</span>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-playfair font-semibold text-sm text-roseDD truncate">
              {order.items.length === 1 ? order.items[0].name : `${order.items[0].name} +${order.items.length - 1} more`}
            </p>
            <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
              {order.status?.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400">{date}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {METHOD_ICONS[order.paymentMethod] || '💳'} {order.paymentMethod?.toUpperCase()}
            {' · '}
            <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>
              {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p className="font-playfair font-extrabold text-roseD text-base">₹{order.total?.toLocaleString()}</p>
          <span className="text-xs text-gray-400">{expanded ? '▲ Hide' : '▼ Details'}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-5 border-t border-pink-50 pt-4" style={{ animation: 'pageIn 0.25s ease both' }}>
          <div className="mb-5"><StatusStepper status={order.status} /></div>

          <div className="bg-pink-50 rounded-xl px-4 py-3 mb-4 flex flex-wrap gap-x-6 gap-y-1">
            <div>
              <p className="text-[.68rem] text-gray-400 uppercase tracking-wide">Order ID</p>
              <p className="text-xs font-mono font-semibold text-roseDD">{order._id}</p>
            </div>
            {order.upiRef && (
              <div>
                <p className="text-[.68rem] text-gray-400 uppercase tracking-wide">UPI Ref</p>
                <p className="text-xs font-mono font-semibold text-gray-600">{order.upiRef}</p>
              </div>
            )}
            <div>
              <p className="text-[.68rem] text-gray-400 uppercase tracking-wide">Placed on</p>
              <p className="text-xs font-semibold text-gray-600">{date}</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
          <div className="flex flex-col gap-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-pink-50/50 rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border border-pink-100">
                  {item.image && item.image !== 'PASTE_LINK_HERE'
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="text-lg">🌸</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-roseDD truncate">{item.name}</p>
                  <div className="flex gap-3 flex-wrap">
                    {item.color    && <span className="text-[.7rem] text-gray-400">🎨 {item.color}</span>}
                    {item.category && <span className="text-[.7rem] text-gray-400">🏷 {item.category}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">× {item.quantity}</p>
                  <p className="text-sm font-bold text-roseD">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pink-50 rounded-xl p-3 mb-4">
            <div className="flex justify-between text-xs text-gray-500 py-1">
              <span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 py-1">
              <span>Delivery ({order.deliveryType})</span><span>₹{order.deliveryFee}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-green-600 py-1">
                <span>Discount</span><span>−₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-roseD pt-2 border-t border-pink-200 mt-1">
              <span>Total</span><span>₹{order.total?.toLocaleString()}</span>
            </div>
          </div>

          {order.deliveryAddress?.fullName && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">📦 Delivery Address</p>
              <div className="bg-pink-50 rounded-xl p-3 text-xs text-gray-600">
                <p className="font-semibold text-roseDD">{order.deliveryAddress.fullName}</p>
                <p>📞 {order.deliveryAddress.phone}</p>
                <p>{order.deliveryAddress.line1}{order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResult(`📍 Showing route to: ${searchQuery}`);
  };

  // Most recent active order for the hero section
  const activeOrder = orders.find(o => o.status === 'out_for_delivery')
    || orders.find(o => o.status === 'preparing')
    || orders[0];

  if (!user) return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[calc(100vh-62px)] gap-4">
      <div className="text-6xl">🔐</div>
      <h2 className="font-playfair font-bold text-roseDD text-2xl">Sign in to view orders</h2>
      <p className="text-textL text-sm">Your order history will appear here after signing in</p>
      <button onClick={() => navigate('/auth')}
        className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-all">
        Sign In 🌸
      </button>
    </div>
  );

  return (
    <div className="page-enter min-h-[calc(100vh-62px)]"
      style={{ background: 'linear-gradient(145deg, #fff8f0, #fff4f8)' }}>

      {/* ── Full-width hero header ── */}
      <div className="w-full bg-gradient-to-br from-blushL via-lavL to-blushL border-b border-blush/20 px-6 py-6">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.2rem)] text-roseDD mb-0.5">📦 Order Tracking</h2>
            <p className="text-[.88rem] text-textL font-light">
              {activeOrder ? `Order #${activeOrder._id?.slice(-8).toUpperCase()}` : 'Your orders'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-soft-s border border-blush/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[.8rem] font-semibold text-sageD">Live Tracking Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6">

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border-2 border-pink-100 p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-pink-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-pink-100 rounded w-2/3" />
                    <div className="h-3 bg-pink-50 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="font-playfair font-bold text-roseDD text-xl mb-2">No orders yet</h3>
            <p className="text-textL text-sm mb-6">Your placed orders will show up here</p>
            <button onClick={() => navigate('/flowers')}
              className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-3 rounded-full font-semibold hover:-translate-y-0.5 transition-all">
              Browse Flowers 🌸
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            {/* ── Top row: ETA + Delivery person ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              {/* ETA banner */}
              <div className="bg-gradient-to-br from-blushL to-lavL rounded-2xl p-6 text-center border border-blush/28 shadow-soft-s">
                <div className="text-[2.5rem] mb-2">🌷</div>
                <p className="font-playfair font-semibold text-[1.1rem] text-roseDD">Estimated Delivery</p>
                <p className="font-playfair font-extrabold text-[1.6rem] text-roseDD my-1">
                  {activeOrder?.scheduledDate
                    ? new Date(activeOrder.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : 'Today'}
                  {activeOrder?.timeSlot === 'morning'   ? ', 8 – 12 PM'  :
                   activeOrder?.timeSlot === 'afternoon' ? ', 12 – 5 PM'  :
                   activeOrder?.timeSlot === 'evening'   ? ', 5 – 9 PM'   : ', Soon'}
                </p>
                <p className="text-[.82rem] text-textL">
                  {activeOrder?.items?.[0]?.name} · For {activeOrder?.deliveryAddress?.fullName || user?.name || 'You'}
                </p>
                <div className="mt-3 bg-white/60 rounded-full px-4 py-1.5 inline-block">
                  <span className="text-[.78rem] font-semibold text-rose">
                    {activeOrder?.status === 'out_for_delivery' ? '🌸 Your bouquet is on the way!'
                     : activeOrder?.status === 'preparing'      ? '🌸 Your bouquet is being prepared!'
                     : activeOrder?.status === 'delivered'      ? '🎉 Delivered successfully!'
                     : '🌸 Order confirmed!'}
                  </span>
                </div>
              </div>

              {/* Delivery person card */}
              <div className="bg-white rounded-2xl shadow-soft-s p-6 flex flex-col justify-center border border-blush/15">
                <p className="text-[.75rem] font-bold text-textL uppercase tracking-wider mb-3">Delivery Partner</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-[2rem] shadow-soft-s">
                    🧑‍🌾
                  </div>
                  <div>
                    <p className="font-playfair font-semibold text-base">Ravi Kumar</p>
                    <p className="text-[.78rem] text-textL">⭐ 4.9 · 1,234 deliveries · On time 98%</p>
                    <p className="text-[.72rem] text-sageD font-semibold mt-0.5">
                      {activeOrder?.status === 'out_for_delivery' ? '● Currently delivering your order'
                       : activeOrder?.status === 'preparing'      ? '● Preparing your order'
                       : '● Ready to deliver'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <button className="flex-1 border-[1.5px] border-rose text-roseD text-[.82rem] font-semibold px-4 py-2 rounded-full hover:bg-rose hover:text-white transition-all">
                    📞 Call
                  </button>
                  <button className="flex-1 bg-blushL hover:bg-blush text-roseD text-[.82rem] font-semibold px-4 py-2 rounded-full transition-all">
                    💬 Chat
                  </button>
                </div>
              </div>
            </div>

            {/* ── Live Map ── */}
            <div className="bg-white rounded-2xl shadow-soft-s border border-blush/15 overflow-hidden mb-5">
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-playfair font-semibold text-base text-roseDD">📍 Live Delivery Location</h3>
                  <span className="text-[.72rem] text-sageD font-semibold bg-[#e8f5e0] px-2.5 py-1 rounded-full">● Live</span>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                  <div className="flex-1 flex items-center gap-2 bg-cream rounded-full px-4 py-2.5 border border-blush/35 focus-within:border-rose transition-colors">
                    <span className="text-rose text-sm">🔍</span>
                    <input
                      className="flex-1 bg-transparent border-none outline-none text-[.86rem] text-text placeholder:text-textL"
                      placeholder="Search delivery address or landmark..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => { setSearchQuery(''); setSearchResult(null); }}
                        className="text-textL hover:text-roseD transition-colors text-xs">✕</button>
                    )}
                  </div>
                  <button type="submit"
                    className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.82rem] font-semibold px-4 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all">
                    Search
                  </button>
                </form>

                {/* Quick chips */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {['My Home', 'Office', "Mom's Place"].map(loc => (
                    <button key={loc}
                      onClick={() => { setSearchQuery(loc); setSearchResult(`📍 Showing route to: ${loc}`); }}
                      className="text-[.72rem] font-medium text-roseD bg-blushL hover:bg-blush px-3 py-1 rounded-full transition-all border border-blush/30">
                      📌 {loc}
                    </button>
                  ))}
                </div>

                {searchResult && (
                  <div className="text-[.78rem] text-sageD font-medium bg-[#e8f5e0] px-3 py-2 rounded-lg mb-2 border border-sage/20">
                    {searchResult}
                  </div>
                )}
              </div>

              {/* Map canvas */}
              <div className="relative overflow-hidden mx-4 mb-4 rounded-xl"
                style={{ background: 'linear-gradient(145deg, #e8f5e0, #f0ece8, #e8e0f5)', minHeight: 180 }}>
                <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-white/60 rounded-full -translate-y-1/2" />
                <div className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2 flex gap-2">
                  {Array.from({length: 20}).map((_, i) => <div key={i} className="h-px flex-1 bg-white/40" />)}
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-[80%] text-center">
                  <div className="text-2xl">🏪</div>
                  <div className="text-[.58rem] text-roseD font-bold bg-white/80 rounded px-1 mt-0.5">Shop</div>
                </div>
                <div className="absolute top-1/2 text-2xl" style={{ left: '42%', transform: 'translateY(-80%)', animation: 'movingPin 3s ease infinite alternate' }}>
                  🛵
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-[80%] text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-[#e09099] flex items-center justify-center text-xl text-white shadow-soft-s"
                    style={{ animation: 'youPulse 2s ease infinite' }}>
                    📍
                  </div>
                  <div className="text-[.58rem] text-roseD font-bold bg-white/80 rounded px-1 mt-0.5">You</div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-3 py-1 text-[.72rem] font-semibold text-roseD shadow-sm">
                  ~1.2 km · 5 min away
                </div>
              </div>

              <div className="mx-4 mb-4 bg-blushL rounded-xl py-2.5 px-4 text-center text-[.84rem] font-bold text-roseD">
                🌸 Your bouquet is ~5 minutes away!
              </div>
            </div>

            {/* ── Order Stepper for active order ── */}
            <div className="mb-5">
              <OrderStepper />
            </div>

            {/* ── All orders list ── */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="font-playfair font-bold text-[1.2rem] text-roseDD">📋 All Orders</h3>
                <p className="text-sm text-textL font-light">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>
              <button onClick={() => navigate('/flowers')}
                className="border-2 border-rose text-roseD text-sm font-semibold px-4 py-2 rounded-full hover:bg-rose hover:text-white transition-all">
                + New Order 🌸
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {orders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  expanded={expanded === order._id}
                  onExpand={() => setExpanded(expanded === order._id ? null : order._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
