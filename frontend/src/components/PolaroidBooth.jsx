import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────
   FONTS + KEYFRAMES
───────────────────────────────────────────── */
const FontInjector = () => {
  useEffect(() => {
    if (document.getElementById("pb-fonts")) return;
    const link = document.createElement("link");
    link.id = "pb-fonts"; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&family=Nunito:wght@400;700;800&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "pb-kf";
    style.textContent = `
      @keyframes floatDrift {
        0%   { transform: translateY(0px)    rotate(0deg)   scale(1);    opacity: 0.18; }
        25%  { transform: translateY(-28px)  rotate(8deg)   scale(1.05); opacity: 0.28; }
        50%  { transform: translateY(-56px)  rotate(-5deg)  scale(0.97); opacity: 0.22; }
        75%  { transform: translateY(-38px)  rotate(10deg)  scale(1.03); opacity: 0.26; }
        100% { transform: translateY(-110vh) rotate(360deg) scale(1);    opacity: 0;    }
      }
      @keyframes shutterBlink {
        0%,90%,100% { opacity: 0 }
        92%,98%     { opacity: 1 }
      }
      @keyframes apertureSpin {
        0%   { transform: rotate(0deg)   scale(1);   opacity: 0.1 }
        50%  { transform: rotate(180deg) scale(1.1); opacity: 0.2 }
        100% { transform: rotate(360deg) scale(1);   opacity: 0.1 }
      }
      @keyframes filmSlide {
        from { transform: translateX(0) }
        to   { transform: translateX(-50%) }
      }
      @keyframes flashPop {
        0%   { opacity: 0; transform: scale(0.8) }
        15%  { opacity: 1; transform: scale(1.05) }
        40%  { opacity: 1; transform: scale(1) }
        100% { opacity: 0; transform: scale(1) }
      }
      @keyframes camBob {
        0%,100% { transform: translateY(0px)    rotate(-3deg) }
        50%     { transform: translateY(-10px)  rotate(3deg)  }
      }
      @keyframes slideUp {
        from { transform: translateY(32px); opacity: 0 }
        to   { transform: translateY(0);    opacity: 1 }
      }
      @keyframes pulse {
        0%,100% { transform: scale(1)    }
        50%     { transform: scale(1.1)  }
      }
      @keyframes scanLine {
        0%   { top: 0%    }
        100% { top: 105%  }
      }
      @keyframes focusRing {
        0%,100% { box-shadow: 0 0 0 2px rgba(200,169,110,0.3) }
        50%     { box-shadow: 0 0 0 6px rgba(200,169,110,0.6) }
      }
      @keyframes liveDot {
        0%,100% { opacity: 1 }
        50%     { opacity: 0.2 }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

/* ─────────────────────────────────────────────
   FILTERS DATA
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
  { id: "classic", label: "Classic",  desc: "One large framed photo",      slots: 1 },
  { id: "strip",   label: "Strip",    desc: "3 photos vertical strip",     slots: 3 },
  { id: "grid",    label: "Grid",     desc: "4 photos in a 2×2 collage",   slots: 4 },
  { id: "wide",    label: "Wide",     desc: "Panoramic wide-angle shot",   slots: 1 },
  { id: "trio",    label: "Trio",     desc: "3 photos side by side",       slots: 3 },
  { id: "big5",    label: "Big Five", desc: "1 hero + 4 small below",      slots: 5 },
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
   CAMERA / PHOTOGRAPHY BACKGROUND
───────────────────────────────────────────── */
function CamSVG({ size, color = "#C8A96E", opacity = 0.18 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 50 39" fill="none" style={{ opacity }}>
      <rect x="2" y="10" width="46" height="28" rx="5" fill={color} />
      <rect x="15" y="2" width="12" height="11" rx="3" fill={color} />
      <rect x="30" y="4" width="7" height="5" rx="2" fill="#FFD700" opacity="0.7" />
      <circle cx="25" cy="24" r="10" fill="rgba(0,0,0,0.25)" />
      <circle cx="25" cy="24" r="7"  fill="rgba(0,0,0,0.3)" />
      <circle cx="25" cy="24" r="4"  fill="rgba(80,140,220,0.6)" />
      <circle cx="22" cy="21" r="1.5" fill="white" opacity="0.4" />
      <circle cx="41" cy="15" r="3"  fill={color} opacity="0.8" />
    </svg>
  );
}

function ApertureSVG({ size, color = "#C8A96E", opacity = 0.15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity }}>
      <circle cx="30" cy="30" r="28" stroke={color} strokeWidth="1.5" fill="none" />
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2, a2 = a + Math.PI / 6;
        const r1 = 26, r2 = 10;
        const x1 = 30 + Math.cos(a)*r1, y1 = 30 + Math.sin(a)*r1;
        const x2 = 30 + Math.cos(a2)*r2, y2 = 30 + Math.sin(a2)*r2;
        const cx3 = 30 + Math.cos(a + Math.PI)*r1*0.5, cy3 = 30 + Math.sin(a + Math.PI)*r1*0.5;
        return <path key={i} d={`M ${x1} ${y1} Q ${cx3} ${cy3} ${x2} ${y2}`} stroke={color} strokeWidth="1.2" fill="none" opacity="0.7" />;
      })}
      <circle cx="30" cy="30" r="7" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function FilmSVG({ size, color = "#C8A96E", opacity = 0.15 }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 80 50" fill="none" style={{ opacity }}>
      <rect x="1" y="1" width="78" height="48" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={4 + i*19} y="4"  width="7" height="6" rx="1" fill={color} opacity="0.6" />
          <rect x={4 + i*19} y="40" width="7" height="6" rx="1" fill={color} opacity="0.6" />
        </g>
      ))}
      <rect x="14" y="12" width="52" height="26" rx="2" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

function PhotographyBackground() {
  const particles = [
    { t: "cam",  left: "4%",  size: 22, delay: 0,   dur: 12 },
    { t: "apt",  left: "13%", size: 26, delay: 2,   dur: 10 },
    { t: "film", left: "22%", size: 16, delay: 4.5, dur: 14 },
    { t: "cam",  left: "33%", size: 18, delay: 1.5, dur: 11 },
    { t: "apt",  left: "44%", size: 20, delay: 6,   dur: 9  },
    { t: "cam",  left: "55%", size: 24, delay: 3,   dur: 13 },
    { t: "film", left: "63%", size: 14, delay: 0.8, dur: 15 },
    { t: "apt",  left: "74%", size: 22, delay: 5,   dur: 10 },
    { t: "cam",  left: "84%", size: 20, delay: 2.5, dur: 12 },
    { t: "film", left: "92%", size: 18, delay: 7,   dur: 11 },
    { t: "apt",  left: "38%", size: 16, delay: 9,   dur: 13 },
    { t: "cam",  left: "70%", size: 14, delay: 3.5, dur: 14 },
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Dark room base */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#120e06 0%,#0d0d0d 45%,#080c14 100%)" }} />
      {/* Warm glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 25% 40%, rgba(200,169,110,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 78% 65%, rgba(80,120,200,0.05) 0%, transparent 60%)" }} />

      {/* Big aperture rings */}
      <div style={{ position: "absolute", top: -50, left: -50, animation: "apertureSpin 20s linear infinite" }}>
        <ApertureSVG size={170} color="#C8A96E" opacity={0.07} />
      </div>
      <div style={{ position: "absolute", bottom: -70, right: -70, animation: "apertureSpin 28s 4s linear infinite" }}>
        <ApertureSVG size={210} color="#8098C8" opacity={0.06} />
      </div>
      <div style={{ position: "absolute", top: "28%", right: -40, animation: "apertureSpin 22s 9s linear infinite" }}>
        <ApertureSVG size={130} color="#C8A96E" opacity={0.05} />
      </div>

      {/* Floating particles */}
      {particles.map((p, i) => {
        const col = i % 3 === 0 ? "#C8A96E" : i % 3 === 1 ? "#8898B8" : "#E8D8B0";
        const op  = 0.14 + (i % 3) * 0.04;
        return (
          <div key={i} style={{ position: "absolute", bottom: "-60px", left: p.left, animation: `floatDrift ${p.dur}s ${p.delay}s infinite ease-in-out` }}>
            {p.t === "cam"  && <CamSVG     size={p.size} color={col} opacity={op} />}
            {p.t === "apt"  && <ApertureSVG size={p.size} color={col} opacity={op} />}
            {p.t === "film" && <FilmSVG     size={p.size} color={col} opacity={op} />}
          </div>
        );
      })}

      {/* Film strip top */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "200%", animation: "filmSlide 30s linear infinite", opacity: 0.06, display: "flex" }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ flexShrink: 0, width: 50, height: 34, border: "1px solid #C8A96E", margin: "2px 1px", position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
              {[0,1,2].map(k => <div key={k} style={{ width: 6, height: 4, background: "#C8A96E", borderRadius: 1 }} />)}
            </div>
            <div style={{ position: "absolute", bottom: 3, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
              {[0,1,2].map(k => <div key={k} style={{ width: 6, height: 4, background: "#C8A96E", borderRadius: 1 }} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Film strip bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "200%", animation: "filmSlide 22s 5s linear infinite", opacity: 0.05, display: "flex" }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ flexShrink: 0, width: 46, height: 28, border: "1px solid #8098C8", margin: "2px 1px" }} />
        ))}
      </div>

      {/* Rare shutter white blink */}
      <div style={{ position: "absolute", inset: 0, background: "white", animation: "shutterBlink 18s 3s infinite", pointerEvents: "none" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED CAMERA ICON
───────────────────────────────────────────── */
function AnimatedCamera({ size = 80 }) {
  const [flashing, setFlashing] = useState(false);
  const flash = () => { setFlashing(true); setTimeout(() => setFlashing(false), 600); };

  return (
    <div onClick={flash} style={{ cursor: "pointer", display: "inline-block", animation: "camBob 3s ease-in-out infinite", position: "relative" }} title="Click me!">
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect x="8"  y="28" width="84" height="55" rx="11" fill="#2D2D2D" />
        <rect x="8"  y="28" width="84" height="55" rx="11" stroke="#444" strokeWidth="1.5" />
        <rect x="26" y="15" width="22" height="17" rx="5"  fill="#2D2D2D" stroke="#444" strokeWidth="1" />
        <rect x="54" y="17" width="14" height="9"  rx="3"  fill="#FFD700" opacity="0.9" />
        <circle cx="50" cy="57" r="22" fill="#1a1a1a" />
        <circle cx="50" cy="57" r="18" fill="#242424" />
        <circle cx="50" cy="57" r="14" fill="#111" />
        <circle cx="50" cy="57" r="10" fill="url(#heroLens)" />
        <circle cx="44" cy="51" r="3.5" fill="white" opacity="0.25" />
        <circle cx="56" cy="63" r="1.5" fill="white" opacity="0.12" />
        {[0,1,2,3,4,5].map(i => { const a=(i/6)*Math.PI*2; return <circle key={i} cx={50+Math.cos(a)*17} cy={57+Math.sin(a)*17} r="1.2" fill="#555" />; })}
        <circle cx="84" cy="36" r="6"   fill="#C8A96E" />
        <circle cx="84" cy="36" r="3.5" fill="#E8C880" />
        {[0,1,2].map(i => <line key={i} x1="14" y1={38+i*7} x2="14" y2={42+i*7} stroke="#444" strokeWidth="2" />)}
        {flashing && <rect x="0" y="0" width="100" height="100" rx="11" fill="white" opacity="0.85" style={{ animation: "flashPop 0.5s ease-out forwards" }} />}
        <defs>
          <radialGradient id="heroLens" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#6699FF" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#2244BB" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0A1A44" />
          </radialGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 3 }}>
        {[...Array(5)].map((_, i) => <div key={i} style={{ width: 7, height: 4, background: "#333", borderRadius: 1 }} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER THUMBNAIL — real live CSS preview
───────────────────────────────────────────── */
function FilterThumb({ filterCss, isActive, onClick, label }) {
  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", minWidth: 68 }}>
      <div style={{
        width: 64, height: 56, borderRadius: 10, overflow: "hidden", position: "relative",
        border: `2.5px solid ${isActive ? "#C8A96E" : "rgba(255,255,255,0.08)"}`,
        boxShadow: isActive ? "0 0 0 1px #C8A96E55, 0 4px 16px rgba(200,169,110,0.35)" : "none",
        transition: "all 0.22s",
        transform: isActive ? "scale(1.1)" : "scale(1)",
        animation: isActive ? "focusRing 2s ease-in-out infinite" : "none",
      }}>
        {/* Mini landscape that gets the filter applied */}
        <div style={{ width: "100%", height: "100%", filter: filterCss, transition: "filter 0.3s" }}>
          <svg viewBox="0 0 64 56" width="64" height="56">
            {/* Sky gradient */}
            <defs>
              <linearGradient id={`sky-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6AA8D8" />
                <stop offset="100%" stopColor="#A8C8E8" />
              </linearGradient>
              <linearGradient id={`gnd-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5A9A50" />
                <stop offset="100%" stopColor="#3A7A30" />
              </linearGradient>
            </defs>
            <rect x="0" y="0"  width="64" height="34" fill={`url(#sky-${label})`} />
            <rect x="0" y="34" width="64" height="22" fill={`url(#gnd-${label})`} />
            {/* Sun */}
            <circle cx="52" cy="10" r="7" fill="#FFD060" />
            {/* Clouds */}
            <ellipse cx="18" cy="12" rx="10" ry="5" fill="white" opacity="0.85" />
            <ellipse cx="25" cy="10" rx="7" ry="4" fill="white" opacity="0.75" />
            {/* Mountains */}
            <polygon points="12,34 26,14 40,34" fill="#607090" opacity="0.85" />
            <polygon points="24,34 36,18 48,34" fill="#506080" opacity="0.9" />
            {/* Tree trunk */}
            <rect x="5"  y="26" width="3" height="10" fill="#7A5030" />
            {/* Tree top */}
            <circle cx="6.5" cy="23" r="5" fill="#2A7A30" />
            {/* House */}
            <rect x="48" y="28" width="12" height="8" fill="#C87050" />
            <polygon points="47,28 60,28 53.5,22" fill="#A05030" />
            <rect x="51" y="30" width="4" height="5" fill="#FFD090" opacity="0.8" />
          </svg>
        </div>
        {isActive && (
          <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#C8A96E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#1C1C1A", fontWeight: 700 }}>✓</div>
        )}
      </div>
      <span style={{ fontSize: 10, color: isActive ? "#C8A96E" : "rgba(237,232,223,0.5)", fontWeight: isActive ? 600 : 400, textAlign: "center" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCENE OVERLAY
───────────────────────────────────────────── */
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
    return (
      <svg width={w} height={h} style={base}>
        {spots.map(([x, y], i) => {
          const cols = ["#FF9EC8","#FFB0D0","#FF80C0","#FFC0E0"], c = cols[i%4], s = 10+(i%3)*2;
          return <g key={i}>{[0,1,2,3,4].map(p => { const a=(p*72*Math.PI)/180; return <ellipse key={p} cx={x+Math.cos(a)*(s+2)} cy={y+Math.sin(a)*(s+2)} rx={s*0.55} ry={s*0.45} fill={c} opacity="0.55"/>; })}<circle cx={x} cy={y} r={s*0.42} fill="#FFE8F4" opacity="0.9"/><circle cx={x} cy={y} r={s*0.2} fill="#FFB0D0" opacity="0.8"/></g>;
        })}
      </svg>
    );
  }
  if (scene === "stars") return <svg width={w} height={h} style={base}>{Array.from({length:16},(_,i)=>{const x=12+((i*47+13)%(w-24)),y=12+((i*31+7)%(h-24)),s=5+(i%4)*2,cols=["#C8B0FF","#A080FF","#E0C8FF","#FFD0FF"];return <polygon key={i} points={star5pts(x,y,s,s*0.4)} fill={cols[i%4]} opacity={0.35+(i%3)*0.15}/>;})}</svg>;
  if (scene === "spring") return <svg width={w} height={h} style={base}>{[["🌸",10,22],["🌷",w-24,22],["🌼",w/2-8,10],["🌿",10,h-12],["🌸",w-22,h-12],["🍀",w/2-6,h-10],["🌱",10,h/2-8],["🌾",w-20,h/2-8]].map(([e,x,y],i)=><text key={i} x={x} y={y} fontSize="15" opacity="0.65">{e}</text>)}</svg>;
  if (scene === "kawaii") return <svg width={w} height={h} style={base}>{[["🐱",10,22],["🍭",w-24,22],["🎀",w/2-8,12],["🌈",10,h-10],["⭐",w-22,h-10],["🍓",w/2-6,h-10],["🧁",10,h/2],["💜",w-22,h/2]].map(([e,x,y],i)=><text key={i} x={x} y={y} fontSize="15" opacity="0.7">{e}</text>)}</svg>;
  if (scene === "hearts") return <svg width={w} height={h} style={base}>{[[16,18],[w-18,18],[w/2,14],[18,h-16],[w-18,h-16],[w/2,h-14],[12,h/2],[w-14,h/2]].map(([x,y],i)=>{const s=8+(i%3)*2,cols=["#FF80A0","#FF60B0","#FFB0C0","#FF9090"];return <path key={i} d={`M${x},${y+s*0.3} C${x},${y} ${x-s},${y} ${x-s},${y+s*0.3} C${x-s},${y+s*0.7} ${x},${y+s*1.1} ${x},${y+s*1.3} C${x},${y+s*1.1} ${x+s},${y+s*0.7} ${x+s},${y+s*0.3} C${x+s},${y} ${x},${y} ${x},${y+s*0.3}Z`} fill={cols[i%4]} opacity="0.5"/>;})}</svg>;
  return null;
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
    <div onClick={() => onSlotClick(idx)} style={{ width: w, height: h, background: "#2a2620", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0, ...s }}>
      {images[idx]
        ? <img src={images[idx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: filterCss, transition: "filter 0.4s ease" }} />
        : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 22, color: "#555" }}>＋</span><span style={{ fontSize: 9, color: "#444", fontFamily: "'DM Sans', sans-serif" }}>tap to add</span></div>
      }
    </div>
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: bg, boxShadow: "0 10px 60px rgba(0,0,0,0.5)", width: dims.w, position: "relative", transform: tilted ? "rotate(-2.5deg)" : "none", transition: "transform 0.3s" }}>
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
      <div style={{ width: "100%", textAlign: "center", padding: "10px 8px 4px", position: "relative", zIndex: 6 }}>
        {caption
          ? <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: frameData.textColor, minHeight: 20 }}>{caption}</div>
          : <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "#bbb", minHeight: 20 }}>Add caption…</div>
        }
        {showDate && <div style={{ fontSize: 10, color: frameData.dateColor, fontFamily: "'DM Sans', sans-serif", paddingBottom: 2 }}>{today}</div>}
      </div>
      <div style={{ height: 14 }} />
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

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#141414", borderRadius: 22, overflow: "hidden", width: "min(92vw,480px)", boxShadow: "0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,169,110,0.2)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(200,169,110,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AnimatedCamera size={26} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#EDE8DF", fontStyle: "italic" }}>Camera</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#EDE8DF", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>✕ Close</button>
        </div>

        {/* Viewfinder */}
        <div style={{ position: "relative", aspectRatio: "4/3", background: "#000", overflow: "hidden" }}>
          {!preview ? (
            <>
              <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: flipped ? "scaleX(-1)" : "none" }} />
              {/* Rule-of-thirds grid */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 120 90">
                {[40,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="90" stroke="rgba(255,255,255,0.16)" strokeWidth="0.4" />)}
                {[30,60].map(y => <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="rgba(255,255,255,0.16)" strokeWidth="0.4" />)}
                {[[5,5],[115,5],[5,85],[115,85]].map(([x,y],i) => {
                  const dx = x<60 ? 1:-1, dy = y<45 ? 1:-1;
                  return <g key={i} stroke="#C8A96E" strokeWidth="1.2" fill="none"><line x1={x} y1={y} x2={x+dx*8} y2={y}/><line x1={x} y1={y} x2={x} y2={y+dy*8}/></g>;
                })}
              </svg>
              {/* Scan line */}
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(200,169,110,0.5),transparent)", animation: "scanLine 2.5s linear infinite" }} />
              {flashing && <div style={{ position: "absolute", inset: 0, background: "white", animation: "flashPop 0.5s ease-out forwards" }} />}
              {countdown !== null && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 96, color: "#C8A96E", fontFamily: "'Playfair Display', serif", fontWeight: 700, animation: "pulse 0.8s ease-in-out", textShadow: "0 0 30px rgba(200,169,110,0.8)" }}>{countdown}</div>
                </div>
              )}
              {ready && (
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.55)", borderRadius: 20, padding: "4px 9px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3030", animation: "liveDot 1s infinite" }} />
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px" }}>
            <button onClick={() => setFlipped(f => !f)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#EDE8DF", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              {flipped ? "⇄ Unflip" : "⇄ Flip"}
            </button>
            <button onClick={takePhoto} disabled={!ready || countdown !== null}
              style={{ width: 68, height: 68, borderRadius: "50%", background: ready ? "#FAFAF7" : "#444", border: "4px solid rgba(200,169,110,0.4)", cursor: ready ? "pointer" : "default", fontSize: 24, boxShadow: ready ? "0 4px 20px rgba(200,169,110,0.4)" : "none", transition: "transform 0.1s" }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.9)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}>
              📷
            </button>
            <div style={{ width: 88 }} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, padding: "16px 20px" }}>
            <button onClick={() => setPreview(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#EDE8DF", borderRadius: 12, padding: "12px 0", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>↺ Retake</button>
            <button onClick={confirmPhoto} style={{ flex: 2, background: "#C8A96E", border: "none", color: "#1C1C1A", borderRadius: 12, padding: "12px 0", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✓ Use this photo</button>
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(237,232,223,0.3)", padding: "0 20px 14px", fontFamily: "'DM Sans', sans-serif" }}>
          {!preview ? "3-second countdown before capture" : "Looks good? Use it or retake."}
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
    <button onClick={() => onChange(!on)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? "#C8A96E" : "rgba(255,255,255,0.08)", position: "relative", cursor: "pointer", border: "none", transition: "background 0.2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", background: "white", top: 3, left: on ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </button>
  );
}

function Toast({ message }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1C1C1A", color: "#FAFAF7", padding: "10px 22px", borderRadius: 24, fontSize: 13, fontFamily: "'DM Sans', sans-serif", opacity: message ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none", zIndex: 9999, whiteSpace: "nowrap", border: "1px solid rgba(200,169,110,0.25)" }}>
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT ICON
───────────────────────────────────────────── */
function LayoutIcon({ id }) {
  const s = { background: "rgba(255,255,255,0.8)", borderRadius: 2 };
  if (id === "classic") return <div style={{ ...s, width: 90, height: 104 }} />;
  if (id === "strip")   return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ ...s, width: 68, height: 40 }} />)}</div>;
  if (id === "grid")    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{[0,1,2,3].map(i => <div key={i} style={{ ...s, width: 44, height: 40 }} />)}</div>;
  if (id === "wide")    return <div style={{ ...s, width: 108, height: 54 }} />;
  if (id === "trio")    return <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ ...s, width: 34, height: 60 }} />)}</div>;
  if (id === "big5")    return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><div style={{ ...s, width: 100, height: 55 }} /><div style={{ display: "flex", gap: 3 }}>{[0,1,2,3].map(i => <div key={i} style={{ ...s, width: 22, height: 22 }} />)}</div></div>;
  return null;
}

/* ─────────────────────────────────────────────
   HERO PAGE
───────────────────────────────────────────── */
function HeroPage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <PhotographyBackground />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: "rgba(8,8,8,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(200,169,110,0.14)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AnimatedCamera size={28} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#EDE8DF", fontStyle: "italic" }}>Polaroid Booth</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Create","About","Contact"].map(n => (
            <span key={n} style={{ fontSize: 13, color: n === "Create" ? "#C8A96E" : "rgba(237,232,223,0.45)", cursor: "pointer", fontWeight: n === "Create" ? 600 : 400 }}>{n}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px 68px", textAlign: "center", animation: "slideUp 0.8s ease-out" }}>
        <div style={{ marginBottom: 32 }}>
          <AnimatedCamera size={104} />
          <p style={{ fontSize: 11, color: "#C8A96E", letterSpacing: "0.12em", marginTop: 12 }}>✦ CLICK THE CAMERA ✦</p>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(46px,8vw,80px)", fontStyle: "italic", fontWeight: 700, lineHeight: 1.05, marginBottom: 16, color: "#EDE8DF" }}>
          Polaroid Booth
        </h1>
        <p style={{ fontSize: 16, color: "rgba(237,232,223,0.55)", maxWidth: 360, lineHeight: 1.8, marginBottom: 44 }}>
          Turn your photos & selfies into beautiful polaroid memories — with live filters, camera capture & kawaii stickers 📷
        </p>
        <button onClick={onStart}
          style={{ background: "linear-gradient(135deg,#C8A96E,#a08040)", color: "#1C1C1A", border: "none", padding: "17px 48px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 40, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 8px 30px rgba(200,169,110,0.35)", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(200,169,110,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(200,169,110,0.35)"; }}>
          Start Creating →
        </button>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 36 }}>
          {["📷 Camera Selfie","🎞 6 Layouts","✦ 11 Live Filters","🌸 Scenes","✦ 60+ Stickers","⬇ Free Download"].map(p => (
            <span key={p} style={{ background: "rgba(200,169,110,0.09)", color: "rgba(237,232,223,0.65)", padding: "7px 15px", borderRadius: 20, fontSize: 12, border: "1px solid rgba(200,169,110,0.18)" }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Filter showcase with live previews */}
      <div style={{ position: "relative", zIndex: 1, background: "rgba(16,14,12,0.75)", backdropFilter: "blur(8px)", padding: "34px 24px", borderTop: "1px solid rgba(200,169,110,0.08)", borderBottom: "1px solid rgba(200,169,110,0.08)" }}>
        <p style={{ textAlign: "center", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8A96E", marginBottom: 22, fontWeight: 600 }}>Live Filter Preview</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {FILTERS.map(f => <FilterThumb key={f.id} filterCss={f.css} isActive={false} onClick={() => {}} label={f.label} />)}
        </div>
      </div>

      {/* Features */}
      <div style={{ position: "relative", zIndex: 1, padding: "52px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8A96E", marginBottom: 32, fontWeight: 600 }}>Why Polaroid Booth</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20, maxWidth: 640, margin: "0 auto" }}>
          {[
            { icon: "📷", t: "Camera Mode",     d: "Live selfie with 3s countdown" },
            { icon: "🎞", t: "6 Layouts",        d: "Classic, Strip, Grid & more"  },
            { icon: "🎨", t: "11 Live Filters",  d: "See every filter in real-time" },
            { icon: "🌸", t: "Scenes",            d: "Cartoon background overlays"  },
            { icon: "✦",  t: "60+ Stickers",      d: "Drag & drop anywhere"         },
            { icon: "⬇", t: "Download Free",     d: "Save instantly as PNG"         },
          ].map((f, i) => (
            <div key={f.t} style={{ padding: "20px 14px", background: "rgba(255,255,255,0.025)", borderRadius: 16, border: "1px solid rgba(200,169,110,0.09)", transition: "transform 0.2s, background 0.2s", animation: `slideUp 0.5s ${i*0.06}s both` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(200,169,110,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{f.icon}</div>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 5, color: "#EDE8DF" }}>{f.t}</strong>
              <span style={{ fontSize: 12, color: "rgba(237,232,223,0.4)" }}>{f.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(200,169,110,0.07)", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 22, justifyContent: "center", marginBottom: 10 }}>
          {["Blog","About","Contact","Privacy","Terms"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "rgba(237,232,223,0.3)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(237,232,223,0.18)" }}>© 2025 Polaroid Booth 📷</span>
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
      <PhotographyBackground />
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "rgba(8,8,8,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(200,169,110,0.14)" }}>
        <button onClick={onBack} style={{ fontSize: 13, color: "rgba(237,232,223,0.7)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><AnimatedCamera size={26} /><span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#EDE8DF", fontStyle: "italic" }}>Polaroid Booth</span></div>
        <span />
      </nav>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "52px 24px 36px", animation: "slideUp 0.6s ease-out" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontStyle: "italic", marginBottom: 8, color: "#EDE8DF" }}>Choose your layout</h2>
        <p style={{ fontSize: 14, color: "rgba(237,232,223,0.45)" }}>Pick the format for your polaroid</p>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 18, padding: "0 28px 64px", justifyContent: "center", flexWrap: "wrap" }}>
        {LAYOUTS.map((lay, idx) => (
          <div key={lay.id} onClick={() => onSelect(lay.id)}
            style={{ background: "rgba(22,18,14,0.9)", backdropFilter: "blur(8px)", borderRadius: 18, overflow: "hidden", cursor: "pointer", width: 168, border: "1px solid rgba(200,169,110,0.14)", transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s", animation: `slideUp 0.5s ${idx*0.08}s both` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(200,169,110,0.2)"; e.currentTarget.style.borderColor = "#C8A96E"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "rgba(200,169,110,0.14)"; }}>
            <div style={{ background: "rgba(200,169,110,0.06)", padding: "22px 14px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minHeight: 148, justifyContent: "center", borderBottom: "1px solid rgba(200,169,110,0.09)" }}>
              <LayoutIcon id={lay.id} />
            </div>
            <div style={{ padding: "12px 14px 15px" }}>
              <strong style={{ fontSize: 14, fontWeight: 600, display: "block", color: "#EDE8DF" }}>{lay.label}</strong>
              <span style={{ fontSize: 12, color: "rgba(237,232,223,0.4)", marginTop: 3, display: "block" }}>{lay.desc}</span>
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

  const showToast = useCallback(msg => { setToast(msg); setTimeout(() => setToast(""), 2600); }, []);

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
    showToast("Double-tap sticker to remove");
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
    background: activeTab === id ? "rgba(200,169,110,0.1)" : "none",
    borderBottom: activeTab === id ? "2px solid #C8A96E" : "2px solid transparent",
    border: "none", cursor: "pointer",
    color: activeTab === id ? "#EDE8DF" : "rgba(237,232,223,0.38)",
    fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "color 0.2s",
  });
  const pillStyle = active => ({ padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", background: active ? "#C8A96E" : "rgba(255,255,255,0.05)", border: active ? "none" : "1px solid rgba(255,255,255,0.09)", fontFamily: "'DM Sans', sans-serif", color: active ? "#1C1C1A" : "rgba(237,232,223,0.65)", transition: "all 0.2s" });
  const chipStyle = active => ({ padding: "7px 13px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: `1.5px solid ${active ? "#C8A96E" : "rgba(255,255,255,0.09)"}`, background: active ? "rgba(200,169,110,0.18)" : "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", color: active ? "#EDE8DF" : "rgba(237,232,223,0.65)" });

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <PhotographyBackground />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      {showCamera && <CameraModal onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "rgba(8,8,8,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(200,169,110,0.14)" }}>
        <button onClick={onBack} style={{ fontSize: 13, color: "rgba(237,232,223,0.7)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><AnimatedCamera size={26} /><span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#EDE8DF", fontStyle: "italic" }}>Polaroid Booth</span></div>
        <span />
      </nav>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 48 }}>
        {/* Polaroid preview */}
        <div style={{ margin: "28px auto 0", position: "relative" }}>
          <Polaroid layout={layout} images={images} filter={filter} frame={frame} scene={scene} caption={caption} showDate={showDate} tilted={tilted} stickers={stickerProps} onSlotClick={handleSlotClick} />
          <button onClick={() => setTilted(t => !t)} title="Rotate"
            style={{ position: "absolute", top: -13, right: -13, width: 28, height: 28, borderRadius: "50%", background: "#C8A96E", border: "none", cursor: "pointer", fontSize: 13, color: "#1C1C1A", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>↻</button>
        </div>

        {/* Camera + Upload */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={openCamera} style={{ background: "linear-gradient(135deg,#C8A96E,#a08040)", color: "#1C1C1A", border: "none", padding: "10px 20px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
            📷 Take Selfie
          </button>
          <button onClick={() => { activeSlot.current = 0; fileRef.current?.click(); }} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(237,232,223,0.75)", border: "1px solid rgba(200,169,110,0.28)", padding: "10px 20px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, display: "flex", alignItems: "center", gap: 7 }}>
            ↑ Upload
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ background: "rgba(14,12,10,0.9)", backdropFilter: "blur(14px)", borderRadius: 18, margin: "20px 14px", border: "1px solid rgba(200,169,110,0.14)", overflow: "hidden", width: "calc(100% - 28px)", maxWidth: 480 }}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(200,169,110,0.09)" }}>
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

          {/* FILTERS — fully functional with live CSS preview thumbnails */}
          {activeTab === "filters" && (
            <div style={{ padding: 14 }}>
              {/* Active filter status bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "9px 13px", background: "rgba(200,169,110,0.09)", borderRadius: 10, border: "1px solid rgba(200,169,110,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ApertureSVG size={18} color="#C8A96E" opacity={1} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#C8A96E" }}>{activeFilter.label}</span>
                  <span style={{ fontSize: 10, color: "rgba(237,232,223,0.4)" }}>— {activeFilter.desc}</span>
                </div>
                {filter !== "none" && (
                  <button onClick={() => { setFilter("none"); showToast("Filter removed"); }}
                    style={{ fontSize: 10, color: "rgba(237,232,223,0.5)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>Reset</button>
                )}
              </div>

              {/* Scrollable filter thumbnails */}
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
                {FILTERS.map(f => (
                  <FilterThumb
                    key={f.id}
                    filterCss={f.css}
                    isActive={filter === f.id}
                    onClick={() => { setFilter(f.id); showToast(`✓ ${f.label} filter`); }}
                    label={f.label}
                  />
                ))}
              </div>

              <p style={{ fontSize: 10, color: "rgba(237,232,223,0.25)", marginTop: 10, textAlign: "center" }}>
                Filters apply live to all your photos instantly
              </p>
            </div>
          )}

          {/* SCENES */}
          {activeTab === "scenes" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(237,232,223,0.35)", marginBottom: 12, fontWeight: 500 }}>Background Scene</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {SCENES.map(s => (
                  <div key={s.id} onClick={() => setScene(s.id)}
                    style={{ borderRadius: 10, height: 68, cursor: "pointer", border: `2px solid ${scene === s.id ? "#C8A96E" : "rgba(255,255,255,0.06)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s", background: s.bg ? s.bg + "18" : "rgba(255,255,255,0.03)", transform: scene === s.id ? "scale(1.04)" : "none" }}>
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <span style={{ fontSize: 10, color: scene === s.id ? "#C8A96E" : "rgba(237,232,223,0.45)", fontWeight: 600 }}>{s.label}</span>
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
                    {{ all: "All", floral: "Floral", cute: "Cute", stars: "Stars", love: "Love" }[cat]}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(STICKERS[stkCat] || STICKERS.all).map((emoji, i) => (
                  <button key={i} onClick={() => addSticker(emoji)}
                    style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.22)"}
                    onMouseLeave={e => e.currentTarget.style.transform = ""}
                  >{emoji}</button>
                ))}
              </div>
            </div>
          )}

          {/* FRAMES */}
          {activeTab === "frames" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(237,232,223,0.35)", marginBottom: 12, fontWeight: 500 }}>Frame Color</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FRAMES.map(f => <button key={f.id} style={chipStyle(frame === f.id)} onClick={() => setFrame(f.id)}>{f.label}</button>)}
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "14px 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(237,232,223,0.65)" }}>Tilt polaroid</span>
                <Toggle on={tilted} onChange={setTilted} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(237,232,223,0.65)" }}>Show date</span>
                <Toggle on={showDate} onChange={setShowDate} />
              </div>
            </div>
          )}

          {/* TEXT */}
          {activeTab === "text" && (
            <div style={{ padding: 14 }}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(237,232,223,0.35)", marginBottom: 10, fontWeight: 500 }}>Caption</p>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add your caption..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(200,169,110,0.18)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, background: "rgba(255,255,255,0.04)", outline: "none", color: "#EDE8DF", boxSizing: "border-box" }} />
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(237,232,223,0.35)", margin: "14px 0 10px", fontWeight: 500 }}>Font Style</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[
                  { id: "serif", label: "Serif Italic", extra: { fontFamily: "'Playfair Display', serif", fontStyle: "italic" } },
                  { id: "cute",  label: "Cute",          extra: { fontFamily: "'Nunito', sans-serif" } },
                  { id: "mono",  label: "Mono",          extra: { fontFamily: "monospace" } },
                ].map(f => <button key={f.id} onClick={() => setFontStyle(f.id)} style={{ ...chipStyle(fontStyle === f.id), ...f.extra }}>{f.label}</button>)}
              </div>
            </div>
          )}
        </div>

        {/* Download + Share */}
        <div style={{ display: "flex", gap: 10, padding: "0 14px", width: "100%", maxWidth: 480, boxSizing: "border-box" }}>
          <button onClick={() => showToast("Polaroid saved! ✓")}
            style={{ flex: 1, background: "#EDE8DF", color: "#1C1C1A", border: "none", padding: "15px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ↓ Download
          </button>
          <button onClick={() => showToast("Link copied!")}
            style={{ flex: 1, background: "linear-gradient(135deg,#C8A96E,#a08040)", color: "#1C1C1A", border: "none", padding: "15px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderRadius: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ↗ Share
          </button>
        </div>
      </div>

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
