import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;
const MERCHANT_UPI  = "swetarajshree5@oksbi";
const MERCHANT_NAME = "Floriva";
const PETALS = ['🌸','🌺','🌹','💐','🌷'];

function buildUpiUrl(upiId, name, amount, note) {
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

const EMPTY_ADDR = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

function AddressSection({ address, onSave }) {
  const [editing, setEditing] = useState(!address.fullName);
  const [form, setForm] = useState({ ...EMPTY_ADDR, ...address });
  const [err, setErr] = useState('');

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setErr(''); }

  function save() {
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode)
      return setErr('Please fill all required fields.');
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return setErr('Enter a valid 10-digit Indian mobile number.');
    if (!/^\d{6}$/.test(form.pincode))
      return setErr('Enter a valid 6-digit pincode.');
    onSave(form);
    setEditing(false);
  }

  if (!editing && address.fullName) return (
    <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-playfair font-semibold text-base">📦 Delivery Address</h3>
        <button onClick={() => setEditing(true)} className="text-xs text-roseD border border-rose/30 px-3 py-1 rounded-full hover:bg-blushL transition-all">✏️ Edit</button>
      </div>
      <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
        <p className="font-semibold text-sm text-roseDD">{address.fullName}</p>
        <p className="text-xs text-gray-500 mt-0.5">📞 {address.phone}</p>
        <p className="text-xs text-gray-600 mt-1">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p className="text-xs text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
      <h3 className="font-playfair font-semibold text-base mb-4">📦 Delivery Address</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[['fullName','Full Name *','text'],['phone','Phone Number *','tel']].map(([name, label, type]) => (
          <div key={name}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
            <input name={name} type={type} value={form[name]} onChange={change} placeholder={label.replace(' *','')}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Address Line 1 *</label>
          <input name="line1" value={form.line1} onChange={change} placeholder="House no., Street, Area"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Address Line 2 (optional)</label>
          <input name="line2" value={form.line2} onChange={change} placeholder="Landmark, Apartment, etc."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all" />
        </div>
        {[['city','City *'],['state','State *'],['pincode','Pincode *']].map(([name, label]) => (
          <div key={name}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
            <input name={name} value={form[name]} onChange={change} placeholder={label.replace(' *','')}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all" />
          </div>
        ))}
      </div>
      {err && <p className="text-red-500 text-xs mt-3">{err}</p>}
      <button onClick={save}
        className="mt-4 w-full bg-gradient-to-br from-blush to-lavender text-roseD font-semibold py-3 rounded-full hover:-translate-y-0.5 transition-all text-sm">
        ✅ Save Address
      </button>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const { user, token } = useAuth();

  const [method,    setMethod]    = useState('upi');
  const [upiInput,  setUpiInput]  = useState('');
  const [upiRef,    setUpiRef]    = useState('');
  const [delivery,  setDelivery]  = useState('scheduled');
  const [step,      setStep]      = useState('method');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [orderId,   setOrderId]   = useState('');
  const [bursting,  setBursting]  = useState(false);
  const [address,   setAddress]   = useState({ ...EMPTY_ADDR });

  const delFee   = delivery === 'instant' ? 199 : 99;
  const total    = totalPrice + delFee;

  const upiUrl = buildUpiUrl(MERCHANT_UPI, MERCHANT_NAME, total, `Floriva Order`);

  async function placeOrder(paymentMethod, upiIdUsed = '') {
    if (!address.fullName) return setError('Please save a delivery address first.');
    setLoading(true);
    setError('');
    try {
      const body = {
        items: cartItems,
        subtotal: totalPrice,
        deliveryFee: delFee,
        discount: 0,
        total,
        paymentMethod,
        upiId: upiIdUsed || MERCHANT_UPI,
        upiRef,
        deliveryType: delivery,
        deliveryAddress: address,
        guestName:  user?.name  || address.fullName,
        guestEmail: user?.email || '',
      };

      const res = await fetch(`${API}/api/orders/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      setOrderId(data.orderId);
      clearCart();
      setBursting(true);
      setTimeout(() => { setBursting(false); setStep('success'); }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Empty cart ───────────────────────────────────────────
  if (cartItems.length === 0 && step !== 'success') return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[calc(100vh-62px)] gap-4">
      <div className="text-6xl">🛒</div>
      <h2 className="font-playfair font-bold text-roseDD text-2xl">Your cart is empty</h2>
      <button onClick={() => navigate('/flowers')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold">
        Browse Flowers 🌸
      </button>
    </div>
  );

  // ── Success ──────────────────────────────────────────────
  if (step === 'success') return (
    <div className="page-enter flex items-center justify-center min-h-[calc(100vh-62px)]">
      <div className="text-center px-6 py-12 max-w-md">
        <div className="text-[5rem] mb-4" style={{ animation: 'petalFall 1.5s ease infinite' }}>💐</div>
        <h1 className="font-playfair font-bold text-roseDD text-[2rem] mb-2">Order Confirmed! 🎉</h1>
        <p className="text-textL font-light mb-2">Your bouquet is being prepared with love 💕</p>
        {orderId && (
          <p className="text-xs text-gray-400 mb-3 font-mono bg-pink-50 px-4 py-2 rounded-xl inline-block">
            Order ID: {orderId}
          </p>
        )}
        {address.fullName && (
          <div className="bg-pink-50 rounded-xl px-5 py-3 mb-5 text-left inline-block">
            <p className="text-xs font-semibold text-gray-500 mb-1">📦 Delivering to</p>
            <p className="text-sm font-semibold text-roseDD">{address.fullName}</p>
            <p className="text-xs text-gray-500">{address.line1}, {address.city} — {address.pincode}</p>
          </div>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/tracking')} className="bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold px-6 py-3 rounded-full hover:-translate-y-0.5 transition-all">
            Track My Order 🚀
          </button>
          <button onClick={() => navigate('/')} className="border-2 border-rose text-roseD font-semibold px-6 py-3 rounded-full hover:bg-rose hover:text-white transition-all">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      {/* Confetti */}
      {bursting && (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="absolute text-[2.5rem]"
              style={{
                '--dx': `${(Math.random() - 0.5) * 500}px`,
                '--dy': `${(Math.random() - 0.5) * 500}px`,
                animation: `cBurst .9s ease-out ${Math.random() * 0.3}s forwards`,
              }}
            >{PETALS[i % PETALS.length]}</span>
          ))}
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">💳 Secure Checkout</h2>
        <p className="text-[.9rem] text-textL font-light mb-7">Complete your order 🔒</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* LEFT — Payment */}
          <div>

            {/* Delivery type */}
            <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
              <h3 className="font-playfair font-semibold text-base mb-3">🚚 Delivery Type</h3>
              <div className="flex rounded-xl overflow-hidden border-[1.5px] border-blush/38">
                {[['instant','⚡ Instant (₹199)'],['scheduled','📅 Scheduled (₹99)']].map(([id, label]) => (
                  <button key={id} onClick={() => setDelivery(id)}
                    className={`flex-1 py-2.5 text-[.82rem] font-medium transition-all
                      ${delivery === id ? 'bg-blushL text-roseD font-bold' : 'bg-white text-textL hover:bg-blushL/50'}`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <AddressSection address={address} onSave={setAddress} />

            {/* Payment method selector */}
            <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
              <h3 className="font-playfair font-semibold text-base mb-4">Choose Payment Method</h3>
              <div className="flex flex-col gap-3">
                {[
                  { id: 'upi', icon: '📲', label: 'UPI Payment', sub: 'GPay, PhonePe, Paytm, BHIM & more' },
                  { id: 'cod', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when you receive your order' },
                ].map((m) => (
                  <div key={m.id} onClick={() => { setMethod(m.id); setStep('method'); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${method === m.id ? 'border-rose bg-blushL/50' : 'border-blush/30 hover:border-rose/50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${method === m.id ? 'border-rose bg-rose' : 'border-gray-300'}`}>
                      {method === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-3xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{m.label}</p>
                      <p className="text-xs text-textL">{m.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPI Section */}
            {method === 'upi' && (
              <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
                <h3 className="font-playfair font-semibold text-base mb-4">📲 Pay via UPI</h3>

                {/* Tabs: QR / UPI ID */}
                <div className="flex rounded-xl overflow-hidden border-[1.5px] border-blush/38 mb-5">
                  {[['qr','📷 Scan QR Code'],['id','⌨️ Enter UPI ID']].map(([t, label]) => (
                    <button key={t} onClick={() => setStep(t)}
                      className={`flex-1 py-2.5 text-[.82rem] font-medium transition-all
                        ${step === t ? 'bg-blushL text-roseD font-bold' : 'bg-white text-textL hover:bg-blushL/50'}`}
                    >{label}</button>
                  ))}
                </div>

                {/* QR Code */}
                {(step === 'qr' || step === 'method') && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl border-2 border-pink-100 shadow-md inline-block">
                      <QRCodeSVG
                        value={upiUrl}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#a8304a"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-roseDD">Scan with any UPI app</p>
                      <p className="text-xs text-gray-400 mt-1">GPay · PhonePe · Paytm · BHIM · Any UPI</p>
                      <div className="flex items-center justify-center gap-2 mt-2 bg-pink-50 rounded-xl px-4 py-2">
                        <span className="text-xs text-gray-500">Pay to:</span>
                        <span className="text-xs font-bold text-roseDD font-mono">{MERCHANT_UPI}</span>
                      </div>
                      <p className="text-lg font-extrabold text-roseD mt-2">₹{total.toLocaleString()}</p>
                    </div>

                    {/* UPI Ref input after scanning */}
                    <div className="w-full">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Enter UPI Transaction ID / Ref No. (after payment)
                      </label>
                      <input
                        value={upiRef}
                        onChange={(e) => setUpiRef(e.target.value)}
                        placeholder="e.g. 123456789012"
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all"
                      />
                    </div>

                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <button
                      onClick={() => placeOrder('upi', MERCHANT_UPI)}
                      disabled={loading || !upiRef.trim()}
                      className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Placing Order...' : `✅ Confirm Payment — ₹${total.toLocaleString()}`}
                    </button>
                    <p className="text-xs text-gray-400 text-center">Enter the transaction ID from your UPI app after paying</p>
                  </div>
                )}

                {/* UPI ID entry */}
                {step === 'id' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Your UPI ID
                      </label>
                      <div className="flex items-center gap-3 border-2 border-pink-100 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all">
                        <span className="text-pink-300">📲</span>
                        <input
                          value={upiInput}
                          onChange={(e) => setUpiInput(e.target.value)}
                          placeholder="yourname@upi / @oksbi / @ybl"
                          className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-300"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">e.g. name@okaxis · name@ybl · name@oksbi</p>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-4 text-center border border-pink-100">
                      <p className="text-xs text-gray-500 mb-1">Amount to pay</p>
                      <p className="text-2xl font-extrabold text-roseD">₹{total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-1">to {MERCHANT_UPI}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        UPI Transaction ID (after payment)
                      </label>
                      <input
                        value={upiRef}
                        onChange={(e) => setUpiRef(e.target.value)}
                        placeholder="e.g. 123456789012"
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none text-sm transition-all"
                      />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                      onClick={() => placeOrder('upi', upiInput)}
                      disabled={loading || !upiInput.trim() || !upiRef.trim()}
                      className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Placing Order...' : `✅ Confirm Payment — ₹${total.toLocaleString()}`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* COD Section */}
            {method === 'cod' && (
              <div className="bg-white rounded-2xl border border-blush/20 shadow-soft-s p-5 mb-4">
                <div className="text-center py-4">
                  <div className="text-5xl mb-3">💵</div>
                  <h3 className="font-playfair font-semibold text-lg text-roseDD mb-2">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500 mb-1">Pay <span className="font-bold text-roseD">₹{total.toLocaleString()}</span> when your order arrives</p>
                  <p className="text-xs text-gray-400 mb-6">Keep exact change ready for a smooth delivery 🌸</p>

                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                  <button
                    onClick={() => placeOrder('cod')}
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ Placing Order...' : `Place Order — ₹${total.toLocaleString()} 🌸`}
                  </button>
                </div>
              </div>
            )}

            {/* Security badge */}
            <div className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3 border border-blush/20">
              <span className="text-2xl">🔒</span>
              <p className="text-[.78rem] text-textL leading-relaxed">
                <span className="font-bold text-text">100% Secure Checkout.</span><br />
                Your data is protected. We never store payment details.
              </p>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-soft-m p-5 sticky top-20 border border-blush/10">
              <h3 className="font-playfair font-bold text-[1.1rem] text-roseDD mb-4">🛍️ Order Summary</h3>

              <div className="max-h-[280px] overflow-y-auto pr-1 mb-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 py-2.5 border-b border-blush/12">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-pink-50 flex items-center justify-center">
                      {item.image && item.image !== 'PASTE_LINK_HERE' ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : <span className="text-lg">🌸</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[.82rem] font-semibold truncate">{item.name}</p>
                      <p className="text-[.72rem] text-gray-400">× {item.quantity} stems</p>
                    </div>
                    <p className="text-[.85rem] font-bold text-roseD flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                <span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                <span>Delivery</span><span>₹{delFee}</span>
              </div>
              <div className="flex justify-between py-3 font-extrabold text-[1.1rem] text-roseD">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>

              <p className="text-center text-[.72rem] text-textL mt-2">🔒 Secure · Satisfaction guaranteed</p>

              {/* Address preview in sidebar */}
              {address.fullName && (
                <div className="mt-4 pt-4 border-t border-blush/12">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">📦 Delivering to</p>
                  <p className="text-xs font-semibold text-roseDD">{address.fullName}</p>
                  <p className="text-xs text-gray-500">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                  <p className="text-xs text-gray-500">{address.city}, {address.state} — {address.pincode}</p>
                  <p className="text-xs text-gray-400">📞 {address.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
