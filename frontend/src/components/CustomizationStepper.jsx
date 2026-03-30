import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FLOWERS, COLORS, WRAPS, RIBBONS, CARD_COLORS } from '../data/mockData';
import MessageCardPreview from './MessageCardPreview';

const STEPS = ['Flowers', 'Colors', 'Size', 'Wrapping', 'Ribbon', 'Message'];
const SIZE_PRICE = { S: 0, M: 300, L: 600 };

export default function CustomizationStepper() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState(0);
  const [flowers, setFlowers] = useState([]);
  const [color,   setColor]   = useState(null);
  const [size,    setSize]    = useState('M');
  const [wrap,    setWrap]    = useState(null);
  const [ribbon,  setRibbon]  = useState(null);
  const [msg,     setMsg]     = useState('');
  const [font,    setFont]    = useState('Elegant');
  const [cardCol, setCardCol] = useState('cream');

  const toggle = (list, setList, val) =>
    setList(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const total = 800 + flowers.length * 150 + SIZE_PRICE[size];

  return (
    <div>
      {/* Step progress */}
      <div className="flex items-center overflow-x-auto stepper-wrap mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className="flex flex-col items-center min-w-[72px] cursor-pointer" onClick={() => setStep(i)}>
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${i < step  ? 'bg-sage text-white' :
                  i === step ? 'bg-gradient-to-br from-rose to-[#e09099] text-white shadow-[0_0_0_5px_rgba(201,132,138,.18)]' :
                               'bg-[#f0e8f0] text-textL'}
              `}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-[.64rem] text-textL mt-1 text-center whitespace-nowrap">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 min-w-[18px] ${i < step ? 'bg-sage' : 'bg-[#e8d0e0]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[210px]">

        {step === 0 && (
          <>
            <h3 className="font-playfair text-base mb-4">🌸 Pick your flowers</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
              {FLOWERS.map(f => (
                <div key={f}
                  onClick={() => toggle(flowers, setFlowers, f)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-sm border-[1.5px]
                    cursor-pointer text-[.83rem] transition-all
                    ${flowers.includes(f)
                      ? 'bg-blushL border-rose text-roseD font-semibold'
                      : 'bg-white border-blush/40 hover:border-rose'}
                  `}
                >
                  {flowers.includes(f) && '✓ '}{f}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="font-playfair text-base mb-4">🎨 Choose a colour palette</h3>
            <div className="flex gap-3 flex-wrap items-center">
              {COLORS.map(c => (
                <div key={c} onClick={() => setColor(c)}
                  className={`
                    w-9 h-9 rounded-full cursor-pointer border-[3px] transition-all
                    ${color === c ? 'border-roseDD scale-125 shadow-[0_0_0_2px_white,0_0_0_4px_var(--rose)]' : 'border-transparent hover:scale-110'}
                  `}
                  style={{ background: c }}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="font-playfair text-base mb-4">📏 Select size</h3>
            <div className="flex gap-2.5">
              {[['S','Small','₹+0'],['M','Medium','₹+300'],['L','Large','₹+600']].map(([k,l,p]) => (
                <button key={k} onClick={() => setSize(k)}
                  className={`
                    px-6 py-3 rounded-sm border-[1.5px] text-[.88rem] font-medium transition-all
                    ${size === k ? 'bg-lavL border-[#c4a0e8] text-text font-bold' : 'bg-white border-blush/40 text-textL hover:border-rose'}
                  `}
                >
                  {l}<br /><small className="text-[.72rem]">{p}</small>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="font-playfair text-base mb-4">📦 Choose wrapping</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {WRAPS.map(w => (
                <button key={w} onClick={() => setWrap(w)}
                  className={`
                    py-3 px-4 rounded-sm border-[1.5px] text-[.83rem] text-center transition-all
                    ${wrap === w
                      ? 'bg-gradient-to-br from-blushL to-lavL border-rose text-roseD font-bold'
                      : 'bg-white border-blush/40 text-textL hover:border-rose'}
                  `}
                >
                  {w}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="font-playfair text-base mb-4">🎀 Pick ribbon & extras</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {RIBBONS.map(r => (
                <button key={r} onClick={() => setRibbon(r)}
                  className={`
                    py-3 px-4 rounded-sm border-[1.5px] text-[.83rem] text-center transition-all
                    ${ribbon === r
                      ? 'bg-gradient-to-br from-blushL to-lavL border-rose text-roseD font-bold'
                      : 'bg-white border-blush/40 text-textL hover:border-rose'}
                  `}
                >
                  {r}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h3 className="font-playfair text-base mb-4">💌 Personalise message card</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Your Message</label>
                <textarea
                  className="w-full p-3 rounded-sm border-[1.5px] border-blush/40 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-[.88rem] resize-none min-h-[80px] transition-all"
                  placeholder="Write your heartfelt message here 💌"
                  value={msg} onChange={e => setMsg(e.target.value)}
                />
                <label className="block text-[.78rem] font-semibold text-textM mb-1.5 mt-3 uppercase tracking-wide">Font Style</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {['Cursive','Print','Elegant'].map(f => (
                    <button key={f} onClick={() => setFont(f)}
                      className={`px-3 py-1 rounded-full border-[1.5px] text-[.8rem] transition-all ${font === f ? 'bg-blushL border-rose text-roseD font-bold' : 'bg-white border-blush/40 text-textL'}`}
                      style={{ fontFamily: f === 'Cursive' ? "'Dancing Script',cursive" : f === 'Elegant' ? "'Playfair Display',serif" : 'inherit' }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Card Color</label>
                <div className="flex gap-2.5">
                  {Object.entries(CARD_COLORS).map(([k, v]) => (
                    <div key={k} onClick={() => setCardCol(k)}
                      className="w-7 h-7 rounded-full cursor-pointer transition-all"
                      style={{
                        background: v,
                        border: `2.5px solid ${cardCol === k ? 'var(--rose-d)' : 'rgba(255,182,193,.4)'}`,
                        transform: cardCol === k ? 'scale(1.22)' : 'scale(1)',
                        boxShadow: v === '#FFFFFF' ? '0 0 0 1px #ddd' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Live Preview</label>
                <MessageCardPreview msg={msg} font={font} cardColor={cardCol} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Price bar */}
      <div className="
        flex justify-between items-center mt-6
        bg-gradient-to-br from-blushL to-lavL
        rounded-md px-5 py-4
        border border-blush/30
      ">
        <div>
          <p className="text-[.87rem] text-textM">Estimated price</p>
          <p className="text-[.74rem] text-textL mt-0.5">{flowers.length} flowers · {size} · {wrap || 'no wrap'}</p>
        </div>
        <p className="font-playfair font-extrabold text-[1.5rem] text-roseD">₹{total.toLocaleString()}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-5">
        {step > 0 && (
          <button onClick={() => setStep(p => p - 1)} className="
            border-[1.5px] border-rose text-roseD text-[.85rem] font-medium
            px-5 py-2 rounded-full hover:bg-rose hover:text-white transition-all
          ">
            ← Back
          </button>
        )}
        <button className="
          ml-auto bg-blushL/60 hover:bg-blushL border-none
          text-roseD text-[.82rem] font-medium
          px-4 py-2 rounded-full transition-colors
        ">
          💾 Save Design
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(p => p + 1)} className="
            bg-gradient-to-br from-rose to-[#e09099]
            text-white text-[.85rem] font-semibold
            px-5 py-2 rounded-full
            hover:-translate-y-0.5 hover:shadow-soft-m transition-all
          ">
            Next →
          </button>
        ) : (
          <button onClick={() => navigate('/schedule')} className="
            bg-gradient-to-br from-rose to-[#e09099]
            text-white text-[.85rem] font-semibold
            px-5 py-2 rounded-full
            hover:-translate-y-0.5 hover:shadow-soft-m transition-all
          ">
            Schedule Delivery 💐
          </button>
        )}
      </div>
    </div>
  );
}
