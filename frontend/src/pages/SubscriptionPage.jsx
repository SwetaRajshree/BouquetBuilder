import { useState }  from 'react';
import PackageCard   from '../components/PackageCard';
import { PACKAGES, FLOWERS, WEEK_DAYS } from '../data/mockData';

const COMPARE_ROWS = [
  ['Free Delivery',        true,  true,  true ],
  ['Seasonal Flowers',     true,  true,  true ],
  ['Priority Scheduling',  false, true,  true ],
  ['Dedicated Florist',    false, false, true ],
  ['Custom Themes',        false, false, true ],
  ['Free Gift Add-ons',    false, false, true ],
  ['VIP Support',          false, false, true ],
  ['Free Message Cards',   false, true,  true ],
];

export default function SubscriptionPage() {
  const [view,       setView]       = useState('plans');
  const [budget,     setBudget]     = useState(2000);
  const [selFlowers, setSelFlowers] = useState([]);
  const [selDay,     setSelDay]     = useState('Monday');

  const toggleFlower = f => setSelFlowers(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] px-4 py-16 text-center">
        <h1 className="font-playfair font-extrabold text-roseDD text-[clamp(2rem,4vw,3rem)] mb-2">Never Miss a Bloom 🌸</h1>
        <p className="text-[1rem] text-textM font-light mb-6">Subscribe & Save — fresh flowers delivered on your schedule</p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <button onClick={() => setView('plans')} className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.85rem] font-semibold px-5 py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all">View Plans</button>
          <button onClick={() => setView('my')}    className="border-[1.5px] border-rose text-roseD text-[.85rem] font-medium px-5 py-2.5 rounded-full hover:bg-rose hover:text-white transition-all">My Subscriptions</button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {view === 'plans' && (
          <>
            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {PACKAGES.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>

            {/* Comparison table */}
            <h2 className="font-playfair font-bold text-[1.9rem] text-roseDD mb-1">Plan Comparison</h2>
            <p className="text-[.9rem] text-textL font-light mb-5">Find exactly what suits you</p>
            <div className="overflow-x-auto rounded-md shadow-soft-s">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-br from-blushL to-lavL">
                    <th className="text-left px-5 py-4 text-[.88rem] border-b-2 border-blush/30">Feature</th>
                    {['Weekly','Monthly','Yearly'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-[.88rem] border-b-2 border-blush/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map(([feat, ...vals]) => (
                    <tr key={feat} className="hover:bg-cream transition-colors">
                      <td className="px-5 py-3.5 text-[.84rem] font-medium border-b border-blush/15">{feat}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="px-5 py-3.5 text-[.84rem] border-b border-blush/15">
                          <span className={v ? 'text-sageD text-lg' : 'text-[#d0a0a0]'}>{v ? '✓' : '✗'}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customize your plan */}
            <div className="bg-white rounded-lg shadow-soft-s p-8 mt-10">
              <h3 className="font-playfair font-bold text-[1.4rem] mb-1">🎨 Customize Your Plan</h3>
              <p className="text-[.85rem] text-textL font-light mb-6">Tell us your preferences and we'll craft the perfect subscription</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-2 uppercase tracking-wide">Preferred Flowers</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FLOWERS.slice(0,6).map(f => (
                      <div key={f} onClick={() => toggleFlower(f)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-sm border-[1.5px] cursor-pointer text-[.82rem] transition-all
                          ${selFlowers.includes(f) ? 'bg-blushL border-rose text-roseD font-semibold' : 'bg-white border-blush/40 hover:border-rose'}`}
                      >
                        {selFlowers.includes(f) && '✓ '}{f}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-2 uppercase tracking-wide">Preferred Delivery Day</label>
                  <div className="flex gap-1.5 flex-wrap mb-5">
                    {WEEK_DAYS.map(d => (
                      <button key={d} onClick={() => setSelDay(d)}
                        className={`px-3 py-1.5 rounded-full border-[1.5px] text-[.78rem] transition-all
                          ${selDay === d ? 'bg-blush border-rose text-roseD font-bold' : 'bg-white border-blush/40 text-textL hover:border-rose'}`}
                      >
                        {d.slice(0,3)}
                      </button>
                    ))}
                  </div>
                  <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">
                    Budget Range: ₹{budget.toLocaleString()}/delivery
                  </label>
                  <input type="range" min={500} max={5000} step={100} value={budget}
                    onChange={e => setBudget(+e.target.value)} className="w-full" />
                  <div className="flex justify-between text-[.72rem] text-textL mt-1">
                    <span>₹500</span><span>₹5,000</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 bg-gradient-to-br from-sage to-sageD text-white text-[.85rem] font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(138,171,120,.4)] transition-all">
                Build My Custom Plan 🌸
              </button>
            </div>
          </>
        )}

        {view === 'my' && (
          <div>
            <h2 className="font-playfair font-bold text-[1.9rem] text-roseDD mb-6">My Subscriptions</h2>
            <div className="bg-white rounded-md shadow-soft-s p-5 mb-5 flex items-center gap-4 flex-wrap">
              <span className="text-4xl">💐</span>
              <div className="flex-1">
                <p className="font-playfair font-semibold text-[1.1rem] mb-1">Monthly Romance</p>
                <p className="text-[.82rem] text-textL">Next delivery: March 28, 2025</p>
              </div>
              <span className="text-[.67rem] font-bold px-2.5 py-1 rounded-full bg-gradient-to-br from-sage to-sageD text-white">Active</span>
              <div className="flex gap-2">
                <button className="border-[1.5px] border-rose text-roseD text-[.78rem] font-medium px-4 py-1.5 rounded-full hover:bg-rose hover:text-white transition-all">Pause</button>
                <button className="bg-blushL/60 text-red-500 text-[.78rem] font-medium px-4 py-1.5 rounded-full hover:bg-red-50 transition-all">Cancel</button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blushL to-lavL rounded-md p-8 text-center border border-blush/28">
              <div className="text-[2rem] mb-2">🎁</div>
              <h3 className="font-playfair font-bold text-[1.3rem] mb-2">Gift a Subscription</h3>
              <p className="text-[.85rem] text-textL font-light mb-4">Give someone the gift of fresh flowers every week</p>
              <button className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.85rem] font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all">
                Gift a Subscription 🎁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
