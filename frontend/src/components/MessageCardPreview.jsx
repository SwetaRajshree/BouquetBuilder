import { CARD_COLORS } from '../data/mockData';

const FONT_MAP = {
  Cursive: "'Dancing Script', cursive",
  Print:   "'Poppins', sans-serif",
  Elegant: "'Playfair Display', serif",
};

export default function MessageCardPreview({ msg, font = 'Elegant', cardColor = 'cream' }) {
  return (
    <div
      className="
        relative rounded-md p-5 min-h-[140px]
        flex flex-col justify-center items-center text-center
        shadow-soft-s border border-blush/25
        transition-[background] duration-300
      "
      style={{ background: CARD_COLORS[cardColor] ?? '#fff' }}
    >
      {/* Decorative corners */}
      <span className="absolute top-2 right-3 text-lg opacity-30">🌸</span>
      <span className="absolute bottom-2 left-2.5 text-base opacity-25">🌿</span>

      <p
        className="relative z-10 text-base leading-relaxed text-text"
        style={{
          fontFamily: FONT_MAP[font] ?? FONT_MAP.Elegant,
          opacity: msg ? 1 : 0.35,
        }}
      >
        {msg || 'Your message will appear here 💌'}
      </p>
    </div>
  );
}
