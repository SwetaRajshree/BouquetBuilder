import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import SpecialDayModal         from '../components/SpecialDayModal';
import { OCCASIONS, MONTHS, DAY_NAMES } from '../data/mockData';
import { useAuth }             from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const OCCASION_EMOJI_MAP = {
  "Valentine's Day":  '❤️',
  "Mom's Birthday":   '🎂',
  "Anniversary":      '💍',
  "Best Friend's Day":'🌸',
  "Birthday":         '🎂',
  "Graduation":       '🎓',
  "Wedding":          '💒',
  "Mother's Day":     '🌷',
  "Just Because":     '🌼',
};

const SLOT_LABEL = { morning: '🌅 8AM–12PM', afternoon: '☀️ 12PM–5PM', evening: '🌙 5PM–9PM' };
const STATUS_STYLE = {
  placed:           'bg-blue-100 text-blue-600',
  preparing:        'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-orange-100 text-orange-600',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-500',
};

export default function CalendarPage() {
  const navigate  = useNavigate();
  const { token } = useAuth();
  const today     = new Date();

  // ── Occasions (persisted in localStorage) ──────────────────
  const [occasions, setOccasions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('floriva_occasions')) || OCCASIONS; }
    catch { return OCCASIONS; }
  });
  const [showModal, setShowModal] = useState(false);

  // ── Calendar nav ────────────────────────────────────────────
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear,  setCalYear]  = useState(today.getFullYear());

  // ── Real orders from backend ────────────────────────────────
  const [orders,       setOrders]       = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // { day, month, year }
  const [detailOrder,  setDetailOrder]  = useState(null); // order popup

  useEffect(() => {
    if (!token) return;
    setOrdersLoading(true);
    fetch(`${API}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [token]);

  // ── Persist occasions ───────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('floriva_occasions', JSON.stringify(occasions));
  }, [occasions]);

  const dim = new Date(calYear, calMonth + 1, 0).getDate();
  const fd  = new Date(calYear, calMonth, 1).getDay();

  // Build maps for this month
  const specialDateMap = {};
  occasions.forEach(o => {
    const d = new Date(o.date);
    if (d.getMonth() === calMonth && d.getFullYear() === calYear)
      specialDateMap[d.getDate()] = o;
  });

  const orderDateMap = {}; // day → [orders]
  orders.forEach(o => {
    if (!o.scheduledDate) return;
    const d = new Date(o.scheduledDate);
    if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
      const day = d.getDate();
      orderDateMap[day] = orderDateMap[day] || [];
      orderDateMap[day].push(o);
    }
  });

  const daysRemaining = ds => {
    const diff = Math.ceil((new Date(ds) - new Date()) / 86400000);
    return diff > 0 ? diff : 365 + diff;
  };

  const addOccasion = (form) => {
    const emoji = OCCASION_EMOJI_MAP[form.occasion] || '🎉';
    setOccasions(p => [...p, { id: Date.now(), name: form.name, icon: emoji, date: form.date }]);
  };

  const removeOccasion = (id) => setOccasions(p => p.filter(o => o.id !== id));

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0);  setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  const handleDayClick = (d) => {
    setSelectedDate({ day: d, month: calMonth, year: calYear });
    const dayOrders = orderDateMap[d];
    setDetailOrder(dayOrders?.length ? dayOrders[0] : null);
  };

  return (
    <div className="page-enter">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">🗓️ Special Days Calendar</h2>
        <p className="text-[.9rem] text-textL font-light mb-6">Never miss a moment worth celebrating</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Left: Calendar ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-soft-s p-4 border border-blush/20"
              style={{ background: 'linear-gradient(145deg, #fff8f0, #fff4f8)' }}>

              {/* Month nav */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth}
                  className="w-7 h-7 rounded-full bg-blushL hover:bg-blush flex items-center justify-center text-rose font-bold transition-all text-sm">‹</button>
                <div className="text-center">
                  <h3 className="font-playfair font-bold text-[1rem] text-roseDD">{MONTHS[calMonth]}</h3>
                  <p className="text-[.68rem] text-textL font-medium">{calYear}</p>
                </div>
                <button onClick={nextMonth}
                  className="w-7 h-7 rounded-full bg-blushL hover:bg-blush flex items-center justify-center text-rose font-bold transition-all text-sm">›</button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-[.66rem] font-bold text-rose/70 py-1">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: fd }, (_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: dim }, (_, i) => {
                  const d        = i + 1;
                  const occasion = specialDateMap[d];
                  const hasOrder = !!orderDateMap[d];
                  const isToday  = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const isSel    = selectedDate?.day === d && selectedDate?.month === calMonth && selectedDate?.year === calYear;
                  const emoji    = occasion ? (OCCASION_EMOJI_MAP[occasion.name] || occasion.icon) : null;

                  return (
                    <div key={d} className="flex flex-col items-center py-0.5 cursor-pointer"
                      onClick={() => handleDayClick(d)}>
                      {emoji && (
                        <span className="text-[.7rem] leading-none mb-0.5 animate-bounce" style={{ animationDuration: '2s' }}>
                          {emoji}
                        </span>
                      )}
                      <div className={`
                        w-7 h-7 flex items-center justify-center rounded-full
                        text-[.75rem] transition-all font-medium relative flex-shrink-0
                        ${isSel
                          ? 'bg-gradient-to-br from-rose to-[#e09099] text-white font-bold shadow-md'
                          : occasion
                          ? 'bg-gradient-to-br from-blush to-lavender text-roseDD font-bold shadow-sm ring-2 ring-rose/20'
                          : isToday
                          ? 'border-2 border-rose text-roseD font-bold bg-blushL'
                          : 'hover:bg-blushL text-text'}
                      `}>
                        {d}
                        {hasOrder && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                        )}
                      </div>
                      {/* Person name below date */}
                      {occasion && (
                        <span className="text-[.52rem] text-roseD font-semibold text-center leading-tight mt-0.5 w-full truncate px-0.5">
                          {occasion.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blush/20 justify-center flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blush to-lavender ring-1 ring-rose/30" />
                  <span className="text-[.65rem] text-textL">Special Day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-rose bg-blushL" />
                  <span className="text-[.65rem] text-textL">Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[.65rem] text-textL">Scheduled Order</span>
                </div>
              </div>
            </div>

            {/* Selected date panel */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-soft-s p-4 border border-blush/20 animate-[fadeSlideIn_.25s_ease_both]">
                <p className="font-playfair font-semibold text-roseDD text-[.95rem] mb-3">
                  📅 {MONTHS[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                </p>

                {/* Order on this date */}
                {detailOrder ? (
                  <div className="bg-gradient-to-br from-blushL to-lavL rounded-xl p-3.5 mb-3 border border-blush/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[.78rem] font-bold text-roseDD">🛍️ Scheduled Delivery</span>
                      <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[detailOrder.status] || 'bg-gray-100 text-gray-500'}`}>
                        {detailOrder.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[.78rem] text-textL mb-1">
                      {SLOT_LABEL[detailOrder.timeSlot] || '🕐 Time TBD'}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {detailOrder.items?.slice(0, 3).map((it, idx) => (
                        <span key={idx} className="text-[.7rem] bg-white px-2 py-0.5 rounded-full border border-blush/30 text-roseD">
                          {it.name} ×{it.quantity}
                        </span>
                      ))}
                    </div>
                    <p className="text-[.78rem] font-bold text-roseD">₹{detailOrder.total?.toLocaleString()}</p>
                    <button
                      onClick={() => navigate(`/tracking`)}
                      className="mt-2 text-[.72rem] text-rose hover:text-roseD underline font-medium">
                      Track this order →
                    </button>
                  </div>
                ) : (
                  <p className="text-[.78rem] text-textL mb-3">No orders scheduled for this day.</p>
                )}

                {/* Special occasion on this date */}
                {specialDateMap[selectedDate.day] && (
                  <div className="flex items-center gap-2 bg-gradient-to-br from-blushL to-lavL rounded-xl p-3 mb-3 border border-blush/20">
                    <span className="text-xl">{specialDateMap[selectedDate.day].icon}</span>
                    <div>
                      <p className="text-[.8rem] font-semibold text-roseDD">{specialDateMap[selectedDate.day].name}</p>
                      <p className="text-[.7rem] text-textL">Special occasion</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/schedule', { state: { date: `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(selectedDate.day).padStart(2,'0')}` } })}
                  className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all text-[.82rem]">
                  📅 Schedule Delivery for This Day
                </button>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2.5 flex-wrap">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all text-[.85rem]">
                ✨ Add Special Day
              </button>
              <button
                onClick={() => navigate('/schedule')}
                className="flex-1 bg-gradient-to-br from-sage to-sageD text-white font-semibold py-2.5 rounded-full hover:-translate-y-0.5 transition-all text-[.85rem]">
                📅 Schedule Delivery
              </button>
            </div>

            {/* Reminder info */}
            <div className="bg-gradient-to-br from-blushL to-lavL rounded-xl p-3.5 text-center border border-blush/25 flex items-center gap-3">
              <div className="text-[1.8rem]">💌</div>
              <div className="text-left">
                <p className="font-playfair font-semibold text-roseD text-[.88rem]">Reminders Active</p>
                <p className="text-[.74rem] text-textL">Flora reminds you before each special day</p>
              </div>
            </div>

            {/* Scheduled orders list */}
            {token && (
              <div className="bg-white rounded-2xl shadow-soft-s p-4 border border-blush/15">
                <h3 className="font-playfair font-semibold text-[.95rem] text-roseDD mb-3 flex items-center gap-2">
                  🚚 Upcoming Deliveries
                  {ordersLoading && <span className="text-[.7rem] text-textL animate-pulse">Loading...</span>}
                </h3>
                {orders.filter(o => o.scheduledDate && new Date(o.scheduledDate) >= today && o.status !== 'delivered' && o.status !== 'cancelled')
                  .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                  .slice(0, 4)
                  .map(o => {
                    const sd = new Date(o.scheduledDate);
                    return (
                      <div key={o._id}
                        className="flex items-center gap-3 p-3 rounded-xl mb-2 border border-blush/10 hover:border-blush/40 hover:bg-blushL/30 transition-all cursor-pointer"
                        onClick={() => navigate('/tracking')}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-lg flex-shrink-0">
                          💐
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[.82rem] font-semibold text-text truncate">
                            {o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1} more` : ''}
                          </p>
                          <p className="text-[.7rem] text-textL">
                            {MONTHS[sd.getMonth()]} {sd.getDate()} · {SLOT_LABEL[o.timeSlot] || 'Time TBD'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-500'}`}>
                            {o.status?.replace('_', ' ')}
                          </span>
                          <span className="text-[.72rem] font-bold text-roseD">₹{o.total?.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                {!ordersLoading && orders.filter(o => o.scheduledDate && new Date(o.scheduledDate) >= today).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-[.8rem] text-textL">No upcoming deliveries</p>
                    <button onClick={() => navigate('/flowers')}
                      className="mt-2 text-[.78rem] text-rose hover:text-roseD underline font-medium">
                      Browse flowers →
                    </button>
                  </div>
                )}
              </div>
            )}

            {!token && (
              <div className="bg-gradient-to-br from-blushL to-lavL rounded-xl p-4 border border-blush/20 text-center">
                <p className="text-[.82rem] text-textL mb-2">Login to see your scheduled deliveries on the calendar</p>
                <button onClick={() => navigate('/auth')}
                  className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.8rem] font-semibold px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all">
                  Login / Sign Up
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Upcoming occasions ── */}
          <div className="bg-white rounded-2xl shadow-soft-s p-5 h-fit border border-blush/15">
            <h3 className="font-playfair font-semibold text-[.97rem] text-roseDD mb-4 flex items-center gap-2">
              Upcoming Occasions <span>🌸</span>
            </h3>
            {occasions
              .sort((a, b) => daysRemaining(a.date) - daysRemaining(b.date))
              .map(o => {
                const emoji    = OCCASION_EMOJI_MAP[o.name] || o.icon;
                const days     = daysRemaining(o.date);
                const urgentBg = days <= 7  ? 'from-[#ff6b6b] to-[#ff4757]'
                               : days <= 30 ? 'from-rose to-[#e09099]'
                               :              'from-[#b5cda3] to-[#8aab78]';
                const isDefault = OCCASIONS.some(def => def.id === o.id);
                return (
                  <div key={o.id}
                    className="flex items-center gap-3 p-3 rounded-xl mb-2.5 cursor-pointer transition-all border border-transparent hover:border-blush/40 hover:bg-blushL/40"
                    style={{ background: 'linear-gradient(135deg, #fff8f0, #fff4f8)' }}>

                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-[1.4rem] flex-shrink-0 shadow-sm">
                      {emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[.86rem] font-semibold text-text truncate">{o.name}</p>
                      <span className="text-[.7rem] text-textL">{o.date}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`bg-gradient-to-br ${urgentBg} text-white text-[.64rem] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                        {days}d
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate('/flowers')}
                          className="bg-gradient-to-br from-blush to-lavender text-roseD text-[.67rem] font-bold px-2.5 py-1 rounded-full hover:from-rose hover:to-[#e09099] hover:text-white transition-all whitespace-nowrap">
                          Order Now
                        </button>
                        {!isDefault && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeOccasion(o.id); }}
                            className="text-gray-300 hover:text-red-400 text-xs transition-colors px-1">
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {showModal && (
        <SpecialDayModal
          onClose={() => setShowModal(false)}
          onSave={addOccasion}
        />
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
