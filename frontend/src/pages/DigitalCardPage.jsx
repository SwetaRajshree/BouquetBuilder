import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CARD_STYLES = [
  { id:'parchment', name:'Parchment', bg:'linear-gradient(135deg,#fce4f0,#f8d0e8,#f0c8e0)', border:'#d4a0c8' },
  { id:'ivory',     name:'Ivory',     bg:'linear-gradient(135deg,#f5e8c8,#ede0b0,#e8d898)', border:'#c8a860' },
  { id:'blush',     name:'Blush',     bg:'linear-gradient(135deg,#e8f5f0,#d0ece8,#c0e0d8)', border:'#80c0b0' },
  { id:'sage',      name:'Sage',      bg:'linear-gradient(135deg,#fff8f0,#fff0e0,#ffe8d0)', border:'#f0a880' },
  { id:'slate',     name:'Slate',     bg:'linear-gradient(135deg,#f8f5f0,#f0ece0,#e8e0d0)', border:'#d0c8b0' },
  { id:'postcard',  name:'Postcard',  bg:'linear-gradient(135deg,#fffbe8,#fff5d0,#fff0c0)', border:'#d4b840' },
];

const MUSIC_OPTIONS = [
  { id:'melancholy', name:'Melancholy', color:'#f0b030', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774812792/tomomi_kato-melancholy-11828_rswib3.mp3' },
  { id:'digital',    name:'Digital',    color:'#f04060', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774812821/paulyudin-ambient-ambient-music-482398_nz4xlp.mp3' },
  { id:'violin',     name:'Violin',     color:'#e87090', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774812819/adiiswanto-cvilni-violin-302859_idsvsi.mp3' },
  { id:'glow',       name:'Glow',       color:'#d0d0d0', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774812821/paulyudin-ambient-ambient-music-482398_nz4xlp.mp3' },
  { id:'guitar',     name:'Guitar',     color:'#60c060', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774813992/eliveta-acoustic-473981_jphfwr.mp3' },
  { id:'saxophone',  name:'Saxophone',  color:'#a0a0b0', url:'https://res.cloudinary.com/deixioyzo/video/upload/v1774813992/eliveta-acoustic-473981_jphfwr.mp3' },
];

const LAYOUTS = {
  classic: [
    [50,72,1.15,0],[34,64,1.0,-18],[66,64,1.0,18],
    [20,55,0.88,-28],[80,55,0.88,28],[50,50,0.92,6],
    [36,46,0.82,-12],[64,46,0.82,12],[50,36,0.86,0],
    [28,40,0.76,-22],[72,40,0.76,22],
  ],
  cascade: [
    [50,75,1.15,0],[30,68,1.05,-22],[70,68,1.05,22],
    [15,58,0.9,-35],[85,58,0.9,35],[38,52,0.88,-10],
    [62,52,0.88,10],[24,44,0.78,-28],[76,44,0.78,28],
    [50,42,0.82,5],[44,34,0.72,-15],
  ],
  fan: [
    [50,70,1.15,0],[28,60,1.08,-30],[72,60,1.08,30],
    [10,48,0.9,-50],[90,48,0.9,50],[32,44,0.85,-18],
    [68,44,0.85,18],[18,36,0.76,-40],[82,36,0.76,40],
    [50,38,0.8,0],[50,26,0.7,8],
  ],
  round: [
    [50,68,1.15,0],[32,58,1.05,-20],[68,58,1.05,20],
    [22,46,0.92,-32],[78,46,0.92,32],[50,44,0.88,0],
    [36,36,0.8,-14],[64,36,0.8,14],[50,28,0.78,5],
    [28,30,0.72,-25],[72,30,0.72,25],
  ],
  wild: [
    [48,74,1.15,-5],[30,62,1.08,-25],[72,65,1.02,20],
    [16,52,0.88,-42],[84,56,0.9,38],[54,48,0.9,12],
    [34,42,0.8,-8],[68,40,0.84,22],[46,32,0.78,-15],
    [22,38,0.72,-35],[78,34,0.74,30],
  ],
};

function BouquetDisplay({ selectedFlowers, foliage, bgColor, layout }) {
  const positions = LAYOUTS[layout] || LAYOUTS.classic;
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:380, margin:'0 auto', aspectRatio:'1/1' }}>
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'72%', height:'72%', background:bgColor || '#fde8c8',
        borderRadius:'50%', filter:'blur(18px)', zIndex:0, opacity:0.85,
      }}/>
      {foliage && (
        <div style={{
          position:'absolute', bottom:'4%', left:'50%',
          transform:'translateX(-50%)', width:'90%', zIndex:1,
          animation:'sway 5s ease-in-out infinite', transformOrigin:'bottom center',
        }}>
          <img src={foliage.img} alt={foliage.name}
            style={{ width:'100%', filter:'drop-shadow(0 8px 16px rgba(0,0,0,0.12))' }}/>
        </div>
      )}
      {(selectedFlowers || []).map((flower, idx) => {
        const pos = positions[idx % positions.length];
        const size = idx < 3 ? 118 : 96;
        return (
          <div key={flower.id + '-' + idx} style={{
            position:'absolute', left:pos[0]+'%', top:pos[1]+'%',
            transform:`translate(-50%,-50%) rotate(${pos[3]}deg) scale(${pos[2]})`,
            zIndex:2+idx, filter:'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
            animation:`floatIn 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.07}s both`,
          }}>
            <img src={flower.img} alt={flower.name} width={size} height={size}
              style={{ objectFit:'contain', display:'block' }}/>
          </div>
        );
      })}
      <div style={{
        position:'absolute', bottom:'2%', left:'50%', transform:'translateX(-50%)',
        width:'28%', height:'10%',
        background:'linear-gradient(180deg,#e8c890,#b8904a)',
        borderRadius:'4px 4px 18px 18px', zIndex:20,
        boxShadow:'0 4px 14px rgba(160,120,60,0.35)',
      }}/>
    </div>
  );
}

export default function DigitalCardPage() {
  const navigate = useNavigate();

  const [bouquet, setBouquet]       = useState(null);
  const [step, setStep]             = useState(0); // 0 = card, 1 = share
  const [cardStyle, setCardStyle]   = useState(CARD_STYLES[0]);
  const [recipient, setRecipient]   = useState('');
  const [message, setMessage]       = useState('');
  const [sender, setSender]         = useState('');
  const [music, setMusic]           = useState(null);
  const [spotifyLink, setSpotifyLink] = useState('');
  const [audioMode, setAudioMode]   = useState('music'); // 'music' | 'voice'
  const [recording, setRecording]   = useState(false);
  const [voiceBlob, setVoiceBlob]   = useState(null);
  const [voiceURL, setVoiceURL]     = useState(null);
  const [voiceId, setVoiceId]       = useState(null);
  const mediaRecorderRef            = useRef(null);
  const chunksRef                   = useRef([]);
  const [shared, setShared]         = useState(false);
  const [confetti, setConfetti]     = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmail, setShowEmail]   = useState(false);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem('bouquet_data'));
      if (d) setBouquet(d);
    } catch {}
  }, []);

  const spotifyEmbedId = spotifyLink.match(/track\/([a-zA-Z0-9]+)/)?.[1] || null;

  const buildShareURL = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/bouquet/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bouquet, recipient, message, sender, cardStyle: cardStyle.id, voiceId, spotifyId: spotifyEmbedId, musicUrl: MUSIC_OPTIONS.find(m => m.id === music)?.url || null }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      if (!data.id) throw new Error('No ID returned');
      return `${window.location.origin}/view-bouquet/${data.id}`;
    } catch (err) {
      alert('Could not generate link: ' + err.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    const url = await buildShareURL();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
      fireConfetti();
    } catch {
      prompt('Copy this link:', url);
    }
  };

  const sendEmail = async () => {
    if (!emailInput.trim()) return;
    const url = await buildShareURL();
    if (!url) return;
    const subject = encodeURIComponent(`${sender || 'Someone'} sent you a bouquet \uD83C\uDF38`);
    const body = encodeURIComponent(`Hi ${recipient || 'there'},\n\n${message || 'I made this bouquet for you!'}\n\nView your bouquet here:\n${url}\n\nWith love,\n${sender || ''}`);
    window.location.href = `mailto:${emailInput}?subject=${subject}&body=${body}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setVoiceBlob(blob);
        setVoiceURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        // upload to backend
        try {
          const res = await fetch('http://localhost:5000/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'audio/webm' },
            body: blob,
          });
          const { id } = await res.json();
          setVoiceId(id);
        } catch {
          // local playback still works even if upload fails
        }
      };
      mr.start();
      setRecording(true);
    } catch {
      alert('Microphone access denied. Please allow mic access and try again.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const deleteVoice = () => {
    setVoiceBlob(null);
    setVoiceURL(null);
    setVoiceId(null);
  };

  const fireConfetti = () => {
    const cols = ['#f08080','#80c080','#8080f0','#f0c060','#c080f0','#f0a050'];
    const pieces = Array.from({ length:55 }, (_, i) => ({
      id:i, x:Math.random()*100,
      color:cols[i%6], delay:Math.random()*1.5, size:5+Math.random()*9,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 4500);
  };

  const ghostBtn = {
    padding:'16px 28px', background:'rgba(255,255,255,0.65)',
    color:'#5a7050', border:'2px solid rgba(90,120,80,0.3)',
    borderRadius:50, fontSize:13, letterSpacing:2,
    cursor:'pointer', fontFamily:'sans-serif',
  };

  const primaryBtn = {
    padding:'16px 44px', background:'linear-gradient(135deg,#3a6030,#5a8050)',
    color:'white', border:'none', borderRadius:50,
    fontSize:14, letterSpacing:3, cursor:'pointer',
    fontFamily:'sans-serif', boxShadow:'0 8px 28px rgba(60,100,48,0.38)',
    transition:'all 0.3s ease',
  };

  return (
    <div className="page-enter min-h-screen" style={{ background:'#c8e8c8', fontFamily:"Georgia,'Palatino Linotype',serif" }}>
      <style>{`
        @keyframes floatIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.2);} to{opacity:1;} }
        @keyframes sway { 0%,100%{transform:translateX(-50%) rotate(-2.5deg);} 50%{transform:translateX(-50%) rotate(2.5deg);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes confettiFall { 0%{transform:translateY(-30px) rotate(0deg);opacity:1;} 100%{transform:translateY(110vh) rotate(720deg);opacity:0;} }
        @keyframes bounce { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-5px) scale(1.08);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{
          position:'fixed', top:0, left:p.x+'%', zIndex:9999,
          width:p.size, height:p.size, background:p.color, borderRadius:'3px',
          animation:`confettiFall ${2+p.delay}s linear ${p.delay*0.4}s both`,
          pointerEvents:'none',
        }}/>
      ))}

      {/* Header */}
      <div style={{ textAlign:'center', padding:'44px 24px 20px' }}>
        <div style={{ fontSize:12, letterSpacing:7, color:'#5a7050', marginBottom:8, fontFamily:'sans-serif' }}>BLOOM & CRAFT</div>
        <h1 style={{ fontSize:'clamp(2rem,5vw,3.4rem)', color:'#2a3a20', fontWeight:300, margin:'0 0 10px', letterSpacing:2 }}>
          {step === 0 ? 'Add a Card' : 'Your Bouquet is Ready! 🌸'}
        </h1>
        <div style={{ width:60, height:2, background:'linear-gradient(90deg,transparent,#5a8050,transparent)', margin:'0 auto' }}/>
      </div>

      {/* Step 0 — Card */}
      {step === 0 && (
        <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:1020, margin:'0 auto' }}>
          <p style={{ textAlign:'center', color:'#6a8060', fontSize:15, marginBottom:36 }}>Choose a style and write your message.</p>

          {/* Card style picker */}
          <div style={{ marginBottom:32 }}>
            <div style={{ textAlign:'center', fontSize:11, letterSpacing:4, color:'#7a9060', marginBottom:18, fontFamily:'sans-serif' }}>CARD STYLE</div>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              {CARD_STYLES.map(cs => (
                <div key={cs.id} onClick={() => setCardStyle(cs)}
                  style={{
                    width:108, height:78, borderRadius:13, background:cs.bg,
                    border:'3px solid ' + (cardStyle.id === cs.id ? '#3a6030' : cs.border),
                    cursor:'pointer',
                    boxShadow: cardStyle.id === cs.id ? '0 8px 22px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.07)',
                    transition:'all 0.2s ease',
                    transform: cardStyle.id === cs.id ? 'scale(1.09)' : 'scale(1)',
                    display:'flex', alignItems:'flex-end', justifyContent:'center', paddingBottom:6,
                  }}>
                  <div style={{ fontSize:11, color:'#5a4030', fontFamily:'sans-serif' }}>{cs.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two column: message + preview */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }}>

            {/* Message form */}
            <div style={{ background:'rgba(255,255,255,0.62)', borderRadius:24, padding:30, backdropFilter:'blur(10px)' }}>
              <div style={{ fontSize:11, letterSpacing:4, color:'#7a9060', marginBottom:22, fontFamily:'sans-serif' }}>MESSAGE</div>
              {[
                { label:'RECIPIENT', val:recipient, set:setRecipient, placeholder:'Beloved,' },
                { label:'SENDER',    val:sender,    set:setSender,    placeholder:'Secret Admirer' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom:18 }}>
                  <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:7, fontFamily:'sans-serif' }}>{item.label}</div>
                  <input value={item.val} onChange={e => item.set(e.target.value)} placeholder={item.placeholder}
                    style={{ width:'100%', padding:'13px 16px', borderRadius:15, border:'none', background:'#f8f4ed', fontSize:14, color:'#4a3a28', outline:'none', boxSizing:'border-box', fontFamily:'Georgia,serif' }}/>
                </div>
              ))}
              <div>
                <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:7, fontFamily:'sans-serif' }}>MESSAGE</div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Keep it short, warm, and card-sized." rows={5}
                  style={{ width:'100%', padding:'13px 16px', borderRadius:15, border:'none', background:'#f8f4ed', fontSize:14, color:'#4a3a28', outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'Georgia,serif' }}/>
                <div style={{ fontSize:11, color:'#9a8a70', marginTop:5, fontFamily:'sans-serif' }}>A shorter note fits the card better.</div>
              </div>
            </div>

            {/* Live preview + music */}
            <div style={{ background:'rgba(255,255,255,0.62)', borderRadius:24, padding:30, backdropFilter:'blur(10px)' }}>
              <div style={{ fontSize:11, letterSpacing:4, color:'#7a9060', marginBottom:22, fontFamily:'sans-serif' }}>LIVE PREVIEW</div>
              <div style={{
                background:cardStyle.bg, border:'2px solid '+cardStyle.border,
                borderRadius:16, padding:'26px 22px', textAlign:'center',
                minHeight:130, marginBottom:26, boxShadow:'0 4px 18px rgba(0,0,0,0.07)',
              }}>
                {recipient && <div style={{ fontSize:15, fontWeight:700, color:'#3a2a18', marginBottom:10 }}>To {recipient},</div>}
                {message   && <div style={{ fontSize:13, color:'#5a4030', fontStyle:'italic', lineHeight:1.75, marginBottom:14 }}>{message}</div>}
                {sender    && <div style={{ fontSize:13, color:'#7a6050' }}>{sender}</div>}
                {!recipient && !message && !sender && <div style={{ color:'#c0b0a0', fontSize:13, fontStyle:'italic' }}>Your message will appear here...</div>}
              </div>

              <div style={{ fontSize:11, letterSpacing:4, color:'#7a9060', marginBottom:14, textAlign:'center', fontFamily:'sans-serif' }}>BACKGROUND AUDIO</div>

              {/* Toggle */}
              <div style={{ display:'flex', borderRadius:50, overflow:'hidden', border:'2px solid rgba(90,120,80,0.25)', marginBottom:16 }}>
                {[['music','🎵 Music'],['voice','🎙 Voice Note']].map(([mode, label]) => (
                  <button key={mode} onClick={() => setAudioMode(mode)}
                    style={{ flex:1, padding:'9px 0', fontSize:12, fontFamily:'sans-serif', letterSpacing:1, border:'none', cursor:'pointer', transition:'all 0.2s',
                      background: audioMode === mode ? 'linear-gradient(135deg,#3a6030,#5a8050)' : 'rgba(255,255,255,0.6)',
                      color: audioMode === mode ? 'white' : '#5a7050',
                    }}>{label}</button>
                ))}
              </div>

              {/* Music picker */}
              {audioMode === 'music' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {MUSIC_OPTIONS.map(m => (
                      <div key={m.id} onClick={() => setMusic(music === m.id ? null : m.id)} style={{ textAlign:'center', cursor:'pointer' }}>
                        <div style={{
                          width:46, height:46, borderRadius:'50%', background:m.color,
                          margin:'0 auto 5px',
                          border:'3px solid ' + (music === m.id ? '#3a6030' : 'transparent'),
                          boxShadow: music === m.id ? '0 4px 14px '+m.color+'90' : '0 2px 8px rgba(0,0,0,0.1)',
                          transition:'all 0.2s ease',
                          animation: music === m.id ? 'bounce 1s ease-in-out infinite' : 'none',
                        }}/>
                        <div style={{ fontSize:10, color:'#7a9060', fontFamily:'sans-serif', letterSpacing:0.5 }}>{m.name.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                  {music && (
                    <div style={{ marginTop:10 }}>
                      <audio controls autoPlay loop src={MUSIC_OPTIONS.find(m => m.id === music)?.url}
                        style={{ width:'100%', borderRadius:12 }}/>
                    </div>
                  )}

                  {/* Spotify link */}
                  <div style={{ borderTop:'1px solid rgba(90,120,80,0.15)', paddingTop:14 }}>
                    <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:8, fontFamily:'sans-serif' }}>OR ADD A SPOTIFY SONG</div>
                    <div style={{ display:'flex', gap:8 }}>
                      <input
                        value={spotifyLink}
                        onChange={e => setSpotifyLink(e.target.value)}
                        placeholder="Paste Spotify song link..."
                        style={{ flex:1, padding:'10px 14px', borderRadius:12, border:'1.5px solid #c8d8c0', background:'#f8f4ed', fontSize:13, color:'#4a3a28', outline:'none', fontFamily:'Georgia,serif' }}
                      />
                      {spotifyLink && (
                        <button onClick={() => setSpotifyLink('')}
                          style={{ padding:'10px 14px', borderRadius:12, border:'1px solid #c04040', background:'none', color:'#c04040', fontSize:12, cursor:'pointer', fontFamily:'sans-serif' }}>
                          ×
                        </button>
                      )}
                    </div>
                    {spotifyEmbedId && (
                      <div style={{ marginTop:10, borderRadius:12, overflow:'hidden' }}>
                        <iframe
                          src={`https://open.spotify.com/embed/track/${spotifyEmbedId}?utm_source=generator&theme=0`}
                          width="100%" height="80" frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy" style={{ borderRadius:12 }}
                        />
                      </div>
                    )}
                    {spotifyLink && !spotifyEmbedId && (
                      <div style={{ fontSize:11, color:'#c06040', marginTop:6, fontFamily:'sans-serif' }}>Paste a valid Spotify track link e.g. https://open.spotify.com/track/...</div>
                    )}
                  </div>
                </div>
              )}

              {/* Voice recorder */}
              {audioMode === 'voice' && (
                <div style={{ textAlign:'center' }}>
                  {!voiceURL ? (
                    <div>
                      <button
                        onClick={recording ? stopRecording : startRecording}
                        style={{
                          width:72, height:72, borderRadius:'50%', border:'none', cursor:'pointer',
                          background: recording ? 'linear-gradient(135deg,#e04040,#c02020)' : 'linear-gradient(135deg,#3a6030,#5a8050)',
                          boxShadow: recording ? '0 0 0 8px rgba(220,60,60,0.2), 0 0 0 16px rgba(220,60,60,0.1)' : '0 6px 20px rgba(60,100,48,0.35)',
                          fontSize:28, marginBottom:10,
                          animation: recording ? 'bounce 0.8s ease-in-out infinite' : 'none',
                          transition:'all 0.3s ease',
                        }}>
                        {recording ? '⏹' : '🎙'}
                      </button>
                      <div style={{ fontSize:12, color: recording ? '#c02020' : '#7a9060', fontFamily:'sans-serif', letterSpacing:1 }}>
                        {recording ? '● RECORDING... tap to stop' : 'TAP TO RECORD'}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background:'rgba(255,255,255,0.7)', borderRadius:16, padding:'14px 18px' }}>
                      <div style={{ fontSize:11, color:'#5a7050', fontFamily:'sans-serif', letterSpacing:2, marginBottom:10 }}>✓ VOICE NOTE RECORDED</div>
                      <audio controls src={voiceURL} style={{ width:'100%', marginBottom:10 }}/>
                      <button onClick={deleteVoice}
                        style={{ fontSize:11, color:'#c04040', background:'none', border:'1px solid #c04040', borderRadius:20, padding:'5px 14px', cursor:'pointer', fontFamily:'sans-serif', letterSpacing:1 }}>
                        🗑 DELETE & RE-RECORD
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display:'flex', gap:14, justifyContent:'center', marginTop:36 }}>
            <button style={ghostBtn} onClick={() => navigate('/bouquet-builder')}>← BACK</button>
            <button style={primaryBtn} onClick={() => setStep(1)}>PREVIEW & SHARE →</button>
          </div>
        </div>
      )}

      {/* Step 1 — Share */}
      {step === 1 && (
        <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:680, margin:'0 auto', textAlign:'center' }}>
          <p style={{ color:'#6a8060', fontSize:15, marginBottom:36 }}>Share your beautiful creation with someone special.</p>

          <div style={{ background:'rgba(255,255,255,0.65)', borderRadius:32, padding:36, marginBottom:28, backdropFilter:'blur(10px)' }}>
            <BouquetDisplay
              selectedFlowers={bouquet?.selectedFlowers}
              foliage={bouquet?.foliage}
              bgColor={bouquet?.bgColor}
              layout={bouquet?.layout}
            />
            {(recipient || message || sender) && (
              <div style={{ marginTop:28, background:cardStyle.bg, border:'2px solid '+cardStyle.border, borderRadius:20, padding:'22px 28px', boxShadow:'0 4px 18px rgba(0,0,0,0.07)' }}>
                {recipient && <div style={{ fontSize:15, fontWeight:700, color:'#3a2a18', marginBottom:9 }}>To {recipient},</div>}
                {message   && <div style={{ fontSize:14, color:'#5a4030', fontStyle:'italic', lineHeight:1.8 }}>{message}</div>}
                {sender    && <div style={{ fontSize:13, color:'#7a6050', marginTop:14 }}>{sender}</div>}
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
            {/* Share via Link */}
            <button onClick={copyLink} disabled={saving}
              style={{ padding:'15px 26px', background: linkCopied ? 'linear-gradient(135deg,#2a7a40,#3a9050)' : 'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:50, fontSize:13, letterSpacing:2, cursor: saving ? 'wait' : 'pointer', fontFamily:'sans-serif', boxShadow:'0 8px 22px rgba(60,100,48,0.32)', transition:'all 0.3s ease' }}>
              {saving ? 'SAVING...' : linkCopied ? '✓ LINK COPIED!' : '📱 COPY SHARE LINK'}
            </button>

            {/* Send via Email */}
            <button onClick={() => setShowEmail(e => !e)}
              style={{ padding:'15px 26px', background: showEmail ? 'rgba(255,255,255,0.9)' : 'linear-gradient(135deg,#3a6030,#5a8050)', color: showEmail ? '#3a6030' : 'white', border: showEmail ? '2px solid #3a6030' : 'none', borderRadius:50, fontSize:13, letterSpacing:2, cursor:'pointer', fontFamily:'sans-serif', boxShadow:'0 8px 22px rgba(60,100,48,0.32)', transition:'all 0.3s ease' }}>
              💌 SEND VIA EMAIL
            </button>
          </div>

          {/* Email input */}
          {showEmail && (
            <div style={{ animation:'fadeUp 0.3s ease-out', background:'rgba(255,255,255,0.82)', borderRadius:20, padding:'22px 28px', marginBottom:20, display:'inline-block', minWidth:320 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:'#7a9060', marginBottom:10, fontFamily:'sans-serif' }}>RECIPIENT EMAIL</div>
              <div style={{ display:'flex', gap:10 }}>
                <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
                  placeholder="friend@example.com" type="email"
                  style={{ flex:1, padding:'12px 16px', borderRadius:12, border:'1.5px solid #c8d8c0', background:'#f8f4ed', fontSize:14, color:'#4a3a28', outline:'none', fontFamily:'Georgia,serif' }}/>
                <button onClick={sendEmail}
                  style={{ padding:'12px 20px', background:'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:12, fontSize:13, cursor:'pointer', fontFamily:'sans-serif', letterSpacing:1 }}>
                  SEND →
                </button>
              </div>
              <div style={{ fontSize:11, color:'#9a8a70', marginTop:8, fontFamily:'sans-serif' }}>Opens your email app with the bouquet link pre-filled.</div>
            </div>
          )}

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button style={ghostBtn} onClick={() => setStep(0)}>← EDIT CARD</button>
            <button style={ghostBtn} onClick={() => navigate('/bouquet-builder')}>🌱 BUILD ANOTHER</button>
          </div>
        </div>
      )}
    </div>
  );
}
