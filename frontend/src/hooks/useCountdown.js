import { useState, useEffect } from 'react';

/**
 * Counts down from a given h/m/s and loops every 24h.
 */
export function useCountdown(initH = 8, initM = 23, initS = 45) {
  const [time, setTime] = useState({ h: initH, m: initM, s: initS });

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return time;
}

/** Zero-pad a number to 2 digits */
export const pad = n => String(n).padStart(2, '0');
