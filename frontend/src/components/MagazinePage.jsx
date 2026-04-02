import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Data ─────────────────────────────────────────────── */
const TEMPLATES = [
  { id: 'anniversary', icon: '💍', label: 'Anniversary Edition',  bg: 'from-[#ffe8ed] to-[#ffd6e7]', accent: '#C9848A' },
  { id: 'birthday',    icon: '🎂', label: 'Birthday Bash',         bg: 'from-[#fff3cd] to-[#ffe8a0]', accent: '#f4a829' },
  { id: 'valentine',   icon: '💐', label: "Valentine's Special",   bg: 'from-[#ffe0e6] to-[#ffc2cc]', accent: '#e8637a' },
  { id: 'justbecause', icon: '🌿', label: 'Just Because',          bg: 'from-[#d4edda] to-[#b5cda3]', accent: '#5a9a6a' },
  { id: 'newbaby',     icon: '👶', label: 'New Baby Bloom',         bg: 'from-[#e3f2fd] to-[#bbdefb]', accent: '#5b9bd5' },
  { id: 'graduation',  icon: '🎓', label: 'Graduation Glory',      bg: 'from-[#f3e5f5] to-[#e1bee7]', accent: '#9c27b0' },
  { id: 'wedding',     icon: '💒', label: 'Wedding Bloom',         bg: 'from-[#fce4ec] to-[#f8bbd0]', accent: '#d81b60' },
];

const LAYOUTS = [
  { id: 'full',    label: 'Full Image',   icon: '⬛' },
  { id: '2col',    label: '2 Column',     icon: '◼◼' },
  { id: '3col',    label: '3 Column',     icon: '◾◾◾' },
  { id: 'collage', label: 'Collage',      icon: '🔲' },
  { id: 'quote',   label: 'Quote Page',   icon: '❝' },
];

const STICKERS = ['🌸','🌺','🌹','🌷','🌼','💐','🦋','✨','💫','🎀','💕','🌿','🍃','⭐','🌙','🎊','🎉','💝','🌈','🫧'];

const BG_COLORS = ['#fff8f0','#ffe8ed','#f3eaff','#e8f5e0','#e3f2fd','#fff9c4','#fce4ec','#f3e5f5'];
const BG_GRADIENTS = [
  'linear-gradient(135deg,#ffe8ed,#f3eaff)',
  'linear-gradient(135deg,#e8f5e0,#e3f2fd)',
  'linear-gradient(135deg,#fff9c4,#ffe8ed)',
  'linear-gradient(135deg,#fce4ec,#f3e5f5)',
];

const FONTS = [
  { id: 'playfair', label: 'Playfair Display', style: "'Playfair Display', serif" },
  { id: 'dancing',  label: 'Dancing Script',   style: "'Dancing Script', cursive" },
  { id: 'poppins',  label: 'Poppins',          style: "'Poppins', sans-serif" },
  { id: 'lora',     label: 'Lora',             style: "'Lora', serif" },
];

const PAPER_SIZES  = ['A4', 'A5', 'Square 20×20'];
const PAGE_COUNTS  = [8, 12, 16, 24];
const PRINT_QUALITY = [
  { id: 'standard', label: 'Standard',  price: 299,  desc: 'Matte 100gsm' },
  { id: 'premium',  label: 'Premium',   price: 499,  desc: 'Satin 150gsm' },
  { id: 'glossy',   label: 'Glossy',    price: 699,  desc: 'Gloss 200gsm + UV' },
];

const SAVED_DRAFTS = [
  { id: 1, title: 'Our Love Story 💕',  pages: 12, template: 'anniversary', updated: '2 days ago' },
  { id: 2, title: "Mom's 60th Birthday",'pages': 8,  template: 'birthday',    updated: '1 week ago' },
];

/* ── Sub-components ───────────────────────────────────── */
function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2.5 text-[.78rem] font-semibold transition-all border-b-2 whitespace-nowrap
        ${active ? 'border-rose text-roseD bg-blushL/40' : 'border-transparent text-textL hover:text-roseD hover:bg-blushL/20'}`}>
      {children}
    </button>
  );
}

function SectionTitle({ children }) {
  return <h3 className="font-playfair font-bold text-[.95rem] text-roseDD mb-3">{children}</h3>;
}

/* ── Main Component ───────────────────────────────────── */
export default function MagazinePage() {
  const navigate = useNavigate();

  // View state: 'home' | 'editor' | 'print' | 'saved'
  const [view,       setView]      = useState('home');
  const [template,   setTemplate]  = useState(null);

  // Editor state
  const [activeTool, setActiveTool] = useState('pages');
  const [pages,      setPages]      = useState([
    { id: 1, layout: 'full',  bg: BG_GRADIENTS[0], stickers: [], text: 'Cover Page ✨' },
    { id: 2, layout: '2col',  bg: BG_COLORS[1],    stickers: [], text: 'Our Story...'  },
    { id: 3, layout: 'quote', bg: BG_GRADIENTS[1], stickers: [], text: '"Forever & Always"' },
  ]);
  const [activePage, setActivePage]   = useState(0);
  const [selFont,    setSelFont]       = useState('playfair');
  const [pageCount,  setPageCount]     = useState(12);
  const [orientation,setOrientation]  = useState('portrait');
  const [magTitle,   setMagTitle]      = useState('Our Love Story 💕');
  const [dedication, setDedication]    = useState('For my sunshine...');

  // Print state
  const [paper,   setPaper]   = useState('A4');
  const [quality, setQuality] = useState('premium');
  const [addedCart, setAddedCart] = useState(false);

  const fileRef = useRef(null);

  /* helpers */
  const currentPage = pages[activePage];
  const addPage = () => {
    setPages(p => [...p, { id: Date.now(), layout: 'full', bg: BG_COLORS[0], stickers: [], text: 'New Page' }]);
    setActivePage(pages.length);
  };
  const removePage = (idx) => {
    if (pages.length <= 1) return;
    setPages(p => p.filter((_, i) => i !== idx));
    setActivePage(Math.max(0, activePage - 1));
  };
  const updatePage = (field, val) => {
    setPages(p => p.map((pg, i) => i === activePage ? { ...pg, [field]: val } : pg));
  };
  const addSticker = (s) => {
    updatePage('stickers', [...(currentPage.stickers || []), s]);
  };
  const printPrice = PRINT_QUALITY.find(q => q.id === quality)?.price || 499;
  const totalPrice = printPrice + (pages.length > 12 ? 100 : 0) + 99; // base + extra pages + delivery

  /* ═══════════════════════════════════════════════
     HOME VIEW — template picker
  ═══════════════════════════════════════════════ */
  if (view === 'home') return (
    <div className="page-enter min-h-[calc(100vh-62px)]"
      style={{ background: 'linear-gradient(145deg,#fff8f0,#f8f0ff,#f0fff8)' }}>

      {/* Hero */}
      <div className="text-center px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="text-[3.5rem] mb-3">📖</div>
        <h1 className="font-playfair font-bold text-[clamp(1.8rem,4vw,3rem)] text-roseDD mb-3">
          Create Your Bloom Magazine 🌸
        </h1>
        <p className="text-[1rem] text-textL font-light max-w-[560px] mx-auto mb-2">
          A Story Told in Petals
        </p>
        <p className="text-[.88rem] text-textM max-w-[520px] mx-auto mb-8">
          Design a beautiful personalised magazine for your loved ones — for any occasion!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setView('saved')}
            className="border-2 border-rose text-roseD px-6 py-2.5 rounded-full text-[.88rem] font-semibold hover:bg-rose hover:text-white transition-all">
            📂 My Magazines
          </button>
          <button onClick={() => { setTemplate(TEMPLATES[0]); setView('editor'); }}
            className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-[.88rem] font-semibold hover:-translate-y-0.5 hover:shadow-soft-m transition-all">
            ✨ Start from Scratch
          </button>
        </div>
      </div>

      {/* Template grid */}
      <div className="max-w-[1100px] mx-auto px-4 pb-12">
        <h2 className="font-playfair font-bold text-[1.5rem] text-roseDD text-center mb-6">
          Choose a Template
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.id}
              className="bg-white rounded-2xl overflow-hidden shadow-soft-s border-2 border-transparent hover:border-rose hover:shadow-soft-m transition-all cursor-pointer group"
              onClick={() => { setTemplate(t); setView('editor'); }}>

              {/* Preview card */}
              <div className={`bg-gradient-to-br ${t.bg} h-36 flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className="text-[3rem] mb-1 group-hover:scale-110 transition-transform">{t.icon}</div>
                {/* Decorative petals */}
                <span className="absolute top-2 right-3 text-lg opacity-30">🌸</span>
                <span className="absolute bottom-2 left-3 text-base opacity-25">✨</span>
                <span className="absolute top-3 left-4 text-sm opacity-20">🌿</span>
                {/* Mini page lines */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-0.5 bg-white/50 rounded-full" style={{ width: `${100 - i * 20}%` }} />
                  ))}
                </div>
              </div>

              <div className="p-3.5">
                <p className="font-playfair font-semibold text-[.88rem] text-text mb-2.5">{t.label}</p>
                <button
                  className="w-full py-2 rounded-full text-[.76rem] font-bold transition-all"
                  style={{ background: t.accent + '22', color: t.accent, border: `1.5px solid ${t.accent}44` }}
                  onClick={e => { e.stopPropagation(); setTemplate(t); setView('editor'); }}>
                  Use This Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     SAVED MAGAZINES VIEW
  ═══════════════════════════════════════════════ */
  if (view === 'saved') return (
    <div className="page-enter min-h-[calc(100vh-62px)]"
      style={{ background: 'linear-gradient(145deg,#fff8f0,#f8f0ff)' }}>
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-7 flex-wrap">
          <button onClick={() => setView('home')} className="text-rose hover:text-roseD text-xl">←</button>
          <h2 className="font-playfair font-bold text-[1.8rem] text-roseDD">📂 My Magazines</h2>
          <button onClick={() => setView('home')}
            className="ml-auto bg-gradient-to-br from-rose to-[#e09099] text-white px-5 py-2 rounded-full text-[.85rem] font-semibold hover:-translate-y-0.5 transition-all">
            + New Magazine
          </button>
        </div>

        {/* Drafts */}
        <SectionTitle>💾 Saved Drafts</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {SAVED_DRAFTS.map(d => {
            const tmpl = TEMPLATES.find(t => t.id === d.template) || TEMPLATES[0];
            return (
              <div key={d.id} className="bg-white rounded-2xl shadow-soft-s border border-blush/15 overflow-hidden flex">
                <div className={`w-20 flex-shrink-0 bg-gradient-to-br ${tmpl.bg} flex items-center justify-center text-3xl`}>
                  {tmpl.icon}
                </div>
                <div className="p-4 flex-1">
                  <p className="font-playfair font-semibold text-base mb-0.5">{d.title}</p>
                  <p className="text-[.74rem] text-textL mb-3">{d.pages} pages · Updated {d.updated}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setTemplate(tmpl); setView('editor'); }}
                      className="flex-1 bg-gradient-to-br from-rose to-[#e09099] text-white text-[.76rem] font-bold py-1.5 rounded-full">
                      Continue Editing
                    </button>
                    <button onClick={() => setView('print')}
                      className="flex-1 border-[1.5px] border-rose text-roseD text-[.76rem] font-medium py-1.5 rounded-full hover:bg-rose hover:text-white transition-all">
                      Reorder Print
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Share */}
        <div className="bg-gradient-to-br from-blushL to-lavL rounded-2xl p-5 text-center border border-blush/20">
          <div className="text-2xl mb-2">🔗</div>
          <p className="font-playfair font-semibold text-roseD mb-1">Share as Digital Link</p>
          <p className="text-[.78rem] text-textL mb-3">Send a beautiful digital copy to your loved one — no printing needed</p>
          <button className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2 rounded-full text-[.85rem] font-semibold hover:-translate-y-0.5 transition-all">
            📤 Generate Shareable Link
          </button>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     PRINT VIEW
  ═══════════════════════════════════════════════ */
  if (view === 'print') return (
    <div className="page-enter min-h-[calc(100vh-62px)]"
      style={{ background: 'linear-gradient(145deg,#fff8f0,#f8f0ff)' }}>
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => setView('editor')} className="text-rose hover:text-roseD text-xl">←</button>
          <h2 className="font-playfair font-bold text-[1.8rem] text-roseDD">🖨️ Ready to Print? 🌸</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">

            {/* Paper size */}
            <div className="bg-white rounded-2xl p-5 shadow-soft-s border border-blush/15">
              <SectionTitle>📄 Paper Size</SectionTitle>
              <div className="flex gap-2.5">
                {PAPER_SIZES.map(s => (
                  <button key={s} onClick={() => setPaper(s)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-[.82rem] font-semibold transition-all
                      ${paper === s ? 'border-rose bg-blushL text-roseD' : 'border-blush/30 text-textL hover:border-rose'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Print quality */}
            <div className="bg-white rounded-2xl p-5 shadow-soft-s border border-blush/15">
              <SectionTitle>🖨️ Print Quality</SectionTitle>
              <div className="space-y-2.5">
                {PRINT_QUALITY.map(q => (
                  <div key={q.id} onClick={() => setQuality(q.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all
                      ${quality === q.id ? 'border-rose bg-blushL/50' : 'border-blush/25 hover:border-rose'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                      ${quality === q.id ? 'border-rose bg-rose' : 'border-[#ddd]'}`}>
                      {quality === q.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[.88rem] font-semibold">{q.label}</p>
                      <p className="text-[.74rem] text-textL">{q.desc}</p>
                    </div>
                    <p className="font-playfair font-bold text-roseD">₹{q.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl p-5 shadow-soft-s border border-blush/15">
              <SectionTitle>📦 Print & Deliver</SectionTitle>
              <div className="bg-cream rounded-xl p-4 border border-blush/20">
                <p className="text-[.85rem] font-semibold mb-1">🚚 Delivered to your door</p>
                <p className="text-[.78rem] text-textL mb-3">Estimated 3–5 business days · Free delivery above ₹999</p>
                <div className="flex gap-2.5">
                  <button className="flex-1 bg-gradient-to-br from-rose to-[#e09099] text-white text-[.82rem] font-semibold py-2 rounded-full">
                    📦 Print & Deliver
                  </button>
                  <button className="flex-1 border-2 border-rose text-roseD text-[.82rem] font-medium py-2 rounded-full hover:bg-rose hover:text-white transition-all">
                    💾 Download PDF
                  </button>
                </div>
              </div>
              <div className="mt-3 bg-gradient-to-br from-blushL to-lavL rounded-xl p-3 border border-blush/20 text-center">
                <p className="text-[.8rem] font-semibold text-roseD mb-1">🔗 Share Digital Link</p>
                <p className="text-[.73rem] text-textL mb-2">Send a beautiful digital copy — no printing needed</p>
                <button className="bg-white border border-blush/40 text-roseD text-[.78rem] font-medium px-4 py-1.5 rounded-full hover:bg-blushL transition-all">
                  Generate Link ✨
                </button>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-soft-m border border-blush/15 sticky top-20">
              <h3 className="font-playfair font-bold text-[1rem] text-roseDD mb-4">🛍️ Order Summary</h3>
              <div className="text-[2rem] text-center mb-3">{template?.icon || '📖'}</div>
              <p className="font-playfair font-semibold text-center mb-4">{magTitle}</p>

              {[
                [`Print (${quality})`, `₹${printPrice}`],
                [`Pages (${pages.length})`, pages.length > 12 ? '₹100' : 'Included'],
                ['Paper', paper],
                ['Delivery', '₹99'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 text-[.84rem] border-b border-blush/12">
                  <span className="text-textM">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}

              <div className="flex justify-between py-3 font-extrabold text-[1.05rem] text-roseD mt-1">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={() => { setAddedCart(true); setTimeout(() => navigate('/cart'), 1200); }}
                className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-3 rounded-full text-[.9rem] hover:-translate-y-0.5 hover:shadow-soft-m transition-all mt-2">
                {addedCart ? '✓ Added to Cart!' : 'Add to Cart 🌸'}
              </button>
              <p className="text-center text-[.72rem] text-textL mt-2">🔒 Secure · Satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     EDITOR VIEW
  ═══════════════════════════════════════════════ */
  const TOOLS = [
    { id: 'pages',   icon: '📄', label: 'Pages'   },
    { id: 'layout',  icon: '🖼️', label: 'Layout'  },
    { id: 'sticker', icon: '🌸', label: 'Stickers'},
    { id: 'bg',      icon: '🎨', label: 'Bg'      },
    { id: 'text',    icon: '✍️', label: 'Text'    },
    { id: 'photo',   icon: '📷', label: 'Photos'  },
    { id: 'font',    icon: '🔤', label: 'Fonts'   },
  ];

  return (
    <div className="page-enter" style={{ background: '#f8f0ff' }}>

      {/* Editor top bar */}
      <div className="sticky top-[62px] z-40 bg-white border-b border-blush/25 shadow-soft-s px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <button onClick={() => setView('home')} className="text-rose hover:text-roseD text-lg flex-shrink-0">←</button>
        <input
          value={magTitle}
          onChange={e => setMagTitle(e.target.value)}
          className="font-playfair font-bold text-[1rem] text-roseDD bg-transparent border-none outline-none flex-1 min-w-[150px]"
          placeholder="Magazine title..."
        />
        <div className="flex gap-2 ml-auto">
          <button onClick={() => setView('saved')}
            className="border-[1.5px] border-blush/40 text-textM text-[.78rem] font-medium px-3.5 py-1.5 rounded-full hover:bg-blushL transition-all">
            💾 Save
          </button>
          <button onClick={() => setView('print')}
            className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.82rem] font-semibold px-4 py-1.5 rounded-full hover:-translate-y-0.5 transition-all">
            🖨️ Print / Share
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)] overflow-hidden">

        {/* ── LEFT: Tools sidebar ── */}
        <div className="w-56 flex-shrink-0 bg-white border-r border-blush/20 flex flex-col overflow-hidden shadow-soft-s">
          {/* Tool icons */}
          <div className="flex flex-wrap gap-0 border-b border-blush/20">
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => setActiveTool(t.id)}
                className={`flex flex-col items-center gap-0.5 p-2.5 text-[.65rem] font-semibold transition-all flex-1 min-w-[44px]
                  ${activeTool === t.id ? 'bg-blushL text-roseD border-b-2 border-rose' : 'text-textL hover:bg-blushL/40'}`}>
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tool content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {activeTool === 'pages' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Pages ({pages.length})</p>
                {pages.map((pg, idx) => (
                  <div key={pg.id} onClick={() => setActivePage(idx)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border
                      ${activePage === idx ? 'border-rose bg-blushL/50' : 'border-blush/20 hover:bg-blushL/20'}`}>
                    <div className="w-8 h-10 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#C9848A,#e09099)' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[.72rem] font-semibold truncate">{pg.text || `Page ${idx+1}`}</p>
                      <p className="text-[.62rem] text-textL">{pg.layout}</p>
                    </div>
                    {pages.length > 1 && (
                      <button onClick={e => { e.stopPropagation(); removePage(idx); }}
                        className="text-textL hover:text-roseD text-xs">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addPage}
                  className="w-full py-2 rounded-lg border-2 border-dashed border-blush/40 text-[.75rem] text-textL hover:border-rose hover:text-roseD transition-all">
                  + Add Page
                </button>
              </>
            )}

            {activeTool === 'layout' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Page Layout</p>
                {LAYOUTS.map(l => (
                  <button key={l.id} onClick={() => updatePage('layout', l.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border-2 text-[.76rem] transition-all
                      ${currentPage?.layout === l.id ? 'border-rose bg-blushL text-roseD font-bold' : 'border-blush/25 text-textL hover:border-rose'}`}>
                    <span className="text-base">{l.icon}</span>{l.label}
                  </button>
                ))}
              </>
            )}

            {activeTool === 'sticker' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Stickers</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {STICKERS.map(s => (
                    <button key={s} onClick={() => addSticker(s)}
                      className="aspect-square rounded-lg bg-blushL/40 hover:bg-blushL text-lg flex items-center justify-center transition-all hover:scale-110">
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeTool === 'bg' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Solid Colors</p>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {BG_COLORS.map(c => (
                    <button key={c} onClick={() => updatePage('bg', c)}
                      className={`aspect-square rounded-lg border-2 transition-all
                        ${currentPage?.bg === c ? 'border-roseD scale-110' : 'border-transparent hover:border-rose hover:scale-105'}`}
                      style={{ background: c }} />
                  ))}
                </div>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-1.5">Gradients</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BG_GRADIENTS.map((g, i) => (
                    <button key={i} onClick={() => updatePage('bg', g)}
                      className={`h-10 rounded-lg border-2 transition-all
                        ${currentPage?.bg === g ? 'border-roseD scale-105' : 'border-transparent hover:border-rose'}`}
                      style={{ background: g }} />
                  ))}
                </div>
              </>
            )}

            {activeTool === 'text' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Edit Text</p>
                <textarea
                  className="w-full p-2.5 rounded-lg border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.8rem] resize-none transition-all"
                  style={{ minHeight: 100, background: '#fffaf8' }}
                  value={currentPage?.text || ''}
                  onChange={e => updatePage('text', e.target.value)}
                  placeholder="Type your text here..."
                />
                {['Add Heading','Add Caption','Add Quote','Add Poem'].map(t => (
                  <button key={t} onClick={() => updatePage('text', (currentPage?.text || '') + '\n' + t)}
                    className="w-full py-2 rounded-lg border border-blush/30 text-[.74rem] text-textL hover:bg-blushL hover:text-roseD transition-all text-left px-3">
                    + {t}
                  </button>
                ))}
              </>
            )}

            {activeTool === 'photo' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Upload Photos</p>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                  className="w-full py-8 rounded-xl border-2 border-dashed border-blush/40 hover:border-rose text-center transition-all hover:bg-blushL/20 group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📷</div>
                  <p className="text-[.75rem] text-textL">Click to upload photo</p>
                  <p className="text-[.68rem] text-textL/70">or drag & drop</p>
                </button>
              </>
            )}

            {activeTool === 'font' && (
              <>
                <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider">Choose Font</p>
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => setSelFont(f.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left
                      ${selFont === f.id ? 'border-rose bg-blushL' : 'border-blush/25 hover:border-rose'}`}
                    style={{ fontFamily: f.style }}>
                    <p className="text-[.88rem] mb-0.5">{f.label}</p>
                    <p className="text-[.72rem] text-textL" style={{ fontFamily: f.style }}>The quick brown fox...</p>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── CENTER: Magazine preview ── */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-6 gap-4"
          style={{ background: 'linear-gradient(145deg,#f3eaff,#fff8f0)' }}>

          {/* Page */}
          <div className="relative rounded-2xl overflow-hidden shadow-soft-l border border-blush/20 transition-all"
            style={{
              width: orientation === 'portrait' ? 320 : 420,
              height: orientation === 'portrait' ? 420 : 320,
              background: currentPage?.bg || BG_GRADIENTS[0],
              fontFamily: FONTS.find(f => f.id === selFont)?.style,
            }}>

            {/* Stickers */}
            {currentPage?.stickers?.map((s, i) => (
              <span key={i} className="absolute text-2xl select-none cursor-move"
                style={{ top: `${15 + (i * 17) % 70}%`, left: `${10 + (i * 23) % 80}%` }}>
                {s}
              </span>
            ))}

            {/* Layout preview */}
            {currentPage?.layout === 'quote' ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <div>
                  <div className="text-4xl mb-3 opacity-30">"</div>
                  <p className="text-roseD font-semibold text-[1rem] leading-relaxed italic">
                    {currentPage?.text || 'Your quote here...'}
                  </p>
                </div>
              </div>
            ) : currentPage?.layout === '2col' ? (
              <div className="absolute inset-4 grid grid-cols-2 gap-2">
                {[0,1].map(i => (
                  <div key={i} className="rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-[.7rem] text-textL p-2 text-center">
                    {i === 0 ? (currentPage?.text || 'Photo / text') : '📷 Photo'}
                  </div>
                ))}
              </div>
            ) : currentPage?.layout === '3col' ? (
              <div className="absolute inset-4 grid grid-cols-3 gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="rounded-lg bg-white/40 border border-white/60 flex items-center justify-center text-[.62rem] text-textL p-1 text-center">
                    📷
                  </div>
                ))}
              </div>
            ) : currentPage?.layout === 'collage' ? (
              <div className="absolute inset-4 grid grid-cols-3 grid-rows-2 gap-1.5">
                <div className="col-span-2 row-span-2 rounded-xl bg-white/40 border border-white/60 flex items-center justify-center text-textL text-[.72rem]">Main 📷</div>
                <div className="rounded-lg bg-white/40 border border-white/60 flex items-center justify-center text-textL text-xs">📷</div>
                <div className="rounded-lg bg-white/40 border border-white/60 flex items-center justify-center text-textL text-xs">📷</div>
              </div>
            ) : (
              /* full layout */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="text-4xl mb-3">{template?.icon || '🌸'}</div>
                <p className="font-bold text-roseDD text-lg mb-1">{currentPage?.text || magTitle}</p>
                <p className="text-[.76rem] text-roseD/70 italic">{dedication}</p>
              </div>
            )}

            {/* Page number */}
            <div className="absolute bottom-2 right-3 text-[.62rem] text-roseD/50 font-semibold">
              {activePage + 1} / {pages.length}
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActivePage(p => Math.max(0, p-1))}
              disabled={activePage === 0}
              className="w-8 h-8 rounded-full bg-white shadow-soft-s flex items-center justify-center text-rose disabled:opacity-30 hover:bg-blushL transition-all">
              ‹
            </button>
            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <button key={i} onClick={() => setActivePage(i)}
                  className={`rounded-full transition-all ${activePage === i ? 'w-5 h-2.5 bg-rose' : 'w-2.5 h-2.5 bg-blush/40 hover:bg-rose/50'}`} />
              ))}
            </div>
            <button onClick={() => setActivePage(p => Math.min(pages.length-1, p+1))}
              disabled={activePage === pages.length - 1}
              className="w-8 h-8 rounded-full bg-white shadow-soft-s flex items-center justify-center text-rose disabled:opacity-30 hover:bg-blushL transition-all">
              ›
            </button>
          </div>

          <p className="text-[.72rem] text-textL">Click stickers, change layout & background from the left panel</p>
        </div>

        {/* ── RIGHT: Page settings ── */}
        <div className="w-52 flex-shrink-0 bg-white border-l border-blush/20 overflow-y-auto p-4 space-y-5 shadow-soft-s">
          <div>
            <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-2">Orientation</p>
            <div className="flex gap-1.5">
              {['portrait','landscape'].map(o => (
                <button key={o} onClick={() => setOrientation(o)}
                  className={`flex-1 py-1.5 rounded-lg border-2 text-[.7rem] font-semibold capitalize transition-all
                    ${orientation === o ? 'border-rose bg-blushL text-roseD' : 'border-blush/25 text-textL hover:border-rose'}`}>
                  {o === 'portrait' ? '📄' : '🖼️'} {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-2">Pages</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PAGE_COUNTS.map(n => (
                <button key={n} onClick={() => setPageCount(n)}
                  className={`py-1.5 rounded-lg border-2 text-[.72rem] font-semibold transition-all
                    ${pageCount === n ? 'border-rose bg-blushL text-roseD' : 'border-blush/25 text-textL hover:border-rose'}`}>
                  {n} pg
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-2">Page Border</p>
            {['None','Soft Shadow','Floral Frame'].map(b => (
              <button key={b}
                className="w-full py-2 mb-1.5 rounded-lg border border-blush/25 text-[.72rem] text-textL hover:bg-blushL hover:text-roseD transition-all text-left px-3">
                {b}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-2">Dedication</p>
            <input
              className="w-full px-3 py-2 rounded-lg border-[1.5px] border-blush/35 focus:border-rose outline-none text-[.76rem] transition-all"
              value={dedication}
              onChange={e => setDedication(e.target.value)}
              placeholder="For my sunshine..."
              style={{ background: '#fffaf8' }}
            />
          </div>

          <div>
            <p className="text-[.72rem] font-bold text-textL uppercase tracking-wider mb-2">Page Notes</p>
            <textarea
              className="w-full px-3 py-2 rounded-lg border-[1.5px] border-blush/35 focus:border-rose outline-none text-[.72rem] resize-none transition-all"
              style={{ minHeight: 60, background: '#fffaf8' }}
              placeholder="Private caption for this page..."
            />
          </div>

          <button onClick={() => setView('print')}
            className="w-full bg-gradient-to-br from-rose to-[#e09099] text-white text-[.8rem] font-semibold py-2.5 rounded-full hover:-translate-y-0.5 transition-all">
            🖨️ Go to Print
          </button>
        </div>
      </div>
    </div>
  );
}
