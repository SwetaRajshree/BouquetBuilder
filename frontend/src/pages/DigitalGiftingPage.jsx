import { useNavigate } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';

const GardenOfFlowers   = lazy(() => import('../components/GardenOfFlowers'));
const PolaroidBooth     = lazy(() => import('../components/PolaroidBooth'));
const MagazinePage      = lazy(() => import('../components/MagazinePage'));
const VoiceNoteKeepsake = lazy(() => import('../components/VoiceNoteKeepsake'));

function LoadingSpinner() {
  return (
    <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const OPTIONS = [
  { id: 'digitalbouquet', label: 'Digital Bouquet',   icon: '💐', desc: 'Build a stunning digital bouquet with hand-drawn flowers & send with a heartfelt message.',  bg: 'linear-gradient(135deg,#ffe8ed,#ffd0d8)', accent: '#a86870' },
  { id: 'postcard',       label: 'Postcard',           icon: '💌', desc: 'Create a beautiful personalised postcard with your message, stickers and a custom design.',    bg: 'linear-gradient(135deg,#e8d5ff,#d8c0ff)', accent: '#7a5a9a' },
  { id: 'cassette',       label: 'Voice Keepsake',     icon: '🎙️', desc: 'Record a heartfelt voice message and attach it to your bouquet — your voice, their heart.',    bg: 'linear-gradient(135deg,#fff0d0,#ffe4b0)', accent: '#8a6020' },
  { id: 'magazine',       label: 'Magazine',           icon: '📖', desc: 'Design a gorgeous magazine-style page filled with your photos, flowers and love notes.',        bg: 'linear-gradient(135deg,#fce8ff,#f0d0ff)', accent: '#8a30a0' },
  { id: 'garden',         label: 'Garden of Flowers',  icon: '🌻', desc: 'Plant a virtual garden of flowers and share the link with someone special to brighten their day.', bg: 'linear-gradient(135deg,#d4f0d4,#c0e8c0)', accent: '#3a7a3a' },
  { id: 'polaroid',       label: 'Polaroid Booth',     icon: '📸', desc: 'Design a cute polaroid-style photo card with flowers, stickers and a personal message.',       bg: 'linear-gradient(135deg,#d0f0ff,#b8e4ff)', accent: '#1060a0' },
];

export default function DigitalGiftingPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (id) => {
    setActiveMenu(id);
    setMenuOpen(false);
    if (id === 'postcard') navigate('/postcard');
  };

  const activeOption = OPTIONS.find(o => o.id === activeMenu);

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f8' }}>

      {/* ── Top bar with title + hamburger ── */}
      <div style={{
        position: 'sticky', top: 62, zIndex: 40,
        background: 'white', borderBottom: '1px solid #f0d0d8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeMenu && (
            <button onClick={() => setActiveMenu(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#a86870', padding: '4px 8px' }}>
              ←
            </button>
          )}
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: '#8a5560' }}>
            {activeOption ? `${activeOption.icon} ${activeOption.label}` : '💌 DigiLove'}
          </span>
        </div>

        {/* Hamburger button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              background: menuOpen ? '#a86870' : '#fff0f2',
              border: '1.5px solid #f0c0c8', borderRadius: 10,
              width: 40, height: 40, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.2s',
            }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 18, height: 2, borderRadius: 2,
                background: menuOpen ? 'white' : '#a86870',
                transition: 'all 0.2s',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 2 ? 'rotate(-45deg) translate(5px,-5px)'
                  : 'scaleX(0)'
                  : 'none',
              }}/>
            ))}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
              <div style={{
                position: 'absolute', right: 0, top: 48, zIndex: 50,
                background: 'white', borderRadius: 16,
                boxShadow: '0 8px 32px rgba(168,104,112,0.2)',
                border: '1px solid #f0d0d8', overflow: 'hidden', minWidth: 200,
                animation: 'dropIn 0.2s ease both',
              }}>
                <style>{`@keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>
                {OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => handleSelect(opt.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: activeMenu === opt.id ? '#fff0f2' : 'white',
                      borderLeft: activeMenu === opt.id ? `3px solid ${opt.accent}` : '3px solid transparent',
                      transition: 'all 0.15s',
                      fontSize: 13, fontWeight: activeMenu === opt.id ? 600 : 400,
                      color: activeMenu === opt.id ? opt.accent : '#6b5060',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff0f2'}
                    onMouseLeave={e => e.currentTarget.style.background = activeMenu === opt.id ? '#fff0f2' : 'white'}
                  >
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── All 6 option cards (shown when no active menu) ── */}
      {!activeMenu && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: '#8a5560', marginBottom: 8, textAlign: 'center' }}>
            Choose Your Digital Gift 🎁
          </h2>
          <p style={{ textAlign: 'center', color: '#9a7d88', fontSize: 14, marginBottom: 36 }}>
            Pick the perfect way to express your feelings
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {OPTIONS.map(opt => (
              <div key={opt.id}
                onClick={() => handleSelect(opt.id)}
                style={{
                  background: opt.bg, borderRadius: 20, padding: '28px 24px',
                  cursor: 'pointer', border: '2px solid transparent',
                  transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(168,104,112,0.08)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${opt.accent}30`; e.currentTarget.style.borderColor = opt.accent + '60'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(168,104,112,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div style={{ fontSize: 48, marginBottom: 14 }}>{opt.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: opt.accent, marginBottom: 8 }}>{opt.label}</h3>
                <p style={{ fontSize: 13, color: '#6b5060', lineHeight: 1.7, marginBottom: 18 }}>{opt.desc}</p>
                <button style={{
                  background: opt.accent, color: 'white', border: 'none',
                  borderRadius: 40, padding: '8px 20px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  Open →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active content ── */}
      {activeMenu === 'digitalbouquet' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '💐', title: 'Build a Bouquet',    desc: 'Pick flowers, foliage & layout — then send with a card.',        route: '/bouquet-builder', accent: '#a86870', bg: 'linear-gradient(135deg,#ffe8ed,#ffd0d8)' },
              { icon: '🎵', title: 'Bouquet + Song',     desc: 'Pair your bouquet with a Spotify song for the ultimate gesture.', route: '/bouquet-builder', accent: '#3a7a3a', bg: 'linear-gradient(135deg,#d4f0d4,#c0e8c0)' },
              { icon: '🎙️', title: 'Bouquet + Voice',    desc: 'Record a voice note and attach it to your digital bouquet.',      route: '/bouquet-builder', accent: '#8a6020', bg: 'linear-gradient(135deg,#fff0d0,#ffe4b0)' },
              { icon: '💌', title: 'Bouquet + Card',     desc: 'Add a beautiful digital card with stickers & your message.',      route: '/digital-card',   accent: '#7a5a9a', bg: 'linear-gradient(135deg,#e8d5ff,#d8c0ff)' },
            ].map(g => (
              <div key={g.title} onClick={() => navigate(g.route)}
                style={{ background: g.bg, borderRadius: 20, padding: '28px 24px', cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 14px 36px ${g.accent}30`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{g.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: g.accent, marginBottom: 8 }}>{g.title}</h3>
                <p style={{ fontSize: 13, color: '#6b5060', lineHeight: 1.6, marginBottom: 16 }}>{g.desc}</p>
                <button style={{ background: g.accent, color: 'white', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Start →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMenu === 'garden'   && <Suspense fallback={<LoadingSpinner />}><GardenOfFlowers /></Suspense>}
      {activeMenu === 'polaroid' && <Suspense fallback={<LoadingSpinner />}><PolaroidBooth /></Suspense>}
      {activeMenu === 'magazine' && <Suspense fallback={<LoadingSpinner />}><MagazinePage /></Suspense>}
      {activeMenu === 'cassette' && <Suspense fallback={<LoadingSpinner />}><VoiceNoteKeepsake /></Suspense>}
    </div>
  );
}
