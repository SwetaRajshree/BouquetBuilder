import { useState, useEffect } from 'react';
const API = import.meta.env.VITE_API_URL;

export default function ReviewDialog({ giftId, onClose }) {
  const [review, setReview]       = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);

  const submit = async () => {
    if (!review.name.trim() || !review.text.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, bouquetId: giftId }),
      });
      setDone(true);
      setTimeout(onClose, 2200);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:24, padding:32, maxWidth:420, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', fontFamily:'sans-serif', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#888' }}>✕</button>
        {done ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌸</div>
            <h3 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#7B0000', marginBottom:8 }}>Thank you!</h3>
            <p style={{ color:'#666', fontSize:14 }}>Your review means the world to us 💝</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>💫</div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#7B0000', marginBottom:4 }}>How was your experience?</h3>
              <p style={{ color:'#888', fontSize:13 }}>Share your thoughts — it helps others spread love too</p>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20 }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setReview(r => ({ ...r, rating: star }))}
                  style={{ background:'none', border:'none', fontSize:28, cursor:'pointer', color: star <= review.rating ? '#f59e0b' : '#ddd' }}>★</button>
              ))}
            </div>
            <input placeholder="Your name" value={review.name}
              onChange={e => setReview(r => ({ ...r, name: e.target.value }))}
              style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #e0e0e0', fontSize:14, marginBottom:10, outline:'none', boxSizing:'border-box' }}
            />
            <textarea placeholder="Tell us about your experience..." value={review.text}
              onChange={e => setReview(r => ({ ...r, text: e.target.value }))}
              rows={3}
              style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'1.5px solid #e0e0e0', fontSize:14, resize:'none', outline:'none', boxSizing:'border-box', marginBottom:16 }}
            />
            <button onClick={submit} disabled={submitting || !review.name.trim() || !review.text.trim()}
              style={{ width:'100%', padding:12, background:'linear-gradient(135deg,#C62828,#7B0000)', color:'white', border:'none', borderRadius:50, fontSize:14, fontWeight:600, cursor:'pointer', opacity:(!review.name.trim()||!review.text.trim())?0.5:1 }}>
              {submitting ? 'Submitting...' : 'Submit Review 🌸'}
            </button>
            <button onClick={onClose}
              style={{ width:'100%', marginTop:8, padding:10, background:'none', border:'none', color:'#aaa', fontSize:13, cursor:'pointer' }}>
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
