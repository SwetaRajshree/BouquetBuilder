import { useState } from 'react';
import { MONTHS, DAY_NAMES } from '../data/mockData';

export default function DateTimePicker({ onDateChange, onTimeChange, initialDay, initialMonth, initialYear }) {
  const today    = new Date();
  const [month,  setMonth]  = useState(initialMonth ?? today.getMonth());
  const [year,   setYear]   = useState(initialYear  ?? today.getFullYear());
  const [selDay, setSelDay] = useState(initialDay   ?? today.getDate());
  const [slot,   setSlot]   = useState('morning');

  const dim = new Date(year, month + 1, 0).getDate();
  const fd  = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const selectDay = (d) => {
    setSelDay(d);
    onDateChange?.({ day: d, month, year });
  };
  const selectSlot = (s) => {
    setSlot(s);
    onTimeChange?.(s);
  };

  const TIME_SLOTS = [
    { id: 'morning',   label: '🌅 Morning',   sub: '8AM – 12PM' },
    { id: 'afternoon', label: '☀️ Afternoon',  sub: '12PM – 5PM' },
    { id: 'evening',   label: '🌙 Evening',    sub: '5PM – 9PM'  },
  ];

  return (
    <div className="bg-white rounded-md shadow-soft-s p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-rose hover:text-roseD text-xl font-bold px-2 transition-colors">‹</button>
        <h3 className="font-playfair font-semibold text-[1.1rem] text-roseDD">
          {MONTHS[month]} {year}
        </h3>
        <button onClick={nextMonth} className="text-rose hover:text-roseD text-xl font-bold px-2 transition-colors">›</button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-5">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[.74rem] font-bold text-textL py-1">{d}</div>
        ))}
        {Array.from({ length: fd }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: dim }, (_, i) => {
          const d   = i + 1;
          const isSel   = selDay === d;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={d}
              onClick={() => selectDay(d)}
              className={`
                aspect-square flex items-center justify-center rounded-full
                text-[.82rem] cursor-pointer transition-all
                ${isSel   ? 'bg-gradient-to-br from-rose to-[#e09099] text-white font-bold' :
                  isToday ? 'border-2 border-rose text-roseD font-bold' :
                            'hover:bg-blushL'}
              `}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <h4 className="font-playfair text-[.95rem] mb-3">🕐 Select Time Slot</h4>
      <div className="flex gap-2.5 flex-wrap">
        {TIME_SLOTS.map(ts => (
          <div
            key={ts.id}
            onClick={() => selectSlot(ts.id)}
            className={`
              flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-full border-[1.5px]
              cursor-pointer text-[.83rem] transition-all
              ${slot === ts.id
                ? 'bg-blushL border-rose text-roseD font-bold'
                : 'bg-white border-blush/40 text-textL hover:border-rose'}
            `}
          >
            <div>{ts.label}</div>
            <div className="text-[.7rem] mt-0.5">{ts.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
