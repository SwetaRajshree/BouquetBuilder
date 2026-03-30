import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL;
function pad(n) { return String(n).padStart(2, '0'); }

export default function FlashSaleStrip() {
  const navigate = useNavigate();
  const [endsAt, setEndsAt] = useState(null);
  const [time, setTime]     = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    fetch(`${API}/api/flashsales`)
      .then(r => r.json())
      .then(data => { if (data[0]?.endsAt) setEndsAt(data[0].endsAt); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => {
      const diff = Math.max(0, new Date(endsAt) - new Date());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  return (
    <div
      onClick={() => navigate('/sale')}
      className="flex items-center justify-center gap-4 flex-wrap px-4 py-2.5 cursor-pointer text-white font-bold text-[.9rem] tracking-[.04em]"
      style={{ background: 'linear-gradient(90deg,#8a5560,#C9848A,#e8909a,#8a5560)', backgroundSize: '300% 100%', animation: 'gradShift 4s ease infinite' }}
    >
      <span>🔥 TODAY'S FLASH DEALS — UP TO 50% OFF 🌹 LIMITED TIME ONLY!</span>
      <div className="flex items-center gap-1.5">
        {[pad(time.h), ':', pad(time.m), ':', pad(time.s)].map((seg, i) =>
          seg === ':' ? (
            <span key={i} className="text-lg font-extrabold animate-[cdBlink_1s_step-end_infinite]">:</span>
          ) : (
            <div key={i} className="bg-white/20 border border-white/30 rounded px-2 py-0.5 text-[1rem] font-extrabold min-w-[28px] text-center">{seg}</div>
          )
        )}
      </div>
      <button className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-4 py-1 text-[.82rem] font-bold transition-colors">
        Shop Now →
      </button>
    </div>
  );
}
