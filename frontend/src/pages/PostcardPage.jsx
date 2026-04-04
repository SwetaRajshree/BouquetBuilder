import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GSAP LOADER — loads from CDN once, calls back when ready
// ─────────────────────────────────────────────────────────────────────────────
let _gsapReady = false;
let _gsapCallbacks = [];
function loadGSAP(cb) {
  if (typeof window === "undefined") return;
  if (window.gsap) { cb(window.gsap); return; }
  _gsapCallbacks.push(cb);
  if (_gsapReady) return;
  _gsapReady = true;
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  s.onload = () => _gsapCallbacks.forEach(fn => fn(window.gsap));
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTCARD FACE — the card that emerges from the envelope
// ─────────────────────────────────────────────────────────────────────────────
const PostcardFace = ({ cardRef, glowRef }) => (
  <div ref={cardRef} style={{
    position: "absolute",
    width: 200, height: 270,
    borderRadius: 4,
    overflow: "hidden",
    opacity: 0,
    willChange: "transform, opacity",
    transformOrigin: "center bottom",
    // starts hidden — GSAP controls everything
  }}>
    {/* Glow halo */}
    <div ref={glowRef} style={{
      position: "absolute",
      inset: -28, borderRadius: 28,
      background: "radial-gradient(ellipse at 50% 65%, rgba(196,163,90,0.38) 0%, transparent 68%)",
      filter: "blur(20px)",
      opacity: 0,
      zIndex: -1,
      willChange: "opacity",
    }} />

    {/* Card body */}
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(162deg, #faf8f3 0%, #f5ede0 100%)",
      display: "flex", flexDirection: "column",
      position: "relative",
      boxShadow: "0 0 0 0 rgba(0,0,0,0)",
    }}>
      {/* Subtle paper texture */}
      <div style={{ position:"absolute", inset:0, opacity:0.035,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%231a1714'/%3E%3Crect width='1' height='1' fill='%23ffffff'/%3E%3C/svg%3E")` }} />

      {/* Corner ornaments */}
      {[[12,12,"top","left"],[12,12,"top","right"],[12,12,"bottom","left"],[12,12,"bottom","right"]].map(([t,s,v,h],i)=>(
        <div key={i} style={{ position:"absolute", [v]:t, [h]:s, width:18, height:18,
          [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:"1.5px solid rgba(196,163,90,0.55)",
          [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:"1.5px solid rgba(196,163,90,0.55)" }} />
      ))}

      {/* Stamp */}
      <div style={{ position:"absolute", top:14, right:14, width:34, height:42,
        border:"2px solid rgba(196,163,90,0.5)", display:"flex", alignItems:"center",
        justifyContent:"center", background:"rgba(245,225,195,0.25)" }}>
        <svg viewBox="0 0 20 24" width={13} height={16}>
          <rect x="1" y="1" width="18" height="22" rx="1" fill="none" stroke="rgba(196,163,90,0.5)" strokeWidth="0.8"/>
          <path d="M1 1 L10 8 L19 1" fill="rgba(196,163,90,0.18)" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"30px 20px 20px", textAlign:"center" }}>
        <div style={{ width:28, height:1, background:"linear-gradient(90deg,transparent,rgba(196,163,90,0.7),transparent)", marginBottom:16 }} />
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700,
          letterSpacing:"-0.5px", lineHeight:1.15, color:"#1a1714", marginBottom:10 }}>
          Save the<br/>Date
        </div>
        <div style={{ width:28, height:1, background:"linear-gradient(90deg,transparent,rgba(196,163,90,0.7),transparent)", marginBottom:14 }} />
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:10, fontStyle:"italic",
          color:"#8a7a6a", letterSpacing:"0.06em", lineHeight:1.9 }}>
          June 14th · 7 PM<br/>The Grand Ballroom
        </div>
      </div>

      {/* Postmark */}
      <div style={{ position:"absolute", bottom:24, left:16, width:38, height:38, borderRadius:"50%",
        border:"1.5px dashed rgba(184,169,154,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:7, color:"#b8a99a", fontWeight:700, letterSpacing:"0.03em",
          textTransform:"uppercase", textAlign:"center", lineHeight:1.35 }}>Post<br/>Studio</div>
      </div>

      {/* Floral sprig */}
      <svg viewBox="0 0 60 30" width={50} style={{ position:"absolute", bottom:20, right:12, opacity:0.5 }}>
        <path d="M10 25 Q20 5 30 15 Q40 5 50 25" stroke="#8a9e8b" strokeWidth="1.2" fill="none"/>
        <circle cx="30" cy="15" r="3.5" fill="#c98b8b" opacity="0.7"/>
        <circle cx="22" cy="10" r="2.5" fill="#c4a35a" opacity="0.6"/>
        <circle cx="38" cy="10" r="2.5" fill="#c98b8b" opacity="0.6"/>
      </svg>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE SVG — main centred envelope with animatable flap
// ─────────────────────────────────────────────────────────────────────────────
const MainEnvelope = ({ envRef, flapRef }) => (
  <div ref={envRef} style={{
    position:"relative", width:280, flexShrink:0,
    willChange:"transform",
    filter:"drop-shadow(0 28px 50px rgba(26,23,20,0.2)) drop-shadow(0 8px 16px rgba(26,23,20,0.1))",
  }}>
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
      <defs>
        <linearGradient id="eBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f0e8"/>
          <stop offset="100%" stopColor="#e8e0d0"/>
        </linearGradient>
        <linearGradient id="eLiner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4a35a" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#d4b870" stopOpacity="0.12"/>
        </linearGradient>
        <linearGradient id="eFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ede6d8"/>
          <stop offset="100%" stopColor="#ddd4c4"/>
        </linearGradient>
        <linearGradient id="eShadL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(26,23,20,0.07)"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
        <linearGradient id="eShadR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(26,23,20,0.07)"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>

      {/* Body */}
      <rect x="4" y="30" width="272" height="166" rx="4" fill="url(#eBody)"/>
      <rect x="4" y="30" width="272" height="166" rx="4" fill="url(#eLiner)"/>

      {/* Side fold shadows */}
      <polygon points="4,30 4,196 112,114" fill="url(#eShadL)"/>
      <polygon points="276,30 276,196 168,114" fill="url(#eShadR)"/>

      {/* Bottom V crease */}
      <path d="M4 196 L140 113 L276 196" stroke="rgba(168,154,130,0.32)" strokeWidth="1"/>

      {/* Subtle horizontal lines */}
      <line x1="4" y1="80"  x2="276" y2="80"  stroke="rgba(168,154,130,0.07)" strokeWidth="0.5"/>
      <line x1="4" y1="120" x2="276" y2="120" stroke="rgba(168,154,130,0.07)" strokeWidth="0.5"/>
      <line x1="4" y1="160" x2="276" y2="160" stroke="rgba(168,154,130,0.07)" strokeWidth="0.5"/>

      {/* Flap — separate <g> so GSAP can rotateX it */}
      <g ref={flapRef} style={{ transformOrigin:"140px 30px", willChange:"transform" }}>
        <path d="M4 30 L140 110 L276 30 Q140 2 4 30Z" fill="url(#eFlap)" stroke="rgba(168,154,130,0.28)" strokeWidth="0.8"/>
        <path d="M4 30 L140 110 L276 30" stroke="rgba(168,154,130,0.22)" strokeWidth="1" fill="none"/>
      </g>

      {/* Sealed edge hint */}
      <line x1="4" y1="30" x2="276" y2="30" stroke="rgba(168,154,130,0.18)" strokeWidth="0.5"/>
    </svg>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND LAYER — ambient floating mini-envelopes + sparkles
// ─────────────────────────────────────────────────────────────────────────────
const BackgroundLayer = () => {
  const items = [
    { x:"7%",  y:"16%", rot:-12, sc:0.7,  delay:0,   dur:7,   col:"#e8a09a", op:0.17 },
    { x:"83%", y:"11%", rot: 8,  sc:0.58, delay:1.4, dur:9,   col:"#9aaad4", op:0.14 },
    { x:"88%", y:"60%", rot:-6,  sc:0.52, delay:0.8, dur:8,   col:"#c4a35a", op:0.15 },
    { x:"3%",  y:"70%", rot: 11, sc:0.48, delay:2.2, dur:10,  col:"#8a9e8b", op:0.12 },
    { x:"72%", y:"78%", rot:-8,  sc:0.44, delay:0.4, dur:7.5, col:"#b0a0d4", op:0.11 },
    { x:"50%", y:"5%",  rot: 4,  sc:0.48, delay:1.8, dur:11,  col:"#c98b8b", op:0.09 },
  ];
  const sparks = [
    {x:"61%",y:"21%",d:0},{x:"75%",y:"56%",d:1.1},{x:"37%",y:"80%",d:0.6},
    {x:"54%",y:"13%",d:1.8},{x:"20%",y:"47%",d:0.3},
  ];
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:1 }}>
      {items.map((it,i) => (
        <div key={i} style={{
          position:"absolute", left:it.x, top:it.y,
          transform:`rotate(${it.rot}deg) scale(${it.sc})`,
          opacity:it.op, filter:"blur(0.4px)",
          animation:`bgEnvFloat ${it.dur}s ease-in-out ${it.delay}s infinite`,
        }}>
          <svg viewBox="0 0 100 72" width={100} fill="none">
            <rect x="1" y="10" width="98" height="61" rx="2" fill={it.col}/>
            <path d="M1 10 L50 38 L99 10Z" fill={it.col} opacity="0.6"/>
            <path d="M1 71 L50 42 L99 71" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"/>
          </svg>
        </div>
      ))}
      {sparks.map((s,i) => (
        <div key={`sp${i}`} style={{
          position:"absolute", left:s.x, top:s.y,
          fontSize:11, color:"#c4a35a",
          animation:`sparkleKf ${2.4+i*0.4}s ease-in-out ${s.d}s infinite`,
        }}>✦</div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE HERO — orchestrates GSAP timeline
// ─────────────────────────────────────────────────────────────────────────────
const EnvelopeHero = ({ onBrowse, onMakeOwn }) => {
  const envRef   = useRef(null);
  const flapRef  = useRef(null);
  const cardRef  = useRef(null);
  const glowRef  = useRef(null);
  const tlRef    = useRef(null);
  const [hovered, setHovered] = useState(false);

  const build = useCallback((gsap) => {
    if (!envRef.current || !cardRef.current || !flapRef.current) return;
    if (tlRef.current) tlRef.current.kill();

    const env  = envRef.current;
    const card = cardRef.current;
    const flap = flapRef.current;
    const glow = glowRef.current;

    // ── Initial state ──
    gsap.set(card, { y:65, x:"-50%", left:"50%", scale:0.88, opacity:0, rotation:2.8 });
    gsap.set(flap, { rotateX:0, transformOrigin:"50% 0%" });
    gsap.set(glow, { opacity:0 });
    gsap.set(env,  { y:0 });

    const tl = gsap.timeline({
      repeat:-1,
      defaults:{ ease:"power3.out" },
    });

    // PHASE 1 — intro pause
    tl.to({}, { duration:0.7 });

    // PHASE 2 — flap lifts open
    tl.to(flap, {
      rotateX:-165,
      transformOrigin:"50% 0%",
      duration:0.72,
      ease:"power2.inOut",
    });

    // PHASE 3 — card peeks out (very bottom of envelope mouth)
    tl.to(card, {
      opacity:1,
      y:30,
      duration:0.35,
      ease:"power2.out",
    }, "-=0.12");

    // PHASE 4 — main pull upward + scale down (depth illusion)
    // Card rises above envelope, gets slightly smaller = elevated / further plane
    tl.to(card, {
      y:-120,         // above envelope mouth
      scale:0.91,     // slightly smaller = depth
      rotation:-1.4,  // nearly upright
      duration:0.88,
      ease:"expo.out",
    });

    // PHASE 5 — glow blooms
    tl.to(glow, { opacity:1, duration:0.35, ease:"power2.out" }, "-=0.55");

    // PHASE 6 — spring bounce (overshoot → settle)
    tl.to(card, { y:-112, duration:0.2, ease:"power2.in"  });
    tl.to(card, { y:-118, duration:0.16,ease:"power2.out" });

    // PHASE 7 — hold + micro-float while reading
    tl.to(card, { y:-115, duration:1.0, ease:"sine.inOut" }, "+=0.1");
    tl.to(card, { y:-120, duration:1.0, ease:"sine.inOut" });

    // PHASE 8 — shadow under card deepens while resting (visual polish)
    // (handled via CSS box-shadow on the card wrapper — no extra JS needed)

    // PHASE 9 — glow fades
    tl.to(glow, { opacity:0, duration:0.45, ease:"power2.in" }, "-=0.5");

    // PHASE 10 — card slides back into envelope
    tl.to(card, {
      y:50,
      scale:0.88,
      rotation:2.8,
      duration:0.52,
      ease:"power2.in",
    });

    // PHASE 11 — card fades as it re-enters
    tl.to(card, { opacity:0, duration:0.18, ease:"power2.in" }, "-=0.22");

    // PHASE 12 — flap closes
    tl.to(flap, {
      rotateX:0,
      duration:0.58,
      ease:"power2.inOut",
    }, "-=0.08");

    // PHASE 13 — rest
    tl.to({}, { duration:0.9 });

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    loadGSAP((gsap) => {
      const id = setTimeout(() => build(gsap), 100);
      return () => clearTimeout(id);
    });
    return () => { if (tlRef.current) tlRef.current.kill(); };
  }, [build]);

  const onEnter = () => {
    setHovered(true);
    if (tlRef.current) tlRef.current.timeScale(1.7);
  };
  const onLeave = () => {
    setHovered(false);
    if (tlRef.current) tlRef.current.timeScale(1.0);
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position:"relative",
        width:"100%", maxWidth:500,
        height:"100%", minHeight:500,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      <BackgroundLayer/>

      {/* Stage */}
      <div style={{
        position:"relative",
        display:"flex", alignItems:"flex-end", justifyContent:"center",
        marginTop:48, zIndex:2,
      }}>
        {/* Card lives here — GSAP moves it above envelope */}
        <PostcardFace cardRef={cardRef} glowRef={glowRef}/>
        {/* Envelope sits on top while card is inside, card rises above */}
        <div style={{ position:"relative", zIndex:2 }}>
          <MainEnvelope envRef={envRef} flapRef={flapRef}/>
        </div>
      </div>

      {/* Hint */}
      <div style={{
        position:"absolute", bottom:4, left:"50%",
        transform:"translateX(-50%)",
        fontSize:9.5, fontWeight:600, letterSpacing:"0.13em",
        color:"#b8a99a", textTransform:"uppercase",
        opacity: hovered ? 0 : 0.6, transition:"opacity 0.4s ease",
        whiteSpace:"nowrap",
      }}>hover to preview</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const EnvelopeSVG = ({ color="#e8a09a", linerColor="#f5c0a8", open=false, style={} }) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <rect x="2" y="20" width="116" height="68" rx="3" fill={color}/>
    <rect x="2" y="20" width="116" height="68" rx="3" fill="url(#liner2)" opacity="0.3"/>
    <path d={open ? "M2 20 L60 52 L118 20" : "M2 20 L60 55 L118 20 L118 20 Q60 2 2 20Z"} fill={open?"none":linerColor} stroke={color} strokeWidth="1"/>
    <path d="M2 88 L60 52 L118 88" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"/>
    <defs>
      <linearGradient id="liner2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

const FloatingEnvelope = ({ x, y, delay, scale, color, linerColor, rotation, cardText, cardBg }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{
      position:"absolute", left:`${x}%`, top:`${y}%`,
      transform:`rotate(${hovered?0:rotation}deg) scale(${hovered?scale*1.15:scale})`,
      transition:"transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      animation:`floatY ${3+delay}s ease-in-out infinite`, animationDelay:`${delay}s`,
      cursor:"pointer", zIndex:2,
      filter:`drop-shadow(0 ${hovered?20:10}px ${hovered?40:20}px rgba(0,0,0,0.18))`,
    }}>
      <div style={{ position:"relative", width:110 }}>
        <div style={{
          position:"absolute", bottom:"60%", left:"12%", right:"12%",
          background:cardBg||"#fff", borderRadius:3, padding:"10px 8px", zIndex:1,
          transform:hovered?"translateY(-28px)":"translateY(-8px)", transition:"transform 0.4s ease",
          boxShadow:"0 4px 14px rgba(0,0,0,0.12)", textAlign:"center",
          fontFamily:"'Georgia', serif", fontSize:9, color:"#444", lineHeight:1.3, fontStyle:"italic",
        }}>{cardText}</div>
        <EnvelopeSVG color={color} linerColor={linerColor} open={hovered} style={{ width:"100%", position:"relative", zIndex:2 }}/>
      </div>
    </div>
  );
};

const CardPreview = ({ bg, text, subtext, color, name, designer, colors, badge, onClick }) => {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{ cursor:"pointer", position:"relative" }}>
      <div style={{
        position:"relative", overflow:"hidden",
        boxShadow: hovered?"0 24px 60px rgba(0,0,0,0.18),0 4px 16px rgba(0,0,0,0.1)":"0 8px 32px rgba(0,0,0,0.1),0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered?"translateY(-8px) scale(1.01)":"translateY(0) scale(1)",
        transition:"all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)", borderRadius:2,
      }}>
        {badge&&<div style={{ position:"absolute",top:10,left:10,zIndex:3, background:badge==="New"?"#8a9e8b":badge==="Magic Art"?"#2c3e6b":"#c98b8b", color:"white",fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px" }}>{badge}</div>}
        <button onClick={e=>{e.stopPropagation();setWished(!wished);}} style={{ position:"absolute",top:10,right:10,zIndex:3, width:30,height:30,borderRadius:"50%", background:"rgba(255,255,255,0.88)", border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center", opacity:hovered||wished?1:0,transition:"opacity 0.2s,transform 0.2s", transform:wished?"scale(1.2)":"scale(1)", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={wished?"#c98b8b":"none"} stroke={wished?"#c98b8b":"#1a1714"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div style={{ background:bg, aspectRatio:"3/4", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"rgba(255,255,255,0.78)", padding:"18px 14px", textAlign:"center", border:"1px solid rgba(255,255,255,0.9)", transform:hovered?"scale(1.03)":"scale(1)", transition:"transform 0.3s", width:"80%" }}>
            <div style={{ fontFamily:"'Georgia',serif", fontSize:18, fontWeight:700, color, lineHeight:1.2, marginBottom:6 }} dangerouslySetInnerHTML={{__html:text}}/>
            {subtext&&<div style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color, opacity:0.7, marginTop:4 }}>{subtext}</div>}
          </div>
        </div>
        <div style={{ background:"#f5f1e8", padding:"8px 12px 4px", display:"flex", alignItems:"flex-end", gap:8 }}>
          <svg viewBox="0 0 60 40" width={48} style={{ marginBottom:-4 }}>
            <rect x="1" y="10" width="58" height="29" rx="2" fill={colors?.[0]||"#e8a09a"}/>
            <path d="M1 10 L30 26 L59 10" fill={colors?.[1]||"#f5c0a8"}/>
          </svg>
        </div>
      </div>
      <div style={{ padding:"12px 2px 4px" }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#1a1714", marginBottom:2, letterSpacing:"-0.2px" }}>{name}</div>
        <div style={{ fontSize:11, color:"#b8a99a" }}>{designer}</div>
        <div style={{ display:"flex", gap:5, marginTop:8 }}>
          {(colors||[]).map((c,i)=>(
            <div key={i} style={{ width:13,height:13,borderRadius:"50%",background:c, border:"1.5px solid rgba(255,255,255,0.8)", boxShadow:"0 0 0 1px rgba(0,0,0,0.1)", cursor:"pointer" }}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const SentimentCard = ({ bg, text, label, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ cursor:"pointer", position:"relative", overflow:"hidden", borderRadius:2, boxShadow:hov?"0 20px 50px rgba(0,0,0,0.18)":"0 6px 20px rgba(0,0,0,0.1)", transform:hov?"translateY(-7px)":"translateY(0)", transition:"all 0.35s ease" }}>
      <div style={{ background:bg, aspectRatio:"4/3", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontStyle:"italic", textAlign:"center", padding:20, lineHeight:1.3, transform:hov?"scale(1.05)":"scale(1)", transition:"transform 0.3s" }} dangerouslySetInnerHTML={{__html:text}}/>
        <div style={{ position:"absolute", top:10, right:12, opacity:hov?1:0, transition:"opacity 0.3s" }}>
          <svg viewBox="0 0 36 26" width={32}><rect x="1" y="4" width="34" height="21" rx="2" fill="rgba(255,255,255,0.35)"/><path d="M1 4 L18 15 L35 4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/></svg>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", background:"linear-gradient(to top,rgba(0,0,0,0.38) 0%,transparent 100%)" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"white", borderBottom:"1.5px solid white", paddingBottom:2, display:"inline-block" }}>{label}</div>
      </div>
    </div>
  );
};

const MakeYourOwnCard = ({ title, desc, ctaLabel, preview, accent, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick} style={{ background:`linear-gradient(135deg,${accent}22 0%,${accent}44 100%)`, border:`1.5px solid ${accent}55`, borderRadius:4, padding:"40px 36px", cursor:"pointer", display:"flex", alignItems:"center", gap:40, transform:hov?"translateY(-4px)":"translateY(0)", boxShadow:hov?`0 20px 50px ${accent}33`:`0 4px 16px ${accent}22`, transition:"all 0.35s ease", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%)", transform:hov?"translateX(100%)":"translateX(-100%)", transition:"transform 0.6s ease" }}/>
      <div style={{ flex:1, zIndex:1 }}>
        <h3 style={{ fontFamily:"'Georgia',serif", fontSize:28, fontWeight:700, color:"#1a1714", lineHeight:1.2, marginBottom:16 }}>{title}</h3>
        <p style={{ fontSize:14, color:"#6b6560", lineHeight:1.7, marginBottom:28, maxWidth:280 }}>{desc}</p>
        <button style={{ background:"#1a1714", color:"white", border:"none", padding:"14px 28px", fontFamily:"inherit", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background=accent} onMouseLeave={e=>e.currentTarget.style.background="#1a1714"}>{ctaLabel}</button>
      </div>
      <div style={{ flexShrink:0, zIndex:1 }}>{preview}</div>
    </div>
  );
};

const UploadCard = ({ label, trending }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ cursor:"pointer", position:"relative" }}>
      {trending&&<div style={{ position:"absolute", top:-10, right:10, zIndex:3, background:"#1a1714", color:"white", fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 10px" }}>Trending</div>}
      <div style={{ display:"flex", alignItems:"flex-end", position:"relative", transform:hov?"translateY(-6px)":"translateY(0)", transition:"transform 0.35s ease" }}>
        <div style={{ position:"absolute", right:0, top:-10, width:"55%", opacity:0.9 }}>
          <svg viewBox="0 0 120 90" fill="none" style={{ width:"100%", filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.15))" }}>
            <rect x="2" y="2" width="116" height="86" rx="3" fill="#c4a35a"/>
            <path d="M2 2 L60 40 L118 2Z" fill="#d4b870"/>
            <path d="M2 88 L60 50 L118 88" stroke="#b89040" strokeWidth="0.8" opacity="0.5"/>
          </svg>
        </div>
        <div style={{ width:"60%", zIndex:2, background:"white", padding:"16px 12px", boxShadow:hov?"0 16px 40px rgba(0,0,0,0.15)":"0 8px 24px rgba(0,0,0,0.1)", transition:"box-shadow 0.3s", minHeight:180, display:"flex", flexDirection:"column", justifyContent:"center", border:"1px dashed #c4a35a" }}>
          <div style={{ color:"#2c7be5", fontFamily:"'Georgia',serif", fontWeight:700, fontSize:16, lineHeight:1.3, marginBottom:8 }}>Upload your<br/>own design.</div>
          <div style={{ fontSize:9, color:"#888", lineHeight:1.5 }}>For best quality, upload up to 20MB with 1463×2048 px</div>
        </div>
      </div>
      <div style={{ paddingTop:12 }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#1a1714" }}>{label}</div>
        <button style={{ marginTop:6, fontSize:11, color:"#6b6560", background:"none", border:"1px solid #b8a99a", padding:"4px 12px", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="#1a1714";e.currentTarget.style.color="#1a1714";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#b8a99a";e.currentTarget.style.color="#6b6560";}}>+ More options</button>
      </div>
    </div>
  );
};

const Modal = ({ card, onClose }) => {
  const [msg, setMsg] = useState("Dear friend, wishing you all the joy this special day deserves! ✨");
  const [sel, setSel] = useState(0);
  const [sent, setSent] = useState(false);
  if (!card) return null;
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(26,23,20,0.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, animation:"fadeIn 0.25s ease" }}>
      <div style={{ background:"#fffef9", maxWidth:820, width:"100%", maxHeight:"90vh", overflowY:"auto", display:"grid", gridTemplateColumns:"1fr 1fr", animation:"slideUp 0.3s ease" }}>
        <div style={{ background:"#f5f1e8", padding:48, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", gap:20 }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:30, height:30, borderRadius:"50%", background:"#1a1714", color:"white", border:"none", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ width:"100%", maxWidth:220, aspectRatio:"3/4", background:card.colors?.[sel]?`linear-gradient(135deg,${card.colors[sel]}88,${card.colors[sel]})`:card.bg, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 20px 50px rgba(0,0,0,0.2)", padding:24 }}>
            <div style={{ background:"rgba(255,255,255,0.8)", padding:20, textAlign:"center", fontFamily:"'Georgia',serif", fontWeight:700, fontSize:22, color:card.textColor||"#3a2010", lineHeight:1.3, border:"1px solid rgba(255,255,255,0.9)" }} dangerouslySetInnerHTML={{__html:card.text}}/>
          </div>
          <svg viewBox="0 0 100 70" width={80} style={{ opacity:0.7 }}>
            <rect x="1" y="8" width="98" height="61" rx="3" fill={card.colors?.[sel]||"#e8a09a"}/>
            <path d="M1 8 L50 36 L99 8Z" fill="rgba(255,255,255,0.25)"/>
            <path d="M1 68 L50 40 L99 68" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8"/>
          </svg>
        </div>
        <div style={{ padding:40 }}>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:26, fontWeight:700, marginBottom:4, color:"#1a1714" }}>{card.name}</div>
          <div style={{ fontSize:12, color:"#b8a99a", marginBottom:28 }}>by {card.designer}</div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6560", marginBottom:10 }}>Choose a color</div>
          <div style={{ display:"flex", gap:8, marginBottom:28 }}>
            {(card.colors||[]).map((c,i)=>(
              <div key={i} onClick={()=>setSel(i)} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", boxShadow:sel===i?`0 0 0 3px white,0 0 0 5px ${c}`:"0 0 0 1px rgba(0,0,0,0.12)", transition:"box-shadow 0.2s" }}/>
            ))}
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6b6560", marginBottom:8 }}>Your Message</label>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} style={{ width:"100%", padding:"12px 14px", border:"1.5px solid rgba(184,169,154,0.4)", background:"#f5f1e8", fontFamily:"inherit", fontSize:13, resize:"none", height:88, outline:"none", lineHeight:1.6, transition:"border-color 0.2s" }} onFocus={e=>e.target.style.borderColor="#1a1714"} onBlur={e=>e.target.style.borderColor="rgba(184,169,154,0.4)"}/>
          </div>
          {sent ? (
            <div style={{ textAlign:"center", padding:"20px", background:"#f0f9f4", border:"1.5px solid #8a9e8b", color:"#2a5a38", fontFamily:"'Georgia',serif", fontSize:15, fontStyle:"italic" }}>🎉 Card sent successfully!</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={()=>setSent(true)} style={{ padding:"15px", background:"#1a1714", color:"white", border:"none", fontFamily:"inherit", fontSize:12, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#c98b8b"} onMouseLeave={e=>e.currentTarget.style.background="#1a1714"}>Send This Card</button>
              <button style={{ padding:"15px", background:"transparent", color:"#1a1714", border:"1.5px solid rgba(26,23,20,0.25)", fontFamily:"inherit", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor="#1a1714"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(26,23,20,0.25)"}>Preview Card</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ msg, show }) => (
  <div style={{ position:"fixed", bottom:28, left:"50%", transform:`translateX(-50%) translateY(${show?0:80}px)`, background:"#1a1714", color:"white", padding:"12px 22px", fontSize:13, fontWeight:500, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", display:"flex", alignItems:"center", gap:10, transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
  <div style={{ width:6,height:6,borderRadius:"50%",background:"#8a9e8b" }}/>{msg}
  </div>
);

const OccasionCircle = ({ bg, text, label, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ cursor:"pointer", flexShrink:0, textAlign:"center" }}>
      <div style={{ width:120, height:120, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", boxShadow:hov?"0 16px 40px rgba(0,0,0,0.2)":"0 6px 20px rgba(0,0,0,0.12)", transform:hov?"scale(1.08)":"scale(1)", transition:"all 0.3s ease" }}>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontStyle:"italic", textAlign:"center", padding:"0 14px", lineHeight:1.35, fontWeight:600 }} dangerouslySetInnerHTML={{__html:text}}/>
      </div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1a1714", opacity:hov?1:0.7, transition:"opacity 0.2s" }}>{label}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function PostcardStudio() {
  const [activeTab,    setActiveTab]    = useState("greeting");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modal,        setModal]        = useState(null);
  const [toast,        setToast]        = useState({ show:false, msg:"" });
  const [visible,      setVisible]      = useState(new Set());
  const [hovAnn,       setHovAnn]       = useState(null);
  const [hovStep,      setHovStep]      = useState(null);

  const showToast = (msg) => {
    setToast({ show:true, msg });
    setTimeout(()=>setToast({ show:false, msg }), 2800);
  };

  const refs = useRef({});
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) setVisible(prev=>new Set([...prev, e.target.id]));
      });
    },{ threshold:0.08 });
    Object.values(refs.current).forEach(el=>el&&obs.observe(el));
    return ()=>obs.disconnect();
  },[]);

  const rev = (id, delay=0) => ({
    opacity: visible.has(id)?1:0,
    transform: visible.has(id)?"translateY(0)":"translateY(28px)",
    transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const cards = [
    { id:"c1", bg:"linear-gradient(135deg,#f0c8c0,#e8a09a)", text:"Happy Birthday,<br/>dear heart", name:"Rosy Celebration",   designer:"Sugar Paper",        colors:["#e8a09a","#9aaad4","#a8d4b2"], badge:"Trending", textColor:"#6a2020", category:"birthday"  },
    { id:"c2", bg:"linear-gradient(135deg,#1e2d5a,#2c3e6b)", text:"Thank<br/>You",               name:"Midnight Thanks",     designer:"Rifle Paper Co.",    colors:["#2c3e6b","#1a1714","#c4a35a"], badge:"New",      textColor:"#adbde0", category:"thankyou"  },
    { id:"c3", bg:"linear-gradient(135deg,#f5e6a3,#c4a35a)", text:"Together<br/>Forever",         name:"Golden Hour",         designer:"Oscar de la Renta",  colors:["#c4a35a","#1a1714","#c98b8b"],             textColor:"#4a3008", category:"wedding"   },
    { id:"c4", bg:"linear-gradient(135deg,#c8ddd0,#8a9e8b)", text:"Season's<br/>Greetings",       name:"Evergreen Wishes",    designer:"Liberty",            colors:["#8a9e8b","#c4714a","#c4a35a"],             textColor:"#1e3a28", category:"holiday"   },
    { id:"c5", bg:"linear-gradient(135deg,#e0d8f0,#b0a0d4)", text:"With Deepest<br/>Sympathy",    name:"Quiet Comfort",       designer:"Mr. Boddington's",   colors:["#b0a0d4","#8a9e8b","#c4a35a"],             textColor:"#2a1a5a", category:"sympathy"  },
    { id:"c6", bg:"linear-gradient(135deg,#2a2520,#1a1714)", text:"Go Cray<br/>Birthday!",        name:"Midnight Bash",       designer:"Kelly Wearstler",    colors:["#1a1714","#2c3e6b","#c4714a"], badge:"Magic Art", textColor:"#c8b898", category:"birthday" },
    { id:"c7", bg:"linear-gradient(135deg,#fde8dc,#f5c0a8)", text:"Thank You,<br/>always.",       name:"Blush Note",          designer:"kate spade new york",colors:["#f5c0a8","#e8a09a","#c4a35a"],             textColor:"#5a2010", category:"thankyou"  },
    { id:"c8", bg:"linear-gradient(135deg,#f0c4a8,#c4714a)", text:"Wishing You<br/>A Rise",       name:"Terra Joy",           designer:"Meri Meri",          colors:["#c4714a","#c4a35a","#8a9e8b"],             textColor:"#4a1a08", category:"birthday"  },
  ];
  const filtered = activeFilter==="all" ? cards : cards.filter(c=>c.category===activeFilter);

  const envelopes = [
    { x:62, y:8,  delay:0,   scale:1.1,  color:"#e8a09a", linerColor:"#f5c0a8", rotation:-8, cardText:"Happy Birthday! 🎂", cardBg:"#fff9f8" },
    { x:72, y:45, delay:1.2, scale:0.9,  color:"#2c3e6b", linerColor:"#4a5e9b", rotation:5,  cardText:"Thank You ✨",        cardBg:"#f0f2f8" },
    { x:84, y:15, delay:0.6, scale:0.85, color:"#c4a35a", linerColor:"#d4b870", rotation:-4, cardText:"Season's Greetings",  cardBg:"#fffdf0" },
    { x:55, y:58, delay:1.8, scale:0.75, color:"#8a9e8b", linerColor:"#aabfab", rotation:7,  cardText:"With Love 💚",        cardBg:"#f4f8f5" },
    { x:88, y:55, delay:0.9, scale:0.8,  color:"#b0a0d4", linerColor:"#c8bcec", rotation:-6, cardText:"Congrats! 🎉",        cardBg:"#f8f6ff" },
  ];

  const tabs = [
    { id:"greeting", label:"Greeting Cards" },
  ];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveTab(id);
  };

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#faf8f3", color:"#1a1714", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── existing ── */
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes slideUp   { from{transform:translateY(32px) scale(0.97);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes drift     { 0%{transform:rotate(0deg) scale(1)} 33%{transform:rotate(1deg) scale(1.01)} 66%{transform:rotate(-1deg) scale(0.99)} 100%{transform:rotate(0deg) scale(1)} }
        @keyframes sparkle   { 0%,100%{transform:scale(0) rotate(0deg);opacity:0} 50%{transform:scale(1) rotate(180deg);opacity:1} }
        @keyframes bgMove    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        /* ── new hero ── */
        @keyframes bgEnvFloat {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-12px); }
        }
        @keyframes sparkleKf {
          0%,100% { transform:scale(0) rotate(0deg); opacity:0; }
          45%,55% { transform:scale(1.2) rotate(180deg); opacity:1; }
        }
        @keyframes heroIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes grainAnim {
          0%  { transform:translate(0,0); }
          20% { transform:translate(-3%,-4%); }
          40% { transform:translate(4%,2%); }
          60% { transform:translate(-2%,6%); }
          80% { transform:translate(3%,-2%); }
          100%{ transform:translate(0,0); }
        }

        * { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#f5f1e8; }
        ::-webkit-scrollbar-thumb { background:#b8a99a; border-radius:3px; }
      `}</style>

      {/* ════ HERO ════ */}
      <section style={{
        minHeight:"100vh", paddingTop:62, position:"relative", overflow:"hidden",
        display:"grid", gridTemplateColumns:"1fr 1fr", alignItems:"center",
        background:"linear-gradient(150deg,#f9f5ee 0%,#f4ede0 55%,#ede4d6 100%)",
      }}>
        {/* Grain texture */}
        <div style={{ position:"absolute", inset:"-50%", width:"200%", height:"200%",
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E")`,
          backgroundRepeat:"repeat", opacity:0.55, pointerEvents:"none",
          animation:"grainAnim 8s steps(2) infinite", zIndex:0,
        }}/>
        {/* Blobs */}
        <div style={{ position:"absolute", top:"5%",  left:"2%",  width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,139,139,0.09) 0%,transparent 70%)", filter:"blur(40px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"45%", left:"24%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(138,158,139,0.07) 0%,transparent 70%)", filter:"blur(40px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"8%",right:"40%",width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,163,90,0.08) 0%,transparent 70%)", filter:"blur(40px)", pointerEvents:"none" }}/>
        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, zIndex:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(26,23,20,0.05) 1px,transparent 0)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>

        {/* LEFT — text */}
        <div style={{ padding:"60px 60px 60px 80px", zIndex:5, position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#c98b8b", marginBottom:28, animation:"heroIn 0.8s ease 0.1s both" }}>
            <span style={{ width:28, height:1, background:"currentColor", display:"inline-block" }}/>
            Online Greeting Cards
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(46px,5.8vw,76px)", lineHeight:1.04, fontWeight:700, letterSpacing:"-2.5px", marginBottom:26, animation:"heroIn 0.9s ease 0.3s both" }}>
            Send something<br/>
            <em style={{ color:"#c98b8b", fontStyle:"italic" }}>beautiful</em><br/>
            <span style={{ fontSize:"0.72em", fontWeight:400, fontStyle:"italic", opacity:0.55, letterSpacing:"-1px" }}>instantly.</span>
          </h1>
          <p style={{ fontSize:16.5, lineHeight:1.78, color:"#6b6560", maxWidth:420, marginBottom:42, animation:"heroIn 0.9s ease 0.5s both" }}>
            From heartfelt birthday wishes to elegant announcements — customizable digital postcards delivered via email or text, right now.
          </p>

        </div>

        {/* RIGHT — envelope animation */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", height:"100%", minHeight:"calc(100vh - 64px)", zIndex:5, animation:"heroIn 1s ease 0.2s both" }}>
          <EnvelopeHero onBrowse={()=>scrollTo("greeting")} onMakeOwn={()=>scrollTo("makeown")}/>
        </div>

        {/* Floating envelopes */}
        <div style={{ position:"absolute", inset:0, zIndex:3, pointerEvents:"none" }}>
          {envelopes.map((env,i)=>(
            <div key={i} style={{ pointerEvents:"all" }}><FloatingEnvelope {...env}/></div>
          ))}
        </div>
        {/* Extra sparkles */}
        {[{top:"22%",left:"54%"},{top:"68%",left:"70%"},{top:"38%",left:"80%"},{top:"78%",left:"51%"}].map((s,i)=>(
          <div key={i} style={{ position:"absolute", ...s, fontSize:13, color:"#c4a35a", animation:`sparkle ${2+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.7}s`, pointerEvents:"none", zIndex:4 }}>✦</div>
        ))}
        {/* Bottom vignette */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to top,rgba(249,245,238,0.65) 0%,transparent 100%)", pointerEvents:"none", zIndex:6 }}/>
      </section>

      {/* ════ TABS ════ */}
      <div style={{ position:"sticky", top:62, zIndex:40, background:"rgba(255,254,249,0.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,169,154,0.2)", padding:"0 80px", display:"flex", overflowX:"auto" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>scrollTo(t.id)} style={{ padding:"18px 24px", fontSize:12, fontWeight:activeTab===t.id?700:500, letterSpacing:"0.04em", color:activeTab===t.id?"#1a1714":"#6b6560", background:"none", border:"none", cursor:"pointer", borderBottom:activeTab===t.id?"2.5px solid #1a1714":"2.5px solid transparent", transition:"all 0.2s", whiteSpace:"nowrap", fontFamily:"inherit" }}>{t.label}</button>
        ))}
      </div>

      {/* ════ GREETING CARDS ════ */}
      <section id="greeting" ref={el=>refs.current["greeting"]=el} style={{ padding:"80px" }}>
        <div id="greeting-inner" ref={el=>refs.current["greeting-inner"]=el} style={rev("greeting-inner")}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:48 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#b8a99a", marginBottom:10 }}>Featured Collection</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, letterSpacing:"-1.5px" }}>Online <em style={{ color:"#c98b8b" }}>greeting</em> cards</h2>
            </div>
            <button onClick={()=>showToast("Viewing all cards...")} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", background:"none", border:"none", borderBottom:"1.5px solid #1a1714", paddingBottom:2, cursor:"pointer", fontFamily:"inherit" }}>View all cards</button>
          </div>
          <div style={{ maxWidth:560, margin:"0 auto 48px", display:"flex", border:"1.5px solid rgba(184,169,154,0.35)", background:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.05)" }}>
            <input placeholder="Search birthday, wedding, thank you..." style={{ flex:1, padding:"14px 18px", border:"none", outline:"none", fontFamily:"inherit", fontSize:13, background:"transparent", color:"#1a1714" }}/>
            <button style={{ padding:"14px 22px", background:"#1a1714", color:"white", border:"none", fontFamily:"inherit", fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="#c98b8b"} onMouseLeave={e=>e.currentTarget.style.background="#1a1714"}>Search</button>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:40, flexWrap:"wrap" }}>
            {[["all","All"],["birthday","Birthday"],["thankyou","Thank You"],["wedding","Wedding"],["holiday","Holiday"],["sympathy","Sympathy"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>setActiveFilter(val)} style={{ padding:"8px 16px", fontSize:11, fontWeight:500, border:`1.5px solid ${activeFilter===val?"#1a1714":"rgba(184,169,154,0.4)"}`, background:activeFilter===val?"#1a1714":"white", color:activeFilter===val?"white":"#1a1714", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>{lbl}</button>
            ))}
            <span style={{ marginLeft:"auto", fontSize:12, color:"#b8a99a", alignSelf:"center" }}>{filtered.length} designs</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:28 }}>
            {filtered.map((card,i)=>(
              <div key={card.id} style={{ animation:`slideUp 0.5s ease ${i*0.07}s both` }}>
                <CardPreview {...card} onClick={()=>setModal(card)}/>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════ HOW IT WORKS ════ */}
      <section style={{ padding:"80px", background:"#f5f1e8" }}>
        <div id="how-inner" ref={el=>refs.current["how-inner"]=el} style={rev("how-inner")}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#b8a99a", marginBottom:12 }}>Simple Process</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, letterSpacing:"-1.5px" }}>How to send a card</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40, position:"relative" }}>
            <div style={{ position:"absolute", top:32, left:"12.5%", right:"12.5%", height:1, background:"linear-gradient(to right,transparent,#b8a99a,transparent)" }}/>
            {[
              { n:"1", title:"Choose a Design", desc:"Browse hundreds of beautiful templates from top designers for every occasion." },
              { n:"2", title:"Customize It",    desc:"Add your personal message, choose colors, fonts, and envelope liners." },
              { n:"3", title:"Add Recipients",  desc:"Send to one person or hundreds. Import contacts or enter emails manually." },
              { n:"4", title:"Send Instantly",  desc:"Deliver via email or text immediately or schedule for a future date." },
            ].map((step,i)=>(
              <div key={step.n} style={{ textAlign:"center" }} onMouseEnter={()=>setHovStep(i)} onMouseLeave={()=>setHovStep(null)}>
                <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto 20px", background:hovStep===i?"#1a1714":"#f5f1e8", border:`1.5px solid ${hovStep===i?"#1a1714":"rgba(184,169,154,0.4)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:hovStep===i?"#faf8f3":"#1a1714", position:"relative", zIndex:1, transform:hovStep===i?"scale(1.12)":"scale(1)", transition:"all 0.3s ease" }}>{step.n}</div>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:8, color:"#1a1714" }}>{step.title}</div>
                <div style={{ fontSize:13, color:"#6b6560", lineHeight:1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ background:"#1a1714", color:"rgba(255,255,255,0.55)", padding:"36px 48px" }}>
        <div style={{ maxWidth:640, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:16, textAlign:"center" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"white" }}>Post<span style={{ color:"#c98b8b" }}>card</span> Studio</div>
          <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,0.45)", maxWidth:360 }}>Send beautiful, customizable digital cards for every occasion — instantly via email or text.</p>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:20, width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
            <span>© 2025 Postcard Studio. All rights reserved.</span>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy Policy","Terms of Service"].map(l=>(
                <span key={l} style={{ cursor:"pointer", color:"rgba(255,255,255,0.35)", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <Modal card={modal} onClose={()=>setModal(null)}/>
      <Toast show={toast.show} msg={toast.msg}/>
    </div>
  );
}
