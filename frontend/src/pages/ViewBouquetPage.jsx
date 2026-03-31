import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CARD_STYLES = [
  { id:'parchment', name:'Parchment', bg:'linear-gradient(135deg,#fce4f0,#f8d0e8,#f0c8e0)', border:'#d4a0c8' },
  { id:'ivory',     name:'Ivory',     bg:'linear-gradient(135deg,#f5e8c8,#ede0b0,#e8d898)', border:'#c8a860' },
  { id:'blush',     name:'Blush',     bg:'linear-gradient(135deg,#e8f5f0,#d0ece8,#c0e0d8)', border:'#80c0b0' },
  { id:'sage',      name:'Sage',      bg:'linear-gradient(135deg,#fff8f0,#fff0e0,#ffe8d0)', border:'#f0a880' },
  { id:'slate',     name:'Slate',     bg:'linear-gradient(135deg,#f8f5f0,#f0ece0,#e8e0d0)', border:'#d0c8b0' },
  { id:'postcard',  name:'Postcard',  bg:'linear-gradient(135deg,#fffbe8,#fff5d0,#fff0c0)', border:'#d4b840' },
];

const LAYOUTS = {
  classic: [[50,72,1.15,0],[34,64,1.0,-18],[66,64,1.0,18],[20,55,0.88,-28],[80,55,0.88,28],[50,50,0.92,6],[36,46,0.82,-12],[64,46,0.82,12],[50,36,0.86,0],[28,40,0.76,-22],[72,40,0.76,22]],
  cascade: [[50,75,1.15,0],[30,68,1.05,-22],[70,68,1.05,22],[15,58,0.9,-35],[85,58,0.9,35],[38,52,0.88,-10],[62,52,0.88,10],[24,44,0.78,-28],[76,44,0.78,28],[50,42,0.82,5],[44,34,0.72,-15]],
  fan:     [[50,70,1.15,0],[28,60,1.08,-30],[72,60,1.08,30],[10,48,0.9,-50],[90,48,0.9,50],[32,44,0.85,-18],[68,44,0.85,18],[18,36,0.76,-40],[82,36,0.76,40],[50,38,0.8,0],[50,26,0.7,8]],
  round:   [[50,68,1.15,0],[32,58,1.05,-20],[68,58,1.05,20],[22,46,0.92,-32],[78,46,0.92,32],[50,44,0.88,0],[36,36,0.8,-14],[64,36,0.8,14],[50,28,0.78,5],[28,30,0.72,-25],[72,30,0.72,25]],
  wild:    [[48,74,1.15,-5],[30,62,1.08,-25],[72,65,1.02,20],[16,52,0.88,-42],[84,56,0.9,38],[54,48,0.9,12],[34,42,0.8,-8],[68,40,0.84,22],[46,32,0.78,-15],[22,38,0.72,-35],[78,34,0.74,30]],
};

function BouquetDisplay({ selectedFlowers, foliage, bgColor, layout }) {
  const positions = LAYOUTS[layout] || LAYOUTS.classic;
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:420, margin:'0 auto', aspectRatio:'1/1' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'72%', height:'72%', background:bgColor || '#fde8c8', borderRadius:'50%', filter:'blur(18px)', zIndex:0, opacity:0.85 }}/>
      {foliage && (
        <div style={{ position:'absolute', bottom:'4%', left:'50%', transform:'translateX(-50%)', width:'90%', zIndex:1, animation:'sway 5s ease-in-out infinite', transformOrigin:'bottom center' }}>
          <img src={foliage.img} alt={foliage.name} style={{ width:'100%', filter:'drop-shadow(0 8px 16px rgba(0,0,0,0.12))' }}/>
        </div>
      )}
      {(selectedFlowers || []).map((flower, idx) => {
        const pos = positions[idx % positions.length];
        const size = idx < 3 ? 118 : 96;
        return (
          <div key={flower.id + '-' + idx} style={{ position:'absolute', left:pos[0]+'%', top:pos[1]+'%', transform:`translate(-50%,-50%) rotate(${pos[3]}deg) scale(${pos[2]})`, zIndex:2+idx, filter:'drop-shadow(0 6px 12px rgba(0,0,0,0.18))', animation:`floatIn 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.07}s both` }}>
            <img src={flower.img} alt={flower.name} width={size} height={size} style={{ objectFit:'contain', display:'block' }}/>
          </div>
        );
      })}
      <div style={{ position:'absolute', bottom:'2%', left:'50%', transform:'translateX(-50%)', width:'28%', height:'10%', background:'linear-gradient(180deg,#e8c890,#b8904a)', borderRadius:'4px 4px 18px 18px', zIndex:20, boxShadow:'0 4px 14px rgba(160,120,60,0.35)' }}/>
    </div>
  );
}

export default function ViewBouquetPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [review, setReview] = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); return; }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bouquet/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(doc => setData({ b: doc.bouquet, r: doc.recipient, m: doc.message, s: doc.sender, cs: doc.cardStyle, vid: doc.voiceId, sid: doc.spotifyId, mu: doc.musicUrl }))
      .catch(() => setError(true));
  }, [id]);

  // Show review dialog after 8 seconds
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => setShowReview(true), 8000);
    return () => clearTimeout(t);
  }, [data]);

  const submitReview = async () => {
    if (!review.name.trim() || !review.text.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, bouquetId: id }),
      });
      setReviewDone(true);
      setTimeout(() => setShowReview(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = CARD_STYLES.find(c => c.id === data?.cs) || CARD_STYLES[0];

  if (error) return (
    <div style={{ minHeight:'100vh', background:'#c8e8c8', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"Georgia,serif" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🌸</div>
      <div style={{ fontSize:20, color:'#3a6030', marginBottom:8 }}>Invalid or expired bouquet link.</div>
      <button onClick={() => navigate('/bouquet-builder')} style={{ marginTop:16, padding:'14px 32px', background:'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:50, fontSize:13, letterSpacing:2, cursor:'pointer', fontFamily:'sans-serif' }}>
        BUILD YOUR OWN 🌸
      </button>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight:'100vh', background:'#c8e8c8', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:16, color:'#5a7050', fontFamily:'sans-serif', letterSpacing:3 }}>LOADING YOUR BOUQUET...</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#c8e8c8', fontFamily:"Georgia,'Palatino Linotype',serif" }}>
      <style>{`
        @keyframes floatIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.2);} to{opacity:1;} }
        @keyframes sway { 0%,100%{transform:translateX(-50%) rotate(-2.5deg);} 50%{transform:translateX(-50%) rotate(2.5deg);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
      `}</style>

      <div style={{ textAlign:'center', padding:'44px 24px 20px' }}>
        <div style={{ fontSize:12, letterSpacing:7, color:'#5a7050', marginBottom:8, fontFamily:'sans-serif' }}>BLOOM & CRAFT</div>
        <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', color:'#2a3a20', fontWeight:300, margin:'0 0 6px', letterSpacing:2 }}>
          Someone sent you a bouquet 🌸
        </h1>
        <div style={{ width:60, height:2, background:'linear-gradient(90deg,transparent,#5a8050,transparent)', margin:'0 auto' }}/>
      </div>

      <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:600, margin:'0 auto', textAlign:'center' }}>
        <div style={{ background:'rgba(255,255,255,0.65)', borderRadius:32, padding:36, marginBottom:28, backdropFilter:'blur(10px)' }}>
          <BouquetDisplay
            selectedFlowers={data.b?.selectedFlowers}
            foliage={data.b?.foliage}
            bgColor={data.b?.bgColor}
            layout={data.b?.layout}
          />

          {(data.r || data.m || data.s) && (
            <div style={{ marginTop:28, background:cardStyle.bg, border:'2px solid '+cardStyle.border, borderRadius:20, padding:'22px 28px', boxShadow:'0 4px 18px rgba(0,0,0,0.07)', textAlign:'left' }}>
              {data.r && <div style={{ fontSize:15, fontWeight:700, color:'#3a2a18', marginBottom:9 }}>To {data.r},</div>}
              {data.m && <div style={{ fontSize:14, color:'#5a4030', fontStyle:'italic', lineHeight:1.8 }}>{data.m}</div>}
              {data.s && <div style={{ fontSize:13, color:'#7a6050', marginTop:14 }}>— {data.s}</div>}
            </div>
          )}

          {data.mu && (
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:8, textAlign:'center', fontFamily:'sans-serif' }}>🎵 PLAY THIS WITH YOUR BOUQUET</div>
              <audio controls autoPlay loop src={data.mu} style={{ width:'100%', borderRadius:12 }}/>
            </div>
          )}

          {data.vid && (
            <div style={{ marginTop:20, textAlign:'center' }}>
              <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:8, fontFamily:'sans-serif' }}>🎙 VOICE NOTE</div>
              <audio controls src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/voice/${data.vid}`}
                style={{ width:'100%', borderRadius:12 }}/>
              <div style={{ fontSize:10, color:'#9a8a70', marginTop:6, fontFamily:'sans-serif' }}>This voice note will expire in 7 days</div>
            </div>
          )}

          {data.sid && (
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:8, textAlign:'center', fontFamily:'sans-serif' }}>🎵 PLAY THEIR SONG FOR YOU</div>
              <iframe
                src={`https://open.spotify.com/embed/track/${data.sid}?utm_source=generator&theme=0`}
                width="100%" height="80" frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy" style={{ borderRadius:12 }}
              />
            </div>
          )}
        </div>

        <button onClick={() => navigate('/bouquet-builder')}
          style={{ padding:'16px 44px', background:'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:50, fontSize:14, letterSpacing:3, cursor:'pointer', fontFamily:'sans-serif', boxShadow:'0 8px 28px rgba(60,100,48,0.38)' }}>
          BUILD YOUR OWN 🌸
        </button>
      </div>

      {/* REVIEW DIALOG */}
      {showReview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'white', borderRadius:24, padding:32, maxWidth:420, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', fontFamily:'sans-serif', position:'relative' }}>
            <button onClick={() => setShowReview(false)}
              style={{ position:'absolute', top:16, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#888' }}>✕</button>

            {reviewDone ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🌸</div>
                <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#3a6030', marginBottom:8 }}>Thank you!</h3>
                <p style={{ color:'#666', fontSize:14 }}>Your review means the world to us 💚</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign:'center', marginBottom:20 }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>💫</div>
                  <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#3a6030', marginBottom:4 }}>How was your experience?</h3>
                  <p style={{ color:'#888', fontSize:13 }}>Share your thoughts — it helps others spread love too</p>
                </div>

                {/* Star rating */}
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20 }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReview(r => ({ ...r, rating: star }))}
                      style={{ background:'none', border:'none', fontSize:28, cursor:'pointer', color: star <= review.rating ? '#f59e0b' : '#ddd', transition:'transform 0.1s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.2)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'}>
                      ★
                    </button>
                  ))}
                </div>

                <input
                  placeholder="Your name"
                  value={review.name}
                  onChange={e => setReview(r => ({ ...r, name: e.target.value }))}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #e0e0e0', fontSize:14, marginBottom:10, outline:'none', boxSizing:'border-box' }}
                />
                <textarea
                  placeholder="Tell us about your experience..."
                  value={review.text}
                  onChange={e => setReview(r => ({ ...r, text: e.target.value }))}
                  rows={3}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #e0e0e0', fontSize:14, resize:'none', outline:'none', boxSizing:'border-box', marginBottom:16 }}
                />
                <button onClick={submitReview} disabled={submitting || !review.name.trim() || !review.text.trim()}
                  style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:50, fontSize:14, fontWeight:600, cursor:'pointer', opacity: (!review.name.trim() || !review.text.trim()) ? 0.5 : 1 }}>
                  {submitting ? 'Submitting...' : 'Submit Review 🌸'}
                </button>
                <button onClick={() => setShowReview(false)}
                  style={{ width:'100%', marginTop:8, padding:'10px', background:'none', border:'none', color:'#aaa', fontSize:13, cursor:'pointer' }}>
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
