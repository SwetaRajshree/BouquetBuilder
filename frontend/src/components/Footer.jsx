import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' }, { to: '/sale', label: 'Flash Sale' },
  { to: '/shops', label: 'Shops' }, { to: '/ai', label: 'AI Assistant' },
  { to: '/calendar', label: 'Calendar' }, { to: '/subscription', label: 'Subscriptions' },
  { to: '/story', label: 'Our Story' },
];

export default function Footer() {
  return (
    <footer className="
      bg-gradient-to-br from-[#f8e8ed] to-[#ede8f7]
      border-t border-blush/25
      px-6 py-10 text-center
    ">
      <div className="font-playfair font-extrabold text-2xl text-roseD mb-1">BouquetBuilder 💐</div>
      <p className="text-sm text-textL mb-4 font-light">Send Love, One Petal at a Time</p>

      <div className="flex flex-wrap justify-center gap-5 mb-4">
        {LINKS.map(l => (
          <Link key={l.to} to={l.to} className="text-[.82rem] text-textL hover:text-roseD transition-colors">
            {l.label}
          </Link>
        ))}
      </div>

      <p className="text-[.76rem] text-textL">© 2025 BouquetBuilder. Crafted with 💕 for flower lovers.</p>
      <div className="text-xl tracking-[.3rem] mt-2">🌸 🌺 🌷 🌹 🪷</div>
    </footer>
  );
}
