import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartContext();
  const [delivery, setDelivery] = useState('scheduled');
  const [promo, setPromo] = useState('');
  const [promoOk, setPromoOk] = useState(false);

  const delFee   = delivery === 'instant' ? 199 : 99;
  const discount = promoOk ? 200 : 0;
  const total    = totalPrice + delFee - discount;

  if (cartItems.length === 0) return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[calc(100vh-62px)] gap-4">
      <div className="text-7xl">🛒</div>
      <h2 className="font-playfair font-bold text-roseDD text-2xl">Your cart is empty</h2>
      <p className="text-textL text-sm">Add some beautiful flowers first 🌸</p>
      <div className="flex gap-3 mt-2">
        <button onClick={() => navigate('/flowers')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-all">
          Browse Flowers 🌸
        </button>
        <button onClick={() => navigate('/shops')} className="border-2 border-rose text-roseD px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose hover:text-white transition-all">
          Find Shops 🌺
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD">🛒 Your Cart</h2>
          <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-400 transition-all border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-full">
            Clear all
          </button>
        </div>
        <p className="text-[.9rem] text-textL font-light mb-7">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · {cartItems.reduce((s, i) => s + i.quantity, 0)} stems
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div>
            {/* Cart items */}
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 items-start bg-white rounded-2xl shadow-soft-s p-4 mb-3 border border-blush/10">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50 flex items-center justify-center">
                  {item.image && item.image !== 'PASTE_LINK_HERE' ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🌸</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-playfair font-semibold text-[.97rem] text-roseDD mb-0.5 truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
                    {item.color    && <span className="text-[.72rem] text-gray-400">🎨 {item.color}</span>}
                    {item.category && <span className="text-[.72rem] text-gray-400">🏷 {item.category}</span>}
                    {item.emotion  && <span className="text-[.72rem] text-gray-400">💫 {item.emotion}</span>}
                    {item.city     && <span className="text-[.72rem] text-gray-400">📍 {item.city}</span>}
                    {item.filler   && <span className="text-[.72rem] text-green-500">🌿 {item.filler.name} +₹{item.filler.price}</span>}
                    {item.postcard && <span className="text-[.72rem] text-pink-400">✉️ Card included</span>}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, 'dec')}
                      className="w-7 h-7 rounded-full border-2 border-pink-200 text-roseD font-bold text-sm flex items-center justify-center hover:bg-pink-50 transition-all"
                    >−</button>
                    <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 'inc')}
                      className="w-7 h-7 rounded-full border-2 border-pink-200 text-roseD font-bold text-sm flex items-center justify-center hover:bg-pink-50 transition-all"
                    >+</button>
                    <span className="text-[.72rem] text-gray-400 ml-1">stems</span>
                    <button
                      onClick={() => navigate('/postcard', { state: { item } })}
                      className="ml-2 text-[.7rem] text-pink-400 hover:text-pink-600 border border-pink-200 hover:border-pink-400 px-2.5 py-1 rounded-full transition-all"
                    >✉️ Edit Card</button>
                  </div>
                </div>

                {/* Price + remove */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="font-playfair font-extrabold text-[1.05rem] text-roseD">
                    ₹{((item.basePrice + (item.filler?.price || item.fillerPrice || 0)) * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-[.7rem] text-gray-400">₹{item.basePrice}/stem{item.filler ? ` + ₹${item.filler.price} filler` : ''}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-300 hover:text-red-400 text-lg transition-colors leading-none"
                  >✕</button>
                </div>
              </div>
            ))}

            {/* Flash sale notice */}
            <div className="bg-gradient-to-br from-[#fff0f0] to-cream rounded-xl p-4 border border-[rgba(255,107,107,.2)] mb-4 flex items-center gap-3 flex-wrap">
              <span className="text-2xl">🔥</span>
              <div className="flex-1 text-[.82rem]">
                <span className="font-bold text-roseD">Flash Sale Active!</span> Add items from today's deals for extra 10% off.
              </div>
              <button onClick={() => navigate('/sale')} className="bg-gradient-to-br from-blush to-lavender text-roseD text-[.76rem] font-bold px-3 py-1.5 rounded-full hover:bg-rose hover:text-white transition-all">
                Shop Deals
              </button>
            </div>

            {/* Delivery type */}
            <div className="bg-white rounded-2xl shadow-soft-s p-4 mb-3 border border-blush/10">
              <h4 className="font-playfair text-[.93rem] mb-3">🚚 Delivery Type</h4>
              <div className="flex rounded-xl overflow-hidden border-[1.5px] border-blush/38">
                {[['instant','⚡ Instant'],['scheduled','📅 Scheduled'],['subscription','🔁 Subscribe']].map(([id, label]) => (
                  <button key={id} onClick={() => setDelivery(id)}
                    className={`flex-1 py-2.5 text-[.8rem] font-medium transition-all text-center
                      ${delivery === id ? 'bg-blushL text-roseD font-bold' : 'bg-white text-textL hover:bg-blushL/50'}`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Promo */}
            <div className="bg-white rounded-2xl shadow-soft-s p-4 border border-blush/10">
              <h4 className="font-playfair text-[.93rem] mb-3">🎟️ Promo Code</h4>
              <div className="flex gap-2.5">
                <input
                  className="flex-1 px-4 py-2.5 rounded-xl border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] transition-all"
                  value={promo} onChange={e => setPromo(e.target.value)} placeholder="Try BLOOM20"
                />
                <button
                  onClick={() => promo.toUpperCase() === 'BLOOM20' && setPromoOk(true)}
                  className="border-[1.5px] border-rose text-roseD px-5 py-2 rounded-full hover:bg-rose hover:text-white transition-all text-[.85rem] font-medium"
                >Apply</button>
              </div>
              {promoOk && <p className="text-green-600 text-[.82rem] mt-2">✓ ₹200 discount applied!</p>}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-soft-m p-5 sticky top-20 border border-blush/10">
              <h3 className="font-playfair font-bold text-[1.1rem] text-roseDD mb-4">💳 Order Summary</h3>

              {cartItems.map(i => {
                const fp = i.filler?.price || i.fillerPrice || 0;
                const lineTotal = (i.basePrice + fp) * i.quantity;
                return (
                  <div key={i._id}>
                    <div className="flex justify-between py-1.5 text-[.86rem]">
                      <span className="truncate max-w-[160px] text-gray-700">{i.name} × {i.quantity}</span>
                      <span className="flex-shrink-0 ml-2 text-gray-700">₹{(i.basePrice * i.quantity).toLocaleString()}</span>
                    </div>
                    {i.filler && (
                      <div className="flex justify-between py-1 text-[.8rem] text-green-600 pl-3">
                        <span className="truncate max-w-[160px]">🌿 {i.filler.name} × {i.quantity}</span>
                        <span className="flex-shrink-0 ml-2">+₹{(fp * i.quantity).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pb-2 text-[.78rem] text-gray-400 border-b border-blush/12">
                      <span>Item total</span>
                      <span className="font-semibold text-roseD">₹{lineTotal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                <span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                <span>Delivery ({delivery})</span><span>₹{delFee}</span>
              </div>
              {promoOk && (
                <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                  <span className="text-green-600">Promo (BLOOM20)</span>
                  <span className="text-green-600">−₹200</span>
                </div>
              )}
              <div className="flex justify-between py-3 font-extrabold text-[1.05rem] text-roseD mt-1">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate('/schedule')}
                className="w-full border-[1.5px] border-rose text-roseD font-medium py-3 rounded-full mb-2.5 hover:bg-rose hover:text-white transition-all text-[.9rem]"
              >Schedule Delivery 📅</button>

              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all text-[.92rem]"
              >Place Order 🌸</button>

              <p className="text-center text-[.72rem] text-textL mt-3">🔒 Secure · Satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
