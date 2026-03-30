import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMG = {
  orchid:      'https://res.cloudinary.com/deixioyzo/image/upload/v1774807072/orchid_dsy56h.webp',
  tulip:       'https://res.cloudinary.com/deixioyzo/image/upload/v1774807102/tulip_puadkq.webp',
  dahlia:      'https://res.cloudinary.com/deixioyzo/image/upload/v1774807041/dahlia_sla5oc.webp',
  anemone:     'https://res.cloudinary.com/deixioyzo/image/upload/v1774807029/anemone_fjaadv.webp',
  carnation:   'https://res.cloudinary.com/deixioyzo/image/upload/v1774807041/carnation_y3znwa.webp',
  zinnia:      'https://res.cloudinary.com/deixioyzo/image/upload/v1774807102/zinnia_fulk0d.webp',
  ranunculus:  'https://res.cloudinary.com/deixioyzo/image/upload/v1774807073/ranunculus_cofymy.webp',
  sunflower:   'https://res.cloudinary.com/deixioyzo/image/upload/v1774807074/sunflower_b6y0dc.webp',
  lily:        'https://res.cloudinary.com/deixioyzo/image/upload/v1774807072/lily_pj5kx1.webp',
  daisy:       'https://res.cloudinary.com/deixioyzo/image/upload/v1774807043/daisy_wvukz4.webp',
  peony:       'https://res.cloudinary.com/deixioyzo/image/upload/v1774807073/peony_u4czhz.webp',
  rose:        'https://res.cloudinary.com/deixioyzo/image/upload/v1774807075/rose_dvhs22.webp',
  fern:        'https://res.cloudinary.com/deixioyzo/image/upload/v1774807043/fern_tipfkk.webp',
  eucalyptus:  'https://res.cloudinary.com/deixioyzo/image/upload/v1774807042/eucalyptus_gnobku.webp',
  babysbreath: 'https://res.cloudinary.com/deixioyzo/image/upload/v1774807031/Baby_s_Breath_cso0rw.webp',
};

const FLOWERS = [
  { id:'orchid',     name:'Orchid',     img:IMG.orchid,     color:'#f0eaf8', accent:'#c9a0dc' },
  { id:'tulip',      name:'Tulip',      img:IMG.tulip,      color:'#fce8e8', accent:'#e05050' },
  { id:'dahlia',     name:'Dahlia',     img:IMG.dahlia,     color:'#fdf0e0', accent:'#e8a050' },
  { id:'anemone',    name:'Anemone',    img:IMG.anemone,    color:'#ede0f8', accent:'#8060c0' },
  { id:'carnation',  name:'Carnation',  img:IMG.carnation,  color:'#fce8f0', accent:'#e080a0' },
  { id:'zinnia',     name:'Zinnia',     img:IMG.zinnia,     color:'#feeee0', accent:'#e08050' },
  { id:'ranunculus', name:'Ranunculus', img:IMG.ranunculus, color:'#fce8e0', accent:'#e09080' },
  { id:'sunflower',  name:'Sunflower',  img:IMG.sunflower,  color:'#fff8e0', accent:'#f0c020' },
  { id:'lily',       name:'Lily',       img:IMG.lily,       color:'#f8f4e8', accent:'#d0c090' },
  { id:'daisy',      name:'Daisy',      img:IMG.daisy,      color:'#f8f8f0', accent:'#e0e080' },
  { id:'peony',      name:'Peony',      img:IMG.peony,      color:'#fce0e0', accent:'#d06060' },
  { id:'rose',       name:'Rose',       img:IMG.rose,       color:'#fce8e8', accent:'#c04040' },
];

const FOLIAGE = [
  { id:'fern',        name:'Fern',          desc:'Wild & Dramatic', img:IMG.fern        },
  { id:'eucalyptus',  name:'Eucalyptus',    desc:'Fresh & Modern',  img:IMG.eucalyptus  },
  { id:'babysbreath', name:"Baby's Breath", desc:'Soft & Delicate', img:IMG.babysbreath },
];

const BG_COLORS = [
  { label:'Morning', color:'#fde8c8' },
  { label:'Garden',  color:'#d8f0d0' },
  { label:'Dusk',    color:'#f8d0c0' },
  { label:'Night',   color:'#c8d0f8' },
  { label:'Blossom', color:'#f0d0f0' },
  { label:'Cream',   color:'#f5f0e8' },
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

const LAYOUT_LABELS = [
  { id:'classic',  label:'Classic'  },
  { id:'cascade',  label:'Cascade'  },
  { id:'fan',      label:'Fan'      },
  { id:'round',    label:'Round'    },
  { id:'wild',     label:'Wild'     },
];

const STEP_LABELS = ['PICK FLOWERS', 'CHOOSE GREENERY', 'YOUR BOUQUET'];

function BouquetDisplay({ selectedFlowers, foliage, bgColor, layout }) {
  const positions = LAYOUTS[layout] || LAYOUTS.classic;
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:460, margin:'0 auto', aspectRatio:'1/1' }}>
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'72%', height:'72%', background:bgColor,
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
      {/* Wrap stem */}
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

export default function BouquetBuilderPage() {
  const navigate = useNavigate();
  const [step, setStep]                     = useState(0);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [foliage, setFoliage]               = useState(null);
  const [bgColor, setBgColor]               = useState('#fde8c8');
  const [layout, setLayout]                 = useState('classic');
  const [hoveredId, setHoveredId]           = useState(null);

  const count   = selectedFlowers.length;
  const countOf = (f) => selectedFlowers.filter(x => x.id === f.id).length;

  const addFlower = (flower) => { if (count < 10) setSelectedFlowers(p => [...p, flower]); };
  const removeOne = (flower) => {
    setSelectedFlowers(p => {
      const arr = [...p];
      const idx = arr.map(f => f.id).lastIndexOf(flower.id);
      if (idx !== -1) arr.splice(idx, 1);
      return arr;
    });
  };

  const canProceed = () => {
    if (step === 0) return count >= 6;
    if (step === 1) return foliage !== null;
    return true;
  };

  const proceed = () => {
    sessionStorage.setItem('bouquet_data', JSON.stringify({ selectedFlowers, foliage, bgColor, layout }));
    navigate('/digital-card');
  };

  return (
    <div className="page-enter min-h-screen" style={{ background:'#c8e8c8', fontFamily:"Georgia,'Palatino Linotype',serif" }}>
      <style>{`
        @keyframes floatIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.2);} to{opacity:1;} }
        @keyframes sway { 0%,100%{transform:translateX(-50%) rotate(-2.5deg);} 50%{transform:translateX(-50%) rotate(2.5deg);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{box-shadow:0 4px 20px rgba(60,100,48,0.4);} 50%{box-shadow:0 4px 32px rgba(60,100,48,0.7);} }
        .flower-tile{transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease;}
        .flower-tile:hover{transform:translateY(-10px) scale(1.07) !important;box-shadow:0 20px 40px rgba(0,0,0,0.18) !important;}
        .foliage-tile{transition:transform 0.3s ease,box-shadow 0.3s ease;}
        .foliage-tile:hover{transform:translateY(-8px) scale(1.04) !important;box-shadow:0 18px 40px rgba(0,0,0,0.18) !important;}
      `}</style>

      {/* Header */}
      <div style={{ textAlign:'center', padding:'44px 24px 20px' }}>
        <div style={{ fontSize:12, letterSpacing:7, color:'#5a7050', marginBottom:8, fontFamily:'sans-serif' }}>BLOOM & CRAFT</div>
        <h1 style={{ fontSize:'clamp(2rem,5vw,3.4rem)', color:'#2a3a20', fontWeight:300, margin:'0 0 10px', letterSpacing:2 }}>
          Build Your Bouquet
        </h1>
        <div style={{ width:60, height:2, background:'linear-gradient(90deg,transparent,#5a8050,transparent)', margin:'0 auto' }}/>
      </div>

      {/* Stepper */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 24px 36px', maxWidth:600, margin:'0 auto' }}>
        {STEP_LABELS.map((label, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, cursor: i <= step ? 'pointer' : 'default' }}
              onClick={() => { if (i <= step) setStep(i); }}>
              <div style={{
                width:40, height:40, borderRadius:'50%',
                background: i === step ? '#3a6030' : i < step ? '#5a8050' : 'rgba(255,255,255,0.4)',
                border:'2px solid ' + (i <= step ? '#3a6030' : '#a0b890'),
                display:'flex', alignItems:'center', justifyContent:'center',
                color: i <= step ? 'white' : '#6a8060', fontWeight:700, fontSize:16,
                transition:'all 0.4s ease',
                animation: i === step ? 'pulse 2s ease-in-out infinite' : 'none',
              }}>{i + 1}</div>
              <div style={{ fontSize:10, letterSpacing:2, color: i === step ? '#2a3a20' : '#6a8060', fontFamily:'sans-serif', textAlign:'center' }}>{label}</div>
            </div>
            {i < 2 && <div style={{ flex:1, height:2, background: i < step ? '#5a8050' : 'rgba(255,255,255,0.3)', margin:'0 6px', marginBottom:26, transition:'background 0.4s' }}/>}
          </div>
        ))}
      </div>

      {/* Step 0 — Pick Flowers */}
      {step === 0 && (
        <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:1060, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontSize:'clamp(1.7rem,4vw,2.6rem)', color:'#2a3a20', fontWeight:300, margin:'0 0 10px', letterSpacing:1 }}>
              Pick 6 to 10 blooms
            </h2>
            <p style={{ color:'#6a8060', fontSize:15, margin:'0 0 16px' }}>
              Repeat the same bloom to build the shape you want.{' '}
              <strong style={{ color:'#3a6030' }}>{count}/10 selected</strong>
            </p>
            <div style={{ width:280, height:7, background:'rgba(255,255,255,0.45)', borderRadius:4, margin:'0 auto', overflow:'hidden' }}>
              <div style={{
                height:'100%', width:((count/10)*100)+'%',
                background: count >= 6 ? 'linear-gradient(90deg,#5a8050,#3a6030)' : 'linear-gradient(90deg,#a0b890,#7a9870)',
                borderRadius:4, transition:'width 0.35s ease',
              }}/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))', gap:18 }}>
            {FLOWERS.map(flower => {
              const n = countOf(flower);
              return (
                <div key={flower.id} className="flower-tile"
                  style={{
                    background: n > 0 ? flower.color : 'rgba(255,255,255,0.55)',
                    borderRadius:22, padding:'20px 14px 14px',
                    border:'2px solid ' + (n > 0 ? flower.accent : 'rgba(255,255,255,0.75)'),
                    cursor:'pointer', textAlign:'center',
                    boxShadow: n > 0 ? '0 8px 28px ' + flower.accent + '55' : '0 4px 14px rgba(0,0,0,0.06)',
                    position:'relative', backdropFilter:'blur(8px)',
                  }}
                  onMouseEnter={() => setHoveredId(flower.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => addFlower(flower)}
                >
                  {n > 0 && (
                    <div style={{
                      position:'absolute', top:9, right:9,
                      background:flower.accent, color:'white',
                      borderRadius:'50%', width:22, height:22,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:700, fontFamily:'sans-serif',
                    }}>{n}</div>
                  )}
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
                    <img src={flower.img} alt={flower.name}
                      width={hoveredId === flower.id ? 88 : 76} height={hoveredId === flower.id ? 88 : 76}
                      style={{ objectFit:'contain', filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.12))', transition:'all 0.25s ease' }}/>
                  </div>
                  <div style={{ fontSize:13, color:'#3a3a28', fontWeight:600 }}>{flower.name}</div>
                  {n > 0 && (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:8 }}>
                      <button onClick={e => { e.stopPropagation(); removeOne(flower); }}
                        style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid '+flower.accent, background:'white', color:flower.accent, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, lineHeight:1 }}>
                        −
                      </button>
                      <span style={{ fontSize:13, fontWeight:700, color:flower.accent, minWidth:14, textAlign:'center' }}>{n}</span>
                      <button onClick={e => { e.stopPropagation(); addFlower(flower); }}
                        style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid '+flower.accent, background:flower.accent, color:'white', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, lineHeight:1 }}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:'center', marginTop:44 }}>
            <button disabled={!canProceed()} onClick={() => setStep(1)}
              style={{
                padding:'16px 44px',
                background: !canProceed() ? '#b0c0a8' : 'linear-gradient(135deg,#3a6030,#5a8050)',
                color:'white', border:'none', borderRadius:50,
                fontSize:14, letterSpacing:3, cursor: !canProceed() ? 'not-allowed' : 'pointer',
                fontFamily:'sans-serif',
                boxShadow: !canProceed() ? 'none' : '0 8px 28px rgba(60,100,48,0.38)',
                transition:'all 0.3s ease',
              }}>
              CHOOSE GREENERY →
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Choose Foliage */}
      {step === 1 && (
        <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:860, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:'clamp(1.7rem,4vw,2.6rem)', color:'#2a3a20', fontWeight:300, margin:'0 0 10px' }}>Choose your foliage</h2>
            <p style={{ color:'#6a8060', fontSize:15 }}>Sets the base greenery for your bouquet.</p>
          </div>
          <div style={{ display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap' }}>
            {FOLIAGE.map(f => (
              <div key={f.id} className="foliage-tile" onClick={() => setFoliage(f)}
                style={{
                  background: foliage?.id === f.id ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.52)',
                  borderRadius:26, padding:'30px 22px 22px',
                  border:'2px solid ' + (foliage?.id === f.id ? '#3a6030' : 'rgba(255,255,255,0.75)'),
                  cursor:'pointer', textAlign:'center', width:215,
                  boxShadow: foliage?.id === f.id ? '0 12px 38px rgba(60,100,48,0.28)' : '0 4px 14px rgba(0,0,0,0.06)',
                }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
                  <img src={f.img} alt={f.name} width={155} height={155}
                    style={{ objectFit:'contain', filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' }}/>
                </div>
                <div style={{ fontSize:21, color:'#2a3a20', fontWeight:400, marginBottom:5 }}>{f.name}</div>
                <div style={{ fontSize:12, color:'#7a9060', fontFamily:'sans-serif' }}>{f.desc}</div>
                <div style={{ fontSize:11, color:'#6a8050', marginTop:8, fontFamily:'sans-serif', letterSpacing:1 }}>
                  {foliage?.id === f.id ? '✓ SELECTED' : 'Tap to choose'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:44, display:'flex', gap:14, justifyContent:'center' }}>
            <button onClick={() => setStep(0)}
              style={{ padding:'16px 28px', background:'rgba(255,255,255,0.65)', color:'#5a7050', border:'2px solid rgba(90,120,80,0.3)', borderRadius:50, fontSize:13, letterSpacing:2, cursor:'pointer', fontFamily:'sans-serif' }}>
              ← BACK
            </button>
            <button disabled={!canProceed()} onClick={() => setStep(2)}
              style={{
                padding:'16px 44px',
                background: !canProceed() ? '#b0c0a8' : 'linear-gradient(135deg,#3a6030,#5a8050)',
                color:'white', border:'none', borderRadius:50,
                fontSize:14, letterSpacing:3, cursor: !canProceed() ? 'not-allowed' : 'pointer',
                fontFamily:'sans-serif',
                boxShadow: !canProceed() ? 'none' : '0 8px 28px rgba(60,100,48,0.38)',
              }}>
              VIEW BOUQUET →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — View Bouquet */}
      {step === 2 && (
        <div style={{ animation:'fadeUp 0.5s ease-out', padding:'0 24px 80px', maxWidth:860, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:11, letterSpacing:5, color:'#7a9060', marginBottom:6, fontFamily:'sans-serif' }}>{foliage?.name?.toUpperCase()}</div>
            <h2 style={{ fontSize:'clamp(1.7rem,4vw,2.6rem)', color:'#2a3a20', fontWeight:300, margin:0 }}>Your Bouquet</h2>
          </div>
          {/* BG color picker */}
          <div style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:28, flexWrap:'wrap' }}>
            {BG_COLORS.map(b => (
              <div key={b.label} onClick={() => setBgColor(b.color)} style={{ textAlign:'center', cursor:'pointer' }}>
                <div style={{
                  width:42, height:42, borderRadius:'50%', background:b.color,
                  border:'3px solid ' + (bgColor === b.color ? '#3a6030' : 'rgba(255,255,255,0.65)'),
                  margin:'0 auto 5px',
                  boxShadow: bgColor === b.color ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                  transition:'all 0.2s ease',
                }}/>
                <div style={{ fontSize:10, color:'#5a7050', fontFamily:'sans-serif' }}>{b.label}</div>
              </div>
            ))}
          </div>
          <BouquetDisplay selectedFlowers={selectedFlowers} foliage={foliage} bgColor={bgColor} layout={layout}/>

          {/* Arrangement switcher */}
          <div style={{ marginTop:28, textAlign:'center' }}>
            <div style={{ fontSize:11, letterSpacing:4, color:'#7a9060', marginBottom:14, fontFamily:'sans-serif' }}>ARRANGEMENT</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {LAYOUT_LABELS.map(l => (
                <button key={l.id} onClick={() => setLayout(l.id)}
                  style={{
                    padding:'9px 20px',
                    background: layout === l.id ? 'linear-gradient(135deg,#3a6030,#5a8050)' : 'rgba(255,255,255,0.65)',
                    color: layout === l.id ? 'white' : '#5a7050',
                    border: '2px solid ' + (layout === l.id ? '#3a6030' : 'rgba(90,120,80,0.3)'),
                    borderRadius:50, fontSize:12, letterSpacing:2,
                    cursor:'pointer', fontFamily:'sans-serif',
                    transition:'all 0.2s ease',
                    transform: layout === l.id ? 'scale(1.06)' : 'scale(1)',
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:14, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
            <button onClick={() => setStep(1)}
              style={{ padding:'16px 28px', background:'rgba(255,255,255,0.65)', color:'#5a7050', border:'2px solid rgba(90,120,80,0.3)', borderRadius:50, fontSize:13, letterSpacing:2, cursor:'pointer', fontFamily:'sans-serif' }}>
              CHANGE GREENERY
            </button>
            <button onClick={() => { setSelectedFlowers([]); setStep(0); }}
              style={{ padding:'16px 28px', background:'rgba(255,255,255,0.65)', color:'#5a7050', border:'2px solid rgba(90,120,80,0.3)', borderRadius:50, fontSize:13, letterSpacing:2, cursor:'pointer', fontFamily:'sans-serif' }}>
              PICK AGAIN
            </button>
            <button onClick={proceed}
              style={{ padding:'16px 44px', background:'linear-gradient(135deg,#3a6030,#5a8050)', color:'white', border:'none', borderRadius:50, fontSize:14, letterSpacing:3, cursor:'pointer', fontFamily:'sans-serif', boxShadow:'0 8px 28px rgba(60,100,48,0.38)' }}>
              ADD A CARD →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
