import { useRef } from 'react';

const EMOJIS = ['🌸', '🌺', '🌷', '🌹', '🪷'];

export default function FallingPetals({ count = 12 }) {
  const petals = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left:  `${Math.random() * 100}%`,
      delay: `${Math.random() * 9}s`,
      dur:   `${7 + Math.random() * 7}s`,
      em:    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size:  `${0.8 + Math.random() * 0.7}rem`,
    }))
  ).current;

  return (
    <div aria-hidden="true">
      {petals.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left, top: 0,
            animationDelay: p.delay,
            animationDuration: p.dur,
            fontSize: p.size,
          }}
        >
          {p.em}
        </span>
      ))}
    </div>
  );
}
