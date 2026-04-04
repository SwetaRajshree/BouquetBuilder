import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&display=swap');
.vnk-root{--bg:#3d2f1e;--bg2:#4a3825;--gold:#c9a84c;--gold-light:#e8c97a;--red:#e05c5c;--paper:#f5f0e8;--text-dark:#2a1f10;--green:#6abf7c;width:100%;min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse at 50% 0%,#5a4020 0%,var(--bg) 70%);font-family:'Lato',sans-serif;color:var(--gold-light);display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;}
.vnk-root*,.vnk-root*::before,.vnk-root*::after{box-sizing:border-box;margin:0;padding:0}
.vnk-flowers{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.vnk-flower{position:absolute;top:-80px;color:var(--gold);opacity:0;animation:vnkFall linear infinite;user-select:none;filter:drop-shadow(0 0 2px rgba(201,168,76,0.4));}
.vnk-flower.large{color:var(--gold-light)}.vnk-flower.small{color:#a07830}
@keyframes vnkFall{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:0}5%{opacity:.9}85%{opacity:.6}100%{transform:translateY(112vh) rotate(400deg) scale(.4);opacity:0}}
@keyframes vnkSway{0%,100%{margin-left:0}25%{margin-left:18px}75%{margin-left:-18px}}
.vnk-screen{width:100%;max-width:600px;min-height:100vh;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;}
.vnk-player-screen{justify-content:flex-start;padding:24px 20px;gap:0}
.vnk-topbar{width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.vnk-topbar-btn{background:transparent;border:none;color:var(--gold);font-size:.85rem;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:'Lato',sans-serif;padding:6px;border-radius:4px;transition:background .2s}
.vnk-topbar-btn:hover{background:rgba(201,168,76,.1)}
.vnk-player-timer{font-size:.9rem;color:var(--gold);margin-bottom:16px;letter-spacing:.04em}
.vnk-cassette-outer{position:relative;display:flex;flex-direction:column;align-items:center;margin:0 auto}
.vnk-cassette{position:relative;display:flex;align-items:stretch;width:360px;height:240px}
.vnk-c-paper{position:relative;flex:1;background:var(--paper);border-radius:10px 0 0 10px;overflow:hidden;box-shadow:inset -3px 0 8px rgba(0,0,0,.12);}
.vnk-c-paper-texture{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(160,140,100,.09) 22px,rgba(160,140,100,.09) 23px);pointer-events:none}
.vnk-c-redline{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--red);opacity:.85;z-index:10}
.vnk-photo-strip{position:absolute;top:10px;left:0;right:0;height:calc(100% - 56px);overflow:hidden}
.vnk-film-track{display:flex;flex-direction:row;height:100%;will-change:transform}
.vnk-strip-img{width:130px;height:100%;object-fit:cover;flex-shrink:0;border:3px solid white;margin-right:6px;box-shadow:0 4px 16px rgba(0,0,0,.3);}
.vnk-perfs{position:absolute;top:0;left:0;right:0;height:10px;display:flex;gap:8px;padding:1px 6px;background:rgba(0,0,0,.15);overflow:hidden}
.vnk-perf{width:14px;height:8px;border-radius:2px;background:rgba(255,255,255,.35);flex-shrink:0}
.vnk-waveform-wrap{position:absolute;bottom:6px;left:0;right:0;height:40px;display:flex;align-items:flex-end;overflow:hidden}
.vnk-waveform-wrap canvas{width:100%;height:100%;display:block}
.vnk-c-spool{width:44px;height:240px;flex-shrink:0;position:relative;background:linear-gradient(90deg,#6a6a6a,#bababa 50%,#6a6a6a);border-radius:0 8px 8px 0;box-shadow:4px 0 14px rgba(0,0,0,.55);}
.vnk-spool-grooves{position:absolute;inset:10px 8px;background:repeating-linear-gradient(180deg,#555 0,#555 5px,#7a7a7a 5px,#7a7a7a 9px);border-radius:4px}
.vnk-spool-label{position:absolute;right:2px;top:50%;transform:translateY(-50%) rotate(90deg);font-size:.58rem;letter-spacing:.22em;color:#444;white-space:nowrap;pointer-events:none}
.vnk-handle-assembly{display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;transform-origin:50% 0%;will-change:transform;flex-shrink:0;margin-top:16px;}
.vnk-handle-assembly:active{cursor:grabbing}
.vnk-h-cap{width:11px;height:7px;background:linear-gradient(180deg,#d8d8d8,#aaa);border-radius:6px 6px 0 0;box-shadow:0 -1px 3px rgba(0,0,0,.3);}
.vnk-h-bar{width:7px;height:40px;background:linear-gradient(90deg,#888,#e8e8e8 35%,#d0d0d0 60%,#888);border-radius:4px 4px 2px 2px;box-shadow:1px 1px 5px rgba(0,0,0,.4);position:relative;}
.vnk-h-ring{width:14px;height:14px;background:radial-gradient(circle at 38% 35%,#eee,#aaa 55%,#666);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;}
.vnk-h-ring-inner{width:7px;height:7px;background:radial-gradient(circle at 40% 38%,#c8c8c8,#4a4a4a);border-radius:50%}
.vnk-h-waist{width:6px;height:10px;background:linear-gradient(180deg,#9a9a9a,#d0d0d0,#9a9a9a);border-radius:2px}
.vnk-h-heart{width:28px;height:28px;background:radial-gradient(circle at 37% 33%,#f5f5f5,#b0b0b0 40%,#666);border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;font-size:11px;color:#2a2a2a;position:relative;}
.vnk-h-lower{width:6px;height:12px;background:linear-gradient(180deg,#9a9a9a,#d8d8d8 50%,#9a9a9a);border-radius:0 0 2px 2px}
.vnk-h-base{width:24px;height:12px;background:linear-gradient(180deg,#a0a0a0,#cccccc);border-radius:0 0 14px 14px;box-shadow:0 3px 8px rgba(0,0,0,.45);}
.vnk-handle-hint{font-size:.78rem;color:var(--gold);opacity:.7;text-align:center;margin-top:18px;letter-spacing:.03em}
`;

const SHAPES = ["✿","❀","✾","✽","⚘","❃","❁","✤","✦","❋","✧","❊","⁕","✱","⋆","✫","❇","✺","✹","❈","❉","✸","✷","✶","✵","✴","🌸","🌼","🌻","💮"];
const fmt = s => `${Math.floor(s/60)}:${s%60<10?"0":""}${s%60}`;

function FallingFlowers() {
  const flowers = Array.from({ length: 48 }, (_, i) => {
    const size = 9 + Math.random() * 14;
    return { id: i, left: (i * 2.2 + Math.random() * 2) % 100, delay: Math.random() * 22, duration: 12 + Math.random() * 16, size, sway: 4 + Math.random() * 16, swayDuration: 3 + Math.random() * 4, shape: SHAPES[i % SHAPES.length], opacity: 0.25 + Math.random() * 0.65, cls: size > 18 ? "large" : size < 12 ? "small" : "" };
  });
  return (
    <div className="vnk-flowers" aria-hidden="true">
      {flowers.map(f => (
        <span key={f.id} className={`vnk-flower ${f.cls}`} style={{ left:`${f.left}%`, fontSize: f.size, opacity: f.opacity, animation: `vnkFall ${f.duration}s linear ${f.delay}s infinite, vnkSway ${f.swayDuration}s ease-in-out ${f.delay}s infinite` }}>{f.shape}</span>
      ))}
    </div>
  );
}

export default function KeepsakePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const canvasRef    = useRef(null);
  const audioRef     = useRef(null);
  const filmTrackRef = useRef(null);
  const playingRef   = useRef(false);
  const rafRef       = useRef(null);

  const [playPos,     setPlayPos]     = useState(0);
  const [handleAngle, setHandleAngle] = useState(0);
  const [showHint,    setShowHint]    = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/voice/keepsake/${id}`)
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
      .then(setData)
      .catch(() => setError('This keepsake could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const drawProgress = useCallback((pct, waveData) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const w = canvas.offsetWidth || 290, h = 40;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    const d = waveData?.length > 0 ? waveData : Array.from({ length: 60 }, () => Math.random() * 80 + 10);
    const bw = Math.max(2, w / d.length - 1);
    d.forEach((v, i) => {
      const bh = Math.max(3, (v / 255) * h * 1.2);
      ctx.fillStyle = (i / d.length) <= pct ? 'rgba(224,92,92,.88)' : 'rgba(224,92,92,.22)';
      ctx.beginPath(); ctx.roundRect(i * (bw + 1), h - bh, bw, bh, 2); ctx.fill();
    });
  }, []);

  const moveFilm = useCallback((pct) => {
    const track = filmTrackRef.current; if (!track) return;
    const totalW = track.scrollWidth - track.parentElement.clientWidth;
    track.style.transform = `translateX(-${Math.max(0, pct * totalW)}px)`;
  }, []);

  useEffect(() => {
    if (!data?.audioUrl) return;
    const audio = new Audio(data.audioUrl);
    audioRef.current = audio;
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = audio.currentTime / audio.duration;
      setPlayPos(audio.currentTime);
      drawProgress(pct, []);
      moveFilm(pct);
      setHandleAngle(pct * 720);
    });
    drawProgress(0, []);
    return () => { audio.pause(); audio.src = ''; };
  }, [data, drawProgress, moveFilm]);

  const handleClick = useCallback(() => {
    const aud = audioRef.current; if (!aud) return;
    setShowHint(false);
    if (playingRef.current) {
      playingRef.current = false;
      aud.pause();
      cancelAnimationFrame(rafRef.current);
    } else {
      playingRef.current = true;
      aud.play().catch(() => {});
      const tick = () => {
        if (!playingRef.current) return;
        if (!aud.duration) { rafRef.current = requestAnimationFrame(tick); return; }
        const pct = aud.currentTime / aud.duration;
        setHandleAngle(pct * 720);
        moveFilm(pct);
        drawProgress(pct, []);
        setPlayPos(aud.currentTime);
        if (aud.currentTime < aud.duration) rafRef.current = requestAnimationFrame(tick);
        else playingRef.current = false;
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [drawProgress, moveFilm]);

  if (loading) return (
    <div className="vnk-root"><style>{css}</style><FallingFlowers/>
      <div className="vnk-screen"><p style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>Loading your keepsake... 🌸</p></div>
    </div>
  );

  if (error) return (
    <div className="vnk-root"><style>{css}</style><FallingFlowers/>
      <div className="vnk-screen">
        <p style={{ fontSize: '3rem', marginBottom: 16 }}>💔</p>
        <p style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="vnk-root">
      <style>{css}</style>
      <FallingFlowers/>
      <div className="vnk-screen vnk-player-screen">
        <div className="vnk-topbar">
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--gold-light)' }}>Voice note keepsake 🎙️</p>
        </div>
        <div className="vnk-player-timer">{fmt(Math.floor(playPos))} / {fmt(data.duration || 0)}</div>

        <div className="vnk-cassette-outer">
          <div className="vnk-cassette">
            <div className="vnk-c-paper">
              <div className="vnk-c-paper-texture"/>
              <div className="vnk-perfs">{Array.from({ length: 20 }).map((_, i) => <div key={i} className="vnk-perf"/>)}</div>
              <div className="vnk-photo-strip">
                <div ref={filmTrackRef} className="vnk-film-track">
                  {(data.photos || []).map((url, i) => <img key={i} className="vnk-strip-img" src={url} alt={`m${i}`}/>)}
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

          <div className="vnk-handle-assembly" onClick={handleClick} style={{ transform: `rotate(${handleAngle}deg)`, transformOrigin: '50% 0%' }}>
            <div className="vnk-h-cap"/>
            <div className="vnk-h-bar"/>
            <div className="vnk-h-ring"><div className="vnk-h-ring-inner"/></div>
            <div className="vnk-h-waist"/>
            <div className="vnk-h-heart">♥</div>
            <div className="vnk-h-lower"/>
            <div className="vnk-h-base"/>
          </div>
        </div>

        {showHint && <p className="vnk-handle-hint">Click the handle to play ▶</p>}
      </div>
    </div>
  );
}
