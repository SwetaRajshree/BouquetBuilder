import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FallingPetals from '../components/FallingPetals';

const TEAM = [
  { name: 'Sweta Rajshree',         role: 'Vision & Technology',       bio: 'Believes flowers can express what words cannot 🌸',          av: '👩‍💼' },
  { name: 'Sakshi Rani Rajshree',      role: 'Operations & Technology',  bio:'Sharing stories that bloom across hearts ❤️' ,                av: '👩‍🔧' },
  { name: 'Prachi Prava Samantray',        role: 'Design & Experience',        bio: 'Turning emotions into beautiful interfaces 🎨',              av: '👩‍🎨' },
];

const VALUES = [
  { icon: '🌱', title: 'Fresh',       desc: 'Every bouquet made with the freshest seasonal blooms, sourced daily from local farms.' },
  { icon: '🏡', title: 'Local',       desc: 'We partner with neighbourhood florists to keep the love — and the money — in your community.' },
  { icon: '♻️', title: 'Sustainable', desc: 'Eco-friendly wrapping, zero single-use plastics in our packaging — nature inspired, nature kind.' },
  { icon: '✋', title: 'Handcrafted', desc: 'Every bouquet hand-arranged by skilled florists. Never mass-produced, always made with heart.' },
];

const STATS = [
  ['200+',    'Florists Empowered'],
  ['50,000+', 'Emotions Delivered'],
  ['1,500+',  'Farmers Supported'],
  ['4.9★',   'Happiness Rating'],
];

const REGIONAL = [
  { title: 'Kolkata Market',   desc: 'A vendor who never missed sunrise.',              emoji: '🌼' },
  { title: 'Bengaluru Roses',  desc: 'A farmer choosing roots over IT dreams.',         emoji: '🌹' },
  { title: 'Madurai Jasmine',  desc: 'Women picking flowers at 3 AM.',                  emoji: '🤍' },
  { title: 'Odisha Marigold',  desc: 'Farmers living by seasons and faith.',            emoji: '🌻' },
];

const TESTIMONIALS = [
  { name: 'Ananya', text: 'My mom cried when she received the flowers. Best gift I ever gave.' },
  { name: 'Rahul',  text: 'It made long distance feel a little closer. Thank you BouquetBuilder.' },
  { name: 'Sneha',  text: 'Knowing farmers are supported made every petal feel more special.' },
];

const BLOGS = [
  { label: 'The Better India',  href: 'https://www.thebetterindia.com' },
  { label: 'Rural India Online', href: 'https://ruralindiaonline.org' },
  { label: 'FlowerAura Blog',   href: 'https://www.floweraura.com/blog' },
  { label: 'FNP Blog',          href: 'https://www.fnp.com/blog' },
];

// Scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// Animated counter
function Counter({ target }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  const num = parseInt(target.replace(/[^0-9]/g, ''));
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!visible || !num) return;
    let start = 0;
    const step = Math.ceil(num / 50);
    const t = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(t); }
      else setCount(start);
    }, 30);
    return () => clearInterval(t);
  }, [visible, num]);

  return (
    <div ref={ref} className="font-playfair font-extrabold text-[2.8rem] text-roseD">
      {num ? `${count.toLocaleString()}${suffix}` : target}
    </div>
  );
}

export default function OurStoryPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="page-enter">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden text-center px-4 py-24 bg-gradient-to-br from-[#ffe8ed] via-[#f0e4ff] to-[#ddeedd]">
        <FallingPetals count={14} />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <h1 className="font-playfair font-extrabold italic text-roseDD text-[clamp(2.5rem,6vw,4.5rem)]"
            style={{ animation: 'pageIn 0.8s ease both' }}>
            Our Story 🌿
          </h1>
          <p className="text-[1.05rem] text-textM mt-4 font-light leading-relaxed"
            style={{ animation: 'pageIn 0.8s ease 0.2s both' }}>
            Born from a love of flowers and a desire to make every day feel like a celebration.
          </p>
          <button onClick={() => navigate('/flowers')}
            className="mt-6 inline-block bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold px-7 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all text-[.9rem]"
            style={{ animation: 'pageIn 0.8s ease 0.4s both' }}>
            Explore Flowers 🌸
          </button>
        </div>
      </div>

      {/* ── Where Every Flower Has a Story ── */}
      <div className="bg-white py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-4">
              Where Every Flower Has a Story 🌱
            </h2>
            <p className="text-textM leading-[1.85] text-[.92rem] mb-4">
              Behind every bouquet is not just beauty — but a journey of early mornings, muddy hands, and hopeful hearts.
            </p>
            <p className="text-textM leading-[1.85] text-[.92rem] mb-4">
              From the jasmine fields of Madurai to the rose farms of Bengaluru, flowers carry stories of people, struggles, and dreams.
            </p>
            <p className="text-textM leading-[1.85] text-[.92rem]">
              BouquetBuilder was created to bring those stories to you — not just to send flowers, but to send emotions, livelihoods, and love. 🌸
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] rounded-lg p-14 text-center text-[6rem] shadow-soft-s hover:scale-105 transition-transform duration-500">
              🌹
            </div>
          </Reveal>
        </div>
      </div>

      <div className="text-center py-3 text-[1.25rem] tracking-[.45rem] text-blush select-none">✿ ❀ ✿ ❀ ✿</div>

      {/* ── Mission ── */}
      <div className="py-2">
        <div className="max-w-[720px] mx-auto px-4 py-12 text-center">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-5">Our Mission 🌸</h2>
            <p className="font-playfair italic text-[1.1rem] text-textM leading-[1.9]">
              "To make gifting flowers effortless, emotional, and meaningful — while supporting the hands that grow them."
            </p>
          </Reveal>
        </div>
      </div>

      <div className="text-center py-3 text-[1.25rem] tracking-[.45rem] text-blush select-none">✿ ❀ ✿ ❀ ✿</div>

      {/* ── Regional Stories ── */}
      <div className="bg-white py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1 text-center">
              Stories from the Soil of India 🌍
            </h2>
            <p className="text-[.9rem] text-textL font-light mb-8 text-center">Real people, real flowers, real impact</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {REGIONAL.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="shadow-soft-s rounded-md overflow-hidden border border-blush/10 hover:-translate-y-1.5 hover:shadow-soft-m transition-all">
                  <div className="h-[150px] w-full bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] flex items-center justify-center text-[4rem]">
                    {item.emoji}
                  </div>
                  <div className="p-4">
                    <h4 className="font-playfair font-semibold text-roseDD mb-1">{item.title}</h4>
                    <p className="text-[.78rem] text-textL">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-3 text-[1.25rem] tracking-[.45rem] text-blush select-none">✿ ❀ ✿ ❀ ✿</div>

      {/* ── Testimonials ── */}
      <div className="py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1 text-center">
              Moments We Became Part Of ❤️
            </h2>
            <p className="text-[.9rem] text-textL font-light mb-8 text-center">Stories from people who sent love</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white rounded-md p-6 shadow-soft-s border border-blush/10 hover:-translate-y-1 hover:shadow-soft-m transition-all">
                  <div className="text-[1.8rem] mb-3">💬</div>
                  <p className="font-playfair italic text-textM text-[.92rem] leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-sm">🌸</div>
                    <h4 className="font-semibold text-[.88rem] text-roseDD">{t.name}</h4>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── Farmer Voice ── */}
      <Reveal>
        <div className="text-center py-10 bg-gradient-to-br from-[#fff7f9] to-[#f3eaff] border-y border-blush/20">
          <div className="text-[2.5rem] mb-3">🌼</div>
          <p className="font-playfair italic text-[1.1rem] text-textM max-w-[500px] mx-auto px-4">
            "When you buy flowers, you support my family, my land, and my future."
          </p>
          <p className="text-[.82rem] text-textL mt-3">— A flower farmer from Odisha</p>
        </div>
      </Reveal>

      <div className="text-center py-3 text-[1.25rem] tracking-[.45rem] text-blush select-none">✿ ❀ ✿ ❀ ✿</div>

      {/* ── Team ── */}
      <div className="bg-white py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">Meet the Team 💐</h2>
            <p className="text-[.9rem] text-textL font-light mb-7">The flower-obsessed people behind BouquetBuilder</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {TEAM.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="bg-white rounded-md p-6 text-center shadow-soft-s border border-blush/10 hover:-translate-y-1.5 hover:shadow-soft-m transition-all">
                  <div className="w-[72px] h-[72px] mx-auto mb-3.5 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-[2.8rem]">
                    {t.av}
                  </div>
                  <h4 className="font-playfair font-semibold text-base mb-0.5">{t.name}</h4>
                  <p className="text-[.75rem] text-rose font-semibold mb-2">{t.role}</p>
                  <p className="text-[.75rem] text-textL leading-relaxed">{t.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-3 text-[1.25rem] tracking-[.45rem] text-blush select-none">✿ ❀ ✿ ❀ ✿</div>

      {/* ── Values ── */}
      <div className="py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD mb-1">Our Values 🌿</h2>
            <p className="text-[.9rem] text-textL font-light mb-7">The principles that guide every petal we deliver</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="bg-white rounded-md p-7 text-center shadow-soft-s border border-blush/10 hover:-translate-y-1.5 hover:shadow-soft-m transition-all">
                  <div className="text-[2.2rem] mb-3">{v.icon}</div>
                  <h4 className="font-playfair font-semibold text-base mb-2">{v.title}</h4>
                  <p className="text-[.78rem] text-textL leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-gradient-to-br from-blushL to-lavL border-t border-blush/25 py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.6rem,3vw,2.1rem)] text-roseDD text-center mb-8">By the Numbers 🌺</h2>
          </Reveal>
          <div className="bg-white rounded-lg shadow-soft-m overflow-hidden flex flex-col md:flex-row">
            {STATS.map(([num, label], i) => (
              <div key={label} className={`flex-1 text-center py-10 px-5 ${i < STATS.length - 1 ? 'border-b md:border-b-0 md:border-r border-blush/25' : ''}`}>
                <Counter target={num} />
                <div className="text-[.82rem] text-textL mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Blog Links ── */}
      <div className="py-2">
        <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
          <Reveal>
            <h2 className="font-playfair font-bold text-[clamp(1.4rem,3vw,1.8rem)] text-roseDD mb-2">Explore Flower Stories 📖</h2>
            <p className="text-[.9rem] text-textL font-light mb-7">Dive deeper into the world of flowers and farmers</p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {BLOGS.map((b, i) => (
              <Reveal key={b.label} delay={i * 60}>
                <a href={b.href} target="_blank" rel="noreferrer"
                  className="inline-block border-[1.5px] border-rose text-roseD text-[.85rem] font-semibold px-5 py-2.5 rounded-full hover:bg-rose hover:text-white transition-all">
                  {b.label} ↗
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="bg-roseDD px-4 py-16 text-center text-white">
        <Reveal>
          <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2.2rem)] mb-2">Join Our Journey 🌸</h2>
          <p className="text-white/80 font-light mb-6">Get bloom tips, exclusive deals & florist stories in your inbox</p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-6 py-3 text-white font-semibold"
              style={{ animation: 'pageIn 0.4s ease both' }}>
              ✅ You're subscribed! Welcome to the garden 🌸
            </div>
          ) : (
            <form onSubmit={handleSubscribe}
              className="flex max-w-[420px] mx-auto overflow-hidden rounded-full bg-white/15 border border-white/25">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-white placeholder:text-white/60 px-5 py-3 text-[.9rem]"
                placeholder="Your email address"
              />
              <button type="submit"
                className="bg-white/95 text-roseDD font-bold text-[.85rem] px-5 py-2.5 rounded-full m-1 hover:bg-white transition-colors">
                Subscribe 💐
              </button>
            </form>
          )}
        </Reveal>
      </div>

    </div>
  );
}
