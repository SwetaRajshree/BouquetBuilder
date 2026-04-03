import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&display=swap');

.vnk-root {
  --bg:#3d2f1e; --bg2:#4a3825; --gold:#c9a84c; --gold-light:#e8c97a;
  --red:#e05c5c; --paper:#f5f0e8; --text-dark:#2a1f10; --green:#6abf7c;
  width:100%; min-height:100vh;
  background:var(--bg);
  background-image:radial-gradient(ellipse at 50% 0%,#5a4020 0%,var(--bg) 70%);
  font-family:'Lato',sans-serif; color:var(--gold-light);
  display:flex; flex-direction:column; align-items:center;
  position:relative; overflow:hidden;
}
.vnk-root*,.vnk-root*::before,.vnk-root*::after{box-sizing:border-box;margin:0;padding:0}

/* ── falling flowers ── */
.vnk-flowers{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.vnk-flower{
  position:absolute;top:-80px;color:var(--gold);
  opacity:0;animation:vnkFall linear infinite;
  user-select:none; filter: drop-shadow(0 0 2px rgba(201,168,76,0.4));
}
.vnk-flower.large { color: var(--gold-light); }
.vnk-flower.small { color: #a07830; }
@keyframes vnkFall{
  0%  {transform:translateY(0) rotate(0deg) scale(1);opacity:0}
  5%  {opacity:.9}
  85% {opacity:.6}
  100%{transform:translateY(112vh) rotate(400deg) scale(.4);opacity:0}
}
@keyframes vnkSway{
  0%,100%{margin-left:0}
  25%{margin-left:18px}
  75%{margin-left:-18px}
}

/* ── screens ── */
.vnk-screen{
  width:100%;max-width:600px;min-height:100vh;position:relative;z-index:1;
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:40px 24px;text-align:center;
}

/* ── splash ── */
.vnk-title{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:400;color:var(--gold-light);letter-spacing:.02em;margin-bottom:8px}
.vnk-byline{font-size:.85rem;font-weight:300;color:var(--gold);opacity:.8;margin-bottom:48px}

/* splash art — wider + taller */
.vnk-art{width:340px;height:320px;margin:0 auto 40px;position:relative}
.vnk-paper-roll{
  position:absolute;top:10px;left:0;width:270px;height:220px;
  background:var(--paper);border-radius:10px 0 0 10px;
  box-shadow:inset -4px 0 10px rgba(0,0,0,.18);
}
.vnk-paper-texture{
  position:absolute;inset:0;border-radius:10px 0 0 10px;
  background:repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(180,160,120,.12) 18px,rgba(180,160,120,.12) 19px);
}
.vnk-spool-right{
  position:absolute;right:0;top:15px;width:48px;height:200px;
  background:linear-gradient(90deg,#7a7a7a,#c4c4c4,#7a7a7a);
  border-radius:8px;box-shadow:3px 0 10px rgba(0,0,0,.5);
}
.vnk-spool-groove{position:absolute;inset:8px;background:repeating-linear-gradient(180deg,#666 0,#666 5px,#888 5px,#888 9px);border-radius:4px}

/* splash wave */
.vnk-wave-preview{position:absolute;bottom:28px;right:52px;display:flex;align-items:flex-end;gap:2px;height:38px}
.vnk-wave-preview span{width:3px;background:var(--red);border-radius:2px;opacity:.7}

/* splash photo peek — bigger */
.vnk-photo-peek{position:absolute;top:16px;right:52px;width:110px;height:130px;background:#c8a86a;border-radius:3px;transform:rotate(-2deg);overflow:hidden;border:3px solid white;animation:vnkPeekSlide 2.8s cubic-bezier(.22,.68,0,1.15) both}
@keyframes vnkPeekSlide{
  from{clip-path:inset(100% 0 0 0);transform:rotate(-2deg) translateY(18px)}
  to{clip-path:inset(0% 0 0 0);transform:rotate(-2deg) translateY(0)}
}
.vnk-photo-peek-inner{width:100%;height:70%;background:linear-gradient(135deg,#8b6914,#c8a86a 40%,#5a3e10)}
.vnk-redline-deco{position:absolute;right:96px;top:0;bottom:0;width:1.5px;background:var(--red);opacity:.8}

/* ── splash handle — centred below paper, sleek ornate ── */
.vnk-splash-handle{
  position:absolute;
  /* horizontally centred under the paper (paper left=0, width=270, spool=48, total=318, centre=159) */
  left:159px; transform:translateX(-50%);
  bottom:-70px;
  display:flex;flex-direction:column;align-items:center;
}

/* ── shared ornate handle parts ── */
.vnk-sh-cap{
  width:18px;height:10px;
  background:linear-gradient(180deg,#d8d8d8,#aaa);
  border-radius:9px 9px 0 0;
  box-shadow:0 -1px 4px rgba(0,0,0,.3);
}
.vnk-sh-topbar{
  width:11px;height:56px;
  background:linear-gradient(90deg,#888,#e2e2e2 40%,#c8c8c8 60%,#888);
  border-radius:5px 5px 2px 2px;
  box-shadow:1px 1px 5px rgba(0,0,0,.45),inset 0 1px 2px rgba(255,255,255,.4);
}
.vnk-sh-ring{
  width:22px;height:22px;
  background:radial-gradient(circle at 38% 35%,#eeeeee,#999 55%,#666);
  border-radius:50%;
  box-shadow:0 2px 8px rgba(0,0,0,.55),inset 0 1px 3px rgba(255,255,255,.3);
  display:flex;align-items:center;justify-content:center;
}
.vnk-sh-ring-inner{
  width:11px;height:11px;
  background:radial-gradient(circle at 40% 36%,#c0c0c0,#5a5a5a);
  border-radius:50%;
}
.vnk-sh-mid{
  width:9px;height:16px;
  background:linear-gradient(180deg,#9a9a9a,#cccccc,#9a9a9a);
  border-radius:2px;
}
.vnk-sh-heart{
  width:46px;height:46px;
  background:radial-gradient(circle at 37% 34%,#f0f0f0,#aaa 45%,#6a6a6a);
  border-radius:50%;
  box-shadow:0 4px 14px rgba(0,0,0,.65),inset 0 1px 3px rgba(255,255,255,.4);
  display:flex;align-items:center;justify-content:center;
  font-size:18px; color:#333;
  position:relative;
}
.vnk-sh-heart::after{
  content:'';position:absolute;inset:4px;
  border-radius:50%;
  border:1px solid rgba(255,255,255,.25);
  pointer-events:none;
}
.vnk-sh-lower{
  width:9px;height:20px;
  background:linear-gradient(180deg,#9a9a9a,#d0d0d0,#9a9a9a);
  border-radius:0 0 3px 3px;
}
.vnk-sh-base{
  width:22px;height:10px;
  background:linear-gradient(180deg,#999,#c8c8c8);
  border-radius:0 0 12px 12px;
  box-shadow:0 2px 6px rgba(0,0,0,.4);
}

/* ── buttons ── */
.vnk-btn{background:var(--bg2);border:none;color:var(--gold-light);font-family:'Lato',sans-serif;font-size:1rem;font-weight:400;padding:14px 48px;border-radius:6px;cursor:pointer;transition:background .2s,transform .1s;letter-spacing:.05em}
.vnk-btn:hover{background:#5a4830}
.vnk-btn:active{transform:scale(.97)}
.vnk-btn.primary{background:var(--gold);color:var(--text-dark)}
.vnk-btn.primary:hover{background:var(--gold-light)}
.vnk-btn.primary:disabled{background:#6a5830;color:#a09060;cursor:not-allowed}
.vnk-btn-full{width:100%;max-width:320px}

/* ── record screen ── */
.vnk-record-screen{justify-content:flex-start;padding-top:56px;gap:0}
.vnk-section-label{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;color:var(--gold-light);margin-bottom:20px;width:100%;text-align:center}
.vnk-photo-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:28px;width:100%}
.vnk-photo-slot{width:80px;height:80px;border-radius:4px;position:relative;overflow:hidden;flex-shrink:0}
.vnk-photo-slot img{width:100%;height:100%;object-fit:cover;display:block}
.vnk-remove-btn{position:absolute;top:2px;right:2px;background:rgba(0,0,0,.6);border:none;color:#fff;width:18px;height:18px;border-radius:50%;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center}
.vnk-add-photo-btn{width:80px;height:80px;border-radius:50%;border:2px dashed var(--gold);background:transparent;color:var(--gold);font-size:1.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
.vnk-add-photo-btn:hover{background:rgba(201,168,76,.1)}
.vnk-add-hint{font-size:.8rem;color:var(--gold);opacity:.7;margin-top:6px;margin-bottom:28px}
.vnk-voice-section{width:100%;display:flex;flex-direction:column;align-items:center;margin-bottom:32px}
.vnk-record-btn{width:72px;height:72px;border-radius:50%;background:var(--red);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px rgba(224,92,92,.4)}
.vnk-record-btn:hover{transform:scale(1.06);box-shadow:0 6px 28px rgba(224,92,92,.55)}
.vnk-record-btn.recording{animation:vnkPulse 1.2s ease-in-out infinite}
@keyframes vnkPulse{0%,100%{box-shadow:0 4px 20px rgba(224,92,92,.4)}50%{box-shadow:0 4px 36px rgba(224,92,92,.8)}}
.vnk-timer-row{display:flex;align-items:center;gap:8px;margin-top:14px;font-size:.95rem;color:var(--gold)}
.vnk-dot{width:8px;height:8px;border-radius:50%;background:var(--red);flex-shrink:0}
.vnk-dot.saved{background:var(--green)}
.vnk-sep{color:var(--gold);opacity:.5}
.vnk-re-record{display:flex;align-items:center;gap:6px;background:transparent;border:none;color:var(--gold);cursor:pointer;font-size:.85rem;font-family:'Lato',sans-serif;margin-top:10px;padding:6px 10px;border-radius:4px;transition:background .2s}
.vnk-re-record:hover{background:rgba(201,168,76,.1)}
.vnk-tap-hint{font-size:.85rem;color:var(--gold);opacity:.7;margin-top:10px}
.vnk-live-wave{display:flex;align-items:flex-end;gap:2px;height:32px;margin-top:12px;min-width:120px}
.vnk-live-wave .bar{width:3px;background:var(--red);border-radius:2px;transition:height .08s}

/* ═══════════════ PLAYER ═══════════════ */
.vnk-player-screen{justify-content:flex-start;padding:24px 20px;gap:0}
.vnk-topbar{width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.vnk-topbar-btn{background:transparent;border:none;color:var(--gold);font-size:.85rem;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:'Lato',sans-serif;padding:6px;border-radius:4px;transition:background .2s}
.vnk-topbar-btn:hover{background:rgba(201,168,76,.1)}
.vnk-topbar-btn svg{width:16px;height:16px}
.vnk-player-timer{font-size:.9rem;color:var(--gold);margin-bottom:16px;letter-spacing:.04em}

/* cassette outer */
  .vnk-cassette-outer{position:relative;display:flex;align-items:flex-start;gap:10px;margin:0 auto}

/* cassette */
  .vnk-cassette{position:relative;display:flex;align-items:stretch;width:360px;height:240px}

/* paper */
  .vnk-c-paper{position:relative;flex:1;background:var(--paper);border-radius:10px 0 0 10px;overflow:hidden;box-shadow:inset -3px 0 8px rgba(0,0,0,.12);}
  .vnk-c-paper-texture{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(160,140,100,.09) 22px,rgba(160,140,100,.09) 23px);pointer-events:none}
  .vnk-c-redline{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--red);opacity:.85;z-index:10}

/* horizontal film strip */
  .vnk-photo-strip{position:absolute;top:10px;left:0;right:0;height:calc(100% - 56px);overflow:hidden}
  .vnk-film-track{display:flex;flex-direction:row;height:100%;will-change:transform}
  .vnk-strip-img{width:130px;height:100%;object-fit:cover;flex-shrink:0;border:3px solid white;margin-right:6px;box-shadow:0 4px 16px rgba(0,0,0,.3);}

/* film perforations */
  .vnk-perfs{position:absolute;top:0;left:0;right:0;height:10px;display:flex;gap:8px;padding:1px 6px;background:rgba(0,0,0,.15);overflow:hidden}
  .vnk-perf{width:14px;height:8px;border-radius:2px;background:rgba(255,255,255,.35);flex-shrink:0}

/* waveform */
  .vnk-waveform-wrap{position:absolute;bottom:6px;left:0;right:0;height:40px;display:flex;align-items:flex-end;overflow:hidden}
  .vnk-waveform-wrap canvas{width:100%;height:100%;display:block}

/* spool */
  .vnk-c-spool{width:44px;height:240px;flex-shrink:0;position:relative;background:linear-gradient(90deg,#6a6a6a,#bababa 50%,#6a6a6a);border-radius:0 8px 8px 0;box-shadow:4px 0 14px rgba(0,0,0,.55);}
  .vnk-spool-grooves{position:absolute;inset:10px 8px;background:repeating-linear-gradient(180deg,#555 0,#555 5px,#7a7a7a 5px,#7a7a7a 9px);border-radius:4px}
  .vnk-spool-label{position:absolute;right:2px;top:50%;transform:translateY(-50%) rotate(90deg);font-size:.58rem;letter-spacing:.22em;color:#444;white-space:nowrap;pointer-events:none}

/* HANDLE - small, to the right of spool */
  .vnk-handle-assembly{display:flex;flex-direction:column;align-items:center;cursor:grab;user-select:none;transform-origin:50% 0%;will-change:transform;flex-shrink:0;margin-top:6px;}
  .vnk-handle-assembly:active{cursor:grabbing}
  .vnk-h-cap{width:11px;height:7px;background:linear-gradient(180deg,#d8d8d8,#aaa);border-radius:6px 6px 0 0;box-shadow:0 -1px 3px rgba(0,0,0,.3);}
  .vnk-h-bar{width:7px;height:40px;background:linear-gradient(90deg,#888,#e8e8e8 35%,#d0d0d0 60%,#888);border-radius:4px 4px 2px 2px;box-shadow:1px 1px 5px rgba(0,0,0,.4);position:relative;}
  .vnk-h-bar::before{content:'';position:absolute;left:2px;top:8px;bottom:8px;width:1px;background:rgba(255,255,255,.3);border-radius:1px}
  .vnk-h-bar::after{content:'';position:absolute;right:2px;top:8px;bottom:8px;width:1px;background:rgba(0,0,0,.2);border-radius:1px}
  .vnk-h-ring{width:14px;height:14px;background:radial-gradient(circle at 38% 35%,#eee,#aaa 55%,#666);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;}
  .vnk-h-ring-inner{width:7px;height:7px;background:radial-gradient(circle at 40% 38%,#c8c8c8,#4a4a4a);border-radius:50%}
  .vnk-h-waist{width:6px;height:10px;background:linear-gradient(180deg,#9a9a9a,#d0d0d0,#9a9a9a);border-radius:2px}
  .vnk-h-heart{width:28px;height:28px;background:radial-gradient(circle at 37% 33%,#f5f5f5,#b0b0b0 40%,#666);border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;font-size:11px;color:#2a2a2a;position:relative;}
  .vnk-h-heart::before{content:'';position:absolute;inset:3px;border-radius:50%;border:1px solid rgba(255,255,255,.22);pointer-events:none}
  .vnk-h-lower{width:6px;height:12px;background:linear-gradient(180deg,#9a9a9a,#d8d8d8 50%,#9a9a9a);border-radius:0 0 2px 2px}
  .vnk-h-base{width:14px;height:7px;background:linear-gradient(180deg,#a0a0a0,#cccccc);border-radius:0 0 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,.4);}
.vnk-h-base{
  width:24px;height:12px;
  background:linear-gradient(180deg,#a0a0a0,#cccccc);
  border-radius:0 0 14px 14px;
  box-shadow:0 3px 8px rgba(0,0,0,.45);
}

.vnk-handle-hint{font-size:.78rem;color:var(--gold);opacity:.7;text-align:center;margin-top:18px;letter-spacing:.03em}

/* toast */
.vnk-toast{position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--gold);color:var(--text-dark);padding:10px 24px;border-radius:24px;font-size:.85rem;opacity:0;transition:all .3s;pointer-events:none;z-index:999}
.vnk-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
`;

/* ─────────────────────────────────
   FALLING FLOWERS — enhanced
───────────────────────────────── */
const SHAPES = [
  "✿","❀","✾","✽","⚘","❃","❁","✤","✦","❋",
  "✧","❊","⁕","✱","⋆","✫","❇","✺","✹","❈",
  "❉","✸","✷","✶","✵","✴","🌸","🌼","🌻","💮"
];

function FallingFlowers() {
  const flowers = Array.from({ length: 48 }, (_, i) => {
    const size = 9 + Math.random() * 14;
    return {
      id: i,
      left: (i * 2.2 + Math.random() * 2) % 100,
      delay: Math.random() * 22,
      duration: 12 + Math.random() * 16,
      size,
      sway: 4 + Math.random() * 16,
      swayDuration: 3 + Math.random() * 4,
      shape: SHAPES[i % SHAPES.length],
      opacity: 0.25 + Math.random() * 0.65,
      cls: size > 18 ? "large" : size < 12 ? "small" : "",
    };
  });
  return (
    <div className="vnk-flowers" aria-hidden="true">
      {flowers.map(f => (
        <span key={f.id} className={`vnk-flower ${f.cls}`} style={{
          left:`${f.left}%`,
          fontSize: f.size,
          animationDelay:`${f.delay}s`,
          animationDuration:`${f.duration}s`,
          opacity: f.opacity,
          animation: `vnkFall ${f.duration}s linear ${f.delay}s infinite, vnkSway ${f.swayDuration}s ease-in-out ${f.delay}s infinite`,
        }}>{f.shape}</span>
      ))}
    </div>
  );
}

/* ── Icons ── */
const MicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
    <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="22" x2="15" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const StopIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
  </svg>
);
const RewindIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 109-9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="8,3 8,8 13,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SPLASH_WAVE = [8,14,10,18,22,16,28,20,24,18,14,10,8,12,20,24,16];
const fmt = s => `${Math.floor(s/60)}:${s%60<10?"0":""}${s%60}`;
const MAX_SECS = 60;

/* ═══════════════════════════════════════
   ORNATE HANDLE (shared between splash & player)
═══════════════════════════════════════ */
function OrnateHandle({ style, refProp, extraClass }) {
  return (
    <div
      className={`vnk-handle-assembly${extraClass ? " " + extraClass : ""}`}
      ref={refProp}
      style={style}
    >
      <div className="vnk-h-cap"/>
      <div className="vnk-h-bar"/>
      <div className="vnk-h-ring"><div className="vnk-h-ring-inner"/></div>
      <div className="vnk-h-waist"/>
      <div className="vnk-h-heart">♥</div>
      <div className="vnk-h-lower"/>
      <div className="vnk-h-base"/>
    </div>
  );
}

/* ═══════════════════════════════════════
   SPLASH
═══════════════════════════════════════ */
function SplashScreen({ onStart }) {
  return (
    <div className="vnk-screen" style={{minHeight:"100vh"}}>
      <div className="vnk-art" aria-hidden="true">
        <div className="vnk-paper-roll">
          <div className="vnk-paper-texture"/>
          <div className="vnk-photo-peek"><div className="vnk-photo-peek-inner"/></div>
          <div className="vnk-wave-preview">
            {SPLASH_WAVE.map((h,i)=><span key={i} style={{height:h}}/>)}
          </div>
        </div>
        <div className="vnk-redline-deco"/>
        <div className="vnk-spool-right"><div className="vnk-spool-groove"/></div>

        {/* ornate handle — centred below paper */}
        <div className="vnk-splash-handle">
          <div className="vnk-h-cap"/>
          <div className="vnk-h-bar"/>
          <div className="vnk-h-ring"><div className="vnk-h-ring-inner"/></div>
          <div className="vnk-h-waist"/>
          <div className="vnk-h-heart">♥</div>
          <div className="vnk-h-lower"/>
          <div className="vnk-h-base"/>
        </div>
      </div>
      <h1 className="vnk-title">Voice note keepsake</h1>
      <p className="vnk-byline">a little moment, preserved forever</p>
      <button className="vnk-btn primary" onClick={onStart}>Start Here</button>
    </div>
  );
}

/* ═══════════════════════════════════════
   RECORD
═══════════════════════════════════════ */
function RecordScreen({ onContinue }) {
  const [photos,   setPhotos]   = useState([]);
  const [recState, setRecState] = useState("idle");
  const [recSecs,  setRecSecs]  = useState(0);
  const [liveBars, setLiveBars] = useState(Array(10).fill(4));

  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);
  const analyserRef = useRef(null);
  const timerRef    = useRef(null);
  const animRef     = useRef(null);
  const waveDataRef = useRef([]);
  const audioBlobRef= useRef(null);
  const audioUrlRef = useRef(null);
  const recSecsRef  = useRef(0);
  const fileInputRef= useRef(null);

  useEffect(()=>()=>{
    clearInterval(timerRef.current);
    cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach(t=>t.stop());
  },[]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current = stream;
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize=64;
      ctx.createMediaStreamSource(stream).connect(an);
      analyserRef.current = an;
      chunksRef.current=[]; waveDataRef.current=[]; recSecsRef.current=0; setRecSecs(0);

      const rec = new MediaRecorder(stream);
      mediaRecRef.current = rec;
      rec.ondataavailable = e=>{ if(e.data.size>0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current,{type:"audio/webm"});
        audioBlobRef.current = blob;
        audioUrlRef.current = URL.createObjectURL(blob);
        setRecState("done");
        streamRef.current?.getTracks().forEach(t=>t.stop());
      };
      rec.start(100); setRecState("recording");

      timerRef.current = setInterval(()=>{
        recSecsRef.current+=1; setRecSecs(recSecsRef.current);
        if(recSecsRef.current>=MAX_SECS) stopRec();
      },1000);

      const data=new Uint8Array(an.frequencyBinCount);
      const frame=()=>{
        animRef.current=requestAnimationFrame(frame);
        an.getByteFrequencyData(data);
        const avg=data.reduce((a,b)=>a+b,0)/data.length;
        waveDataRef.current.push(avg);
        setLiveBars(Array.from({length:10},(_,i)=>Math.max(4,(data[i*2]||0)/8)));
      };
      frame();
    } catch { alert("Microphone access needed. Please allow and try again."); }
  };

  const stopRec = () => {
    if(mediaRecRef.current?.state==="recording") mediaRecRef.current.stop();
    clearInterval(timerRef.current);
    cancelAnimationFrame(animRef.current);
  };

  const reRecord = () => {
    audioBlobRef.current=null; audioUrlRef.current=null;
    waveDataRef.current=[]; recSecsRef.current=0;
    setRecSecs(0); setRecState("idle");
  };

  return (
    <div className="vnk-screen vnk-record-screen">
      <p className="vnk-section-label">Add Photos</p>
      <div className="vnk-photo-grid">
        {photos.map((url,i)=>(
          <div className="vnk-photo-slot" key={i}>
            <img src={url} alt={`p${i}`}/>
            <button className="vnk-remove-btn" onClick={()=>setPhotos(p=>p.filter((_,j)=>j!==i))}>×</button>
          </div>
        ))}
        {photos.length<8&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <button className="vnk-add-photo-btn" onClick={()=>fileInputRef.current?.click()}>+</button>
          </div>
        )}
      </div>
      <p className="vnk-add-hint">{photos.length>0?`${photos.length}/8 photos added`:"Add up to 8 photos"}</p>
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:"none"}}
        onChange={e=>{
          const rem=8-photos.length;
          const urls=Array.from(e.target.files).slice(0,rem).map(f=>URL.createObjectURL(f));
          setPhotos(p=>[...p,...urls]);
          e.target.value="";
        }}/>

      <p className="vnk-section-label">Record Voice Note</p>
      <div className="vnk-voice-section">
        <button
          className={`vnk-record-btn${recState==="recording"?" recording":""}`}
          onClick={recState==="done"?undefined:(recState==="recording"?stopRec:startRec)}
          style={recState==="done"?{opacity:.5,cursor:"default"}:{}}
        >
          {recState==="recording"?<StopIcon/>:<MicIcon/>}
        </button>
        {recState==="recording"&&(
          <div className="vnk-live-wave">
            {liveBars.map((h,i)=><div className="bar" key={i} style={{height:h}}/>)}
          </div>
        )}
        {(recState==="recording"||recState==="done")&&(
          <div className="vnk-timer-row">
            <div className={`vnk-dot${recState==="done"?" saved":""}`}/>
            <span>{fmt(recSecs)}</span><span className="vnk-sep">/</span><span>{fmt(MAX_SECS)}</span>
          </div>
        )}
        {recState==="idle"&&<p className="vnk-tap-hint">Tap to record</p>}
        {recState==="done"&&(
          <button className="vnk-re-record" onClick={reRecord}>
            <RewindIcon/> Re-record
          </button>
        )}
      </div>
      <button
        className="vnk-btn primary vnk-btn-full"
        disabled={recState!=="done"}
        onClick={()=>onContinue({photos,audioUrl:audioUrlRef.current,waveData:waveDataRef.current,duration:recSecsRef.current})}
      >Continue</button>
    </div>
  );
}

/* ═══════════════════════════════════════
   PLAYER
═══════════════════════════════════════ */
function PlayerScreen({ data, onNewMemory }) {
  const { photos, audioUrl, waveData, duration } = data;

  const canvasRef    = useRef(null);
  const audioRef     = useRef(null);
  const filmTrackRef = useRef(null);
  const handleAssRef = useRef(null);

  const [playPos,      setPlayPos]      = useState(0);
  const [showHint,     setShowHint]     = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [handleAngle,  setHandleAngle]  = useState(0);
  const [filmOffset,   setFilmOffset]   = useState(0);

  const accRotRef  = useRef(0);
  const draggingRef = useRef(false);
  const totalFilmW = useRef(0);

  useEffect(()=>{
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.addEventListener('timeupdate',()=>{
      if(!audio.duration) return;
      const pct = audio.currentTime / audio.duration;
      setPlayPos(audio.currentTime);
      drawProgress(pct);
      setFilmOffset(pct * totalFilmW.current);
      accRotRef.current = pct * 720;
      setHandleAngle(pct * 720);
    });
    return ()=>{ audio.pause(); audio.src=''; };
  },[audioUrl]);

  useEffect(()=>{
    if(photos?.length) totalFilmW.current = photos.length * 136;
    drawProgress(0);
  },[photos]);

  const drawProgress = useCallback((pct)=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const w = canvas.offsetWidth||290, h = 40;
    canvas.width=w; canvas.height=h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,w,h);
    const d = waveData?.length>0 ? waveData : Array.from({length:60},()=>Math.random()*80+10);
    const bw = Math.max(2,w/d.length-1);
    d.forEach((v,i)=>{
      const bh=Math.max(3,(v/255)*h*1.2);
      ctx.fillStyle=(i/d.length)<=pct?'rgba(224,92,92,.88)':'rgba(224,92,92,.22)';
      ctx.beginPath(); ctx.roundRect(i*(bw+1),h-bh,bw,bh,2); ctx.fill();
    });
  },[waveData]);

  useEffect(()=>{
    const el=handleAssRef.current; if(!el) return;
    let startAngle=0;
    const getCenter=()=>{ const r=el.getBoundingClientRect(); return{x:r.left+r.width/2,y:r.top}; };
    const angle=(cx,cy,ex,ey)=>Math.atan2(ey-cy,ex-cx)*180/Math.PI;

    const onDown=(e)=>{
      e.preventDefault();
      draggingRef.current=true;
      setShowHint(false);
      const pt=e.touches?e.touches[0]:e;
      const c=getCenter();
      startAngle=angle(c.x,c.y,pt.clientX,pt.clientY)-accRotRef.current;
      document.addEventListener('mousemove',onMove);
      document.addEventListener('touchmove',onMove,{passive:false});
      document.addEventListener('mouseup',onUp);
      document.addEventListener('touchend',onUp);
    };

    const onMove=(e)=>{
      if(!draggingRef.current) return;
      e.preventDefault();
      const pt=e.touches?e.touches[0]:e;
      const c=getCenter();
      const ang=angle(c.x,c.y,pt.clientX,pt.clientY);
      let delta=ang-startAngle-accRotRef.current;
      while(delta>180) delta-=360;
      while(delta<-180) delta+=360;
      const aud=audioRef.current;
      if(Math.abs(delta)>0.5){
        accRotRef.current+=delta;
        setHandleAngle(accRotRef.current);
        if(aud?.duration){
          const newTime=Math.max(0,Math.min(aud.duration,aud.currentTime+(delta/720)*aud.duration));
          aud.currentTime=newTime;
          if(delta>0 && aud.paused) aud.play().catch(()=>{});
          if(delta<0 && !aud.paused) aud.pause();
          const pct=newTime/aud.duration;
          setFilmOffset(pct*totalFilmW.current);
          drawProgress(pct);
          setPlayPos(newTime);
        }
      }
      startAngle=ang-accRotRef.current;
    };

    const onUp=()=>{
      draggingRef.current=false;
      const aud=audioRef.current;
      if(aud && !aud.paused) aud.pause();
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('touchmove',onMove);
      document.removeEventListener('mouseup',onUp);
      document.removeEventListener('touchend',onUp);
    };

    el.addEventListener('mousedown',onDown);
    el.addEventListener('touchstart',onDown,{passive:false});
    return()=>{
      el.removeEventListener('mousedown',onDown);
      el.removeEventListener('touchstart',onDown);
      document.removeEventListener('mousemove',onMove);
      document.removeEventListener('touchmove',onMove);
      document.removeEventListener('mouseup',onUp);
      document.removeEventListener('touchend',onUp);
    };
  },[]);

  const share=()=>{
    const msg='Check out this voice note keepsake!';
    if(navigator.share){navigator.share({title:'Voice Note Keepsake',text:msg}).catch(()=>{})}
    else{
      navigator.clipboard.writeText(window.location.href+' - '+msg).then(()=>{
        setToastVisible(true);setTimeout(()=>setToastVisible(false),2500);
      }).catch(()=>{});
    }
  };

  return (
    <div className="vnk-screen vnk-player-screen">
      <div className="vnk-topbar">
        <button className="vnk-topbar-btn" onClick={onNewMemory}><RewindIcon/> New memory</button>
        <button className="vnk-topbar-btn" onClick={share}><ShareIcon/> Share</button>
      </div>
      <div className="vnk-player-timer">{fmt(Math.floor(playPos))} / {fmt(duration)}</div>

      <div className="vnk-cassette-outer">
        <div className="vnk-cassette">
          <div className="vnk-c-paper">
            <div className="vnk-c-paper-texture"/>
            <div className="vnk-perfs">
              {Array.from({length:20}).map((_,i)=><div key={i} className="vnk-perf"/>)}
            </div>
            <div className="vnk-photo-strip">
              <div
                ref={filmTrackRef}
                className="vnk-film-track"
                style={{transform:`translateX(-${filmOffset}px)`}}
              >
                {photos?.map((url,i)=>(
                  <img key={i} className="vnk-strip-img" src={url} alt={`m${i}`}/>
                ))}
              </div>
            </div>
            <div className="vnk-c-redline"/>
            <div className="vnk-waveform-wrap"><canvas ref={canvasRef}/></div>
          </div>
          <div className="vnk-c-spool">
            <div className="vnk-spool-grooves"/>
            <span className="vnk-spool-label">@keepsake</span>
          </div>
        </div>

        <div
          className="vnk-handle-assembly"
          ref={handleAssRef}
          style={{transform:`rotate(${handleAngle}deg)`,transformOrigin:'50% 0%'}}
        >
          <div className="vnk-h-cap"/>
          <div className="vnk-h-bar"/>
          <div className="vnk-h-ring"><div className="vnk-h-ring-inner"/></div>
          <div className="vnk-h-waist"/>
          <div className="vnk-h-heart">&#9829;</div>
          <div className="vnk-h-lower"/>
          <div className="vnk-h-base"/>
        </div>
      </div>

      {showHint&&<p className="vnk-handle-hint">Turn the handle clockwise to play &#8635;</p>}
      <div className={`vnk-toast${toastVisible?' show':''}`}>Copied to clipboard!</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function VoiceNoteKeepsake() {
  const [screen,     setScreen]     = useState("splash");
  const [memoryData, setMemoryData] = useState(null);

  return (
    <div className="vnk-root">
      <style>{css}</style>
      <FallingFlowers/>
      {screen==="splash"&&<SplashScreen onStart={()=>setScreen("record")}/>}
      {screen==="record"&&<RecordScreen onContinue={d=>{setMemoryData(d);setScreen("player");}}/>}
      {screen==="player"&&memoryData&&(
        <PlayerScreen data={memoryData} onNewMemory={()=>{setMemoryData(null);setScreen("record");}}/>
      )}
    </div>
  );
}
