import { useState, useEffect, useRef, useCallback } from "react";
const API = import.meta.env.VITE_API_URL;

const PAPER_COLORS = [
  "#C0392B","#E74C3C","#CB4335","#B03A2E","#D98880",
  "#F1948A","#CD6155","#A93226","#E55B4D","#EC7063",
  "#E8B4B8","#D4A5A5","#C9806E","#B85450",
];


const seededRand = (seed) => {
  let s = (seed + 1) * 7919;
  return () => { s = Math.imul(s ^ (s >>> 13), 0x4f8f3a01) >>> 0; return s / 0xffffffff; };
};

const buildHeartProps = (reviews) => reviews.map((_, i) => {
  const rand = seededRand(i * 31 + 7);
  const total = reviews.length;
  const cols = total <= 3 ? total : Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = Math.max(8, Math.min(88, (col / Math.max(cols - 1, 1)) * 70 + 12 + (rand() - 0.5) * 10));
  const y = Math.max(5, Math.min(88, (row / Math.max(rows - 1, 1)) * 75 + 8 + (rand() - 0.5) * 10));
  return { x, y, size:19+rand()*15, rotation:(rand()-0.5)*75, zIdx:Math.floor(rand()*22),
    color:PAPER_COLORS[Math.floor(rand()*PAPER_COLORS.length)],
    floatDuration:3.2+rand()*4.5, floatDelay:rand()*6,
    swayX:(rand()-0.5)*7, swayY:(rand()-0.5)*5, rotateSway:(rand()-0.5)*14, shadow:0.07+rand()*0.15 };
});

// ─── PAPER HEART SVG ─────────────────────────────────────────────────────────
const PaperHeart = ({ size, color, rotation, style = {} }) => {
  const darkenColor = (hex, amt) => {
    const num = parseInt((hex || "#C0392B").replace("#",""), 16);
    const r = Math.max(0, ((num >> 16) & 255) - amt);
    const g = Math.max(0, ((num >> 8) & 255) - amt);
    const b = Math.max(0, (num & 255) - amt);
    return `rgb(${r},${g},${b})`;
  };
  const safeColor = color || "#C0392B";
  const stroke = darkenColor(safeColor, 45);
  const crease = darkenColor(safeColor, 25);
  const uid = `ph${(safeColor+size).replace(/[^a-z0-9]/gi,"")}`;
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 94"
      style={{ transform: `rotate(${rotation}deg)`, display:"block", ...style }}
    >
      <defs>
        <filter id={`${uid}tx`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n" result="gn"/>
          <feBlend in="SourceGraphic" in2="gn" mode="multiply" result="bl"/>
          <feComposite in="bl" in2="SourceGraphic" operator="in"/>
        </filter>
        <linearGradient id={`${uid}g`} x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor={safeColor}/>
          <stop offset="60%" stopColor={safeColor}/>
          <stop offset="100%" stopColor={crease}/>
        </linearGradient>
        <linearGradient id={`${uid}hi`} x1="0%" y1="0%" x2="90%" y2="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.30)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      {/* Heart body with paper texture */}
      <path
        d="M50 90 C50 90 4 57 4 29 C4 14 14 3 28 3 C37 3 45 9 50 16 C55 9 63 3 72 3 C86 3 96 14 96 29 C96 57 50 90 50 90Z"
        fill={`url(#${uid}g)`} stroke={stroke} strokeWidth="1.8"
        filter={`url(#${uid}tx)`}
      />
      {/* Crease / fold line */}
      <path d="M50 16 L50 90" stroke={crease} strokeWidth="0.7" strokeOpacity="0.35" strokeDasharray="2.5,5"/>
      {/* Highlight */}
      <path
        d="M50 90 C50 90 4 57 4 29 C4 14 14 3 28 3 C37 3 45 9 50 16 C55 9 63 3 72 3 C86 3 96 14 96 29 C96 57 50 90 50 90Z"
        fill={`url(#${uid}hi)`} opacity="0.42"
      />
      {/* Dog-ear */}
      <path d="M72 3 L81 11 L77 7Z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  );
};

const Sparkle = ({ x, y, delay, size = 10 }) => (
  <div style={{ position:"absolute", left:`${x}%`, top:`${y}%`, animation:`sSparkle 2.6s ${delay}s ease-in-out infinite`, pointerEvents:"none", zIndex:40 }}>
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2L13.8 10.2L22 12L13.8 13.8L12 22L10.2 13.8L2 12L10.2 10.2Z" fill="#FFD6E0"/>
    </svg>
  </div>
);

const FloatUp = ({ x, delay, duration, color }) => (
  <div style={{
    position:"absolute", left:`${x}%`, bottom:"22%", pointerEvents:"none", zIndex:60,
    animation:`sFloatUp ${duration}s ${delay}s ease-out forwards`,
  }}>
    <PaperHeart size={16} color={color} rotation={(Math.random()-0.5)*40}/>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function HeartJarReviews() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);

  const toEntries = (data) => buildHeartProps(data).map((hp, i) => ({ ...data[i], hp }));

  useEffect(() => {
    const load = () =>
      fetch(`${API}/api/reviews`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data) && data.length > 0) setEntries(toEntries(data)); })
        .catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const submitReview = async () => {
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`${API}/api/reviews`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const saved = await res.json();
      setEntries(prev => toEntries([saved, ...prev.map(({ hp, ...r }) => r)]));
      setDone(true);
      setForm({ name: '', text: '', rating: 5 });
      setTimeout(() => { setDone(false); setShowForm(false); }, 2500);
    } catch(e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const [isOpen, setIsOpen]       = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [clicked, setClicked]     = useState(null);
  const [popupPos, setPopupPos]   = useState({ x:50, y:50 });
  const [floaters, setFloaters]   = useState([]);
  const jarRef  = useRef(null);
  const nextId  = useRef(0);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      const hearts = Array.from({ length: 24 }, (_, i) => ({
        id: nextId.current++,
        x: 16 + Math.random() * 68,
        delay: i * 0.08,
        duration: 1.5 + Math.random() * 1.3,
        color: PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)],
      }));
      setFloaters(hearts);
      setTimeout(() => setFloaters([]), 5000);
    }, 1150);
  };

  useEffect(() => {
    const close = () => setClicked(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleHeartClick = useCallback((e, review) => {
    e.stopPropagation();
    if (!isOpen) return;
    const rect    = e.currentTarget.getBoundingClientRect();
    const jarRect = jarRef.current?.getBoundingClientRect();
    const px = ((rect.left + rect.width/2 - (jarRect?.left||0)) / (jarRect?.width||1)) * 100;
    const py = rect.top - (jarRect?.top||0) - 10;
    setPopupPos({ x: px, y: py });
    setClicked(review);
  }, [isOpen]);

  const capOpen = isOpen || isOpening;
  const sparkles = [
    {x:3,y:9,delay:0},{x:94,y:7,delay:0.8},{x:2,y:74,delay:1.3},
    {x:97,y:62,delay:0.5},{x:50,y:0,delay:1.1},{x:7,y:47,delay:1.8},
    {x:93,y:36,delay:0.3},{x:26,y:97,delay:1.6},{x:74,y:96,delay:1.0},
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#fff5f7 0%,#ffeaee 55%,#ffdde4 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif",
      padding:"40px 20px 60px", position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes sFloat {
          0%,100%{transform:translate(0,0) rotate(var(--rot));}
          30%{transform:translate(var(--sx),var(--sy)) rotate(calc(var(--rot) + var(--rr)));}
          70%{transform:translate(calc(var(--sx)*-0.5),calc(var(--sy)*0.6)) rotate(calc(var(--rot) - var(--rr)*0.6));}
        }
        @keyframes sFloatUp {
          0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1;}
          100%{transform:translateY(-210px) rotate(40deg) scale(0.4);opacity:0;}
        }
        @keyframes sSparkle {
          0%,100%{opacity:0;transform:scale(0.2) rotate(0deg);}
          50%{opacity:1;transform:scale(1.4) rotate(190deg);}
        }
        @keyframes sPopIn {
          0%{transform:scale(0.35) translateY(10px);opacity:0;}
          60%{transform:scale(1.08) translateY(-2px);opacity:1;}
          100%{transform:scale(1) translateY(0);opacity:1;}
        }
        @keyframes sHeartbeat {
          0%,100%{transform:scale(1);}
          14%{transform:scale(1.14);}
          28%{transform:scale(1);}
          42%{transform:scale(1.07);}
        }
        @keyframes sTitleFloat {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-6px);}
        }
        @keyframes sCapLift {
          0%{transform:translate(-50%,0px) rotate(0deg);}
          35%{transform:translate(-50%,-44px) rotate(-20deg);}
          65%{transform:translate(-50%,-85px) rotate(-10deg);}
          100%{transform:translate(-50%,-110px) rotate(-3deg);}
        }
        @keyframes sCapFloat {
          0%,100%{transform:translate(-50%,-110px) rotate(-3deg);}
          33%{transform:translate(-52%,-128px) rotate(4deg);}
          66%{transform:translate(-48%,-118px) rotate(-5deg);}
        }
        @keyframes sCapShake {
          0%,100%{transform:translate(-50%,0) rotate(0deg);}
          20%{transform:translate(-50%,0) rotate(-2.5deg);}
          40%{transform:translate(-50%,0) rotate(2.5deg);}
          60%{transform:translate(-50%,0) rotate(-1.5deg);}
          80%{transform:translate(-50%,0) rotate(1.5deg);}
        }
        @keyframes sRibbon {
          0%,100%{transform:rotate(-4deg) scale(1);}
          50%{transform:rotate(4deg) scale(1.06);}
        }
        @keyframes sBgOrb {
          0%,100%{transform:scale(1) translate(0,0);}
          50%{transform:scale(1.1) translate(14px,-11px);}
        }
        @keyframes sPulse {
          0%,100%{transform:scale(1);}
          50%{transform:scale(1.05);}
        }
        @keyframes sGlow {
          0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.25);}
          50%{box-shadow:0 0 0 10px rgba(192,57,43,0);}
        }
        @keyframes sHoverPop {
          0%{transform:rotate(var(--rot)) scale(1);}
          55%{transform:rotate(var(--rot)) scale(1.65);}
          100%{transform:rotate(var(--rot)) scale(1.5);}
        }
      `}</style>

      {/* BG orbs */}
      {[{w:280,h:280,t:6,l:3,c:"#FFDDE5",d:7},{w:210,h:210,t:72,l:82,c:"#FFB3C6",d:9},
        {w:170,h:170,t:28,l:58,c:"#FFC8D5",d:6},{w:320,h:320,t:82,l:8,c:"#FFE4EC",d:8}
      ].map((o,i)=>(
        <div key={i} style={{
          position:"fixed",width:`${o.w}px`,height:`${o.h}px`,borderRadius:"50%",
          background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
          top:`${o.t}%`,left:`${o.l}%`,transform:"translate(-50%,-50%)",
          animation:`sBgOrb ${o.d}s ${i*1.3}s ease-in-out infinite`,
          pointerEvents:"none",opacity:0.5,
        }}/>
      ))}

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:"30px",zIndex:10,position:"relative"}}>
        <h1 style={{
          fontSize:"clamp(24px,4.2vw,44px)",fontWeight:"700",color:"#8B1A1A",
          margin:0,animation:"sTitleFloat 4s ease-in-out infinite",
          textShadow:"0 3px 22px rgba(139,26,26,0.13)",letterSpacing:"-0.2px",
        }}>💌 Our Love Letters</h1>
        <p style={{color:"#A93226",fontSize:"clamp(12px,1.7vw,14.5px)",marginTop:"8px",fontStyle:"italic",margin:"8px 0 0"}}>
          Every little paper heart holds a real customer review
        </p>
        <div style={{
          display:"inline-flex",alignItems:"center",gap:"8px",marginTop:"10px",
          background:"rgba(255,255,255,0.74)",backdropFilter:"blur(14px)",
          borderRadius:"999px",padding:"5px 20px",border:"1.5px solid rgba(180,58,46,0.22)",
          animation:"sPulse 3.2s ease-in-out infinite",
        }}>
          <span style={{fontSize:"14px"}}>❤️</span>
          <span style={{color:"#8B1A1A",fontWeight:"700",fontSize:"13px"}}>{entries.length} Happy Customers</span>
          <span style={{fontSize:"14px"}}>❤️</span>
        </div>
      </div>

      {/* ── JAR WRAPPER ── */}
      <div ref={jarRef} style={{
        position:"relative",
        width:"clamp(260px,40vw,460px)",
        height:"clamp(340px,52vw,600px)",
        zIndex:10,
      }}>
        {sparkles.map((s,i)=><Sparkle key={i} {...s}/>)}
        {floaters.map(f=><FloatUp key={f.id} {...f}/>)}

        {/* ══════════════════ CAP ══════════════════ */}
        <div style={{
          position:"absolute",
          top:0, left:"50%",
          width:"66%",
          zIndex:50,
          animation: isOpen
            ? "sCapFloat 4.5s ease-in-out infinite"
            : isOpening
            ? "sCapLift 1.15s cubic-bezier(0.25,0.46,0.45,0.94) forwards"
            : "sCapShake 7s 2s ease-in-out infinite",
          transform: isOpen ? "translate(-50%,-110px) rotate(-3deg)" : "translate(-50%,0)",
          willChange:"transform",
        }}>
          {/* Bow */}
          <div style={{
            position:"absolute",top:"-10px",left:"50%",transform:"translateX(-50%)",
            zIndex:55,animation:"sRibbon 3.2s ease-in-out infinite",
          }}>
            <svg width="56" height="36" viewBox="0 0 56 36">
              <defs>
                <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C62828"/>
                  <stop offset="100%" stopColor="#7B0000"/>
                </linearGradient>
              </defs>
              <path d="M28 18 Q14 2 2 7 Q10 18 2 30 Q14 34 28 18Z" fill="url(#bowGrad)"/>
              <path d="M28 18 Q42 2 54 7 Q46 18 54 30 Q42 34 28 18Z" fill="url(#bowGrad)"/>
              <path d="M28 18 Q14 2 2 7 Q10 18 2 30 Q14 34 28 18Z" fill="rgba(255,255,255,0.07)"/>
              <circle cx="28" cy="18" r="5.5" fill="#B71C1C"/>
              <circle cx="28" cy="18" r="2.8" fill="#EF9A9A"/>
            </svg>
          </div>

          {/* Lid main body */}
          <div style={{
            marginTop:"24px",
            borderRadius:"10px 10px 6px 6px",
            height:"clamp(22px,4.2vw,44px)",
            background:"linear-gradient(180deg,#9B1919 0%,#C62828 22%,#D32F2F 50%,#B71C1C 75%,#7B0000 100%)",
            boxShadow:"0 4px 16px rgba(100,0,0,0.42),inset 0 2px 6px rgba(255,255,255,0.16),inset 0 -2px 5px rgba(0,0,0,0.3)",
            position:"relative",overflow:"hidden",
          }}>
            {Array.from({length:11}).map((_,i)=>(
              <div key={i} style={{
                position:"absolute",top:"12%",left:`${5+i*8.5}%`,
                width:"1.5px",height:"76%",
                background:"rgba(255,255,255,0.10)",borderRadius:"1px",
              }}/>
            ))}
            {/* Specular */}
            <div style={{
              position:"absolute",top:0,left:"8%",width:"28%",height:"38%",
              background:"rgba(255,255,255,0.13)",borderRadius:"0 0 50% 50%",
            }}/>
            <div style={{
              position:"absolute",top:"15%",right:"10%",width:"6%",height:"55%",
              background:"rgba(255,255,255,0.08)",borderRadius:"4px",
            }}/>
          </div>

          {/* Grip band */}
          <div style={{
            height:"clamp(7px,1.2vw,14px)",
            background:"linear-gradient(180deg,#6D0000 0%,#8B1A1A 50%,#6D0000 100%)",
            borderRadius:"0 0 5px 5px",
            boxShadow:"inset 0 2px 5px rgba(0,0,0,0.35),0 3px 8px rgba(0,0,0,0.15)",
          }}/>
        </div>

        {/* ══════════════════ JAR BODY ══════════════════ */}
        <div style={{
          position:"absolute",
          top:"clamp(44px,7.5vw,86px)",
          left:"50%",transform:"translateX(-50%)",
          width:"90%",height:"83%",
          zIndex:15,
        }}>

          {/* Glass rear layer (tint so hearts show through realistically) */}
          <svg viewBox="0 0 300 440" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"}}>
            <defs>
              <linearGradient id="glassBack" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(205,185,190,0.50)"/>
                <stop offset="10%"  stopColor="rgba(245,228,232,0.25)"/>
                <stop offset="38%"  stopColor="rgba(255,248,250,0.15)"/>
                <stop offset="65%"  stopColor="rgba(248,235,238,0.20)"/>
                <stop offset="85%"  stopColor="rgba(230,210,215,0.35)"/>
                <stop offset="100%" stopColor="rgba(195,170,175,0.55)"/>
              </linearGradient>
              <radialGradient id="glassDepth" cx="50%" cy="88%" r="62%">
                <stop offset="0%" stopColor="rgba(150,80,90,0)"/>
                <stop offset="100%" stopColor="rgba(100,40,50,0.20)"/>
              </radialGradient>
              <linearGradient id="leftEdge" x1="0%" y1="15%" x2="100%" y2="85%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.52)"/>
                <stop offset="55%" stopColor="rgba(255,255,255,0.08)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
              <linearGradient id="rightEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.32)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
              </linearGradient>
              <linearGradient id="baseGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(195,165,172,0.62)"/>
                <stop offset="100%" stopColor="rgba(155,120,128,0.78)"/>
              </linearGradient>
            </defs>
            {/* Main jar silhouette */}
            <path d="M52 8 L248 8 Q278 8 282 30 L298 440 L2 440 L18 30 Q22 8 52 8Z" fill="url(#glassBack)"/>
            <path d="M52 8 L248 8 Q278 8 282 30 L298 440 L2 440 L18 30 Q22 8 52 8Z" fill="url(#glassDepth)"/>
            {/* Left thick glass panel */}
            <path d="M18 30 Q22 8 52 8 L64 8 Q35 8 31 30 L16 440 L2 440 L18 30Z" fill="rgba(190,162,168,0.58)"/>
            {/* Right thick glass panel */}
            <path d="M248 8 L260 8 Q290 8 282 30 L298 440 L284 440 L269 30 Q264 8 248 8Z" fill="rgba(190,162,168,0.52)"/>
            {/* Left caustic shimmer */}
            <path d="M31 24 Q40 8 60 8 L74 8 L58 440 L43 440Z" fill="url(#leftEdge)"/>
            <path d="M54 8 L70 8 L56 440 L41 440Z" fill="rgba(255,255,255,0.16)"/>
            {/* Right thin reflection */}
            <rect x="256" y="28" width="12" height="385" rx="6" fill="url(#rightEdge)"/>
            {/* Horizontal caustic bands */}
            <rect x="2" y="105" width="296" height="7" rx="3" fill="rgba(255,255,255,0.055)"/>
            <rect x="2" y="215" width="296" height="5" rx="2" fill="rgba(255,255,255,0.045)"/>
            <rect x="2" y="320" width="296" height="6" rx="3" fill="rgba(255,255,255,0.050)"/>
            {/* Bottom base */}
            <path d="M2 422 L298 422 L298 440 L2 440Z" fill="url(#baseGlass)" rx="3"/>
            <ellipse cx="150" cy="422" rx="138" ry="6" fill="rgba(255,255,255,0.20)"/>
            {/* Neck shoulder */}
            <path d="M44 8 L256 8 L260 0 L40 0Z" fill="rgba(200,175,180,0.58)"/>
            {/* Outer stroke */}
            <path d="M52 8 L248 8 Q278 8 282 30 L298 440 L2 440 L18 30 Q22 8 52 8Z"
              fill="none" stroke="rgba(170,125,135,0.42)" strokeWidth="2.5"/>
          </svg>

          {/* ── HEARTS (clipped inside jar) ── */}
          <div style={{
            position:"absolute", inset:0, zIndex:2,
            clipPath:"polygon(17.5% 2.5%, 82.5% 2.5%, 99.5% 100%, 0.5% 100%)",
            overflow:"hidden",
          }}>
            {entries.map((entry) => {
              const hp = entry.hp;
              const isHov = hoveredId === entry._id;
              return (
                <div
                  key={entry._id}
                  onMouseEnter={() => isOpen && setHoveredId(entry._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={e => handleHeartClick(e, entry)}
                  style={{
                    position:"absolute",
                    left:`${hp.x}%`,
                    top:`${hp.y}%`,
                    zIndex: isHov ? 30 : hp.zIdx,
                    cursor: isOpen ? "pointer" : "default",
                    "--rot":`${hp.rotation}deg`,
                    "--sx":`${hp.swayX}px`,
                    "--sy":`${hp.swayY}px`,
                    "--rr":`${hp.rotateSway}deg`,
                    transform:`rotate(${hp.rotation}deg) scale(${isHov ? 1.55 : 1})`,
                    transition:"transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                    animation: isHov
                      ? "sHoverPop 0.32s ease forwards"
                      : `sFloat ${hp.floatDuration}s ${hp.floatDelay}s ease-in-out infinite`,
                    filter: isHov
                      ? "drop-shadow(0 4px 12px rgba(160,50,50,0.70))"
                      : `drop-shadow(0 ${Math.round(hp.shadow*10)}px ${Math.round(hp.shadow*16)}px rgba(90,15,15,${hp.shadow.toFixed(2)}))`,
                    opacity: isOpen ? 1 : 0.55,
                  }}
                >
                  <PaperHeart size={hp.size} color={hp.color} rotation={0}/>
                </div>
              );
            })}
          </div>

          {/* Glass FRONT overlay — sits over hearts */}
          <svg viewBox="0 0 300 440" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:8,pointerEvents:"none"}}>
            <defs>
              <linearGradient id="glassFront" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(230,210,215,0.30)"/>
                <stop offset="7%"   stopColor="rgba(255,250,252,0.13)"/>
                <stop offset="38%"  stopColor="rgba(255,255,255,0.04)"/>
                <stop offset="75%"  stopColor="rgba(255,248,250,0.09)"/>
                <stop offset="100%" stopColor="rgba(218,195,202,0.28)"/>
              </linearGradient>
              <linearGradient id="mainShimmer" x1="0%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.50)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>
            <path d="M52 8 L248 8 Q278 8 282 30 L298 440 L2 440 L18 30 Q22 8 52 8Z" fill="url(#glassFront)"/>
            {/* Primary shimmer streak */}
            <path d="M54 8 L92 8 L75 440 L38 440Z" fill="url(#mainShimmer)" opacity="0.52"/>
            {/* Secondary thin streak */}
            <path d="M84 8 L98 8 L82 440 L70 440Z" fill="rgba(255,255,255,0.09)"/>
          </svg>

          {/* Closed state overlay */}
          {!isOpen && (
            <div style={{
              position:"absolute",inset:0,zIndex:20,
              clipPath:"polygon(17.5% 2.5%, 82.5% 2.5%, 99.5% 100%, 0.5% 100%)",
              background:"rgba(255,235,238,0.22)",backdropFilter:"blur(1.5px)",
              display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"8px",
            }}>
              <div style={{fontSize:"clamp(30px,4.8vw,50px)",animation:"sHeartbeat 2.2s ease-in-out infinite"}}>🫙</div>
              <div style={{
                color:"#7B0000",fontStyle:"italic",fontSize:"clamp(10px,1.5vw,13px)",fontWeight:"600",
                background:"rgba(255,255,255,0.80)",padding:"5px 15px",borderRadius:"999px",
                animation:"sGlow 2.4s ease-in-out infinite",border:"1px solid rgba(180,50,50,0.24)",
              }}>Open me to read the reviews ✨</div>
            </div>
          )}

          {/* Popup card */}
          {clicked && (
            <div
              onClick={e=>e.stopPropagation()}
              style={{
                position:"absolute",
                left:`${Math.min(Math.max(popupPos.x-16,4),61)}%`,
                top:`${Math.max(popupPos.y-140,4)}px`,
                width:"clamp(152px,27%,212px)",
                background:"linear-gradient(145deg,#fff9fa,#fff0f2)",
                borderRadius:"16px",padding:"13px 14px",
                boxShadow:"0 10px 34px rgba(176,58,46,0.22),0 2px 8px rgba(0,0,0,0.08)",
                border:"1.5px solid rgba(160,50,50,0.22)",
                zIndex:50,
                animation:"sPopIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}
            >
              <div style={{
                position:"absolute",bottom:"-9px",left:"50%",transform:"translateX(-50%)",
                width:0,height:0,
                borderLeft:"9px solid transparent",borderRight:"9px solid transparent",
                borderTop:"9px solid rgba(160,50,50,0.22)",
              }}/>
              <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"7px"}}>
                <div style={{
                  width:"30px",height:"30px",borderRadius:"50%",flexShrink:0,
                  background:`linear-gradient(135deg,${clicked.color||"#C0392B"},${(clicked.color||"#C0392B")}99)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"12px",color:"white",fontWeight:"700",
                  boxShadow:"0 2px 6px rgba(0,0,0,0.14)",
                }}>{clicked.name[0]}</div>
                <div>
                  <div style={{fontSize:"11.5px",fontWeight:"700",color:"#7B0000"}}>{clicked.name}</div>
                  <div style={{fontSize:"10.5px",color:"#C62828",letterSpacing:"0.8px"}}>
                    {"★".repeat(clicked.rating)}{"☆".repeat(5-clicked.rating)}
                  </div>
                </div>
              </div>
              <div style={{fontSize:"11px",color:"#4A1010",lineHeight:"1.55",fontStyle:"italic"}}>
                "{clicked.text}"
              </div>
              <div style={{textAlign:"right",marginTop:"5px",fontSize:"13px"}}>
                {["💌","💝","💖","💗","♥️"][0]}
              </div>
            </div>
          )}
        </div>

        {/* Jar floor shadow */}
        <div style={{
          position:"absolute",bottom:"-14px",left:"50%",transform:"translateX(-50%)",
          width:"72%",height:"18px",
          background:"radial-gradient(ellipse,rgba(110,40,50,0.28) 0%,transparent 70%)",
          borderRadius:"50%",filter:"blur(5px)",zIndex:1,
        }}/>
      </div>

      {/* ── BUTTON ── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          disabled={isOpening}
          style={{
            marginTop:"30px",
            padding:"clamp(11px,1.9vw,15px) clamp(24px,4.2vw,42px)",
            background: isOpening
              ? "linear-gradient(135deg,#EF9A9A,#E57373)"
              : "linear-gradient(135deg,#C62828,#7B0000)",
            color:"white",border:"none",borderRadius:"999px",
            fontSize:"clamp(13px,1.9vw,16.5px)",fontWeight:"700",
            cursor:isOpening?"wait":"pointer",
            fontFamily:"Palatino Linotype,serif",letterSpacing:"0.3px",
            boxShadow:"0 6px 22px rgba(123,0,0,0.40),0 2px 6px rgba(0,0,0,0.12)",
            transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
            position:"relative",zIndex:10,
            animation:isOpening?"none":"sHeartbeat 2.8s ease-in-out infinite",
            transform:isOpening?"scale(0.95)":"scale(1)",
          }}
        >
          {isOpening?"✨ Opening the jar...":"🫙 Open the Jar of Love"}
        </button>
      )}

      {isOpen && (
        <div style={{marginTop:"22px",textAlign:"center",animation:"sPopIn 0.5s ease forwards",zIndex:10}}>
          <div style={{
            fontSize:"clamp(11px,1.6vw,13.5px)",color:"#7B0000",fontStyle:"italic",
            background:"rgba(255,255,255,0.75)",backdropFilter:"blur(12px)",
            padding:"7px 22px",borderRadius:"999px",border:"1.5px solid rgba(160,50,50,0.2)",
          }}>
            💌 Hover a heart to peek · Click to read the full review
          </div>
        </div>
      )}

      {/* Hover bar */}
      {hoveredId && isOpen && (() => {
        const r = entries.find(e => e._id === hoveredId);
        if (!r) return null;
        return (
          <div style={{
            position:"fixed",bottom:"18px",left:"50%",transform:"translateX(-50%)",
            background:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)",
            borderRadius:"12px",padding:"7px 20px",
            border:`1.5px solid ${r.color}55`,
            boxShadow:"0 4px 22px rgba(123,0,0,0.14)",
            zIndex:200,animation:"sPopIn 0.18s ease forwards",
            display:"flex",alignItems:"center",gap:"8px",whiteSpace:"nowrap",
          }}>
            <PaperHeart size={15} color={r.color||"#C0392B"} rotation={-12}/>
            <span style={{fontSize:"12.5px",fontWeight:"700",color:"#7B0000"}}>{r.name}</span>
            <span style={{fontSize:"11px",color:"#C62828",letterSpacing:"1px"}}>{"★".repeat(r.rating)}</span>
          </div>
        );
      })()}

      {/* ── LEAVE A REVIEW BUTTON + FORM ── */}
      <div style={{marginTop:"28px",zIndex:10,width:"100%",maxWidth:"420px"}}>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} style={{
            width:"100%",padding:"13px",
            background:"linear-gradient(135deg,#C62828,#7B0000)",
            color:"white",border:"none",borderRadius:"999px",
            fontSize:"clamp(13px,1.9vw,15px)",fontWeight:"700",cursor:"pointer",
            fontFamily:"Palatino Linotype,serif",
            boxShadow:"0 6px 22px rgba(123,0,0,0.35)",
          }}>💌 Drop your love note in the jar</button>
        ) : (
          <div style={{
            background:"linear-gradient(145deg,#fff9fa,#fff0f2)",
            borderRadius:"20px",padding:"24px",
            boxShadow:"0 10px 34px rgba(176,58,46,0.18)",
            border:"1.5px solid rgba(160,50,50,0.18)",
          }}>
            {done ? (
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <div style={{fontSize:"44px",marginBottom:"10px"}}>🌸</div>
                <p style={{color:"#7B0000",fontWeight:"700",fontSize:"16px",margin:0}}>Your heart is in the jar! 💝</p>
              </div>
            ) : (
              <>
                <p style={{textAlign:"center",color:"#7B0000",fontWeight:"700",fontSize:"15px",marginBottom:"16px",marginTop:0}}>💫 How was your experience?</p>
                <div style={{display:"flex",justifyContent:"center",gap:"6px",marginBottom:"14px"}}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setForm(f => ({ ...f, rating: star }))}
                      style={{background:"none",border:"none",fontSize:"26px",cursor:"pointer",
                        color: star <= form.rating ? '#f59e0b' : '#ddd'}}>★</button>
                  ))}
                </div>
                <input placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:"1.5px solid #f0c0c0",
                    fontSize:"14px",marginBottom:"10px",outline:"none",boxSizing:"border-box",
                    fontFamily:"Palatino Linotype,serif",background:"#fff9fa"}}
                />
                <textarea placeholder="Tell us your story..." value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  rows={3}
                  style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:"1.5px solid #f0c0c0",
                    fontSize:"14px",resize:"none",outline:"none",boxSizing:"border-box",
                    marginBottom:"14px",fontFamily:"Palatino Linotype,serif",background:"#fff9fa"}}
                />
                <button onClick={submitReview} disabled={submitting || !form.name.trim() || !form.text.trim()}
                  style={{width:"100%",padding:"12px",
                    background:"linear-gradient(135deg,#C62828,#7B0000)",
                    color:"white",border:"none",borderRadius:"999px",fontSize:"14px",
                    fontWeight:"700",cursor:"pointer",fontFamily:"Palatino Linotype,serif",
                    opacity:(!form.name.trim()||!form.text.trim())?0.5:1,
                    boxShadow:"0 4px 16px rgba(123,0,0,0.30)"}}>
                  {submitting ? "Adding to jar..." : "Add to the jar 🫙"}
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{width:"100%",marginTop:"8px",padding:"8px",background:"none",
                    border:"none",color:"#aaa",fontSize:"13px",cursor:"pointer"}}>
                  Maybe later
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom deco */}
      <div style={{marginTop:"34px",display:"flex",gap:"13px",alignItems:"center",opacity:0.55,zIndex:10}}>
        {["💌","💝","❤️","💗","💕"].map((e,i)=>(
          <span key={i} style={{fontSize:"16px",animation:`sHeartbeat ${1.6+i*0.25}s ${i*0.18}s ease-in-out infinite`}}>{e}</span>
        ))}
      </div>
    </div>
  );
}





