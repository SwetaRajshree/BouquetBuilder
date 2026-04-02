import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from 'html2canvas';

/* ─────────────────────────────────────────────
   FONTS + KEYFRAMES
───────────────────────────────────────────── */
const FontInjector = () => {
  useEffect(() => {
    if (document.getElementById("pb-fonts")) return;
    const link = document.createElement("link");
    link.id = "pb-fonts"; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600;1,800&family=DM+Sans:wght@300;400;500&family=Nunito:wght@400;700;800&family=Caveat:wght@500;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "pb-kf";
    style.textContent = `
      * { box-sizing: border-box; }

      @keyframes floatDrift {
        0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.22; }
        25%  { transform: translateY(-20px) rotate(6deg) scale(1.04); opacity: 0.32; }
        50%  { transform: translateY(-44px) rotate(-4deg) scale(0.97); opacity: 0.26; }
        75%  { transform: translateY(-30px) rotate(8deg) scale(1.02); opacity: 0.30; }
        100% { transform: translateY(-100vh) rotate(300deg) scale(1); opacity: 0; }
      }
      @keyframes filmRoll {
        from { transform: translateX(0) }
        to   { transform: translateX(-50%) }
      }
      @keyframes filmRollReverse {
        from { transform: translateX(-50%) }
        to   { transform: translateX(0) }
      }
      @keyframes shutterBlink {
        0%,92%,100% { opacity: 0 }
        94%,98%     { opacity: 1 }
      }
      @keyframes apertureSpin {
        0%   { transform: rotate(0deg) scale(1); opacity: 0.12 }
        50%  { transform: rotate(180deg) scale(1.08); opacity: 0.22 }
        100% { transform: rotate(360deg) scale(1); opacity: 0.12 }
      }
      @keyframes flashPop {
        0%   { opacity: 0; transform: scale(0.9) }
        15%  { opacity: 1; transform: scale(1.04) }
        40%  { opacity: 1; transform: scale(1) }
        100% { opacity: 0; transform: scale(1) }
      }
      @keyframes camBob {
        0%,100% { transform: translateY(0px) rotate(-2deg) }
        50%     { transform: translateY(-9px) rotate(2.5deg) }
      }
      @keyframes slideUp {
        from { transform: translateY(28px); opacity: 0 }
        to   { transform: translateY(0); opacity: 1 }
      }
      @keyframes fadeIn {
        from { opacity: 0 }
        to   { opacity: 1 }
      }
      @keyframes pulse {
        0%,100% { transform: scale(1) }
        50%     { transform: scale(1.12) }
      }
      @keyframes scanLine {
        0%   { top: 0% }
        100% { top: 105% }
      }
      @keyframes liveDot {
        0%,100% { opacity: 1 }
        50%     { opacity: 0.2 }
      }
      @keyframes filmAdvance {
        0%   { transform: rotate(0deg) }
        100% { transform: rotate(360deg) }
      }
      @keyframes lensFocus {
        0%,100% { box-shadow: 0 0 0 3px rgba(255,180,200,0.3), 0 0 0 6px rgba(255,180,200,0.12) }
        50%     { box-shadow: 0 0 0 6px rgba(255,180,200,0.5), 0 0 0 12px rgba(255,180,200,0.2) }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center }
        100% { background-position: 200% center }
      }
      @keyframes popIn {
        0%   { transform: scale(0.7); opacity: 0 }
        70%  { transform: scale(1.08); opacity: 1 }
        100% { transform: scale(1); opacity: 1 }
      }
      @keyframes wiggle {
        0%,100% { transform: rotate(-2deg) }
        50%     { transform: rotate(2deg) }
      }
      @keyframes filmKnobSpin {
        from { transform: rotate(0deg) }
        to   { transform: rotate(360deg) }
      }
      @keyframes starTwinkle {
        0%,100% { opacity: 0.4; transform: scale(1) }
        50%     { opacity: 1; transform: scale(1.3) }
      }
      @keyframes heartBeat {
        0%,100% { transform: scale(1) }
        14%     { transform: scale(1.15) }
        28%     { transform: scale(1) }
        42%     { transform: scale(1.1) }
        56%     { transform: scale(1) }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FILTERS = [
  { id: "none",     label: "Original", css: "",                                                                        desc: "No filter"            },
  { id: "vintage",  label: "Vintage",  css: "sepia(0.55) contrast(0.9) brightness(1.05)",                             desc: "Warm sepia film"      },
  { id: "bw",       label: "B&W",      css: "grayscale(1) contrast(1.15) brightness(1.05)",                           desc: "Classic black & white"},
  { id: "warm",     label: "Warm",     css: "sepia(0.2) saturate(1.5) brightness(1.08) hue-rotate(350deg)",           desc: "Golden hour"          },
  { id: "cool",     label: "Cool",     css: "hue-rotate(20deg) saturate(0.8) brightness(1.12)",                       desc: "Icy blue tones"       },
  { id: "faded",    label: "Faded",    css: "contrast(0.72) brightness(1.18) saturate(0.6)",                          desc: "Washed-out matte"     },
  { id: "vivid",    label: "Vivid",    css: "saturate(2.0) contrast(1.15) brightness(1.04)",                          desc: "Punchy colors"        },
  { id: "dramatic", label: "Dramatic", css: "contrast(1.5) brightness(0.92) saturate(1.2)",                           desc: "High contrast"        },
  { id: "pastel",   label: "Pastel",   css: "saturate(0.55) brightness(1.22) contrast(0.82)",                         desc: "Soft dreamy"          },
  { id: "amber",    label: "Amber",    css: "sepia(0.7) saturate(1.3) brightness(1.1) hue-rotate(345deg)",            desc: "Rich amber glow"      },
  { id: "chrome",   label: "Chrome",   css: "saturate(1.4) contrast(1.25) brightness(1.05) hue-rotate(5deg)",         desc: "Metallic pop"         },
];

const LAYOUTS = [
  { id: "classic", label: "Classic",  desc: "One large framed photo",    slots: 1 },
  { id: "strip",   label: "Strip",    desc: "3 photos vertical strip",   slots: 3 },
  { id: "grid",    label: "Grid",     desc: "4 photos in a 2×2 collage", slots: 4 },
  { id: "wide",    label: "Wide",     desc: "Panoramic wide-angle shot",  slots: 1 },
  { id: "trio",    label: "Trio",     desc: "3 photos side by side",      slots: 3 },
  { id: "big5",    label: "Big Five", desc: "1 hero + 4 small below",    slots: 5 },
];

const FRAMES = [
  { id: "white",    label: "White",    bg: "#FAFAF7", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "cream",    label: "Cream",    bg: "#EDE8DF", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "pink",     label: "Blush",    bg: "#F8E8F0", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "mint",     label: "Mint",     bg: "#E8F8EE", textColor: "#1C1C1A", dateColor: "#8A8478" },
  { id: "dark",     label: "Dark",     bg: "#1C1C1A", textColor: "#EDE8DF", dateColor: "#888888" },
  { id: "lavender", label: "Lavender", bg: "#F0ECF8", textColor: "#1C1C1A", dateColor: "#8A8478" },
];

const SCENES = [
  { id: "none",    label: "None",    emoji: "○",  bg: null       },
  { id: "flowers", label: "Flowers", emoji: "🌸", bg: "#FFF0F5" },
  { id: "stars",   label: "Stars",   emoji: "⭐", bg: "#F0EEFF" },
  { id: "spring",  label: "Spring",  emoji: "🌷", bg: "#F0FFF4" },
  { id: "kawaii",  label: "Kawaii",  emoji: "🐱", bg: "#FFF8F0" },
  { id: "hearts",  label: "Hearts",  emoji: "❤️", bg: "#FFF0F5" },
];

const STICKERS = {
  all:    ["🌸","🌺","🌻","🌷","🌼","💐","🍀","🌿","🦋","🐝","⭐","✨","💫","🌈","❤️","🩷","🤍","💜","🎀","🎁","🍓","🍑","🌙","☁️","🔮","🫧","🌟","🎸","🪷","🌱"],
  floral: ["🌸","🌺","🌻","🌷","🌼","💐","🍀","🌿","🪷","🌱","🍃","🌾"],
  cute:   ["🦋","🐝","🐱","🐻","🐰","🎀","🍓","🍑","🧁","🍭","💌","🫧","🐣","🌈"],
  stars:  ["⭐","✨","💫","🌟","🌙","☁️","🌈","🔮","💜","🩵","🌠","🪐"],
  love:   ["❤️","🩷","🤍","💜","💛","🧡","💖","💗","💝","💌","🎁","🎀","🥰","💞"],
};

/* ─────────────────────────────────────────────
   PALETTE — cute warm pastel
───────────────────────────────────────────── */
const P = {
  bg:      "#FEFCE8",       // butter yellow
  bgAlt:   "#FEF9C3",       // soft lemon
  surface: "rgba(255,255,255,0.72)",
  surfaceB:"rgba(254,252,232,0.85)",
  border:  "rgba(202,183,80,0.25)",
  borderHover: "rgba(180,160,40,0.55)",
  accent:  "#CA8A04",       // golden yellow
  accent2: "#FFAB76",       // peach
  accent3: "#A78BFA",       // lavender
  gold:    "#E8A87C",
  text:    "#2D2A1A",
  textMid: "#6B5E2A",
  textSoft:"rgba(45,42,26,0.45)",
  nav:     "rgba(254,252,232,0.88)",
};

/* ─────────────────────────────────────────────
   SVG ICONS — softer, cuter
───────────────────────────────────────────── */
function CamSVG({ size, color = "#F4739A", opacity = 0.22 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 50 39" fill="none" style={{ opacity }}>
      <rect x="2" y="10" width="46" height="28" rx="7" fill={color} />
      <rect x="15" y="2" width="12" height="11" rx="4" fill={color} />
      <rect x="30" y="4" width="7" height="5" rx="2" fill="#FFD700" opacity="0.8" />
      <circle cx="25" cy="24" r="10" fill="rgba(255,255,255,0.18)" />
      <circle cx="25" cy="24" r="7"  fill="rgba(255,255,255,0.15)" />
      <circle cx="25" cy="24" r="4"  fill="rgba(255,200,220,0.5)" />
      <circle cx="22" cy="21" r="1.5" fill="white" opacity="0.55" />
      <circle cx="40" cy="15" r="3"  fill={color} opacity="0.8" />
    </svg>
  );
}

function ApertureSVG({ size, color = "#F4739A", opacity = 0.18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity }}>
      <circle cx="30" cy="30" r="28" stroke={color} strokeWidth="1.5" fill="none" />
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2, a2 = a + Math.PI / 6;
        const r1 = 26, r2 = 10;
        const x1 = 30 + Math.cos(a)*r1, y1 = 30 + Math.sin(a)*r1;
        const x2 = 30 + Math.cos(a2)*r2, y2 = 30 + Math.sin(a2)*r2;
        const cx3 = 30 + Math.cos(a + Math.PI)*r1*0.5, cy3 = 30 + Math.sin(a + Math.PI)*r1*0.5;
        return <path key={i} d={`M ${x1} ${y1} Q ${cx3} ${cy3} ${x2} ${y2}`} stroke={color} strokeWidth="1.2" fill="none" opacity="0.75" />;
      })}
      <circle cx="30" cy="30" r="7" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function FilmSVG({ size, color = "#FFAB76", opacity = 0.2 }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 80 50" fill="none" style={{ opacity }}>
      <rect x="1" y="1" width="78" height="48" rx="5" stroke={color} strokeWidth="1.5" fill="none" />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={4 + i*19} y="4"  width="7" height="6" rx="1.5" fill={color} opacity="0.6" />
          <rect x={4 + i*19} y="40" width="7" height="6" rx="1.5" fill={color} opacity="0.6" />
        </g>
      ))}
      <rect x="14" y="12" width="52" height="26" rx="3" stroke={color} strokeWidth="1" fill="none" opacity="0.45" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   RICH ANIMATED CAMERA ICON
───────────────────────────────────────────── */
function AnimatedCamera({ size = 80 }) {
  const [flashing, setFlashing] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const flash = () => {
    setFlashing(true);
    setSpinning(true);
    setTimeout(() => { setFlashing(false); setSpinning(false); }, 700);
  };

  return (
    <div onClick={flash} style={{ cursor: "pointer", display: "inline-block", animation: "camBob 3.2s ease-in-out infinite", position: "relative" }} title="Click me!">
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="heroLens" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#A78BFA" />
            <stop offset="40%"  stopColor="#7C6EE8" />
            <stop offset="100%" stopColor="#3B2FA0" />
          </radialGradient>
          <radialGradient id="camBody" cx="50%" cy="30%" r="80%">
            <stop offset="0%"   stopColor="#FDBCC8" />
            <stop offset="100%" stopColor="#F4739A" />
          </radialGradient>
        </defs>
        {/* Body */}
        <rect x="8"  y="28" width="84" height="55" rx="14" fill="url(#camBody)" />
        <rect x="8"  y="28" width="84" height="55" rx="14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
        {/* Viewfinder bump */}
        <rect x="26" y="15" width="22" height="17" rx="6"  fill="#FDBCC8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* Flash */}
        <rect x="54" y="17" width="14" height="9"  rx="3"  fill="#FFE87A" opacity="0.9" />
        {spinning && <rect x="54" y="17" width="14" height="9" rx="3" fill="white" opacity="0.9" />}
        {/* Lens outer */}
        <circle cx="50" cy="57" r="22" fill="rgba(255,255,255,0.18)" />
        <circle cx="50" cy="57" r="18" fill="rgba(255,255,255,0.12)" />
        <circle cx="50" cy="57" r="14" fill="#2a1a4a" />
        <circle cx="50" cy="57" r="10" fill="url(#heroLens)" style={{ animation: spinning ? "filmAdvance 0.5s linear infinite" : "none" }} />
        {/* Lens gleam */}
        <circle cx="44" cy="51" r="3.5" fill="white" opacity="0.3" />
        <circle cx="56" cy="63" r="1.5" fill="white" opacity="0.15" />
        {/* Lens ring dots */}
        {[0,1,2,3,4,5].map(i => { const a=(i/6)*Math.PI*2; return <circle key={i} cx={50+Math.cos(a)*17} cy={57+Math.sin(a)*17} r="1.4" fill="rgba(255,255,255,0.3)" />; })}
        {/* Shutter button */}
        <circle cx="84" cy="36" r="6"   fill="#FFE87A" />
        <circle cx="84" cy="36" r="3.5" fill="#FFD700" />
        {/* Side ridges */}
        {[0,1,2].map(i => <line key={i} x1="14" y1={38+i*7} x2="14" y2={42+i*7} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />)}
        {/* Flash pop */}
        {flashing && <circle cx="50" cy="57" r="28" fill="white" opacity="0.6" />}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER THUMB
───────────────────────────────────────────── */
function FilterThumb({ filterCss, isActive, onClick, label }) {
  const colors = ["#FDBCC8","#FFD6A0","#C7B8F5","#B8E8C8","#B8D4F8","#FFF3B0","#F8C8D8","#D4E8FF","#FFD4E8","#E8D4FF","#D4FFE8"];
  const idx = Math.abs(label.charCodeAt(0) + label.charCodeAt(1)) % colors.length;
  return (
    <div onClick={onClick}
      style={{
        flexShrink: 0, width: 62, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        transition: "transform 0.18s", transform: isActive ? "scale(1.1)" : "scale(1)"
      }}>
      <div style={{
        width: 62, height: 62, borderRadius: 14, overflow: "hidden",
        border: isActive ? `2.5px solid ${P.accent}` : `2px solid ${P.border}`,
        boxShadow: isActive ? `0 4px 14px rgba(244,115,154,0.35)` : "none",
        background: colors[idx], filter: filterCss, transition: "border 0.2s"
      }}>
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+3)%colors.length]})` }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif", color: isActive ? P.accent : P.textMid, fontWeight: isActive ? 700 : 400, textAlign: "center" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCENE OVERLAY
───────────────────────────────────────────── */
function star5pts(cx, cy, r1, r2) {
  let pts = "";
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    pts += `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)} `;
  }
  return pts.trim();
}

function SceneOverlay({ scene, width: w, height: h }) {
  const base = { position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 5 };
  if (scene === "flowers") return (
    <svg width={w} height={h} style={base}>
      {[["🌸",10,20],["🌺",w-26,20],["🌼",w/2-10,10],["🌷",10,h-14],["🌸",w-24,h-14],["🍀",w/2-6,h-10],["💐",8,h/2]].map(([e,x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="16" opacity="0.7">{e}</text>
      ))}
    </svg>
  );
  if (scene === "stars") return (
    <svg width={w} height={h} style={base}>
      {Array.from({length:14},(_,i)=>{
        const x=14+((i*53+17)%(w-28)), y=14+((i*37+9)%(h-28)), s=5+(i%4)*2;
        const cols=["#C8B0FF","#A080FF","#E0C8FF","#FFD0FF"];
        return <polygon key={i} points={star5pts(x,y,s,s*0.4)} fill={cols[i%4]} opacity={0.3+(i%3)*0.18}/>;
      })}
    </svg>
  );
  if (scene === "spring") return (
    <svg width={w} height={h} style={base}>
      {[["🌸",10,22],["🌷",w-24,22],["🌼",w/2-8,10],["🌿",10,h-12],["🌸",w-22,h-12],["🍀",w/2-6,h-10],["🌱",10,h/2-8],["🌾",w-20,h/2-8]].map(([e,x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="15" opacity="0.65">{e}</text>
      ))}
    </svg>
  );
  if (scene === "kawaii") return (
    <svg width={w} height={h} style={base}>
      {[["🐱",10,22],["🍭",w-24,22],["🎀",w/2-8,12],["🌈",10,h-10],["⭐",w-22,h-10],["🍓",w/2-6,h-10],["🧁",10,h/2],["💜",w-22,h/2]].map(([e,x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="15" opacity="0.7">{e}</text>
      ))}
    </svg>
  );
  if (scene === "hearts") return (
    <svg width={w} height={h} style={base}>
      {[[16,18],[w-18,18],[w/2,14],[18,h-16],[w-18,h-16],[w/2,h-14],[12,h/2],[w-14,h/2]].map(([x,y],i)=>{
        const s=8+(i%3)*2, cols=["#FF80A0","#FF60B0","#FFB0C0","#FF9090"];
        return <path key={i} d={`M${x},${y+s*0.3} C${x},${y} ${x-s},${y} ${x-s},${y+s*0.3} C${x-s},${y+s*0.7} ${x},${y+s*1.1} ${x},${y+s*1.3} C${x},${y+s*1.1} ${x+s},${y+s*0.7} ${x+s},${y+s*0.3} C${x+s},${y} ${x},${y} ${x},${y+s*0.3}Z`} fill={cols[i%4]} opacity="0.5"/>;
      })}
    </svg>
  );
  return null;
}

/* ─────────────────────────────────────────────
   PHOTO ROLL STRIP — the eye-catcher
───────────────────────────────────────────── */
function PhotoRollStrip({ top, speed = 28, reverse = false, opacity = 1, scale = 1 }) {
  const frames = Array.from({ length: 20 });
  const colors = [
    ["#FDBCC8","#FFD6A0"],["#C7B8F5","#B8E8C8"],["#B8D4F8","#FFF3B0"],
    ["#F8C8D8","#D4E8FF"],["#FFD4E8","#E8D4FF"],["#D4FFE8","#FDBCC8"],
    ["#FFE8D4","#C7B8F5"],["#D4D4FF","#FFD6A0"],["#E8FFD4","#F8C8D8"],
    ["#FFD4D4","#B8D4F8"],
  ];
  const emojis = ["🌸","🎀","⭐","🌷","🦋","💜","🌈","🍓","🎸","💌","🌙","🐱","✨","🍑","🌺","💫","🎁","🪷","🔮","🌻"];

  return (
    <div style={{
      position: "absolute", top, left: 0, width: "200%", display: "flex", alignItems: "center",
      animation: `${reverse ? "filmRollReverse" : "filmRoll"} ${speed}s linear infinite`,
      pointerEvents: "none", transformOrigin: "left center",
    }}>
      {frames.map((_, i) => {
        const ci = i % colors.length;
        const [c1, c2] = colors[ci];
        const emoji = emojis[i % emojis.length];
        return (
          <div key={i} style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            {/* Perforations left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "4px 3px", background: "rgba(0,0,0,0.07)", height: 76 * scale, justifyContent: "space-around" }}>
              {[0,1,2].map(k => (
                <div key={k} style={{ width: 8 * scale, height: 10 * scale, borderRadius: 2, background: "rgba(255,255,255,0.6)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)" }} />
              ))}
            </div>
            {/* Frame */}
            <div style={{
              width: 90 * scale, height: 76 * scale, flexShrink: 0, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              opacity,
            }}>
              {/* Mini polaroid-style inner */}
              <div style={{ position: "absolute", inset: 5, background: "rgba(255,255,255,0.45)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 20 * scale }}>{emoji}</span>
                <div style={{ width: 30 * scale, height: 2, borderRadius: 1, background: "rgba(100,80,80,0.15)", marginTop: 2 }} />
              </div>
            </div>
            {/* Perforations right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "4px 3px", background: "rgba(0,0,0,0.07)", height: 76 * scale, justifyContent: "space-around" }}>
              {[0,1,2].map(k => (
                <div key={k} style={{ width: 8 * scale, height: 10 * scale, borderRadius: 2, background: "rgba(255,255,255,0.6)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)" }} />
              ))}
            </div>
            {/* Gap between frames */}
            <div style={{ width: 3, height: 76 * scale, background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUTE BACKGROUND
───────────────────────────────────────────── */
function CuteBackground() {
  const floaters = [
    { t: "cam",  left: "5%",  size: 20, delay: 0,   dur: 14 },
    { t: "apt",  left: "14%", size: 24, delay: 2,   dur: 11 },
    { t: "film", left: "24%", size: 16, delay: 5,   dur: 15 },
    { t: "cam",  left: "36%", size: 18, delay: 1.5, dur: 12 },
    { t: "apt",  left: "48%", size: 20, delay: 6.5, dur: 10 },
    { t: "cam",  left: "58%", size: 22, delay: 3,   dur: 13 },
    { t: "film", left: "66%", size: 14, delay: 0.8, dur: 16 },
    { t: "apt",  left: "76%", size: 20, delay: 5,   dur: 11 },
    { t: "cam",  left: "86%", size: 18, delay: 2.5, dur: 13 },
    { t: "film", left: "93%", size: 16, delay: 7.5, dur: 12 },
  ];

  const floatColors = ["#F4739A","#FFAB76","#A78BFA","#60C6A8","#60A8E8"];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Soft cream base */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #FEFCE8 0%, #FEF9C3 45%, #FFF8E1 100%)" }} />

      {/* Soft radial glows */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 20% 35%, rgba(202,138,4,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(167,139,250,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 55% 10%, rgba(255,171,118,0.06) 0%, transparent 60%)" }} />

      {/* Big aperture rings — soft */}
      <div style={{ position: "absolute", top: -60, left: -60, animation: "apertureSpin 22s linear infinite" }}>
        <ApertureSVG size={180} color="#F4739A" opacity={0.08} />
      </div>
      <div style={{ position: "absolute", bottom: -80, right: -80, animation: "apertureSpin 30s 5s linear infinite" }}>
        <ApertureSVG size={220} color="#A78BFA" opacity={0.07} />
      </div>
      <div style={{ position: "absolute", top: "32%", right: -50, animation: "apertureSpin 25s 11s linear infinite" }}>
        <ApertureSVG size={140} color="#FFAB76" opacity={0.06} />
      </div>

      {/* Photo roll strips — the star of the show */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 90, overflow: "hidden", opacity: 0.55 }}>
        <PhotoRollStrip top={7} speed={26} reverse={false} scale={1} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 90, overflow: "hidden", opacity: 0.5 }}>
        <PhotoRollStrip top={7} speed={20} reverse={true} scale={0.9} />
      </div>

      {/* Tiny floating particles */}
      {floaters.map((p, i) => {
        const col = floatColors[i % floatColors.length];
        return (
          <div key={i} style={{ position: "absolute", bottom: "-60px", left: p.left, animation: `floatDrift ${p.dur}s ${p.delay}s infinite ease-in-out` }}>
            {p.t === "cam"  && <CamSVG      size={p.size} color={col} opacity={0.28} />}
            {p.t === "apt"  && <ApertureSVG size={p.size} color={col} opacity={0.28} />}
            {p.t === "film" && <FilmSVG     size={p.size} color={col} opacity={0.3} />}
          </div>
        );
      })}

      {/* Tiny twinkle stars scattered */}
      {[
        {left:"12%",top:"18%",size:10,delay:0},
        {left:"72%",top:"8%",size:8,delay:1.4},
        {left:"44%",top:"35%",size:12,delay:0.7},
        {left:"88%",top:"28%",size:9,delay:2},
        {left:"28%",top:"55%",size:7,delay:1.1},
        {left:"62%",top:"66%",size:11,delay:0.3},
      ].map((s,i)=>(
        <div key={i} style={{ position:"absolute", left:s.left, top:s.top, animation:`starTwinkle ${2+i*0.4}s ${s.delay}s ease-in-out infinite` }}>
          <svg width={s.size} height={s.size} viewBox="0 0 10 10">
            <polygon points={star5pts(5,5,5,2.2)} fill={floatColors[i%floatColors.length]} opacity="0.5" />
          </svg>
        </div>
      ))}

      {/* Rare white flash — very faint */}
      <div style={{ position: "absolute", inset: 0, background: "white", animation: "shutterBlink 22s 6s infinite", opacity: 0.5, pointerEvents: "none" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILM REEL ANIMATION (decorative)
───────────────────────────────────────────── */
function FilmReelDecor({ size = 60, color = "#F4739A", style: s = {} }) {
  return (
    <div style={{ display: "inline-flex", position: "relative", ...s }}>
      <svg width={size} height={size} viewBox="0 0 60 60" style={{ animation: "filmKnobSpin 4s linear infinite" }}>
        <circle cx="30" cy="30" r="28" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
        <circle cx="30" cy="30" r="18" stroke={color} strokeWidth="1.5" fill="none" opacity="0.25" />
        <circle cx="30" cy="30" r="8"  fill={color} opacity="0.2" />
        {[0,1,2,3,4,5,6,7].map(i=>{
          const a=(i/8)*Math.PI*2;
          return <rect key={i} x={30+Math.cos(a)*17-3} y={30+Math.sin(a)*17-5} width="6" height="10" rx="2" fill={color} opacity="0.35" transform={`rotate(${i/8*360},${30+Math.cos(a)*17},${30+Math.sin(a)*17})`} />;
        })}
        <circle cx="30" cy="30" r="4" fill={color} opacity="0.5" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   POLAROID PREVIEW
───────────────────────────────────────────── */
function Polaroid({ layout, images, filter, frame, scene, caption, showDate, tilted, stickers, onSlotClick }) {
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

  const Slot = ({ idx, w, h, style: s = {} }) => (
    <div onClick={() => onSlotClick(idx)} style={{ width: w, height: h, background: "#EDE0D8", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0, borderRadius: 2, ...s }}>
      {images[idx]
        ? <img src={images[idx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: filterCss, transition: "filter 0.4s ease" }} />
        : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20, opacity: 0.4 }}>📷</span>
            <span style={{ fontSize: 9, color: "#A08070", fontFamily: "'DM Sans', sans-serif" }}>tap to add</span>
          </div>
        )
      }
    </div>
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: bg, boxShadow: "0 8px 40px rgba(200,100,130,0.18), 0 2px 8px rgba(0,0,0,0.08)", width: dims.w, position: "relative", transform: tilted ? "rotate(-2.5deg)" : "none", transition: "transform 0.3s", borderRadius: 2 }}>
      <SceneOverlay scene={scene} width={dims.w} height={sceneH} />
      <div style={{ position: "relative", zIndex: 6, width: "100%", display: "flex", justifyContent: "center" }}>
        {layout === "classic" && <div style={{ margin: "16px 17px 0" }}><Slot idx={0} w={dims.sw} h={dims.sh} /></div>}
        {layout === "strip"   && <div style={{ padding: "12px 11px 0", display: "flex", flexDirection: "column", gap: 4 }}>{[0,1,2].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "grid"    && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: "14px 14px 0" }}>{[0,1,2,3].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "wide"    && <div style={{ margin: "16px 17px 0" }}><Slot idx={0} w={dims.sw} h={dims.sh} /></div>}
        {layout === "trio"    && <div style={{ padding: "12px 10px 0", display: "flex", gap: 4 }}>{[0,1,2].map(i => <Slot key={i} idx={i} w={dims.sw} h={dims.sh} />)}</div>}
        {layout === "big5"    && (
          <div style={{ padding: "14px 15px 0" }}>
            <Slot idx={0} w={dims.sw} h={dims.sh} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginTop: 4 }}>
              {[1,2,3,4].map(i => <Slot key={i} idx={i} w={56} h={55} />)}
            </div>
          </div>
        )}
      </div>
      {/* Caption area */}
      <div style={{ width: "100%", textAlign: "center", padding: "10px 8px 4px", position: "relative", zIndex: 6 }}>
        {caption
          ? <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: frameData.textColor, minHeight: 20 }}>{caption}</div>
          : <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: "rgba(150,120,120,0.5)", minHeight: 20 }}>Add caption…</div>
        }
        {showDate && <div style={{ fontSize: 10, color: frameData.dateColor, fontFamily: "'DM Sans', sans-serif", paddingBottom: 2 }}>{today}</div>}
      </div>
      <div style={{ height: 14 }} />
      {/* Stickers */}
      {stickers.map(stk => (
        <div key={stk.id} onMouseDown={stk.onDragStart} onTouchStart={stk.onDragStart} onDoubleClick={stk.onRemove}
          style={{ position: "absolute", left: stk.x, top: stk.y, fontSize: 22, cursor: "grab", userSelect: "none", zIndex: 30 }}>
          {stk.emoji}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAMERA MODAL
───────────────────────────────────────────── */
function CameraModal({ onCapture, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready,     setReady]     = useState(false);
  const [flipped,   setFlipped]   = useState(true);
  const [flashing,  setFlashing]  = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [preview,   setPreview]   = useState(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); setReady(true); }
      })
      .catch(() => alert("Camera access denied or not available."));
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  const takePhoto = () => {
    if (countdown !== null) return;
    let count = 3;
    setCountdown(count);
    const tick = setInterval(() => {
      count--;
      if (count > 0) { setCountdown(count); }
      else {
        clearInterval(tick); setCountdown(null); setFlashing(true);
        setTimeout(() => {
          const canvas = canvasRef.current, video = videoRef.current;
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (flipped) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
          ctx.drawImage(video, 0, 0);
          setFlashing(false); setPreview(canvas.toDataURL("image/jpeg", 0.92));
        }, 300);
      }
    }, 1000);
  };

  const confirmPhoto = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    onCapture(preview);
  };

  const retake = () => {
    setPreview(null);
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); setReady(true); }
      })
      .catch(() => alert("Camera access denied or not available."));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(253,246,240,0.92)", backdropFilter: "blur(10px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 28, overflow: "hidden", width: "min(92vw,480px)", boxShadow: "0 30px 80px rgba(244,115,154,0.22), 0 0 0 1.5px rgba(244,115,154,0.18)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${P.border}`, background: "rgba(255,240,248,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AnimatedCamera size={26} />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: P.text, fontStyle: "italic" }}>Camera</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(244,115,154,0.08)", border: `1px solid ${P.border}`, color: P.accent, borderRadius: 10, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>✕ Close</button>
        </div>

        {/* Viewfinder */}
        <div style={{ position: "relative", aspectRatio: "4/3", background: "#1a1018", overflow: "hidden" }}>
          {!preview ? (
            <>
              <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: flipped ? "scaleX(-1)" : "none" }} />
              {/* Rule-of-thirds grid */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 120 90">
                {[40,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="90" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />)}
                {[30,60].map(y => <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />)}
                {[[5,5],[115,5],[5,85],[115,85]].map(([x,y],i) => {
                  const dx = x<60 ? 1:-1, dy = y<45 ? 1:-1;
                  return <g key={i} stroke="#F4739A" strokeWidth="1.2" fill="none"><line x1={x} y1={y} x2={x+dx*8} y2={y}/><line x1={x} y1={y} x2={x} y2={y+dy*8}/></g>;
                })}
              </svg>
              {/* Scan line */}
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(244,115,154,0.55),transparent)", animation: "scanLine 2.4s linear infinite" }} />
              {/* Flash */}
              {flashing && <div style={{ position: "absolute", inset: 0, background: "white", animation: "flashPop 0.5s ease-out forwards" }} />}
              {/* Countdown */}
              {countdown !== null && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(253,246,240,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 96, color: "#F4739A", fontFamily: "'Fraunces', serif", fontWeight: 800, animation: "pulse 0.8s ease-in-out", textShadow: "0 0 30px rgba(244,115,154,0.5)", filter: "drop-shadow(0 4px 14px rgba(244,115,154,0.6))" }}>{countdown}</div>
                </div>
              )}
              {/* Live dot */}
              {ready && (
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.45)", borderRadius: 20, padding: "4px 9px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF4060", animation: "liveDot 1s infinite" }} />
                  <span style={{ fontSize: 10, color: "#fff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em" }}>LIVE</span>
                </div>
              )}
            </>
          ) : (
            <img src={preview} alt="captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>

        {/* Controls */}
        {!preview ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: "rgba(255,240,248,0.3)" }}>
            <button onClick={() => setFlipped(f => !f)} style={{ background: "rgba(244,115,154,0.07)", border: `1px solid ${P.border}`, color: P.accent, borderRadius: 14, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              {flipped ? "⇄ Unflip" : "⇄ Flip"}
            </button>
            <button onClick={takePhoto} disabled={!ready || countdown !== null}
              style={{ width: 68, height: 68, borderRadius: "50%", background: ready ? "linear-gradient(135deg,#F4739A,#FFAB76)" : "#ddd", border: "none", cursor: ready ? "pointer" : "default", fontSize: 24, boxShadow: ready ? "0 6px 24px rgba(244,115,154,0.45)" : "none", transition: "transform 0.1s, box-shadow 0.2s", animation: ready ? "heartBeat 2.5s infinite" : "none" }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.9)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}>
              📷
            </button>
            <div style={{ width: 88 }} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, padding: "16px 20px", background: "rgba(255,240,248,0.3)" }}>
            <button onClick={retake} style={{ flex: 1, background: "rgba(244,115,154,0.06)", border: `1px solid ${P.border}`, color: P.accent, borderRadius: 14, padding: "12px 0", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>↺ Retake</button>
            <button onClick={confirmPhoto} style={{ flex: 2, background: "linear-gradient(135deg,#F4739A,#FFAB76)", border: "none", color: "white", borderRadius: 14, padding: "12px 0", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✓ Use this photo</button>
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 11, color: P.textSoft, padding: "0 20px 14px", fontFamily: "'DM Sans', sans-serif" }}>
          {!preview ? "3-second countdown before capture 🎀" : "Looks good? Use it or retake! ✨"}
        </p>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   UI PRIMITIVES
───────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 42, height: 24, borderRadius: 12, background: on ? "linear-gradient(90deg,#F4739A,#FFAB76)" : "rgba(200,180,180,0.18)", position: "relative", cursor: "pointer", border: "none", transition: "background 0.25s", flexShrink: 0, boxShadow: on ? "0 2px 8px rgba(244,115,154,0.3)" : "none" }}>
      <span style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "white", top: 3, left: on ? 21 : 3, transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

function Toast({ message }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#F4739A,#FFAB76)", color: "white", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, opacity: message ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none", zIndex: 9999, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(244,115,154,0.4)" }}>
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT ICON
───────────────────────────────────────────── */
function LayoutIcon({ id }) {
  const s = { background: "linear-gradient(135deg,rgba(244,115,154,0.5),rgba(255,171,118,0.5))", borderRadius: 3 };
  if (id === "classic") return <div style={{ ...s, width: 90, height: 104 }} />;
  if (id === "strip")   return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ ...s, width: 68, height: 40 }} />)}</div>;
  if (id === "grid")    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{[0,1,2,3].map(i => <div key={i} style={{ ...s, width: 44, height: 40 }} />)}</div>;
  if (id === "wide")    return <div style={{ ...s, width: 108, height: 54 }} />;
  if (id === "trio")    return <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ ...s, width: 34, height: 60 }} />)}</div>;
  if (id === "big5")    return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><div style={{ ...s, width: 100, height: 55 }} /><div style={{ display: "flex", gap: 3 }}>{[0,1,2,3].map(i => <div key={i} style={{ ...s, width: 22, height: 22 }} />)}</div></div>;
  return null;
}

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function Nav({ onBack, showBack = true }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: P.nav, backdropFilter: "blur(16px)", borderBottom: `1px solid ${P.border}` }}>
      {showBack
        ? <button onClick={onBack} style={{ fontSize: 13, color: P.accent, background: "rgba(244,115,154,0.07)", border: `1px solid ${P.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
        : <div style={{ width: 80 }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AnimatedCamera size={26} />
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: P.text, fontStyle: "italic" }}>Polaroid Booth</span>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {["Create","About"].map(n => (
          <span key={n} style={{ fontSize: 12, color: n === "Create" ? P.accent : P.textSoft, cursor: "pointer", fontWeight: n === "Create" ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>{n}</span>
        ))}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO PAGE
───────────────────────────────────────────── */
function HeroPage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <CuteBackground />
      <Nav showBack={false} />

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 24px 56px", textAlign: "center", animation: "slideUp 0.8s ease-out" }}>
        {/* Decorative reels */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          <FilmReelDecor size={44} color="#FFAB76" />
          <AnimatedCamera size={100} />
          <FilmReelDecor size={44} color="#A78BFA" />
        </div>
        <p style={{ fontSize: 11, color: P.accent, letterSpacing: "0.14em", marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✦ CLICK THE CAMERA ✦</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(42px,7.5vw,78px)", fontStyle: "italic", fontWeight: 800, lineHeight: 1.05, marginBottom: 14, color: P.text,
          background: "linear-gradient(135deg,#F4739A 0%,#FFAB76 50%,#A78BFA 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>
          Polaroid Booth
        </h1>
        <p style={{ fontSize: 16, color: P.textMid, maxWidth: 380, lineHeight: 1.85, marginBottom: 40 }}>
          Turn your photos & selfies into beautiful polaroid memories — with live filters, camera capture & kawaii stickers 🌸
        </p>
        <button onClick={onStart}
          style={{ background: "linear-gradient(135deg,#F4739A,#FFAB76)", color: "white", border: "none", padding: "17px 52px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: 40, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 8px 30px rgba(244,115,154,0.38)", transition: "transform 0.2s, box-shadow 0.2s", animation: "popIn 0.6s 0.3s both" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(244,115,154,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(244,115,154,0.38)"; }}>
          Start Creating ✨
        </button>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
          {["📷 Camera Selfie","🎞 6 Layouts","✦ 11 Live Filters","🌸 Scenes","✦ 60+ Stickers","⬇ Free Download"].map((p,i) => (
            <span key={p} style={{ background: "rgba(255,255,255,0.65)", color: P.textMid, padding: "7px 16px", borderRadius: 20, fontSize: 12, border: `1.5px solid ${P.border}`, backdropFilter: "blur(6px)", animation: `popIn 0.4s ${0.4+i*0.06}s both`, fontWeight: 500 }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Filter showcase */}
      <div style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(10px)", padding: "32px 24px", borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}` }}>
        <p style={{ textAlign: "center", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: P.accent, marginBottom: 20, fontWeight: 700 }}>✦ Live Filter Preview ✦</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {FILTERS.map(f => <FilterThumb key={f.id} filterCss={f.css} isActive={false} onClick={() => {}} label={f.label} />)}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ position: "relative", zIndex: 1, padding: "52px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: P.accent, marginBottom: 32, fontWeight: 700 }}>Why Polaroid Booth</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 16, maxWidth: 660, margin: "0 auto" }}>
          {[
            { icon: "📷", t: "Camera Mode",    d: "Live selfie with 3s countdown" },
            { icon: "🎞", t: "6 Layouts",       d: "Classic, Strip, Grid & more"  },
            { icon: "🎨", t: "11 Live Filters", d: "See every filter in real-time" },
            { icon: "🌸", t: "Scenes",           d: "Cartoon background overlays"  },
            { icon: "✦",  t: "60+ Stickers",    d: "Drag & drop anywhere"         },
            { icon: "⬇", t: "Download Free",   d: "Save instantly as PNG"         },
          ].map((f, i) => (
            <div key={f.t}
              style={{ padding: "22px 16px", background: "rgba(255,255,255,0.68)", backdropFilter: "blur(8px)", borderRadius: 20, border: `1.5px solid ${P.border}`, transition: "transform 0.22s, box-shadow 0.22s", animation: `slideUp 0.5s ${i*0.07}s both`, cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,115,154,0.18)"; e.currentTarget.style.borderColor = P.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = P.border; }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>{f.icon}</div>
              <strong style={{ fontSize: 13, display: "block", marginBottom: 5, color: P.text }}>{f.t}</strong>
              <span style={{ fontSize: 12, color: P.textSoft }}>{f.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, background: "rgba(255,240,248,0.6)", borderTop: `1px solid ${P.border}`, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 22, justifyContent: "center", marginBottom: 10 }}>
          {["Blog","About","Contact","Privacy","Terms"].map(l => (
            <span key={l} style={{ fontSize: 12, color: P.textSoft, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(150,100,100,0.4)" }}>© 2025 Polaroid Booth 🌸</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT PAGE
───────────────────────────────────────────── */
function LayoutPage({ onBack, onSelect }) {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <CuteBackground />
      <Nav onBack={onBack} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "52px 24px 32px", animation: "slideUp 0.6s ease-out" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontStyle: "italic", marginBottom: 8, color: P.text }}>Choose your layout</h2>
        <p style={{ fontSize: 14, color: P.textMid }}>Pick the format for your polaroid ✨</p>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 18, padding: "0 28px 72px", justifyContent: "center", flexWrap: "wrap" }}>
        {LAYOUTS.map((lay, idx) => (
          <div key={lay.id} onClick={() => onSelect(lay.id)}
            style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(10px)", borderRadius: 22, overflow: "hidden", cursor: "pointer", width: 168, border: `1.5px solid ${P.border}`, transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s", animation: `popIn 0.4s ${idx*0.07}s both` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-7px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 18px 44px rgba(244,115,154,0.22)"; e.currentTarget.style.borderColor = P.accent; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = P.border; }}>
            <div style={{ background: "linear-gradient(135deg,rgba(244,115,154,0.07),rgba(255,171,118,0.07))", padding: "24px 14px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minHeight: 148, justifyContent: "center", borderBottom: `1px solid ${P.border}` }}>
              <LayoutIcon id={lay.id} />
            </div>
            <div style={{ padding: "12px 14px 15px" }}>
              <strong style={{ fontSize: 14, fontWeight: 700, display: "block", color: P.text }}>{lay.label}</strong>
              <span style={{ fontSize: 12, color: P.textSoft, marginTop: 3, display: "block" }}>{lay.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDITOR PAGE
───────────────────────────────────────────── */
function EditorPage({ layout, onBack }) {
  const [images,     setImages]     = useState({});
  const [filter,     setFilter]     = useState("none");
  const [frame,      setFrame]      = useState("white");
  const [scene,      setScene]      = useState("none");
  const [caption,    setCaption]    = useState("");
  const [showDate,   setShowDate]   = useState(true);
  const [tilted,     setTilted]     = useState(false);
  const [activeTab,  setActiveTab]  = useState("filters");
  const [stickers,   setStickers]   = useState([]);
  const [stkCat,     setStkCat]     = useState("all");
  const [fontStyle,  setFontStyle]  = useState("serif");
  const [toast,      setToast]      = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraSlot, setCameraSlot] = useState(0);

  const fileRef    = useRef(null);
  const activeSlot = useRef(null);
  const dragRef    = useRef(null);
  const polaroidRef = useRef(null);
  const [shareUrl,       setShareUrl]       = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharing,        setSharing]        = useState(false);
  const [shareCopied,    setShareCopied]    = useState(false);

  const showToast = useCallback(msg => { setToast(msg); setTimeout(() => setToast(""), 2600); }, []);

  const handleDownload = async () => {
    const node = polaroidRef.current;
    if (!node) return;
    const btn = node.querySelector('button[title="Rotate"]');
    if (btn) btn.style.display = 'none';
    try {
      const canvas = await html2canvas(node, { useCORS: true, backgroundColor: null, scale: 2 });
      const a = document.createElement('a');
      a.download = 'polaroid.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      showToast('📷 Polaroid downloaded!');
    } catch { showToast('Download failed. Try again.'); }
    finally { if (btn) btn.style.display = ''; }
  };

  const handleShare = async () => {
    const node = polaroidRef.current;
    if (!node) return;
    setSharing(true);
    try {
      const state = { layout, images, filter, frame, scene, caption, showDate, tilted, stickers: stickers.map(s => ({ emoji: s.emoji, x: s.x, y: s.y })) };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gardens/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'polaroid', title: caption || 'My Polaroid', state }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (!data.id) throw new Error('No id returned');
      setShareUrl(`${window.location.origin}/shared-polaroid/${data.id}`);
      setShowShareModal(true);
    } catch (err) {
      console.error('Share error:', err);
      showToast(`Failed: ${err.message}`);
    } finally { setSharing(false); }
  };

  const copyShareLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); }
    catch { const t = document.createElement('textarea'); t.value = shareUrl; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    setShareCopied(true); setTimeout(() => setShareCopied(false), 2000);
  };

  const handleSlotClick = idx => { activeSlot.current = idx; fileRef.current?.click(); };
  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setImages(prev => ({ ...prev, [activeSlot.current]: ev.target.result }));
    reader.readAsDataURL(f); e.target.value = "";
  };

  const openCamera = () => {
    const slots = LAYOUTS.find(l => l.id === layout)?.slots || 1;
    const firstEmpty = [...Array(slots)].findIndex((_, i) => !images[i]);
    setCameraSlot(firstEmpty >= 0 ? firstEmpty : 0);
    setShowCamera(true);
  };

  const handleCapture = dataUrl => {
    setImages(prev => ({ ...prev, [cameraSlot]: dataUrl }));
    setShowCamera(false);
    showToast("📷 Photo captured!");
  };

  const addSticker = emoji => {
    setStickers(prev => [...prev, { id: Date.now() + Math.random(), emoji, x: 30 + Math.random() * 100, y: 20 + Math.random() * 80 }]);
    showToast("Double-tap sticker to remove ✨");
  };
  const removeSticker = id => setStickers(prev => prev.filter(s => s.id !== id));
  const handleStickerDragStart = id => e => {
    e.preventDefault();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const stk = stickers.find(s => s.id === id);
    if (stk) dragRef.current = { id, ox: cx - stk.x, oy: cy - stk.y };
  };

  useEffect(() => {
    const onMove = e => {
      if (!dragRef.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX, cy = e.touches ? e.touches[0].clientY : e.clientY;
      setStickers(prev => prev.map(s => s.id === dragRef.current.id ? { ...s, x: cx - dragRef.current.ox, y: cy - dragRef.current.oy } : s));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false }); window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [stickers]);

  const stickerProps = stickers.map(stk => ({ ...stk, onDragStart: handleStickerDragStart(stk.id), onRemove: () => removeSticker(stk.id) }));
  const activeFilter = FILTERS.find(f => f.id === filter) || FILTERS[0];

  const tabStyle = id => ({
    flex: 1, padding: "11px 4px", fontSize: 10, fontFamily: "'DM Sans', sans-serif",
    background: activeTab === id ? "rgba(244,115,154,0.09)" : "none",
    borderBottom: activeTab === id ? `2.5px solid ${P.accent}` : "2.5px solid transparent",
    border: "none", cursor: "pointer",
    color: activeTab === id ? P.accent : P.textSoft,
    fontWeight: activeTab === id ? 700 : 400, textTransform: "uppercase", letterSpacing: "0.03em",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "color 0.2s",
  });
  const pillStyle = active => ({
    padding: "5px 13px", borderRadius: 20, fontSize: 11, cursor: "pointer",
    background: active ? "linear-gradient(135deg,#F4739A,#FFAB76)" : "rgba(244,115,154,0.06)",
    border: active ? "none" : `1px solid ${P.border}`,
    fontFamily: "'DM Sans', sans-serif", color: active ? "white" : P.textMid, transition: "all 0.2s", fontWeight: active ? 600 : 400,
  });
  const chipStyle = active => ({
    padding: "7px 14px", borderRadius: 10, fontSize: 12, cursor: "pointer",
    border: `1.5px solid ${active ? P.accent : P.border}`,
    background: active ? "rgba(244,115,154,0.09)" : "rgba(255,255,255,0.4)",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
    color: active ? P.accent : P.textMid, fontWeight: active ? 600 : 400,
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden", background: P.bg }}>
      <CuteBackground />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      {showCamera && <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      <Nav onBack={onBack} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 56 }}>
        {/* Polaroid preview */}
        <div style={{ margin: "28px auto 0", position: "relative" }} ref={polaroidRef}>
          <Polaroid layout={layout} images={images} filter={filter} frame={frame} scene={scene} caption={caption} showDate={showDate} tilted={tilted} stickers={stickerProps} onSlotClick={handleSlotClick} />
          <button onClick={() => setTilted(t => !t)} title="Rotate"
            style={{ position: "absolute", top: -13, right: -13, width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#F4739A,#FFAB76)", border: "none", cursor: "pointer", fontSize: 14, color: "white", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(244,115,154,0.4)" }}>↻</button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={openCamera} style={{ background: "linear-gradient(135deg,#F4739A,#FFAB76)", color: "white", border: "none", padding: "11px 22px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 16px rgba(244,115,154,0.35)" }}>
            📷 Take Selfie
          </button>
          <button onClick={() => { activeSlot.current = 0; fileRef.current?.click(); }} style={{ background: "rgba(255,255,255,0.72)", color: P.accent, border: `1.5px solid ${P.border}`, padding: "11px 22px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 7, backdropFilter: "blur(6px)" }}>
            ↑ Upload
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", borderRadius: 22, margin: "20px 14px", border: `1.5px solid ${P.border}`, overflow: "hidden", width: "calc(100% - 28px)", maxWidth: 480, boxShadow: "0 4px 24px rgba(244,115,154,0.1)" }}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${P.border}` }}>
            {[
              { id: "filters",  icon: "🎞",  label: "FILTERS"  },
              { id: "scenes",   icon: "🌸",  label: "SCENES"   },
              { id: "stickers", icon: "✦",   label: "STICKERS" },
              { id: "frames",   icon: "▢",   label: "FRAMES"   },
              { id: "text",     icon: "Aa",  label: "TEXT"     },
            ].map(tab => (
              <button key={tab.id} style={tabStyle(tab.id)} onClick={() => setActiveTab(tab.id)}>
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* FILTERS */}
          {activeTab === "filters" && (
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "9px 13px", background: "rgba(244,115,154,0.06)", borderRadius: 12, border: `1px solid ${P.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ApertureSVG size={18} color={P.accent} opacity={1} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: P.accent }}>{activeFilter.label}</span>
                  <span style={{ fontSize: 10, color: P.textSoft }}>— {activeFilter.desc}</span>
                </div>
                {filter !== "none" && (
                  <button onClick={() => { setFilter("none"); showToast("Filter removed"); }}
                    style={{ fontSize: 10, color: P.textMid, background: "rgba(244,115,154,0.07)", border: `1px solid ${P.border}`, borderRadius: 8, padding: "3px 9px", cursor: "pointer" }}>Reset</button>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
                {FILTERS.map(f => (
                  <FilterThumb key={f.id} filterCss={f.css} isActive={filter === f.id} onClick={() => { setFilter(f.id); showToast(`✓ ${f.label} filter`); }} label={f.label} />
                ))}
              </div>
              <p style={{ fontSize: 10, color: P.textSoft, marginTop: 10, textAlign: "center" }}>Filters apply live to all your photos instantly 🎀</p>
            </div>
          )}

          {/* SCENES */}
          {activeTab === "scenes" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: P.textSoft, marginBottom: 12, fontWeight: 600 }}>Background Scene</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {SCENES.map(s => (
                  <div key={s.id} onClick={() => setScene(s.id)}
                    style={{ borderRadius: 14, height: 70, cursor: "pointer", border: `2px solid ${scene === s.id ? P.accent : P.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.2s", background: s.bg ? s.bg + "55" : "rgba(255,255,255,0.5)", transform: scene === s.id ? "scale(1.05)" : "none", boxShadow: scene === s.id ? `0 4px 12px rgba(244,115,154,0.25)` : "none" }}>
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <span style={{ fontSize: 10, color: scene === s.id ? P.accent : P.textMid, fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STICKERS */}
          {activeTab === "stickers" && (
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {["all","floral","cute","stars","love"].map(cat => (
                  <button key={cat} style={pillStyle(stkCat === cat)} onClick={() => setStkCat(cat)}>
                    {{ all: "All 🌟", floral: "Floral 🌸", cute: "Cute 🐱", stars: "Stars ⭐", love: "Love ❤️" }[cat]}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {(STICKERS[stkCat] || STICKERS.all).map((emoji, i) => (
                  <button key={i} onClick={() => addSticker(emoji)}
                    style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(244,115,154,0.06)", border: `1.5px solid ${P.border}`, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.25)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(244,115,154,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >{emoji}</button>
                ))}
              </div>
            </div>
          )}

          {/* FRAMES */}
          {activeTab === "frames" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: P.textSoft, marginBottom: 12, fontWeight: 600 }}>Frame Color</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FRAMES.map(f => <button key={f.id} style={chipStyle(frame === f.id)} onClick={() => setFrame(f.id)}>{f.label}</button>)}
              </div>
              <div style={{ height: 1, background: P.border, margin: "14px 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: P.textMid }}>Tilt polaroid 📐</span>
                <Toggle on={tilted} onChange={setTilted} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: P.textMid }}>Show date 📅</span>
                <Toggle on={showDate} onChange={setShowDate} />
              </div>
            </div>
          )}

          {/* TEXT */}
          {activeTab === "text" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: P.textSoft, marginBottom: 10, fontWeight: 600 }}>Caption</p>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add your caption..."
                style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${P.border}`, fontFamily: "'Caveat', cursive", fontStyle: "italic", fontSize: 16, background: "rgba(255,255,255,0.7)", outline: "none", color: P.text, boxSizing: "border-box", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = P.accent}
                onBlur={e => e.target.style.borderColor = P.border}
              />
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: P.textSoft, margin: "14px 0 10px", fontWeight: 600 }}>Font Style</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[
                  { id: "serif", label: "Caveat",  extra: { fontFamily: "'Caveat', cursive" } },
                  { id: "cute",  label: "Nunito",  extra: { fontFamily: "'Nunito', sans-serif" } },
                  { id: "mono",  label: "Mono",    extra: { fontFamily: "monospace" } },
                ].map(f => <button key={f.id} onClick={() => setFontStyle(f.id)} style={{ ...chipStyle(fontStyle === f.id), ...f.extra }}>{f.label}</button>)}
              </div>
            </div>
          )}
        </div>

        {/* Download + Share */}
        <div style={{ display: "flex", gap: 12, padding: "0 14px", width: "100%", maxWidth: 480 }}>
          <button onClick={handleDownload}
            style={{ flex: 1, background: "rgba(255,255,255,0.82)", color: P.accent, border: `1.5px solid ${P.border}`, padding: "15px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backdropFilter: "blur(6px)" }}>
            ↓ Download
          </button>
          <button onClick={handleShare} disabled={sharing}
            style={{ flex: 1, background: sharing ? "#ccc" : "linear-gradient(135deg,#F4739A,#FFAB76)", color: sharing ? P.textMid : "white", border: "none", padding: "15px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, borderRadius: 40, cursor: sharing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: sharing ? "none" : "0 4px 18px rgba(244,115,154,0.35)" }}>
            {sharing ? "Saving..." : "↗ Share"}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(253,246,240,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setShowShareModal(false)}>
          <div style={{ background: "white", borderRadius: 24, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(244,115,154,0.2), 0 0 0 1.5px rgba(244,115,154,0.15)", position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowShareModal(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: P.textMid }}>×</button>
            <h3 style={{ fontFamily: "'Fraunces', serif", color: P.text, fontSize: "1.4rem", marginBottom: 6, fontStyle: "italic" }}>📷 Share Your Polaroid</h3>
            <p style={{ color: P.textSoft, fontSize: "0.82rem", marginBottom: 18 }}>Anyone with this link can view your polaroid ✨</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input readOnly value={shareUrl} style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${P.border}`, background: "rgba(244,115,154,0.04)", color: P.textMid, fontSize: "0.78rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={copyShareLink} style={{ padding: "10px 16px", borderRadius: 12, background: shareCopied ? "#2d6015" : "linear-gradient(135deg,#F4739A,#FFAB76)", color: "white", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap", transition: "background 0.2s" }}>
                {shareCopied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {[["📱", "WhatsApp", `https://wa.me/?text=${encodeURIComponent("Check out my Polaroid! " + shareUrl)}`],
                ["🐦", "Twitter",  `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my Polaroid!")}&url=${encodeURIComponent(shareUrl)}`],
                ["✉️", "Email",    `mailto:?subject=${encodeURIComponent("My Polaroid")}&body=${encodeURIComponent("Check this out: " + shareUrl)}`]
              ].map(([icon, label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 16px", borderRadius: 14, background: "rgba(244,115,154,0.06)", border: `1.5px solid ${P.border}`, textDecoration: "none", color: P.textMid, fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,115,154,0.12)"; e.currentTarget.style.borderColor = P.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,115,154,0.06)"; e.currentTarget.style.borderColor = P.border; }}>
                  <span style={{ fontSize: "1.3rem" }}>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function PolaroidBooth() {
  const [page,   setPage]   = useState("hero");
  const [layout, setLayout] = useState("classic");

  return (
    <>
      <FontInjector />
      {page === "hero"   && <HeroPage onStart={() => setPage("layout")} />}
      {page === "layout" && <LayoutPage onBack={() => setPage("hero")} onSelect={l => { setLayout(l); setPage("editor"); }} />}
      {page === "editor" && <EditorPage layout={layout} onBack={() => setPage("layout")} />}
    </>
  );
}
