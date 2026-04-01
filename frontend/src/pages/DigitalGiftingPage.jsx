import { useNavigate } from 'react-router-dom';
import FallingPetals from '../components/FallingPetals';

const GIFTS = [
  {
    icon: '💐',
    title: 'Digital Bouquet',
    desc: 'Build a stunning digital bouquet with hand-drawn flowers, arrange layers & send with a heartfelt message.',
    route: '/bouquet-builder',
    bg: 'from-[#ffe8ed] to-[#ffd0d8]',
    btn: 'Build Now',
    color: '#a86870',
  },
  {
    icon: '💌',
    title: 'Digital Postcard',
    desc: 'Create a beautiful personalised postcard with your message, stickers and a custom design.',
    route: '/postcard',
    bg: 'from-[#e8d5ff] to-[#d8c0ff]',
    btn: 'Create Card',
    color: '#7a5a9a',
  },
  {
    icon: '🎵',
    title: 'Bouquet + Song',
    desc: 'Send a digital bouquet paired with their favourite Spotify song for the ultimate romantic gesture.',
    route: '/bouquet-builder',
    bg: 'from-[#d4f0d4] to-[#c0e8c0]',
    btn: 'Send with Music',
    color: '#3a7a3a',
  },
  {
    icon: '🎙️',
    title: 'Voice Note Bouquet',
    desc: 'Record a personal voice message and attach it to your digital bouquet — your voice, their heart.',
    route: '/bouquet-builder',
    bg: 'from-[#fff0d0] to-[#ffe4b0]',
    btn: 'Record & Send',
    color: '#8a6020',
  },
];

export default function DigitalGiftingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter overflow-x-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden text-center px-4 py-24 bg-gradient-to-br from-[#ffe8ed] via-[#f0e0ff] to-[#daefd4]">
        <FallingPetals count={16} />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <div className="inline-block bg-white/60 backdrop-blur-sm text-roseD text-[.78rem] font-semibold px-4 py-1.5 rounded-full border border-blush/40 mb-5 tracking-wide">
            ✨ Digital Gifting · No Delivery Needed · Instant Joy
          </div>
          <h1 className="font-playfair font-extrabold text-roseDD leading-[1.15] text-[clamp(2.3rem,5.5vw,3.8rem)] mb-4">
            Gift Love Digitally 💌
          </h1>
          <p className="text-[1.05rem] text-textM mb-8 font-light leading-relaxed">
            Send beautiful digital bouquets, postcards, voice notes & more — instantly, from anywhere in the world.
          </p>
          <button
            onClick={() => navigate('/bouquet-builder')}
            className="bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold px-8 py-3.5 rounded-full text-[.9rem] hover:-translate-y-0.5 hover:shadow-soft-l transition-all"
          >
            Start Gifting 🌸
          </button>
        </div>
      </section>

      {/* Gift Options */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD text-center mb-2">Choose Your Gift 🎁</h2>
          <p className="text-center text-textL text-sm mb-10">Pick the perfect way to express your feelings</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GIFTS.map((g, i) => (
              <div key={g.title}
                className={`bg-gradient-to-br ${g.bg} rounded-2xl p-8 border-2 border-transparent hover:border-blush/40 hover:-translate-y-1.5 hover:shadow-soft-m transition-all cursor-pointer group`}
                onClick={() => navigate(g.route)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-[3.5rem] mb-4 group-hover:scale-110 transition-transform duration-200">{g.icon}</div>
                <h3 className="font-playfair font-bold text-xl mb-2" style={{ color: g.color }}>{g.title}</h3>
                <p className="text-textM text-[.88rem] leading-relaxed mb-5">{g.desc}</p>
                <button
                  onClick={e => { e.stopPropagation(); navigate(g.route); }}
                  className="text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all hover:brightness-110"
                  style={{ background: g.color }}
                >
                  {g.btn} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#fff8f0] to-[#f3eaff]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-roseDD mb-10">How Digital Gifting Works 🌸</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['🎨', 'Create', 'Pick your gift type and personalise it with flowers, messages, music or voice.'],
              ['🔗', 'Share', 'Get a unique link to share via WhatsApp, Instagram, email or any platform.'],
              ['💕', 'They Receive', 'They open a beautiful page with your gift — no app needed, works on any device.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-soft-s border border-blush/10">
                <div className="text-[2.5rem] mb-3">{icon}</div>
                <h4 className="font-playfair font-semibold text-base text-roseDD mb-2">{title}</h4>
                <p className="text-textL text-[.82rem] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-roseDD py-16 text-center px-4">
        <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-white mb-3">Ready to Make Someone Smile? 💐</h2>
        <p className="text-white/80 mb-7 font-light">Create your first digital gift in under 2 minutes.</p>
        <button onClick={() => navigate('/bouquet-builder')}
          className="bg-white text-roseDD font-bold px-8 py-3.5 rounded-full text-[.9rem] hover:-translate-y-0.5 hover:shadow-soft-l transition-all">
          Build a Digital Bouquet 🌸
        </button>
      </section>
    </div>
  );
}
