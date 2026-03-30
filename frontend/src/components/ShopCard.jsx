import { useNavigate } from 'react-router-dom';
import { useCartContext } from "../context/CartContext";

export default function ShopCard({ shop }) {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();

  return (
    <div
      onClick={() => navigate(`/shop/${shop.id}`)}
      className="
        min-w-[215px] flex-shrink-0
        bg-white rounded-md p-5
        shadow-soft-s border border-blush/20
        cursor-pointer transition-all duration-250
        hover:-translate-y-1.5 hover:shadow-soft-m hover:border-blush
      "
    >
      <div
        className="w-14 h-14 rounded-sm flex items-center justify-center text-4xl mb-3"
        style={{ background: shop.color + '55' }}
      >
        {shop.img}
      </div>

      <h3 className="font-playfair font-semibold text-base mb-0.5">
        {shop.name}
      </h3>

      <p className="text-[.76rem] text-textL mb-2.5">
        {shop.specialty}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[.78rem] font-medium">⭐ {shop.rating}</span>
        <span className="text-[.74rem] text-textL">📍 {shop.distance}</span>
        <span
          className={`
            text-[.67rem] font-bold px-2 py-0.5 rounded-full
            ${shop.open
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-700'}
          `}
        >
          {shop.open ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* ✅ ADD TO CART BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          addToCart({
            _id: shop.id,
            name: shop.name,
            price: shop.price || 100, // fallback
          });
        }}
        className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white py-1.5 rounded-md text-sm transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
