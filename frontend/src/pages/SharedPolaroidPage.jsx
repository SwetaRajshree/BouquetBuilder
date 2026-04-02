import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FILTERS = [
  { id: "none",     css: "" },
  { id: "vintage",  css: "sepia(0.55) contrast(0.9) brightness(1.05)" },
  { id: "bw",       css: "grayscale(1) contrast(1.15) brightness(1.05)" },
  { id: "warm",     css: "sepia(0.2) saturate(1.5) brightness(1.08) hue-rotate(350deg)" },
  { id: "cool",     css: "hue-rotate(20deg) saturate(0.8) brightness(1.12)" },
  { id: "faded",    css: "contrast(0.72) brightness(1.18) saturate(0.6)" },
  { id: "vivid",    css: "saturate(2.0) contrast(1.15) brightness(1.04)" },
  { id: "dramatic", css: "contrast(1.5) brightness(0.92) saturate(1.2)" },
  { id: "pastel",   css: "saturate(0.55) brightness(1.22) contrast(0.82)" },
  { id: "amber",    css: "sepia(0.7) saturate(1.3) brightness(1.1) hue-rotate(345deg)" },
  { id: "chrome",   css: "saturate(1.4) contrast(1.25) brightness(1.05) hue-rotate(5deg)" },
];

const FRAMES = [
  { id: "white",    bg: "#FAFAF7", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "cream",    bg: "#EDE8DF", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "pink",     bg: "#F8E8F0", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "mint",     bg: "#E8F8EE", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "dark",     bg: "#1C1C1A", textColor: "#EDE8DF", dateColor: "#888888" },
  { id: "lavender", bg: "#F0ECF8", textColor: "#1C1C1A", dateColor: "#8A8478" },
];

const SCENES = [
  { id: "none",    bg: null },
  { id: "flowers", bg: "#FFF0F5" },
  { id: "stars",   bg: "#F0EEFF" },
  { id: "spring",  bg: "#F0FFF4" },
  { id: "kawaii",  bg: "#FFF8F0" },
  { id: "hearts",  bg: "#FFF0F5" },
];

function star5pts(cx, cy, ro, ri) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = ((i * 36 - 90) * Math.PI) / 180, r = i % 2 ? ri : ro;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}

function SceneOverlay({ scene, width, height }) {
  if (!scene || scene === "none") return null;
  const w = width, h = height;
  const base = { position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden" };
  if (scene === "flowers") {
    const spots = [[18,18],[w-18,18],[w/2,14],[18,h-18],[w-18,h-18],[w/2,h-14],[14,h/2],[w-14,h/2]];
    return <svg width={w} height={h} style={base}>{spots.map(([x,y],i)=>{const cols=["#FF9EC8","#FFB0D0","#FF80C0","#FFC0E0"],c=cols[i%4],s=10+(i%3)*2;return <g key={i}>{[0,1,2,3,4].map(p=>{const a=(p*72*Math.PI)/180;return <ellipse key={p} cx={x+Math.cos(a)*(s+2)} cy={y+Math.sin(a)*(s+2)} rx={s*0.55} ry={s*0.45} fill={c} opacity="0.55"/>;})}<circle cx={x} cy={y} r={s*0.42} fill="#FFE8F4" opacity="0.9"/><circle cx={x} cy={y} r={s*0.2} fill="#FFB0D0" opacity="0.8"/></g>;})}</svg>;
  }
  if (scene === "stars") return <svg width={w} height={h} style={base}>{Array.from({length:16},(_,i)=>{const x=12+((i*47+13)%(w-24)),y=12+((i*31+7)%(h-24)),s=5+(i%4)*2,cols=["#C8B0FF","#A080FF","#E0C8FF","#FFD0FF"];return <polygon key={i} points={star5pts(x,y,s,s*0.4)} fill={cols[i%4]} opacity={0.35+(i%3)*0.15}/>;})}</svg>;
  if (scene === "spring") return <svg width={w} height={h} style={base}>{[["🌸",10,22],["🌷",w-24,22],["🌼",w/2-8,10],["🌿",10,h-12],["🌸",w-22,h-12],["🍀",w/2-6,h-10],["🌱",10,h/2-8],["🌾",w-20,h/2-8]].map(([e,x,y],i)=><text key={i} x={x} y={y} fontSize="15" opacity="0.65">{e}</text>)}</svg>;
  if (scene === "kawaii") return <svg width={w} height={h} style={base}>{[["🐱",10,22],["🍭",w-24,22],["🎀",w/2-8,12],["🌈",10,h-10],["⭐",w-22,h-10],["🍓",w/2-6,h-10],["🧁",10,h/2],["💜",w-22,h/2]].map(([e,x,y],i)=><text key={i} x={x} y={y} fontSize="15" opacity="0.7">{e}</text>)}</svg>;
  if (scene === "hearts") return <svg width={w} height={h} style={base}>{[[16,18],[w-18,18],[w/2,14],[18,h-16],[w-18,h-16],[w/2,h-14],[12,h/2],[w-14,h/2]].map(([x,y],i)=>{const s=8+(i%3)*2,cols=["#FF80A0","#FF60B0","#FFB0C0","#FF9090"];return <path key={i} d={`M${x},${y+s*0.3} C${x},${y} ${x-s},${y} ${x-s},${y+s*0.3} C${x-s},${y+s*0.7} ${x},${y+s*1.1} ${x},${y+s*1.3} C${x},${y+s*1.1} ${x+s},${y+s*0.7} ${x+s},${y+s*0.3} C${x+s},${y} ${x},${y} ${x},${y+s*0.3}Z`} fill={cols[i%4]} opacity="0.5"/>;})}</svg>;
  return null;
}

function PolaroidView({ state }) {
  const { layout, images, filter, frame, scene, caption, showDate, tilted, stickers } = state;
  const frameData = FRAMES.find(f => f.id === frame) || FRAMES[0];
  const filterCss = (FILTERS.find(f => f.id === filter) || {}).css || "";
  const sceneData = SCENES.find(s => s.id === scene);
  const today = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const bg = scene !== "none" && sceneData?.bg ? sceneData.bg : frameData.bg;

  const dims = {
    classic: { w: 260, sw: 226, sh: 200 },
    strip:   { w: 170, sw: 148, sh: 105 },
    grid:    { w: 270, sw: 114, sh: 100 },
    wide:    { w: 330, sw: 296, sh: 155 },
    trio:    { w: 310, sw: 90,  sh: 110 },
    big5:    { w: 270, sw: 240, sh: 130 },
  }[layout] || { w: 260, sw: 226, sh: 200 };

  const sceneH = { classic: 296, strip: 370, grid: 290, wide: 248, trio: 210, big5: 310 }[layout] || 296;

  const Slot = ({ idx, w, h }) => (
    <div style={{ width: w, height: h, background: "#2a2620", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {images[idx]
        ? <img src={images[idx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: filterCss }} />
        : <span style={{ fontSize: 22, color: "#555" }}>📷</span>
      }
    </div>
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: bg, boxShadow: "0 10px 60px rgba(0,0,0,0.3)", width: dims.w, position: "relative", transform: tilted ? "rotate(-2.5deg)" : "none" }}>
      <SceneOverlay scene={scene} width={dims.w} height={sceneH} />
      <div style={{ position: "relative", zIndex: 6, width: "100%", display: "flex", justifyContent: "center" }}>
        {layout === "classic" && <div style={{ margin: "16px 17px 0" }}><Slot idx={0} w={dims.sw} h={dims.sh} /></div>}
        {layout === "strip"   && <div style={{ padding: "12px 11px 0", display: "flex", flexDirection: "column", gap: 4 }}>{[0,1,2].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "grid"    && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: "14px 14px 0" }}>{[0,1,2,3].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "wide"    && <div style={{ margin: "16px 17px 0" }}><Slot idx={0} w={dims.sw} h={dims.sh} /></div>}
        {layout === "trio"    && <div style={{ padding: "12px 10px 0", display: "flex", gap: 4 }}>{[0,1,2].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "big5"    && <div style={{ padding: "14px 15px 0" }}><Slot idx={0} w={dims.sw} h={dims.sh} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginTop: 4 }}>{[1,2,3,4].map(i => <Slot key={i} idx={i} w={56} h={55} />)}</div></div>}
      </div>
      <div style={{ width: "100%", textAlign: "center", padding: "10px 8px 4px", position: "relative", zIndex: 6 }}>
        {caption && <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: frameData.textColor }}>{caption}</div>}
        {showDate && <div style={{ fontSize: 10, color: frameData.dateColor, paddingBottom: 2 }}>{today}</div>}
      </div>
      <div style={{ height: 14 }} />
      {stickers?.map((stk, i) => (
        <div key={i} style={{ position: "absolute", left: stk.x, top: stk.y, fontSize: 22, pointerEvents: "none", zIndex: 30 }}>{stk.emoji}</div>
      ))}
    </div>
  );
}

export default function SharedPolaroidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gardens/${id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(d => setData(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>📷</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound || !data?.state) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', color: '#EDE8DF', gap: 16, fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '3rem' }}>📷</div>
      <h2>Polaroid not found</h2>
      <p style={{ color: '#888' }}>This link may have expired.</p>
      <button onClick={() => navigate('/digital-gifting')} style={{ padding: '10px 24px', borderRadius: 50, background: '#C8A96E', color: '#1C1C1A', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
        Create Your Own
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#120e06,#0d0d0d)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px 60px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');`}</style>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#C8A96E', fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: 8 }}>
        {data.title}
      </h1>
      <p style={{ color: 'rgba(237,232,223,0.4)', fontSize: '0.85rem', marginBottom: 32 }}>📷 Shared Polaroid</p>
      <PolaroidView state={data.state} />
      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <p style={{ color: 'rgba(237,232,223,0.4)', fontSize: '0.85rem', marginBottom: 14 }}>Want to make your own?</p>
        <button onClick={() => navigate('/digital-gifting')} style={{ padding: '12px 32px', borderRadius: 50, background: 'linear-gradient(135deg,#C8A96E,#a08040)', color: '#1C1C1A', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
          📷 Create Your Polaroid
        </button>
      </div>
    </div>
  );
}
