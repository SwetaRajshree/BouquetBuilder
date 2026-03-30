import { useState } from 'react';

const METHODS = [
  { id: 'card',    icon: '💳', label: 'Credit / Debit Card',   sub: 'Visa, Mastercard, Amex, RuPay' },
  { id: 'bkash',  icon: '📱', label: 'Mobile Wallets',         sub: 'bKash · Nagad · Rocket' },
  { id: 'netbank',icon: '🏦', label: 'Net Banking',            sub: 'All major banks supported' },
  { id: 'cod',    icon: '💵', label: 'Cash on Delivery',       sub: 'Pay when you receive' },
  { id: 'gift',   icon: '🎁', label: 'Gift Card / Promo Code', sub: 'Enter your code below' },
];

export default function PaymentMethodSelector({ onChange }) {
  const [method, setMethod] = useState('card');
  const [promo,  setPromo]  = useState('');

  const select = (id) => { setMethod(id); onChange?.(id); };

  return (
    <div>
      {METHODS.map(pm => (
        <div
          key={pm.id}
          onClick={() => select(pm.id)}
          className={`
            flex items-center gap-3.5 p-4 mb-3 rounded-md border-2 cursor-pointer transition-all
            ${method === pm.id ? 'border-rose bg-blushL' : 'border-blush/30 hover:border-rose'}
          `}
        >
          {/* Radio circle */}
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${method === pm.id ? 'border-rose bg-rose' : 'border-[#ddd] bg-white'}
          `}>
            {method === pm.id && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
          <div className="text-3xl min-w-[40px] text-center">{pm.icon}</div>
          <div>
            <div className="text-[.9rem] font-semibold">{pm.label}</div>
            <div className="text-[.75rem] text-textL">{pm.sub}</div>
          </div>
        </div>
      ))}

      {/* Card form */}
      {method === 'card' && (
        <div className="bg-cream rounded-md p-5 mt-2 space-y-4">
          <div>
            <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Card Number</label>
            <div className="bg-white border-[1.5px] border-blush/40 rounded-sm px-4 py-3 text-[.9rem] text-textL tracking-[.15em]">
              •••• •••• •••• ••••
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Expiry</label>
              <input className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]" placeholder="MM / YY" />
            </div>
            <div>
              <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">CVV</label>
              <input type="password" className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]" placeholder="•••" />
            </div>
          </div>
          <div>
            <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Cardholder Name</label>
            <input className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]" placeholder="As on card" />
          </div>
        </div>
      )}

      {method === 'gift' && (
        <div className="bg-cream rounded-md p-5 mt-2">
          <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Enter Code</label>
          <div className="flex gap-2.5">
            <input className="flex-1 px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]"
              placeholder="e.g. BLOOM20" value={promo} onChange={e => setPromo(e.target.value)} />
            <button className="border-[1.5px] border-rose text-roseD px-5 py-2 rounded-full hover:bg-rose hover:text-white transition-all text-[.85rem] font-medium">
              Apply
            </button>
          </div>
        </div>
      )}

      {/* SSL badge */}
      <div className="flex items-center gap-3 bg-cream rounded-sm px-4 py-3 mt-4 border border-blush/20">
        <span className="text-2xl">🔒</span>
        <p className="text-[.78rem] text-textL leading-relaxed">
          <span className="font-bold text-text">Your payment is 100% secure.</span><br />
          Protected by 256-bit SSL. We never store card details.
        </p>
      </div>
    </div>
  );
}
