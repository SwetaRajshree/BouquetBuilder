export default function BouquetCard({ bouquet, onAdd, saleOrig = null, left = null }) {
  return (
    <div className="
      bouquet-card relative
      bg-white rounded-md p-5
      shadow-soft-s border border-blush/15
      text-center overflow-hidden
      cursor-pointer transition-all duration-300
      hover:-translate-y-1.5 hover:scale-[1.02]
      hover:shadow-[0_14px_42px_rgba(201,132,138,.26)]
    ">
      {saleOrig && (
        <div className="flex gap-1.5 justify-center mb-2.5 flex-wrap">
          <span className="text-[.67rem] font-bold px-2 py-0.5 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff4757] text-white">
            -{Math.round((1 - bouquet.price / saleOrig) * 100)}% OFF
          </span>
          {left !== null && left <= 5 && (
            <span className="text-[.67rem] font-bold px-2 py-0.5 rounded-full bg-gradient-to-br from-[#ffa726] to-[#ff7043] text-white animate-[pulseBadge_1.5s_ease_infinite]">
              Only {left} left!
            </span>
          )}
        </div>
      )}

      <span className="text-[3.4rem] block mb-3 transition-transform duration-300 group-hover:scale-110">
        {bouquet.img}
      </span>
      <h4 className="font-playfair font-semibold text-base mb-0.5">{bouquet.name}</h4>
      <p className="text-[.76rem] text-textL mb-3 leading-relaxed">{bouquet.desc}</p>

      <div className="font-playfair font-bold text-[1.1rem] text-roseD mb-3">
        {saleOrig && (
          <span className="text-[.82rem] text-textL line-through mr-1.5">
            ₹{saleOrig.toLocaleString()}
          </span>
        )}
        ₹{bouquet.price.toLocaleString()}
      </div>

      {left !== null && (
        <div className="mb-3">
          <div className="bg-red-100 rounded-full h-1.5 w-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#ff6b6b] to-[#ff4757] h-full rounded-full transition-all duration-700"
              style={{ width: `${(left / 15) * 100}%` }}
            />
          </div>
          <p className="text-[.7rem] text-textL mt-1">{left} of 15 remaining</p>
        </div>
      )}

      <button
        onClick={onAdd}
        className="
          bg-gradient-to-br from-blush to-lavender
          text-roseD text-[.76rem] font-bold
          px-3.5 py-1.5 rounded-full
          hover:bg-rose hover:text-white hover:scale-105
          transition-all
        "
      >
        Add to Cart 🛒
      </button>
    </div>
  );
}
