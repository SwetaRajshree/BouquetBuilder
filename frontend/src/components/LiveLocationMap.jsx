import { useState, useEffect } from 'react';

/**
 * Dual-pin live map placeholder.
 * Shows animated delivery scooter moving toward customer pin.
 */
export default function LiveLocationMap({ mode = 'delivery' }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPos(p => (p + 1) % 100), 120);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white rounded-md shadow-soft-s p-5">
      <h3 className="font-playfair text-base mb-4">
        {mode === 'delivery' ? '📍 Live Delivery Location' : '📍 Shops Near You'}
      </h3>

      {/* Map canvas */}
      <div className="
        bg-gradient-to-br from-[#e8f5e0] via-[#f0ece8] to-[#e8e0f5]
        rounded-md p-6 relative overflow-hidden min-h-[100px]
      ">
        {/* Road line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-white/60 rounded-full -translate-y-1/2" />

        {/* Shop / origin pin */}
        <div className="absolute left-3 top-1/2 -translate-y-[80%] text-2xl">🏪</div>

        {/* Moving delivery scooter */}
        <div
          className="absolute top-1/2 text-2xl transition-none"
          style={{
            left: `${16 + pos * 0.5}%`,
            transform: 'translateY(-80%)',
            animation: 'movingPin 3s ease infinite alternate',
          }}
        >
          🛵
        </div>

        {/* Customer / destination pin */}
        <div className="absolute right-3 top-1/2 -translate-y-[80%]">
          <div className="
            w-9 h-9 rounded-full flex items-center justify-center text-lg
            bg-gradient-to-br from-rose to-[#e09099] text-white
            animate-[youPulse_2s_ease_infinite]
            shadow-[0_0_0_0_rgba(201,132,138,.4)]
          ">
            📍
          </div>
        </div>
      </div>

      {/* Status pill */}
      <div className="
        text-center mt-3 bg-blushL rounded-sm py-2.5 text-[.85rem] font-bold text-roseD
      ">
        🌸 Your bouquet is ~5 minutes away!
      </div>
    </div>
  );
}
