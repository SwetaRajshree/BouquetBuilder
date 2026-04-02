import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SharedGardenPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [garden, setGarden] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gardens/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setGarden(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f2ede2' }}>
      <div style={{ fontSize:'2rem', animation:'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f2ede2', fontFamily:"'Walter Turncoat',cursive", gap:16 }}>
      <div style={{ fontSize:'3rem' }}>🌿</div>
      <h2 style={{ color:'#2d5a1e', fontSize:'1.4rem' }}>Garden not found</h2>
      <p style={{ color:'#888', fontSize:'0.9rem' }}>This garden link may have expired or doesn't exist.</p>
      <button onClick={() => navigate('/digital-gifting')} style={{ marginTop:8, padding:'10px 24px', borderRadius:50, background:'#2d6015', color:'white', border:'none', cursor:'pointer', fontSize:'0.9rem' }}>
        Create Your Own Garden 🌸
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f2ede2,#e8f5e0)', display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px 60px', fontFamily:"'Walter Turncoat',cursive" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Walter+Turncoat&display=swap');`}</style>

      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🌸</div>
        <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#2d5a1e', margin:0, letterSpacing:'0.02em' }}>
          {garden.title}
        </h1>
        <p style={{ color:'#7a9a6a', fontSize:'0.88rem', marginTop:8 }}>
          ✿ {garden.flowerCount} flower{garden.flowerCount !== 1 ? 's' : ''} planted with love ✿
        </p>
      </div>

      <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 12px 48px rgba(45,96,21,0.2)', maxWidth:700, width:'100%' }}>
        <img src={garden.image} alt={garden.title} style={{ width:'100%', display:'block' }} />
      </div>

      <div style={{ marginTop:36, textAlign:'center' }}>
        <p style={{ color:'#7a9a6a', fontSize:'0.88rem', marginBottom:16 }}>Want to create your own garden?</p>
        <button onClick={() => navigate('/digital-gifting')} style={{ padding:'12px 32px', borderRadius:50, background:'linear-gradient(135deg,#2d6015,#4a8a2a)', color:'white', border:'none', cursor:'pointer', fontSize:'0.95rem', fontFamily:"'Walter Turncoat',cursive", boxShadow:'0 6px 20px rgba(45,96,21,0.3)', letterSpacing:'0.04em' }}>
          🌱 Plant Your Own Garden
        </button>
      </div>
    </div>
  );
}
