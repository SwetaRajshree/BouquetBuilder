import { useNavigate } from 'react-router-dom';

export default function PackageCard({ pkg }) {
  const navigate = useNavigate();
  return (
    <div className={`
      relative bg-white rounded-lg p-7 text-center
      shadow-soft-s border-2 transition-all duration-250
      hover:-translate-y-1.5 hover:shadow-soft-l
      ${pkg.popular ? 'border-rose' : 'border-transparent'}
    `}>
      {pkg.popular && (
        <div className="
          absolute -top-3.5 left-1/2 -translate-x-1/2
          bg-gradient-to-br from-rose to-[#e09099]
          text-white text-[.7rem] font-extrabold
          px-4 py-1 rounded-full tracking-wider uppercase whitespace-nowrap
        ">
          ✨ Most Popular
        </div>
      )}
      <span className="text-4xl mb-3 block">{pkg.icon}</span>
      <h3 className="font-playfair font-semibold text-lg mb-0.5">{pkg.title}</h3>
      <div className="font-playfair font-extrabold text-[1.4rem] text-roseD mb-4">{pkg.price}</div>
      <div className="
        text-[.78rem] text-sageD font-semibold mb-4
        bg-[#e8f5e0] rounded-full px-3 py-1 inline-block
      ">
        Delivery: {pkg.freq}
      </div>
      <ul className="text-left mb-5 space-y-1.5">
        {pkg.perks.map(p => (
          <li key={p} className="flex gap-2 text-[.8rem] text-textL">
            <span className="text-rose">✿</span>{p}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/subscription')}
        className="
          w-full bg-gradient-to-br from-rose to-[#e09099]
          text-white text-[.85rem] font-semibold
          py-2.5 rounded-full mb-2
          hover:-translate-y-0.5 hover:shadow-soft-m transition-all
        "
      >
        Subscribe Now
      </button>
      <button className="
        w-full text-[.78rem] text-textL
        bg-blushL/60 hover:bg-blushL rounded-full py-2
        transition-colors
      ">
        🎁 Gift This Plan
      </button>
    </div>
  );
}
