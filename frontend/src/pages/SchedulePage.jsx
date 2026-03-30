import { useState }       from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DateTimePicker     from '../components/DateTimePicker';
import MessageCardPreview from '../components/MessageCardPreview';
import { CARD_COLORS, MONTHS } from '../data/mockData';
import { useCartContext } from '../context/CartContext';

export default function SchedulePage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartItems, totalPrice } = useCartContext();

  const today = new Date();

  // Pre-fill date if coming from calendar
  const preDate = location.state?.date ? new Date(location.state.date) : null;

  const [selDay,   setSelDay]   = useState(preDate ? preDate.getDate()    : today.getDate());
  const [selMonth, setSelMonth] = useState(preDate ? preDate.getMonth()   : today.getMonth());
  const [selYear,  setSelYear]  = useState(preDate ? preDate.getFullYear(): today.getFullYear());
  const [timeSlot, setTimeSlot] = useState('morning');

  // Recipient form
  const [form, setForm] = useState({ name: '', address: '', phone: '', instructions: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  // Message card
  const [msgCard,   setMsgCard]   = useState('');
  const [msgFont,   setMsgFont]   = useState('Elegant');
  const [cardColor, setCardColor] = useState('cream');

  const slotLabel = timeSlot === 'morning' ? '8AM–12PM' : timeSlot === 'afternoon' ? '12PM–5PM' : '5PM–9PM';
  const deliveryFee = totalPrice >= 499 ? 0 : 99;
  const total = totalPrice + deliveryFee;

  const handleSchedule = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Add some flowers first.');
      navigate('/flowers');
      return;
    }
    if (!form.name || !form.address || !form.phone) {
      alert('Please fill in recipient name, address and phone.');
      return;
    }
    navigate('/payment', {
      state: {
        scheduledDate: `${selYear}-${String(selMonth + 1).padStart(2, '0')}-${String(selDay).padStart(2, '0')}`,
        timeSlot,
        deliveryAddress: { fullName: form.name, line1: form.address, phone: form.phone },
        specialInstructions: form.instructions,
        messageCard: { text: msgCard, font: msgFont, color: cardColor },
        deliveryType: 'scheduled',
      }
    });
  };

  return (
    <div className="page-enter">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">📅 Schedule Delivery</h2>
        <p className="text-[.9rem] text-textL font-light mb-7">Choose when love should arrive</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-5">

            {/* Calendar & time picker */}
            <DateTimePicker
              initialDay={selDay}
              initialMonth={selMonth}
              initialYear={selYear}
              onDateChange={({ day, month, year }) => { setSelDay(day); setSelMonth(month); setSelYear(year); }}
              onTimeChange={setTimeSlot}
            />

            {/* Recipient details */}
            <div className="bg-white rounded-md shadow-soft-s p-5">
              <h3 className="font-playfair text-base mb-4">👤 Recipient Details</h3>
              {[
                ['Full Name',            'e.g. Priya Sharma',      'text',  'name'],
                ['Delivery Address',     'Flat no., Street, City', 'text',  'address'],
                ['Phone Number',         '+91 98765 43210',        'tel',   'phone'],
              ].map(([label, ph, type, key]) => (
                <div key={key} className="mb-4">
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">{label}</label>
                  <input type={type} value={form[key]} onChange={set(key)}
                    className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-[.88rem] transition-all"
                    placeholder={ph} />
                </div>
              ))}
              <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Special Instructions</label>
              <textarea value={form.instructions} onChange={set('instructions')}
                className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-[.88rem] resize-none min-h-[80px] transition-all"
                placeholder="Leave at door, ring bell twice..." />
            </div>

            {/* Message card */}
            <div className="bg-white rounded-md shadow-soft-s p-5">
              <h3 className="font-playfair text-base mb-4">💌 Message Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Your Message</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] resize-none min-h-[80px] transition-all"
                    placeholder="Write your heartfelt message..."
                    value={msgCard} onChange={e => setMsgCard(e.target.value)}
                  />
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 mt-3 uppercase tracking-wide">Font</label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {['Cursive','Print','Elegant'].map(f => (
                      <button key={f} onClick={() => setMsgFont(f)}
                        className={`px-3.5 py-1 rounded-full border-[1.5px] text-[.8rem] transition-all ${msgFont === f ? 'bg-blushL border-rose text-roseD font-bold' : 'bg-white border-blush/40 text-textL hover:border-rose'}`}
                      >{f}</button>
                    ))}
                  </div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Card Color</label>
                  <div className="flex gap-2.5">
                    {Object.entries(CARD_COLORS).map(([k, v]) => (
                      <div key={k} onClick={() => setCardColor(k)}
                        className="w-7 h-7 rounded-full cursor-pointer transition-all"
                        style={{ background: v, border: `2.5px solid ${cardColor === k ? 'var(--rose-d)' : 'rgba(255,182,193,.4)'}`, transform: cardColor === k ? 'scale(1.22)' : 'scale(1)', boxShadow: v === '#FFFFFF' ? '0 0 0 1px #ddd' : 'none' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Preview</label>
                  <MessageCardPreview msg={msgCard} font={msgFont} cardColor={cardColor} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-md shadow-soft-m p-5 sticky top-20">
              <h3 className="font-playfair font-bold text-[1.1rem] text-roseDD mb-4">🛍️ Order Summary</h3>

              {cartItems.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[.82rem] text-textL mb-3">Your cart is empty</p>
                  <button onClick={() => navigate('/flowers')}
                    className="text-[.8rem] text-rose hover:text-roseD underline font-medium">
                    Browse flowers →
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                      <span className="truncate max-w-[180px]">{item.name} ×{item.quantity}</span>
                      <span>₹{((item.basePrice + (item.fillerPrice || 0)) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                    <span>Delivery ({timeSlot})</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between py-3 font-extrabold text-[1.05rem] text-roseD mt-1">
                    <span>Total</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="bg-cream rounded-sm px-3 py-2.5 text-[.8rem] text-textL leading-relaxed mb-4">
                📅 {MONTHS[selMonth]} {selDay}, {selYear} · {slotLabel}
              </div>

              <button
                onClick={handleSchedule}
                className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3.5 rounded-full text-[.92rem] hover:-translate-y-0.5 hover:shadow-soft-m transition-all"
              >
                Schedule My Bouquet 💐
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
