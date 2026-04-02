export default function MagazinePage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fffbea 0%, #fef9c3 50%, #fefce8 100%)',
      fontFamily: "'Georgia', serif",
      padding: '60px 24px',
    }}>
      {/* Magazine cover mockup */}
      <div style={{
        width: 340,
        minHeight: 460,
        background: 'white',
        borderRadius: 4,
        boxShadow: '6px 6px 0 #e5e0c8, 0 20px 60px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #e8e0c0',
      }}>
        {/* Top color band */}
        <div style={{ height: 8, background: 'linear-gradient(90deg, #ca8a04, #fbbf24, #ca8a04)' }} />

        {/* Magazine header */}
        <div style={{ padding: '20px 24px 0', textAlign: 'center', borderBottom: '2px solid #fef08a' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#ca8a04', fontFamily: 'sans-serif', marginBottom: 4 }}>
            FLORIVA PRESENTS
          </div>
          <div style={{
            fontSize: 38, fontWeight: 900, letterSpacing: '-0.02em',
            color: '#1c1a0a', lineHeight: 1, marginBottom: 4,
            fontFamily: "'Georgia', serif", fontStyle: 'italic',
          }}>
            Bloom
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', color: '#92400e', fontFamily: 'sans-serif', paddingBottom: 14 }}>
            THE DIGITAL FLORAL MAGAZINE
          </div>
        </div>

        {/* Cover image placeholder */}
        <div style={{
          height: 200,
          background: 'linear-gradient(160deg, #fef9c3, #fde68a, #fef3c7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
          borderBottom: '1px solid #fef08a',
        }}>
          <div style={{ fontSize: 64 }}>🌸</div>
          <div style={{ fontSize: 11, color: '#92400e', fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
            COVER STORY
          </div>
        </div>

        {/* Headline lines */}
        <div style={{ padding: '18px 24px 24px' }}>
          {[
            { w: '80%', h: 10, mb: 8 },
            { w: '60%', h: 8,  mb: 16 },
            { w: '90%', h: 7,  mb: 6 },
            { w: '70%', h: 7,  mb: 6 },
            { w: '50%', h: 7,  mb: 0 },
          ].map((l, i) => (
            <div key={i} style={{ width: l.w, height: l.h, background: '#fef08a', borderRadius: 4, marginBottom: l.mb }} />
          ))}
        </div>

        {/* Bottom band */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, #ca8a04, #fbbf24, #ca8a04)', position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </div>

      {/* Coming soon text */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>📖</div>
        <h2 style={{
          fontFamily: "'Georgia', serif", fontStyle: 'italic',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#92400e', marginBottom: 8,
        }}>
          Magazine — Coming Soon
        </h2>
        <p style={{ color: '#a16207', fontSize: '0.9rem', fontFamily: 'sans-serif', maxWidth: 360, lineHeight: 1.7 }}>
          Create beautiful digital magazines with your photos, flowers & messages. Share them as a link with your loved ones.
        </p>
      </div>
    </div>
  );
}
