import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL;

const CARD_STYLES = [
  { id:'parchment', name:'Parchment', bg:'linear-gradient(135deg,#fce4f0,#f8d0e8,#f0c8e0)', border:'#d4a0c8' },
  { id:'ivory',     name:'Ivory',     bg:'linear-gradient(135deg,#f5e8c8,#ede0b0,#e8d898)', border:'#c8a860' },
  { id:'blush',     name:'Blush',     bg:'linear-gradient(135deg,#e8f5f0,#d0ece8,#c0e0d8)', border:'#80c0b0' },
  { id:'sage',      name:'Sage',      bg:'linear-gradient(135deg,#fff8f0,#fff0e0,#ffe8d0)', border:'#f0a880' },
  { id:'slate',     name:'Slate',     bg:'linear-gradient(135deg,#f8f5f0,#f0ece0,#e8e0d0)', border:'#d0c8b0' },
  { id:'postcard',  name:'Postcard',  bg:'linear-gradient(135deg,#fffbe8,#fff5d0,#fff0c0)', border:'#d4b840' },
];

const FALLBACK_FILLERS = [
  { _id:'fern',        name:'Fern',          image:'https://res.cloudinary.com/deixioyzo/image/upload/v1774807043/fern_tipfkk.webp' },
  { _id:'eucalyptus',  name:'Eucalyptus',    image:'https://res.cloudinary.com/deixioyzo/image/upload/v1774807042/eucalyptus_gnobku.webp' },
  { _id:'babysbreath', name:"Baby's Breath", image:'https://res.cloudinary.com/deixioyzo/image/upload/v1774807031/Baby_s_Breath_cso0rw.webp' },
];

export default function PostcardPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { addToCart, cartItems, updateCartItem } = useCartContext();

  const item = location.state?.item;
  // If coming from cart's Edit Card, the item already has filler/postcard saved
  const existingCartItem = item ? cartItems.find(c => c._id === item._id) : null;

  const [fillers, setFillers] = useState(FALLBACK_FILLERS);

  useEffect(() => {
    fetch(`${API}/api/fillers`)
      .then(r => r.json())
      .then(data => {
        if (data.length > 0) {
          setFillers(data);
          // re-match filler from DB data once loaded
          if (existingFillerId) {
            const match = data.find(f => f._id === existingFillerId);
            if (match) setFiller(match);
          }
        }
      })
      .catch(() => {});
  }, []);

  const existingPostcard = existingCartItem?.postcard;
  const existingFillerId = existingCartItem?.filler?.id;

  const [cardStyle, setCardStyle] = useState(
    CARD_STYLES.find(c => c.id === existingPostcard?.cardStyle) || CARD_STYLES[0]
  );
  const [recipient, setRecipient] = useState(existingPostcard?.recipient || '');
  const [message,   setMessage]   = useState(existingPostcard?.message   || '');
  const [sender,    setSender]    = useState(existingPostcard?.sender    || '');
  const [filler,    setFiller]    = useState(
    existingFillerId ? (FALLBACK_FILLERS.find(f => f._id === existingFillerId) || existingCartItem.filler) : null
  );
  const [skipCard,  setSkipCard]  = useState(!existingPostcard && !!existingCartItem);

  if (!item) {
    navigate('/flowers');
    return null;
  }

  const isBouquet = item.type === 'Bouquet';
  const basePrice  = item.pricePerStem || item.priceRange?.min || 0;
  const fillerPrice = filler?.pricePerStem || 0;
  const totalPrice  = basePrice + fillerPrice;

  const handleAddToCart = () => {
    const postcardData = skipCard ? null : { cardStyle: cardStyle.id, recipient, message, sender };
    const fillerData   = filler ? { id: filler._id, name: filler.name, image: filler.image, price: filler.pricePerStem } : null;
    const fillerPrice  = filler?.pricePerStem || 0;

    if (existingCartItem) {
      // Editing — update in place
      updateCartItem(item._id, {
        postcard: postcardData,
        filler: fillerData,
        basePrice: item.pricePerStem || item.priceRange?.min || 0,
      });
    } else {
      addToCart({
        ...item,
        price: basePrice + fillerPrice,
        postcard: postcardData,
        filler: fillerData,
      });
    }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4" style={{ fontFamily: "Georgia,'Palatino Linotype',serif" }}>
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-[5px] text-pink-400 mb-2 font-sans">PERSONALISE YOUR ORDER</p>
          <h1 className="font-playfair font-bold text-3xl text-roseDD mb-1">Add a Personal Touch 🌸</h1>
          <p className="text-sm text-gray-400">Optionally add a message card{!isBouquet ? ' and filler leaves' : ''} before adding to cart.</p>
        </div>

        {/* Item preview */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft-s border border-pink-100 mb-8">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50">
            {item.image
              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
              : <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
            }
          </div>
          <div className="flex-1">
            <p className="font-playfair font-bold text-roseDD">{item.name}</p>
            <p className="text-xs text-gray-400">{item.category} · {item.emotion}</p>
            <p className="text-xs font-semibold text-roseD mt-1">
              {item.priceRange ? `₹${item.priceRange.min} – ₹${item.priceRange.max}` : `₹${item.pricePerStem}/stem`}
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="text-xs text-gray-400 hover:text-pink-500 border border-gray-200 hover:border-pink-300 px-3 py-1.5 rounded-full transition-all">
            ← Change
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left — Card + Message */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-s border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair font-bold text-roseDD">✉️ Message Card</h3>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" checked={skipCard} onChange={e => setSkipCard(e.target.checked)} className="accent-pink-500"/>
                Skip card
              </label>
            </div>

            {!skipCard && (
              <>
                {/* Card style picker */}
                <p className="text-[0.7rem] font-semibold text-pink-400 uppercase tracking-widest mb-3">Card Style</p>
                <div className="flex gap-2 flex-wrap mb-5">
                  {CARD_STYLES.map(cs => (
                    <div key={cs.id} onClick={() => setCardStyle(cs)}
                      style={{ background: cs.bg, border: `2px solid ${cardStyle.id === cs.id ? '#3a6030' : cs.border}`, transform: cardStyle.id === cs.id ? 'scale(1.08)' : 'scale(1)' }}
                      className="w-14 h-10 rounded-lg cursor-pointer transition-all flex items-end justify-center pb-1">
                      <span className="text-[9px] text-gray-500 font-sans">{cs.name}</span>
                    </div>
                  ))}
                </div>

                {/* Live preview */}
                <div style={{ background: cardStyle.bg, border: `2px solid ${cardStyle.border}` }}
                  className="rounded-xl p-4 text-center min-h-[90px] mb-5 shadow-sm">
                  {recipient && <p className="text-sm font-bold text-[#3a2a18] mb-1">To {recipient},</p>}
                  {message   && <p className="text-xs text-[#5a4030] italic leading-relaxed mb-2">{message}</p>}
                  {sender    && <p className="text-xs text-[#7a6050]">— {sender}</p>}
                  {!recipient && !message && !sender && <p className="text-xs text-gray-300 italic">Your message will appear here...</p>}
                </div>

                {/* Fields */}
                {[
                  { label:'To', val: recipient, set: setRecipient, placeholder:'Beloved,' },
                  { label:'From', val: sender, set: setSender, placeholder:'Secret Admirer' },
                ].map(f => (
                  <div key={f.label} className="mb-3">
                    <p className="text-[0.7rem] font-semibold text-pink-400 uppercase tracking-widest mb-1">{f.label}</p>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-pink-50 text-sm text-gray-700 outline-none focus:border-pink-300"/>
                  </div>
                ))}
                <div>
                  <p className="text-[0.7rem] font-semibold text-pink-400 uppercase tracking-widest mb-1">Message</p>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Keep it short and sweet 💕" rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-pink-50 text-sm text-gray-700 outline-none focus:border-pink-300 resize-none"/>
                </div>
              </>
            )}

            {skipCard && (
              <p className="text-sm text-gray-400 italic text-center py-6">No card will be added to this order.</p>
            )}
          </div>

          {/* Right — Filler (only for individual flowers) */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-s border border-pink-100">
            <h3 className="font-playfair font-bold text-roseDD mb-1">
              {isBouquet ? '💐 Your Bouquet' : '🌿 Add Filler Leaves'}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {isBouquet ? 'This is a ready-made bouquet — no filler needed.' : 'Turn your flowers into a bouquet by adding filler greenery.'}
            </p>

            {!isBouquet && (
              <div className="flex flex-col gap-3">
                <div onClick={() => setFiller(null)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${!filler ? 'border-pink-400 bg-pink-50' : 'border-pink-100 hover:border-pink-300'}`}>
                  <div className="w-12 h-12 flex items-center justify-center text-2xl bg-pink-50 rounded-lg">🚫</div>
                  <div>
                    <p className="text-sm font-semibold text-roseDD">No Filler</p>
                    <p className="text-xs text-gray-400">Just the flowers, no greenery</p>
                  </div>
                  {!filler && <span className="ml-auto text-pink-500 font-bold">✓</span>}
                </div>
                {fillers.map(f => (
                  <div key={f._id} onClick={() => setFiller(f)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${filler?._id === f._id ? 'border-pink-400 bg-pink-50' : 'border-pink-100 hover:border-pink-300'}`}>
                    {f.image
                      ? <img src={f.image} alt={f.name} className="w-12 h-12 object-contain rounded-lg"/>
                      : <div className="w-12 h-12 flex items-center justify-center text-2xl bg-pink-50 rounded-lg">🌿</div>
                    }
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-roseDD">{f.name}</p>
                      <p className="text-xs text-gray-400">+₹{f.pricePerStem}/stem</p>
                    </div>
                    {filler?._id === f._id && <span className="text-pink-500 font-bold">✓</span>}
                  </div>
                ))}
              </div>
            )}

            {isBouquet && (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="text-5xl mb-3">💐</div>
                  <p className="text-sm text-gray-400">Ready to go as-is!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price summary + Actions */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="bg-white rounded-2xl px-8 py-4 shadow-soft-s border border-pink-100 flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Item</p>
              <p className="font-semibold text-roseDD">₹{basePrice}</p>
            </div>
            {filler && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Filler ({filler.name})</p>
                <p className="font-semibold text-roseDD">+₹{fillerPrice}</p>
              </div>
            )}
            <div className="text-center border-l border-pink-100 pl-6">
              <p className="text-xs text-gray-400 mb-1">Total / stem</p>
              <p className="font-bold text-roseD text-base">₹{totalPrice}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full border-2 border-pink-200 text-pink-500 text-sm font-semibold hover:border-pink-400 transition-all bg-white">
              ← Back
            </button>
            <button onClick={handleAddToCart}
              className="px-8 py-3 rounded-full bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-soft-m transition-all">
              Add to Cart — ₹{totalPrice} 🛒
            </button>
            <button onClick={() => navigate('/cart')}
              className="px-6 py-3 rounded-full border-2 border-pink-200 text-pink-500 text-sm font-semibold hover:border-pink-400 transition-all bg-white">
              View Cart 🛒
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
