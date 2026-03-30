export default function FlashSaleCard({ item, onAdd }) {
  const pct = item.discountPct;
  const isLow = item.stock <= 5;

  return (
    <div className="bouquet-card sale-pulse relative bg-white rounded-2xl p-5 text-center shadow-soft-s border border-blush/15 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]">
      {/* Badges */}
      <div className="flex gap-1.5 justify-center mb-3 flex-wrap">
        <span className="text-[.67rem] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff4757] text-white">
          -{pct}% OFF
        </span>
        {isLow && item.stock > 0 && (
          <span className="text-[.67rem] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-br from-[#ffa726] to-[#ff7043] text-white animate-[pulseBadge_1.5s_ease_infinite]">
            Only {item.stock} left!
          </span>
        )}
        {item.stock === 0 && (
          <span className="text-[.67rem] font-bold px-2.5 py-0.5 rounded-full bg-gray-400 text-white">
            Sold Out
          </span>
        )}
      </div>

      {/* Image */}
      {item.image && item.image !== "PASTE_LINK_HERE" ? (
        <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-xl mb-3" />
      ) : (
        <div className="text-[3.2rem] mb-3">🌸</div>
      )}

      <h4 className="font-playfair font-semibold text-base mb-0.5">{item.name}</h4>
      {item.occasion && <p className="text-[.72rem] text-textL mb-2">🎀 {item.occasion}</p>}

      {/* Price */}
      <div className="font-playfair font-bold text-[1.1rem] text-roseD mb-3">
        <span className="text-[.8rem] text-textL line-through mr-1.5">₹{item.originalPrice}/stem</span>
        ₹{item.salePrice}/stem
      </div>

      {/* Stock bar */}
      <div className="mb-3">
        <div className="bg-red-100 rounded-full h-1.5 w-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#ff6b6b] to-[#ff4757] h-full rounded-full transition-all duration-700"
            style={{ width: `${(item.stock / item.totalStock) * 100}%` }}
          />
        </div>
        <p className="text-[.7rem] text-textL mt-1">{item.stock} of {item.totalStock} remaining</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); if (item.stock > 0) onAdd(item); }}
        disabled={item.stock === 0}
        className="relative z-10 w-full bg-gradient-to-br from-rose to-[#e09099] text-white text-[.82rem] font-semibold py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {item.stock === 0 ? "Sold Out" : "Add to Cart 🛒"}
      </button>
    </div>
  );
}
