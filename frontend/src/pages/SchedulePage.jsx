import { useState }       from 'react';
import { useNavigate }    from 'react-router-dom';
import DateTimePicker     from '../components/DateTimePicker';
import MessageCardPreview from '../components/MessageCardPreview';
import { CARD_COLORS, MONTHS } from '../data/mockData';

export default function SchedulePage() {
  const navigate = useNavigate();
  const today    = new Date();

  const [selDay,    setSelDay]    = useState(today.getDate());
  const [selMonth,  setSelMonth]  = useState(today.getMonth());
  const [timeSlot,  setTimeSlot]  = useState('morning');
  const [msgCard,   setMsgCard]   = useState('');
  const [msgFont,   setMsgFont]   = useState('Elegant');
  const [cardColor, setCardColor] = useState('cream');

  const slotLabel = timeSlot === 'morning' ? '8AM–12PM' : timeSlot === 'afternoon' ? '12PM–5PM' : '5PM–9PM';

  return (
    <div className="page-enter">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">📅 Schedule Delivery</h2>
        <p className="text-[.9rem] text-textL font-light mb-7">Choose when love should arrive</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-5">
            {/* Calendar & time picker */}
            <DateTimePicker
              onDateChange={({ day, month }) => { setSelDay(day); setSelMonth(month); }}
              onTimeChange={setTimeSlot}
            />

            {/* Recipient details */}
            <div className="bg-white rounded-md shadow-soft-s p-5">
              <h3 className="font-playfair text-base mb-4">👤 Recipient Details</h3>
              {[['Full Name','e.g. Priya Sharma','text'],['Delivery Address','Flat no., Street, City, PIN','text'],['Phone Number','+91 98765 43210','tel']].map(([label,ph,type]) => (
                <div key={label} className="mb-4">
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">{label}</label>
                  <input type={type} className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-[.88rem] transition-all" placeholder={ph} />
                </div>
              ))}
              <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Special Instructions</label>
              <textarea className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-[.88rem] resize-none min-h-[80px] transition-all" placeholder="Leave at door, ring bell twice..." />
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
              {[['Whisper of Spring','₹1,299'],['Customization','₹450'],['Message card','₹49'],[`Delivery (${timeSlot})`, '₹99'],['Discount','-₹100']].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 text-[.86rem] border-b border-blush/12">
                  <span className={label === 'Discount' ? 'text-sageD' : ''}>{label}</span>
                  <span className={label === 'Discount' ? 'text-sageD' : ''}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 font-extrabold text-[1.05rem] text-roseD mt-1">
                <span>Total</span><span>₹1,797</span>
              </div>
              <div className="bg-cream rounded-sm px-3 py-2.5 text-[.8rem] text-textL leading-relaxed mb-4">
                📅 {MONTHS[selMonth]} {selDay} · {slotLabel}
              </div>
              <button
                onClick={() => navigate('/payment')}
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
