import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GIFT_SHOPS = [
  {
    name: 'HeartArt by Sweta',
    tag: 'Handcrafted Hampers',
    desc: 'Beautifully curated gift hampers with flowers, chocolates & personal touches.',
    emoji: '🎀',
    ig: 'https://www.instagram.com/heartartbysweta?igsh=eXQ0eHJ0c3RsOGdk',
    headerBg: 'linear-gradient(135deg,#2c1a00,#4a3000)',
    avatarBg: 'linear-gradient(135deg,#c9a84c,#a8863a)',
    shopLabel: '🧺 Shop Hampers',
    shopRoute: '/gift-hampers',
    handle: '@heartartbysweta',
    reels: [
      { url: 'https://www.instagram.com/reel/DPtTDvPE-gn/?igsh=OWdtMWh0d2xvNG4z', emoji: '🌹', label: 'Rose Hamper' },
      { url: 'https://www.instagram.com/reel/DRhiPyZk4pR/?igsh=djJkajk2eWJ4dWZz', emoji: '🌸', label: 'Floral Box' },
      { url: 'https://www.instagram.com/reel/DOn76waDzlk/?igsh=MXV0c2s0Zzl6dm9hYg==', emoji: '💐', label: 'Mixed Blooms' },
      { url: 'https://www.instagram.com/reel/DPtssgQkuHf/?igsh=MW42dDRoamZ6ZHd3cg==', emoji: '🌷', label: 'Tulip Set' },
      { url: 'https://www.instagram.com/reel/DR3mcNuAVIW/?igsh=cmNqYzlqNTg0NWs2', emoji: '🌺', label: 'Hibiscus Art' },
      { url: 'https://www.instagram.com/reel/DVqpn0fjAOb/?igsh=MWY5YWgydDJtcDYyMw==', emoji: '🪷', label: 'Lotus Craft' },
    ],
  },
  {
    name: 'Jewellery Studio',
    tag: 'Fine Jewellery & Accessories',
    desc: 'Handcrafted jewellery pieces — rings, necklaces, earrings & more, made with love.',
    emoji: '💎',
    ig: 'https://www.instagram.com/',
    headerBg: 'linear-gradient(135deg,#1a0a2e,#2d1b3d)',
    avatarBg: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    shopLabel: '💎 Shop Jewellery',
    shopRoute: '/collection',
    handle: '@jewellery',
    reels: [
      { url: 'https://www.instagram.com/reel/DVyX-OTD4TO/?igsh=MTUwZmt4aWZmb3VzbQ==', emoji: '💍', label: 'Ring Collection' },
      { url: 'https://www.instagram.com/p/DQT9H5Ikp0j/?img_index=3&igsh=ZWtheXQ5ajZnbmdi', emoji: '📿', label: 'Necklaces' },
      { url: 'https://www.instagram.com/reel/DOvpbLukv3T/?igsh=MTYwbWtobXBnYnprbg==', emoji: '✨', label: 'New Arrivals' },
      { url: 'https://www.instagram.com/p/DVyte8DEwGx/?img_index=1&igsh=Z3J5b3Vkb3B5cmJo', emoji: '💛', label: 'Gold Pieces' },
      { url: 'https://www.instagram.com/p/DRJqu6SEnIM/?igsh=MWw4YzVhNzVxMzd4Yw==', emoji: '🌸', label: 'Floral Jewels' },
      { url: 'https://www.instagram.com/p/DRCpeNGEsO-/?img_index=2&igsh=djZxZGx6NDdjbWM4', emoji: '💜', label: 'Statement Pieces' },
    ],
  },
];

export default function GiftShopsPage() {
  const navigate = useNavigate();
  const [hoveredShop, setHoveredShop] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: 'linear-gradient(145deg,#fdf8f0,#fdf4dc,#fdf0e8)', minHeight: '100vh' }}>
      <style>{`
        @keyframes floatUp { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes shimmer { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        .reel-card { flex-shrink:0; width:110px; border-radius:14px; overflow:hidden; border:2px solid rgba(255,255,255,0.15); transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; background:rgba(255,255,255,0.06); text-decoration:none; display:block; }
        .reel-card:hover { transform:translateY(-8px) scale(1.05); border-color:rgba(255,182,193,0.7); box-shadow:0 20px 40px rgba(0,0,0,0.35); }
        .cat-card { border-radius:18px; padding:24px 20px; text-align:center; cursor:pointer; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); border:2px solid transparent; }
        .cat-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(201,168,76,0.2); border-color:#f0d898; }
        .shop-card { border-radius:24px; overflow:hidden; transition:all 0.3s ease; }
        .shop-card:hover { transform:translateY(-4px); box-shadow:0 24px 60px rgba(44,26,46,0.15); }
      `}</style>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#2c1a00,#4a3000,#1e1200)', padding: '60px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position:'absolute', top:-60, left:'20%', width:300, height:300, background:'rgba(201,168,76,0.2)', borderRadius:'50%', filter:'blur(60px)' }}/>
        <div style={{ position:'absolute', bottom:-40, right:'15%', width:200, height:200, background:'rgba(232,71,106,0.12)', borderRadius:'50%', filter:'blur(50px)' }}/>
        <button onClick={() => navigate(-1)}
          style={{ position:'absolute', top:20, left:24, display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 16px', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)' }}>
          ← Back
        </button>
        <div style={{ fontSize:64, marginBottom:12, animation:'floatUp 3s ease-in-out infinite' }}>🧺</div>
        <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:900, color:'#f0d898', letterSpacing:4, textTransform:'uppercase' }}>Curated with Love</p>
        <h1 style={{ margin:'0 0 14px', fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.15 }}>
          Gift Shops &{' '}
          <span style={{ background:'linear-gradient(90deg,#f0d898,#c9a84c,#e8476a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Hamper Studios
          </span>
        </h1>
        <p style={{ margin:'0 auto 32px', fontSize:15, color:'rgba(253,248,240,0.75)', maxWidth:480, lineHeight:1.7 }}>
          Discover handcrafted gift hampers, floral boxes & curated sets from our partner shops
        </p>
        <button onClick={() => navigate('/gift-hampers')}
          style={{ padding:'12px 28px', background:'linear-gradient(135deg,#c9a84c,#a8863a)', color:'#fff', border:'none', borderRadius:40, fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 6px 22px rgba(201,168,76,0.45)' }}>
          🛍️ Browse All Hampers
        </button>
      </div>

      <div style={{ maxWidth:1160, margin:'0 auto', padding:'48px 22px 80px' }}>

        {/* Featured Shops */}
        <div>
          <h2 style={{ fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, color:'#2c1a2e', marginBottom:6 }}>🏪 Featured Gift Studios</h2>
          <p style={{ fontSize:13, color:'#9a8a94', marginBottom:28 }}>Handpicked shops loved by our community</p>

          {GIFT_SHOPS.map((shop, si) => (
            <div key={si} className="shop-card" style={{ background:'#fff', border:'1.5px solid #f0e8eb', marginBottom:32 }}>
              <div style={{ background:shop.headerBg, padding:'28px 28px 24px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:shop.avatarBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {shop.emoji}
                </div>
                <div style={{ flex:1 }}>
                  <h3 style={{ margin:'0 0 4px', fontSize:20, fontWeight:900, color:'#fff' }}>{shop.name}</h3>
                  <p style={{ margin:'0 0 6px', fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>{shop.tag}</p>
                  <p style={{ margin:0, fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>{shop.desc}</p>
                </div>
                <a href={shop.ig} target="_blank" rel="noreferrer"
                  style={{ flexShrink:0, padding:'10px 20px', background:'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', color:'white', border:'none', borderRadius:40, fontSize:12, fontWeight:700, cursor:'pointer', textDecoration:'none', whiteSpace:'nowrap' }}>
                  📸 Follow
                </a>
              </div>

              <div style={{ padding:'24px 28px' }}>
                <p style={{ margin:'0 0 14px', fontSize:12, fontWeight:700, color:'#9a8a94', letterSpacing:1, textTransform:'uppercase' }}>✨ Latest Posts & Reels</p>
                <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none' }}>
                  {shop.reels.map((reel, i) => (
                    <a key={i} href={reel.url} target="_blank" rel="noreferrer" className="reel-card">
                      <div style={{ width:'100%', aspectRatio:'9/16', background:`linear-gradient(135deg,hsl(${260+i*20},60%,20%),hsl(${280+i*15},70%,30%))`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                        <span style={{ fontSize:30, animation:`shimmer ${2+i*0.3}s ease-in-out infinite` }}>{reel.emoji}</span>
                        <span style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontFamily:'sans-serif', letterSpacing:1 }}>▶ VIEW</span>
                      </div>
                      <div style={{ padding:'8px 10px', background:'rgba(20,10,40,0.95)' }}>
                        <p style={{ margin:0, fontSize:10, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{reel.label}</p>
                        <p style={{ margin:'2px 0 0', fontSize:9, color:'rgba(255,255,255,0.4)' }}>{shop.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ display:'flex', gap:12, marginTop:20, flexWrap:'wrap' }}>
                  <a href={shop.ig} target="_blank" rel="noreferrer"
                    style={{ padding:'11px 24px', background:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color:'white', border:'none', borderRadius:40, fontSize:13, fontWeight:700, cursor:'pointer', textDecoration:'none', boxShadow:'0 4px 16px rgba(220,39,67,0.35)' }}>
                    📸 View Instagram Profile
                  </a>
                  <button onClick={() => navigate(shop.shopRoute)}
                    style={{ padding:'11px 24px', background:shop.avatarBg, color:'white', border:'none', borderRadius:40, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(100,50,200,0.25)' }}>
                    {shop.shopLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', background:'linear-gradient(135deg,#2c1a00,#4a3000)', borderRadius:24, padding:'48px 32px' }}>
          <div style={{ fontSize:48, marginBottom:12, animation:'floatUp 3s ease-in-out infinite' }}>🎁</div>
          <h3 style={{ margin:'0 0 10px', fontSize:'clamp(1.3rem,3vw,1.8rem)', fontWeight:900, color:'#fff' }}>Want to List Your Gift Shop?</h3>
          <p style={{ margin:'0 auto 24px', fontSize:14, color:'rgba(253,248,240,0.7)', maxWidth:400, lineHeight:1.7 }}>
            Partner with BouquetBuilder and reach thousands of customers looking for the perfect gift.
          </p>
          <button onClick={() => navigate('/account?tab=contact')}
            style={{ padding:'13px 32px', background:'linear-gradient(135deg,#c9a84c,#a8863a)', color:'white', border:'none', borderRadius:40, fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:'0 6px 22px rgba(201,168,76,0.45)' }}>
            📩 Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
