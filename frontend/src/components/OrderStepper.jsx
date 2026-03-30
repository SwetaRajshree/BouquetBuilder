const STEPS = [
  { icon: '🌸', label: 'Order Placed',     desc: 'Your order was received at 10:32 AM',       status: 'done'    },
  { icon: '🌺', label: 'Preparing',        desc: 'Our florists are handcrafting your bouquet', status: 'active'  },
  { icon: '🚴', label: 'Out for Delivery', desc: 'On the way to Priya Sharma',                status: 'pending' },
  { icon: '💐', label: 'Delivered',        desc: 'Love delivered, smiles bloomed 🌸',          status: 'pending' },
];

export default function OrderStepper() {
  return (
    <div className="bg-white rounded-md shadow-soft-s p-5">
      {STEPS.map((s, i) => (
        <div key={i} className="flex gap-4 items-start mb-5 last:mb-0">
          {/* Icon column */}
          <div className="flex flex-col items-center">
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-[3px] transition-all
              ${s.status === 'done'    ? 'bg-gradient-to-br from-sage to-sageD border-sage' :
                s.status === 'active'  ? 'bg-gradient-to-br from-blush to-lavender border-rose shadow-[0_0_0_5px_rgba(201,132,138,.18)]' :
                                         'bg-[#f0e8f0] border-[#e0d0e0]'}
            `}>
              {s.icon}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-0.5 flex-1 min-h-[28px] mt-1 ${s.status === 'done' ? 'bg-sage' : 'bg-[#e0d0e0]'}`} />
            )}
          </div>

          {/* Text */}
          <div className="pt-3">
            <h4 className={`font-playfair font-semibold text-base mb-1 ${s.status === 'pending' ? 'text-textL' : 'text-text'}`}>
              {s.label}
            </h4>
            <p className="text-[.79rem] text-textL">{s.desc}</p>
            {s.status === 'active' && (
              <span className="
                inline-block mt-1.5 text-[.67rem] font-extrabold uppercase tracking-wider
                bg-gradient-to-br from-rose to-[#e09099] text-white
                px-3 py-0.5 rounded-full
              ">
                In Progress ✨
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
