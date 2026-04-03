import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    emoji: '💐',
    title: 'Digital Bouquet',
    desc: 'Build a beautiful virtual bouquet and send it with a personalised card & voice note.',
    route: '/bouquet-builder',
    bg: 'linear-gradient(135deg, #ffe8ed, #ffd0d8)',
    accent: '#c04060',
  },
  {
    emoji: '💌',
    title: 'Digital Card',
    desc: 'Create a stunning greeting card with custom messages, stickers and card styles.',
    route: '/digital-card',
    bg: 'linear-gradient(135deg, #e8d5ff, #d8c0ff)',
    accent: '#6030a0',
  },
  {
    emoji: '📮',
    title: 'Postcard',
    desc: 'Send a real printed postcard delivered to their doorstep — personalised just for them.',
    route: '/postcard',
    bg: 'linear-gradient(135deg, #fff0d0, #ffe4b0)',
    accent: '#a06010',
  },
  {
    emoji: '🎙️',
    title: 'Voice Note Keepsake',
    desc: 'Record a heartfelt voice message and attach it to your bouquet or card.',
    route: '/bouquet-builder',
    bg: 'linear-gradient(135deg, #d4f0d4, #c0e8c0)',
    accent: '#206030',
  },
  {
    emoji: '🌸',
    title: 'Shared Garden',
    desc: 'Create a virtual garden of flowers and share the link with someone special.',
    route: '/digital-gifting',
    bg: 'linear-gradient(135deg, #d0f0ff, #b8e4ff)',
    accent: '#1060a0',
  },
  {
    emoji: '📸',
    title: 'Polaroid Booth',
    desc: 'Design a cute polaroid-style photo card with flowers and a personal message.',
    route: '/digital-gifting',
    bg: 'linear-gradient(135deg, #ffe8f8, #ffd0f0)',
    accent: '#a02080',
  },
];

export default function DigiLovePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#f8f4ff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #2d1b3d 0%, #4a2060 60%, #6030a0 100%)', padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        {['top-4 left-8', 'top-8 right-12', 'bottom-6 left-16', 'bottom-4 right-8'].map((pos, i) => (
          <span key={i} style={{ position: 'absolute', fontSize: 32, opacity: 0.15, pointerEvents: 'none' }}
            className={`absolute ${pos}`}>
            {['🌸', '💌', '🌺', '💐'][i]}
          </span>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>💌</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: 'white', marginBottom: 14 }}>
            DigiLove — Send Love Digitally
          </h1>
          <p style={{ fontSize: 16, color: '#d0b0ff', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Distance is no barrier. Send bouquets, cards, voice notes & more — all digitally, all beautifully crafted 💜
          </p>
          <button
            onClick={() => navigate('/bouquet-builder')}
            style={{ background: 'linear-gradient(135deg, #e080c0, #c040a0)', color: 'white', border: 'none', borderRadius: 40, padding: '14px 36px', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 28px rgba(192,64,160,0.45)' }}>
            Start Creating 🌸
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '64px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: '#2d1b3d', marginBottom: 8, textAlign: 'center' }}>
          What You Can Send 💝
        </h2>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 48, textAlign: 'center' }}>
          Six beautiful ways to express your love digitally
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {FEATURES.map(f => (
            <div key={f.title}
              onClick={() => navigate(f.route)}
              style={{ background: f.bg, borderRadius: 24, padding: '32px 28px', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 48px ${f.accent}30`; e.currentTarget.style.borderColor = f.accent + '60'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{f.emoji}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: f.accent, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
              <button
                style={{ background: f.accent, color: 'white', border: 'none', borderRadius: 40, padding: '9px 22px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Try Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'linear-gradient(135deg, #2d1b3d, #4a2060)', padding: '64px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 8 }}>
          How It Works ✨
        </h2>
        <p style={{ color: '#c0a0e0', fontSize: 14, marginBottom: 48 }}>Three simple steps to send digital love</p>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[
            { n: '1', icon: '🎨', title: 'Create', desc: 'Pick your gift type and personalise it with your message, flowers & style.' },
            { n: '2', icon: '💌', title: 'Personalise', desc: 'Add a voice note, card style, recipient name and a heartfelt message.' },
            { n: '3', icon: '🔗', title: 'Share', desc: 'Get a unique link and share it via WhatsApp, Instagram or email instantly.' },
          ].map(step => (
            <div key={step.n} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 24px', width: 240, border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #e080c0, #c040a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: 'white', margin: '0 auto 16px' }}>
                {step.n}
              </div>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ color: 'white', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: '#c0a0e0', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/bouquet-builder')}
          style={{ marginTop: 48, background: 'linear-gradient(135deg, #e080c0, #c040a0)', color: 'white', border: 'none', borderRadius: 40, padding: '14px 40px', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 28px rgba(192,64,160,0.45)' }}>
          Send DigiLove Now 💌
        </button>
      </section>
    </div>
  );
}
