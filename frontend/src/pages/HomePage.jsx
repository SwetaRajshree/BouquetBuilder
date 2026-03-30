import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FallingPetals   from '../components/FallingPetals';
import FlashSaleStrip  from '../components/FlashSaleStrip';
import ShopCard        from '../components/ShopCard';
import { SALE_BOUQUETS } from '../data/mockData';

const OCCASIONS = [
  { icon: '💝', label: "Valentine's", slug: 'valentines',  bg: 'from-[#ffe0e6] to-[#ffd0d8]' },
  { icon: '🎂', label: 'Birthday',    slug: 'birthday',    bg: 'from-[#fff0d0] to-[#ffe4b0]' },
  { icon: '💍', label: 'Anniversary', slug: 'anniversary', bg: 'from-[#e8d5ff] to-[#d8c0ff]' },
  { icon: '🌸', label: 'Just Because',slug: 'justbecause', bg: 'from-[#d4f0d4] to-[#c0e8c0]' },
];

const HOW_STEPS = [
  { n: '1', icon: '🗺️', title: 'Find a Shop',  desc: 'Browse florists near you and discover their specialties, ratings & opening hours.', route: '/shops' },
  { n: '2', icon: '✏️', title: 'Customize',    desc: 'Build your dream bouquet step-by-step — flowers, colors, wrapping, message card & more.', route: '/flowers' },
  { n: '3', icon: '💐', title: 'Deliver',      desc: 'Schedule same-day or future delivery right to their doorstep, with live tracking.', route: '/calendar' },
];

const TESTIMONIALS = [
  { name: 'Priya S.',    emoji: '🌸', text: 'The bouquet was absolutely stunning! My mom cried happy tears. Will order again!', flowers: '🌹🌷' },
  { name: 'Rahul M.',   emoji: '💐', text: 'Ordered for my anniversary — Flora AI helped me pick the perfect arrangement. 10/10!', flowers: '🌺🌸' },
  { name: 'Ananya K.',  emoji: '🌺', text: 'Same-day delivery was a lifesaver. Fresh flowers, beautiful packaging. Loved it!', flowers: '🌼💐' },
];

const MARQUEE_ITEMS = ['🌹 Red Roses', '🌷 Tulips', '🌸 Cherry Blossoms', '🌻 Sunflowers', '💐 Mixed Bouquets', '🪷 Lotus', '🌼 Daisies', '🌺 Hibiscus', '🍃 Eucalyptus', '🌿 Greenery'];

// Decorative SVG floral elements
function FloralCorner({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="8"  fill="#FFB6C1" opacity=".5"/>
      <circle cx="40" cy="10" r="5"  fill="#E6CFFF" opacity=".6"/>
      <circle cx="10" cy="45" r="6"  fill="#B5CDA3" opacity=".45"/>
      <circle cx="55" cy="25" r="4"  fill="#FFB6C1" opacity=".4"/>
      <ellipse cx="30" cy="55" rx="10" ry="6" fill="#E6CFFF" opacity=".35" transform="rotate(-30 30 55)"/>
      <line x1="20" y1="20" x2="55" y2="55" stroke="#FFB6C1" strokeWidth="1.5" opacity=".3"/>
      <line x1="10" y1="45" x2="40" y2="10" stroke="#B5CDA3" strokeWidth="1"   opacity=".3"/>
      <circle cx="70" cy="15" r="3"  fill="#FFB6C1" opacity=".35"/>
      <circle cx="15" cy="70" r="3"  fill="#E6CFFF" opacity=".35"/>
    </svg>
  );
}

function LeafAccent({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 35 Q20 5 40 20 Q60 35 75 10" stroke="#B5CDA3" strokeWidth="2" fill="none" opacity=".5"/>
      <path d="M15 30 Q25 15 35 22" stroke="#B5CDA3" strokeWidth="1.5" fill="none" opacity=".4"/>
      <circle cx="40" cy="20" r="3" fill="#B5CDA3" opacity=".4"/>
      <circle cx="20" cy="18" r="2" fill="#FFB6C1" opacity=".5"/>
      <circle cx="60" cy="22" r="2" fill="#E6CFFF" opacity=".5"/>
    </svg>
  );
}

function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 select-none">
      <LeafAccent className="w-20 h-10 opacity-70" />
      <span className="text-[1.1rem] tracking-[.5rem] text-blush">✿ 🌸 ✿</span>
      <LeafAccent className="w-20 h-10 opacity-70 scale-x-[-1]" />
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/shops`)
      .then((r) => r.json())
      .then((data) => setShops(data))
      .catch(console.error);
  }, []);

  return (
    <div className="page-enter overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden flex items-center justify-center text-center min-h-[560px] px-4 py-24 bg-gradient-to-br from-[#ffe8ed] via-[#f0e0ff] to-[#daefd4]">
        <FallingPetals count={18} />

        {/* Decorative corner florals */}
        <FloralCorner className="absolute top-0 left-0 w-36 h-36 pointer-events-none" />
        <FloralCorner className="absolute top-0 right-0 w-36 h-36 pointer-events-none scale-x-[-1]" />
        <FloralCorner className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none scale-y-[-1]" />
        <FloralCorner className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none rotate-180" />

        {/* Floating emoji blobs */}
        <span className="absolute top-[18%] left-[8%]  text-3xl animate-[petalFloat_6s_ease-in-out_infinite] pointer-events-none select-none opacity-60">🌿</span>
        <span className="absolute top-[30%] right-[7%] text-2xl animate-[petalFloat_8s_ease-in-out_1s_infinite] pointer-events-none select-none opacity-55">🌺</span>
        <span className="absolute bottom-[22%] left-[12%] text-2xl animate-[petalFloat_7s_ease-in-out_2s_infinite] pointer-events-none select-none opacity-50">🌷</span>
        <span className="absolute bottom-[18%] right-[10%] text-3xl animate-[petalFloat_9s_ease-in-out_.5s_infinite] pointer-events-none select-none opacity-55">🍃</span>
        <span className="absolute top-[55%] left-[4%]  text-xl animate-[petalFloat_5s_ease-in-out_3s_infinite] pointer-events-none select-none opacity-45">✿</span>
        <span className="absolute top-[12%] right-[20%] text-xl animate-[petalFloat_7s_ease-in-out_1.5s_infinite] pointer-events-none select-none opacity-45">🌼</span>

        <div className="relative z-10 max-w-[700px]">
          <div className="inline-block bg-white/60 backdrop-blur-sm text-roseD text-[.78rem] font-semibold px-4 py-1.5 rounded-full border border-blush/40 mb-5 tracking-wide">
            🌸 Fresh Flowers · Same Day Delivery · 100% Natural
          </div>
          <h1 className="font-playfair font-extrabold text-roseDD leading-[1.15] text-[clamp(2.3rem,5.5vw,4rem)] mb-4 [text-shadow:0_2px_20px_rgba(168,104,112,.15)]">
            Send Love,<br />One Petal at a Time 🌸
          </h1>
          <p className="text-[1.05rem] text-textM mb-8 font-light leading-relaxed">
            Discover local florists, build custom bouquets &<br />deliver happiness to someone special.
          </p>
          <div className="flex rounded-[99px] overflow-hidden max-w-[480px] mx-auto shadow-[0_8px_36px_rgba(201,132,138,.22)] bg-white">
            <span className="px-4 text-xl flex items-center">📍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/shops${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)}
              className="flex-1 border-none outline-none py-4 text-[.95rem] text-text bg-transparent"
              placeholder="Find shops near you..."
            />
            <button
              onClick={() => navigate(`/shops${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)}
              className="bg-gradient-to-br from-rose to-[#e09099] px-6 text-xl text-white hover:brightness-105 transition-all"
            >
              🔍
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 mt-8 flex-wrap">
            {[['🌹','500+ Bouquets'],['🏪','50+ Shops'],['⭐','4.9 Rating']].map(([icon, label]) => (
              <div key={label} className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-[.8rem] font-medium text-roseD border border-blush/30">
                {icon} {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Sale Strip ── */}
      <FlashSaleStrip />

      {/* ── Seasonal Marquee ── */}
      <div className="bg-gradient-to-r from-[#ffe8ed] via-white to-[#ffe8ed] border-y border-blush/20 py-3 overflow-hidden">
        <div className="marquee-track flex gap-10 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-[.82rem] font-medium text-roseD tracking-wide flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Featured Shops ── */}
      <section className="bg-white py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD">🌹 Featured Shops</h2>
              <p className="text-[.9rem] text-textL font-light mt-1">Handpicked florists loved by our community</p>
            </div>
            <button onClick={() => navigate('/shops')} className="border-[1.5px] border-rose text-roseD text-[.85rem] font-medium px-5 py-2 rounded-full hover:bg-rose hover:text-white transition-all">
              View All →
            </button>
          </div>
          <div className="scroll-row">
            {shops.map((s, i) => <ShopCard key={s._id} shop={{ ...s, id: s._id, img: ['🌺','🌸','🌹','🌼','💐'][i%5], color: '#FFB6C1', specialty: s.area || s.city || 'Florist', rating: '4.8', distance: s.area || '', open: true }} />)}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* ── Occasions ── */}
      <section className="py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">💌 Shop by Occasion</h2>
          <p className="text-[.9rem] text-textL font-light mb-7">The perfect bouquet for every moment</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {OCCASIONS.map(o => (
              <div key={o.label} onClick={() => navigate(`/occasion/${o.slug}`)}
                className={`bg-gradient-to-br ${o.bg} rounded-md p-7 text-center shadow-soft-s border-2 border-transparent cursor-pointer transition-all hover:-translate-y-1.5 hover:border-blush hover:shadow-soft-m group`}
              >
                <div className="text-[2.6rem] mb-2.5 group-hover:scale-110 transition-transform duration-200">{o.icon}</div>
                <h4 className="font-playfair font-semibold text-[.94rem] text-roseDD">{o.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* ── How It Works ── */}
      <section className="bg-white py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">🌷 How It Works</h2>
          <p className="text-[.9rem] text-textL font-light mb-7">Three effortless steps to a perfect bouquet</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-[2px] bg-gradient-to-r from-blush via-lavender to-blush opacity-50 z-0" />
            {HOW_STEPS.map(step => (
              <div key={step.n} onClick={() => navigate(step.route)}
                className="relative bg-white rounded-md p-8 text-center shadow-soft-s border border-blush/10 z-10 cursor-pointer hover:-translate-y-1.5 hover:shadow-soft-m hover:border-blush/40 transition-all group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center font-playfair font-extrabold text-[1.3rem] text-roseD shadow-soft-s">
                  {step.n}
                </div>
                <div className="text-[1.8rem] mb-3">{step.icon}</div>
                <h3 className="font-playfair font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-[.83rem] text-textL leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flora AI Promo ── */}
      <section className="py-2 bg-gradient-to-br from-[#f3eaff] via-[#ffe8ed] to-[#f3eaff]">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#2d1b3d] to-[#4a2060] p-10 md:p-14 text-center shadow-soft-l">
            {/* Decorative petals inside card */}
            <span className="absolute top-4 left-6 text-3xl opacity-20 select-none">🌸</span>
            <span className="absolute top-8 right-8 text-2xl opacity-20 select-none">🌺</span>
            <span className="absolute bottom-6 left-10 text-2xl opacity-20 select-none">🌷</span>
            <span className="absolute bottom-4 right-6 text-3xl opacity-20 select-none">💐</span>
            <span className="absolute top-1/2 left-4 text-xl opacity-15 select-none">✿</span>
            <span className="absolute top-1/2 right-4 text-xl opacity-15 select-none">✿</span>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,182,193,.4)] animate-[floraGlow_3s_ease-in-out_infinite]">
                🌸
              </div>
              <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.2rem)] text-white mb-3">
                Meet Flora, Your AI Bouquet Assistant
              </h2>
              <p className="text-[.95rem] text-[#e8d5ff] mb-7 max-w-[500px] mx-auto leading-relaxed font-light">
                Not sure what to pick? Flora helps you find the perfect bouquet in seconds — just describe the occasion and she'll do the rest 💕
              </p>
              <button
                onClick={() => navigate('/ai')}
                className="bg-gradient-to-br from-blush to-lavender text-roseDD font-bold px-8 py-3.5 rounded-full text-[.9rem] hover:brightness-105 hover:-translate-y-0.5 transition-all shadow-soft-m"
              >
                Chat with Flora 🌸
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bouquet Builder Promo ── */}
      <section className="py-2 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#fff0f5] via-[#fdf4ff] to-[#f0fdf4] border border-blush/20 p-10 md:p-14 shadow-soft-m">
            <span className="absolute top-4 left-6 text-4xl opacity-20 select-none animate-[petalFloat_6s_ease-in-out_infinite]">🌸</span>
            <span className="absolute top-6 right-8 text-3xl opacity-20 select-none animate-[petalFloat_8s_ease-in-out_1s_infinite]">🌺</span>
            <span className="absolute bottom-4 left-10 text-3xl opacity-20 select-none animate-[petalFloat_7s_ease-in-out_2s_infinite]">🌷</span>
            <span className="absolute bottom-6 right-6 text-4xl opacity-20 select-none animate-[petalFloat_9s_ease-in-out_.5s_infinite]">💐</span>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 flex gap-3">
                {['🌹','🌻','🌷','🌸'].map((f,i) => (
                  <div key={i} className="text-[2.8rem] animate-[petalFloat_5s_ease-in-out_infinite]" style={{ animationDelay: `${i*0.4}s` }}>{f}</div>
                ))}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2.1rem)] text-roseDD mb-3">
                  🎨 Build & Send a Digital Bouquet
                </h2>
                <p className="text-[.92rem] text-textM mb-6 font-light leading-relaxed">
                  Drag & drop hand-drawn flowers, arrange layers, pick a wrapping — then create a beautiful digital card with stickers & messages to send to your loved ones!
                </p>
                <button onClick={() => navigate('/digital-bouquet')}
                  className="bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold px-8 py-3.5 rounded-full text-[.9rem] hover:-translate-y-0.5 hover:shadow-soft-l transition-all">
                  Start Building 🌸
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-br from-[#ffe8ed] via-[#f0e0ff] to-[#daefd4] py-16 text-center relative overflow-hidden">
        <span className="absolute top-4 left-[10%] text-3xl opacity-30 select-none animate-[petalFloat_6s_ease-in-out_infinite]">🌸</span>
        <span className="absolute top-8 right-[12%] text-2xl opacity-25 select-none animate-[petalFloat_8s_ease-in-out_1s_infinite]">🌺</span>
        <span className="absolute bottom-4 left-[20%] text-2xl opacity-25 select-none animate-[petalFloat_7s_ease-in-out_2s_infinite]">🌷</span>
        <span className="absolute bottom-6 right-[18%] text-3xl opacity-30 select-none animate-[petalFloat_9s_ease-in-out_.5s_infinite]">💐</span>
        <div className="relative z-10">
          <p className="text-[2rem] mb-3">💐</p>
          <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-roseDD mb-3">
            Ready to Spread Some Joy?
          </h2>
          <p className="text-[.92rem] text-textM mb-7 font-light">Find the perfect bouquet for every moment that matters.</p>
          <button onClick={() => navigate('/shops')} className="bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold px-8 py-3.5 rounded-full text-[.9rem] hover:-translate-y-0.5 hover:shadow-soft-l transition-all">
            Explore Shops 🌹
          </button>
        </div>
      </section>

      {/* ── Floating Bouquet Builder Button ── */}
      <style>{`
        @keyframes slideAcross {
          0%   { transform: translateX(0) translateY(0); }
          50%  { transform: translateX(calc(-100vw + 130px)) translateY(-7px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes bouquetBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-7px); }
        }
        @keyframes sparkPop {
          0%   { opacity:0; transform: translate(-50%,-50%) scale(0.3); }
          40%  { opacity:1; }
          100% { opacity:0; transform: translate(-50%,-50%) scale(1.6) translateY(-20px); }
        }
        @keyframes trailFade {
          0%,100% { opacity:0; letter-spacing:4px; }
          30%,70% { opacity:1; letter-spacing:6px; }
        }
        .bb-wrap {
          position: fixed;
          top: 75vh;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          animation: slideAcross 40s ease-in-out infinite;
        }
        .bb-trail {
          position: relative;
          margin-right: 10px;
          display: flex;
          align-items: center;
        }
        .bb-trail-text {
          font-family: Georgia, serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #2a6030;
          text-shadow: 0 0 8px #80f080, 0 0 20px #c0ffc0, 0 0 4px white;
          animation: trailFade 3s ease-in-out infinite;
          white-space: nowrap;
          pointer-events: none;
        }
        .bb-spark {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          animation: sparkPop 1.6s ease-out infinite;
        }
      `}</style>

      <div className="bb-wrap">
        {/* Trail + sparks */}
        <div className="bb-trail">
          <span className="bb-trail-text">✨ BUILD A BOUQUET ✨</span>
          {[
            { top:'50%', left:'10%',  color:'#f0d040', delay:'0s'   },
            { top:'20%', left:'25%',  color:'#80f080', delay:'0.3s' },
            { top:'80%', left:'40%',  color:'#f080c0', delay:'0.6s' },
            { top:'30%', left:'55%',  color:'#80c0ff', delay:'0.9s' },
            { top:'70%', left:'70%',  color:'#f0d040', delay:'0.2s' },
            { top:'15%', left:'85%',  color:'#c080ff', delay:'0.5s' },
            { top:'60%', left:'95%',  color:'#80f080', delay:'0.8s' },
          ].map((s, i) => (
            <span key={i} className="bb-spark" style={{
              top: s.top, left: s.left,
              background: s.color,
              boxShadow: `0 0 8px 3px ${s.color}`,
              animationDelay: s.delay,
            }}/>
          ))}
        </div>

        {/* Button */}
        <div
          onClick={() => navigate('/digital-bouquet')}
          title="Build a Digital Bouquet"
          style={{
            width: 86, height: 86, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#c8e8c8,#a8d8a8)',
            boxShadow: '0 8px 28px rgba(60,100,48,0.45), 0 0 22px rgba(100,220,100,0.35)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid rgba(90,140,80,0.45)',
          }}
        >
          <img
            src="https://res.cloudinary.com/deixioyzo/image/upload/v1774807029/anemone_fjaadv.webp"
            alt="Build Bouquet"
            style={{ width:60, height:60, objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }}
          />
        </div>
      </div>

    </div>
  );
}
