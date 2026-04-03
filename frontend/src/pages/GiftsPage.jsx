import { useState, useEffect } from "react";
import { useCartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/* ══════════════════════════════════════════════
   COLOR SYSTEM — BouquetBuilder Gift Palette
   Rose · Sage · Champagne · Blush · Forest
══════════════════════════════════════════════ */
const C = {
  /* Backgrounds */
  pageBg:      "linear-gradient(145deg, #fdf6f0 0%, #fce8e8 30%, #f0f4f0 65%, #fdf0f8 100%)",
  cardBg:      "#fffcfa",
  cardBgHov:   "#fff8f5",
  drawerBg:    "#fffaf8",

  /* Brand */
  rose:        "#e8476a",
  roseDark:    "#c0344f",
  roseLight:   "#fce8ed",
  roseMid:     "#f7b8c8",

  sage:        "#5a8a6a",
  sageDark:    "#3d6b50",
  sageLight:   "#eaf4ee",
  sageMid:     "#b2d4bc",

  champagne:   "#c9a84c",
  champLight:  "#fdf4dc",
  champMid:    "#f0d898",

  blush:       "#f5c5d0",
  blushDeep:   "#e8909f",
  cream:       "#fdf8f2",
  petal:       "#fdeef2",

  forest:      "#2d4a35",
  ink:         "#2c1a2e",
  inkMid:      "#4a3050",
  muted:       "#9a8a94",
  mutedLight:  "#c8bcc6",
  border:      "#f0e8eb",
  borderMid:   "#e8d8de",

  /* Gradients */
  heroGrad1:   "linear-gradient(135deg, #fff0e8 0%, #fde0e8 50%, #fdf0dc 100%)",
  heroGrad2:   "linear-gradient(135deg, #edf8f0 0%, #ddf0e8 50%, #eef6f4 100%)",
  heroGrad3:   "linear-gradient(135deg, #fdeef8 0%, #f0e8f8 50%, #fde8f0 100%)",
  ctaGrad:     "linear-gradient(135deg, #2d4a35 0%, #1e3328 50%, #2c1a2e 100%)",
  promoGrad:   "linear-gradient(90deg, #2c1a2e 0%, #4a2535 50%, #2d4a35 100%)",
  btnGrad:     "linear-gradient(135deg, #e8476a 0%, #c0344f 100%)",
  btnSageGrad: "linear-gradient(135deg, #5a8a6a 0%, #3d6b50 100%)",
  goldGrad:    "linear-gradient(135deg, #c9a84c 0%, #a8863a 100%)",
  accentLine:  "linear-gradient(90deg, #e8476a, #c9a84c, #5a8a6a)",
};

/* ─── DATA ───────────────────────────────────────────────── */
const CATEGORIES = [
  { key:"all",       label:"All Gifts",         icon:"✦" },
  { key:"customize", label:"Customize Gift",    icon:"🎨" },
  { key:"instant",   label:"Instant Delivery",  icon:"⚡" },
  { key:"jewellery", label:"Jewellery",          icon:"💎" },
];

const OCCASIONS = ["Birthday","Anniversary","Valentine's Day","Mother's Day","Wedding","Diwali","Just Because"];

const PRODUCTS = [
  { id:"c1", cat:"customize", name:"Build-Your-Own Gift Box",   sub:"Chocolates · Candles · Keepsakes · Card",      price:699,  was:999,  badge:"Most Popular",    badgeColor:"rose",    tag:"Bestseller", img:"https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", rating:4.8, reviews:312 },
  { id:"c2", cat:"customize", name:"Photo Memory Keepsake",     sub:"Photo Prints · Frame · Handwritten Note",       price:849,  was:1199, badge:"Personalised",    badgeColor:"purple",  tag:"New",        img:"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80", rating:4.9, reviews:187 },
  { id:"c3", cat:"customize", name:"Couple's Luxury Hamper",    sub:"Spa Set · Wine · Belgian Chocolates · Candle",  price:1299, was:1799, badge:"28% Off",         badgeColor:"champ",   tag:"Trending",   img:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80", rating:4.7, reviews:95 },
  { id:"c4", cat:"customize", name:"Birthday Surprise Kit",     sub:"Balloons · Cake Topper · Personalised Letter",  price:599,  was:799,  badge:null,              badgeColor:null,      tag:null,         img:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80", rating:4.6, reviews:224 },
  { id:"i1", cat:"instant",   name:"Chocolate Bouquet",         sub:"Ferrero · Lindt · Dairy Milk",                  price:499,  was:699,  badge:"⚡ 3 Hr Delivery", badgeColor:"orange",  tag:"Express",    img:"https://images.unsplash.com/photo-1526081347589-7151db8bbc49?w=600&q=80", rating:4.8, reviews:408 },
  { id:"i2", cat:"instant",   name:"Midnight Surprise Setup",   sub:"Balloons · Rose Petals · Fairy Lights",         price:799,  was:1099, badge:"⚡ 60 Min",        badgeColor:"orange",  tag:"Express",    img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", rating:4.7, reviews:156 },
  { id:"i3", cat:"instant",   name:"Digital Gift Card",         sub:"Any Amount · Any Occasion · Instant Send",      price:250,  was:null, badge:"⚡ Instant",       badgeColor:"orange",  tag:"Digital",    img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", rating:4.5, reviews:621 },
  { id:"i4", cat:"instant",   name:"Roses + Cake Combo",        sub:"Red Roses · 500g Custom Cake · Note",           price:899,  was:1199, badge:"⚡ 2 Hr Delivery", badgeColor:"orange",  tag:"Bestseller", img:"https://images.unsplash.com/photo-1558636508-e0969431e731?w=600&q=80", rating:4.9, reviews:289 },
  { id:"j1", cat:"jewellery", name:"Engraved Silver Bracelet",  sub:"Sterling Silver · Custom Engraving · Gift Box", price:1199, was:1599, badge:"Personalised",    badgeColor:"purple",  tag:"Trending",   img:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", rating:4.9, reviews:342 },
  { id:"j2", cat:"jewellery", name:"Rose Gold Pendant",         sub:"Rose Gold · Delicate Chain · Velvet Pouch",     price:1499, was:1999, badge:"25% Off",         badgeColor:"champ",   tag:"New",        img:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", rating:4.8, reviews:178 },
  { id:"j3", cat:"jewellery", name:"Birthstone Ring Set",       sub:"Adjustable · Birthstones · Set of Two",         price:1899, was:2499, badge:"Couple's Special", badgeColor:"rose",   tag:"Bestseller", img:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", rating:5.0, reviews:93 },
  { id:"j4", cat:"jewellery", name:"Gold-Plated Name Locket",   sub:"18K Gold Plated · Name Engraving · Gift Ready", price:999,  was:1299, badge:"Trending",        badgeColor:"sage",    tag:"Trending",   img:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", rating:4.7, reviews:265 },
];

const BADGE_MAP = {
  rose:   { bg:"#fce8ed", color:"#c0344f", border:"#f7b8c8" },
  purple: { bg:"#f3eeff", color:"#6d28d9", border:"#c4b5fd" },
  champ:  { bg:"#fdf4dc", color:"#92630a", border:"#f0d898" },
  orange: { bg:"#fff4e8", color:"#c05a10", border:"#fdd0a0" },
  sage:   { bg:"#eaf4ee", color:"#3d6b50", border:"#b2d4bc" },
};

const TAG_MAP = {
  Bestseller: { bg:"#eaf4ee", color:"#3d6b50" },
  New:        { bg:"#fce8ed", color:"#c0344f" },
  Trending:   { bg:"#fdf4dc", color:"#92630a" },
  Express:    { bg:"#fff4e8", color:"#c05a10" },
  Digital:    { bg:"#f3eeff", color:"#6d28d9" },
};

const JEWEL_CATS = [
  { name:"Earrings",  img:"https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80" },
  { name:"Necklaces", img:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
  { name:"Bracelets", img:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" },
  { name:"Rings",     img:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
  { name:"Pendants",  img:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80" },
  { name:"Gift Sets", img:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
];

const REVIEWS = [
  { name:"Priya S.", loc:"Mumbai",    stars:5, text:"The custom gift box was absolutely stunning — she cried happy tears. Everything was wrapped so beautifully. Will definitely order again!", avatar:"P", color:C.rose },
  { name:"Rahul M.", loc:"Bengaluru", stars:5, text:"Got the midnight surprise setup for our anniversary. The team was so professional and the room looked magical. 10/10!", avatar:"R", color:C.sage },
  { name:"Ananya K.", loc:"Delhi",    stars:5, text:"The rose gold pendant is exquisite — even better in person. Came in a gorgeous velvet pouch. My girlfriend was speechless!", avatar:"A", color:C.champagne },
];

const inr  = n => "₹" + n.toLocaleString("en-IN");
const disc = (p,w) => w ? Math.round((1-p/w)*100) : 0;

/* ─── STARS ────────────────────────────────────────────────── */
function Stars({ n, size=11 }) {
  return (
    <span style={{ display:"inline-flex", gap:1, fontSize:size, color:"#d4932c" }}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{ opacity:i<=n?1:i-n<1?0.5:0.25 }}>★</span>
      ))}
    </span>
  );
}

/* ─── PROMO TICKER ──────────────────────────────────────────── */
function PromoBanner() {
  const msgs = [
    "🌸 FREE gift wrapping on all orders above ₹999",
    "⚡ Same-day delivery in 100+ cities",
    "💎 18K gold plated jewellery — anti-tarnish guaranteed",
    "🌹 8L+ happy customers · Ships in 24 hours",
    "🎨 100% customizable gifts — your personal touch",
  ];
  const [i,setI] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%msgs.length),3200);return()=>clearInterval(t);},[]);
  return (
    <div style={{ background:C.promoGrad, color:"#fde8f0", fontSize:12.5, fontWeight:600, padding:"10px 0", textAlign:"center", letterSpacing:0.5 }}>
      <span key={i} style={{ display:"inline-block", animation:"ticker 0.45s ease" }}>{msgs[i]}</span>
    </div>
  );
}

/* ─── HERO CARD ─────────────────────────────────────────────── */
function HeroCard({ title, sub, cta, gradient, accentColor, btnGrad, emoji, onClick }) {
  const [hov,setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{ background:gradient, borderRadius:22, padding:"30px 26px 26px", cursor:"pointer", position:"relative", overflow:"hidden",
        border:`1.5px solid ${accentColor}30`,
        transition:"transform 0.22s,box-shadow 0.22s",
        transform:hov?"translateY(-5px)":"none",
        boxShadow:hov?`0 20px 52px ${accentColor}28`:`0 4px 18px ${accentColor}12` }}>
      <div style={{ fontSize:58, position:"absolute", right:16, top:10, opacity:0.22, lineHeight:1, filter:"saturate(0.7)" }}>{emoji}</div>
      <div style={{ width:36, height:2.5, background:btnGrad, borderRadius:2, marginBottom:12 }} />
      <h2 style={{ margin:"0 0 10px", fontSize:22, fontWeight:900, color:C.ink, lineHeight:1.2, whiteSpace:"pre-line" }}>{title}</h2>
      <p style={{ margin:"0 0 22px", fontSize:12.5, color:C.inkMid, lineHeight:1.65, opacity:0.85 }}>{sub}</p>
      <button onClick={e=>{e.stopPropagation();onClick();}}
        style={{ background:btnGrad, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:12.5, fontWeight:800, cursor:"pointer", letterSpacing:0.3, boxShadow:`0 4px 14px ${accentColor}40` }}>
        {cta} →
      </button>
    </div>
  );
}

/* ─── JEWELLERY STRIP ───────────────────────────────────────── */
function JewelleryCatStrip() {
  return (
    <div style={{ marginBottom:56 }}>
      {/* Section header on a textured band */}
      <div style={{ background:"linear-gradient(90deg,#eaf4ee,#fdf4dc,#fce8ed,#eaf4ee)", borderRadius:16, padding:"22px 28px", marginBottom:18, textAlign:"center", border:`1px solid ${C.borderMid}` }}>
        <p style={{ margin:"0 0 5px", fontSize:10.5, fontWeight:900, color:C.champagne, letterSpacing:3.5, textTransform:"uppercase" }}>Everyday Demifine</p>
        <h2 style={{ margin:"0 0 4px", fontSize:25, fontWeight:900, color:C.ink, letterSpacing:-0.5 }}>Shop Jewellery by Category</h2>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
          <div style={{ width:28, height:2, background:C.rose, borderRadius:2 }} />
          <div style={{ width:28, height:2, background:C.champagne, borderRadius:2 }} />
          <div style={{ width:28, height:2, background:C.sage, borderRadius:2 }} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:4, borderRadius:18, overflow:"hidden", boxShadow:`0 8px 32px ${C.rose}18` }}>
        {JEWEL_CATS.map((c,i)=>(
          <div key={i} style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.querySelector("img").style.transform="scale(1.1)";e.currentTarget.querySelector(".jov").style.opacity="1";}}
            onMouseLeave={e=>{e.currentTarget.querySelector("img").style.transform="scale(1)";e.currentTarget.querySelector(".jov").style.opacity="0";}}>
            <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.45s ease", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(44,26,46,0.78) 0%,rgba(44,26,46,0.1) 52%,transparent 100%)" }} />
            <div className="jov" style={{ position:"absolute", inset:0, background:`${C.rose}22`, opacity:0, transition:"opacity 0.3s" }} />
            <div style={{ position:"absolute", bottom:12, left:12, color:"#fff" }}>
              <div style={{ fontSize:11.5, fontWeight:900, letterSpacing:1.2, textTransform:"uppercase", textShadow:"0 1px 6px rgba(0,0,0,0.6)" }}>{c.name}</div>
              <div style={{ fontSize:12, color:C.champMid, marginTop:3, fontWeight:700 }}>Shop →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PRODUCT CARD ──────────────────────────────────────────── */
function ProductCard({ p, onAdd, inCart, onWishlist, wished }) {
  const [hov,setHov] = useState(false);
  const d = disc(p.price,p.was);
  const bs = p.badge ? BADGE_MAP[p.badgeColor] : null;
  const ts = p.tag  ? TAG_MAP[p.tag] : null;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?C.cardBgHov:C.cardBg, borderRadius:20, overflow:"hidden",
        border:hov?`1.5px solid ${C.roseMid}`:`1.5px solid ${C.border}`,
        boxShadow:hov?`0 20px 52px ${C.rose}14,0 4px 16px ${C.champagne}10`:`0 2px 12px rgba(44,26,46,0.06)`,
        transition:"all 0.26s", display:"flex", flexDirection:"column" }}>

      {/* Image zone */}
      <div style={{ position:"relative", overflow:"hidden", aspectRatio:"4/3" }}>
        <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.45s ease", transform:hov?"scale(1.07)":"scale(1)" }} />
        {/* warm overlay on hover */}
        <div style={{ position:"absolute", inset:0, background:hov?`${C.rose}08`:"transparent", transition:"0.3s" }} />

        {/* Wishlist */}
        <button onClick={()=>onWishlist(p.id)}
          style={{ position:"absolute", top:10, right:10, background:wished?C.roseLight:"rgba(255,252,250,0.92)", border:wished?`1px solid ${C.roseMid}`:"1px solid rgba(232,71,106,0.18)", borderRadius:"50%", width:34, height:34, fontSize:17, cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", color:wished?C.rose:C.blushDeep }}>
          {wished?"♥":"♡"}
        </button>

        {/* Badge */}
        {bs && (
          <div style={{ position:"absolute", top:10, left:10, fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20, letterSpacing:0.4, background:bs.bg, color:bs.color, border:`1px solid ${bs.border}` }}>
            {p.badge}
          </div>
        )}

        {/* Discount pill */}
        {d>0 && (
          <div style={{ position:"absolute", bottom:10, left:10, background:C.ctaGrad, color:C.champMid, fontSize:10.5, fontWeight:900, padding:"3px 10px", borderRadius:20, letterSpacing:0.3 }}>
            {d}% OFF
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding:"16px 16px 15px", flex:1, display:"flex", flexDirection:"column", gap:6, background: hov ? `linear-gradient(180deg,${C.cardBgHov},#fff8f2)` : "transparent" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Stars n={p.rating} />
            <span style={{ fontSize:11, color:C.mutedLight }}>({p.reviews})</span>
          </div>
          {ts && (
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, letterSpacing:0.4, background:ts.bg, color:ts.color }}>
              {p.tag}
            </span>
          )}
        </div>

        <h3 style={{ margin:0, fontSize:14.5, fontWeight:900, color:C.ink, lineHeight:1.3, letterSpacing:-0.3 }}>{p.name}</h3>
        <p style={{ margin:0, fontSize:11.5, color:C.muted, lineHeight:1.55 }}>{p.sub}</p>

        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:4 }}>
          <span style={{ fontSize:18, fontWeight:900, color:C.ink }}>{inr(p.price)}</span>
          {p.was && <span style={{ fontSize:12, color:C.mutedLight, textDecoration:"line-through" }}>{inr(p.was)}</span>}
          {d>0 && <span style={{ fontSize:11, fontWeight:800, color:C.sage }}>({d}% off)</span>}
        </div>

        <button onClick={()=>onAdd(p)}
          style={{ marginTop:8, background:inCart?C.sageLight:C.btnGrad, color:inCart?C.sageDark:"#fff",
            border:inCart?`1.5px solid ${C.sageMid}`:"none", borderRadius:11, padding:"11px",
            fontSize:12.5, fontWeight:900, cursor:"pointer", letterSpacing:0.3, transition:"opacity 0.18s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            boxShadow:inCart?"none":`0 4px 16px ${C.rose}35` }}>
          {inCart ? `✓ Added to Bag` : "Add to Gift Bag"}
        </button>
      </div>
    </div>
  );
}

/* ─── REVIEWS ───────────────────────────────────────────────── */
function ReviewsSection() {
  return (
    <div style={{ background:"linear-gradient(135deg,#fdf0f5,#fdf8f0,#f0f8f4)", borderRadius:24, padding:"46px 36px 42px", marginBottom:56, border:`1.5px solid ${C.borderMid}`, position:"relative", overflow:"hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:`${C.rose}12`, borderRadius:"50%", filter:"blur(40px)" }} />
      <div style={{ position:"absolute", bottom:-30, left:-30, width:140, height:140, background:`${C.sage}12`, borderRadius:"50%", filter:"blur(35px)" }} />

      <div style={{ textAlign:"center", marginBottom:34, position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:4, marginBottom:10 }}>
          {[1,2,3,4,5].map(i=><span key={i} style={{ fontSize:20, color:C.champagne }}>★</span>)}
        </div>
        <p style={{ margin:"0 0 6px", fontSize:10.5, fontWeight:900, color:C.champagne, textTransform:"uppercase", letterSpacing:3.5 }}>That's What They Said</p>
        <h2 style={{ margin:0, fontSize:28, fontWeight:900, color:C.ink, letterSpacing:-0.6 }}>Over 8 Lakh Happy Customers</h2>
        <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:10 }}>
          <div style={{ width:24, height:2.5, background:C.rose, borderRadius:2 }} />
          <div style={{ width:24, height:2.5, background:C.champagne, borderRadius:2 }} />
          <div style={{ width:24, height:2.5, background:C.sage, borderRadius:2 }} />
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18, position:"relative" }}>
        {REVIEWS.map((r,i)=>(
          <div key={i} style={{ background:"rgba(255,252,250,0.9)", borderRadius:18, padding:"24px 22px", border:`1px solid ${C.border}`, boxShadow:`0 4px 20px rgba(44,26,46,0.06)`, backdropFilter:"blur(4px)" }}>
            <Stars n={r.stars} size={14} />
            <p style={{ margin:"14px 0 18px", fontSize:13.5, color:C.inkMid, lineHeight:1.78, fontStyle:"italic" }}>"{r.text}"</p>
            <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${r.color},${r.color}99)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:15, flexShrink:0, boxShadow:`0 3px 10px ${r.color}50` }}>{r.avatar}</div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:900, color:C.ink }}>{r.name}</div>
                <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{r.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CART DRAWER ───────────────────────────────────────────── */
function CartDrawer({ cart, onClose, onRemove }) {
  const total = cart.reduce((s,i)=>s+i.price,0);
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(44,26,46,0.52)", zIndex:998 }} />
      <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:375, background:C.drawerBg, zIndex:999, display:"flex", flexDirection:"column", borderRadius:"22px 0 0 22px", boxShadow:"-14px 0 64px rgba(44,26,46,0.18)", borderLeft:`3px solid ${C.roseLight}` }}>

        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:`linear-gradient(135deg,${C.petal},${C.cream})` }}>
          <div>
            <h2 style={{ margin:0, fontSize:19, fontWeight:900, color:C.ink }}>🛍️ Your Gift Bag</h2>
            <p style={{ margin:"3px 0 0", fontSize:12, color:C.muted }}>{cart.length} item{cart.length!==1?"s":""}</p>
          </div>
          <button onClick={onClose} style={{ background:C.roseLight, border:`1px solid ${C.roseMid}`, borderRadius:"50%", width:36, height:36, fontSize:20, cursor:"pointer", color:C.rose, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:400 }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {cart.length===0
            ? <div style={{ textAlign:"center", marginTop:64 }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🌸</div>
                <p style={{ color:C.muted, fontSize:14.5, fontWeight:600 }}>Your bag is empty</p>
                <p style={{ color:C.mutedLight, fontSize:12.5 }}>Add something beautiful for someone special</p>
              </div>
            : cart.map((item,idx)=>(
                <div key={idx} style={{ display:"flex", gap:12, padding:"13px 0", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
                  <img src={item.img} alt={item.name} style={{ width:58, height:58, borderRadius:12, objectFit:"cover", flexShrink:0, border:`1.5px solid ${C.border}` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:800, color:C.ink, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                    <div style={{ fontSize:12.5, color:C.rose, fontWeight:800, marginTop:3 }}>{inr(item.price)}</div>
                  </div>
                  <button onClick={()=>onRemove(idx)} style={{ background:C.roseLight, color:C.rose, border:`1px solid ${C.roseMid}`, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, cursor:"pointer", flexShrink:0 }}>✕</button>
                </div>
              ))
          }
        </div>

        {/* Footer */}
        {cart.length>0 && (
          <div style={{ padding:"18px 24px 28px", borderTop:`1px solid ${C.border}`, background:`linear-gradient(180deg,${C.cream},${C.petal}18)` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13.5, color:C.muted }}>Subtotal ({cart.length} items)</span>
              <span style={{ fontSize:20, fontWeight:900, color:C.ink }}>{inr(total)}</span>
            </div>
            <p style={{ fontSize:11.5, color:C.muted, margin:"0 0 16px", textAlign:"center" }}>🌸 Free gift wrapping included on all orders</p>
            <a href="/cart" style={{ display:"block", width:"100%", background:C.btnGrad, color:"#fff", border:"none", borderRadius:13, padding:"15px", fontSize:14.5, fontWeight:900, cursor:"pointer", letterSpacing:0.3, boxShadow:`0 6px 22px ${C.rose}40`, textAlign:"center", textDecoration:"none" }}>
              Proceed to Checkout →
            </a>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function GiftSection() {
  const { addToCart, cartItems } = useCartContext();
  const { wishlist: globalWishlist, toggle: toggleWishlistGlobal } = useWishlist();
  const [cat,setCat]         = useState("all");
  const [occasion,setOccasion] = useState(null);
  const [search,setSearch]   = useState("");
  const [sortBy,setSortBy]   = useState("default");
  const [cart,setCart]       = useState([]);
  const [cartOpen,setCartOpen] = useState(false);

  const inWishlist = (id) => globalWishlist.some(w => w._id === id);

  const products = PRODUCTS.filter(p=>{
    if(cat!=="all" && p.cat!==cat) return false;
    if(search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sub.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>{
    if(sortBy==="price_asc") return a.price-b.price;
    if(sortBy==="price_desc") return b.price-a.price;
    if(sortBy==="rating") return b.rating-a.rating;
    return 0;
  });

  const addCart = item => {
    addToCart({ _id: item.id, name: item.name, pricePerStem: item.price, image: item.img, category: item.cat, color: '', city: '' });
    setCart(p => p.some(c => c.id === item.id) ? p : [...p, item]);
  };
  const remCart = idx => setCart(p => p.filter((_,i) => i !== idx));
  const toggleWish = id => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) toggleWishlistGlobal({ _id: product.id, name: product.name, price: product.price, image: product.img, category: product.cat });
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif", background:C.pageBg, minHeight:"100vh" }}>
      <style>{`
        @keyframes ticker{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── Promo Strip ── */}
      <PromoBanner />

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"42px 22px 80px" }}>

        {/* ── Page Header ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:44, flexWrap:"wrap", gap:18 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:32, height:2.5, background:C.accentLine, borderRadius:2 }} />
              <p style={{ margin:0, fontSize:10.5, fontWeight:900, color:C.rose, letterSpacing:3.5, textTransform:"uppercase" }}>BouquetBuilder Gift Store</p>
            </div>
            <h1 style={{ margin:"0 0 12px", fontSize:42, fontWeight:900, color:C.ink, lineHeight:1.08, letterSpacing:-1.5 }}>
              Send a Gift<br />
              <span style={{ background:`linear-gradient(90deg,${C.rose},${C.champagne},${C.sage})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                They'll Never Forget
              </span>
            </h1>
            <p style={{ margin:0, color:C.muted, fontSize:14.5, maxWidth:460, lineHeight:1.7 }}>
              Instant delivery · Premium jewellery · Fully customizable<br />Every gift curated with love 🌸
            </p>
          </div>

          <button onClick={()=>setCartOpen(true)}
            style={{ background:C.btnGrad, color:"#fff", border:"none", borderRadius:15, padding:"13px 26px", fontSize:13.5, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", gap:10, letterSpacing:0.3, flexShrink:0, boxShadow:`0 6px 24px ${C.rose}40` }}>
            🛍️ Gift Bag
            {cart.length>0 && (
              <span style={{ background:"#fff", color:C.rose, borderRadius:"50%", minWidth:22, height:22, fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>{cart.length}</span>
            )}
          </button>
        </div>

        {/* ── Hero Banners ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18, marginBottom:48 }}>
          <HeroCard title={"Birthday Joy,\nGift-Wrapped"} sub="Curated blooms, cakes & keepsakes for thoughtful celebrations" cta="Shop Birthday" gradient={C.heroGrad1} accentColor={C.champagne} btnGrad={C.goldGrad} emoji="🎂" onClick={()=>setCat("customize")} />
          <HeroCard title={"Jewellery She'll\nTreasure Forever"} sub="18K gold plated · Personalised engraving · Gift-ready packaging" cta="Explore Jewellery" gradient={C.heroGrad2} accentColor={C.sage} btnGrad={C.btnSageGrad} emoji="💍" onClick={()=>setCat("jewellery")} />
          <HeroCard title={"Need It Fast?\nInstant Gifts"} sub="Same-day & express delivery across 100+ cities" cta="Order Now" gradient={C.heroGrad3} accentColor={C.rose} btnGrad={C.btnGrad} emoji="⚡" onClick={()=>setCat("instant")} />
        </div>

        {/* ── Jewellery Strip ── */}
        <JewelleryCatStrip />

        {/* ── Occasion Pills ── */}
        <div style={{ marginBottom:32 }}>
          <p style={{ margin:"0 0 12px", fontSize:10.5, fontWeight:900, color:C.champagne, textTransform:"uppercase", letterSpacing:3 }}>🌺 Shop By Occasion</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {OCCASIONS.map(o=>(
              <button key={o} onClick={()=>setOccasion(occasion===o?null:o)}
                style={{ padding:"8px 18px", borderRadius:40,
                  border:occasion===o?`2px solid ${C.rose}`:`1.5px solid ${C.borderMid}`,
                  background:occasion===o?C.roseLight:"rgba(255,252,250,0.85)",
                  color:occasion===o?C.roseDark:C.inkMid,
                  fontSize:12.5, fontWeight:700, cursor:"pointer", transition:"all 0.2s", letterSpacing:0.2,
                  boxShadow:occasion===o?`0 2px 12px ${C.rose}25`:"none" }}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category + Search Bar ── */}
        <div style={{ background:"rgba(255,252,250,0.8)", backdropFilter:"blur(10px)", borderRadius:18, padding:"16px 20px", marginBottom:28, border:`1.5px solid ${C.borderMid}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, boxShadow:`0 4px 20px rgba(232,71,106,0.06)` }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {CATEGORIES.map(c=>(
              <button key={c.key} onClick={()=>setCat(c.key)}
                style={{ padding:"8px 18px", borderRadius:40,
                  border:cat===c.key?`2px solid ${C.rose}`:`1.5px solid ${C.borderMid}`,
                  background:cat===c.key?C.roseLight:"transparent",
                  color:cat===c.key?C.roseDark:C.inkMid,
                  fontSize:12.5, fontWeight:800, cursor:"pointer", transition:"all 0.2s",
                  boxShadow:cat===c.key?`0 3px 12px ${C.rose}25`:"none" }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", background:C.cream, border:`1.5px solid ${C.borderMid}`, borderRadius:12, padding:"9px 14px", gap:8 }}>
              <span style={{ fontSize:14, color:C.muted }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gifts…"
                style={{ border:"none", outline:"none", fontSize:13, color:C.ink, background:"transparent", width:148 }} />
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
              style={{ padding:"10px 14px", borderRadius:12, border:`1.5px solid ${C.borderMid}`, background:C.cream, fontSize:12.5, color:C.inkMid, fontWeight:700, cursor:"pointer", outline:"none" }}>
              <option value="default">Featured</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <p style={{ margin:"0 0 24px", fontSize:12.5, color:C.muted }}>
          Showing <strong style={{ color:C.ink }}>{products.length}</strong> gift{products.length!==1?"s":""}
          {cat!=="all" && <> in <strong style={{ color:C.rose }}>{CATEGORIES.find(c=>c.key===cat)?.label}</strong></>}
        </p>

        {/* ── Product Grid ── */}
        {products.length===0
          ? <div style={{ textAlign:"center", padding:"64px 20px", color:C.muted }}>
              <div style={{ fontSize:46, marginBottom:14 }}>🔍</div>
              <p style={{ fontSize:15 }}>No gifts found — try a different search</p>
            </div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(252px,1fr))", gap:20, marginBottom:56 }}>
              {products.map(p=>(
                <ProductCard key={p.id} p={p} onAdd={addCart} inCart={cart.some(c=>c.id===p.id)} onWishlist={toggleWish} wished={inWishlist(p.id)} />
              ))}
            </div>
        }

        {/* ── Reviews ── */}
        <ReviewsSection />

        {/* ── CTA Banner ── */}
        <div style={{ background:C.ctaGrad, borderRadius:26, padding:"44px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24, position:"relative", overflow:"hidden" }}>
          {/* decorative blobs */}
          <div style={{ position:"absolute", top:-60, right:80, width:220, height:220, background:`${C.rose}18`, borderRadius:"50%", filter:"blur(50px)" }} />
          <div style={{ position:"absolute", bottom:-40, left:40, width:160, height:160, background:`${C.champagne}15`, borderRadius:"50%", filter:"blur(40px)" }} />

          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", gap:5, marginBottom:10 }}>
              <div style={{ width:20, height:2.5, background:C.rose, borderRadius:2 }} />
              <div style={{ width:20, height:2.5, background:C.champagne, borderRadius:2 }} />
            </div>
            <h3 style={{ margin:"0 0 10px", fontSize:30, fontWeight:900, color:"#fff", lineHeight:1.18, letterSpacing:-0.7 }}>Request a Fully Custom Gift</h3>
            <p style={{ margin:0, color:"rgba(253,240,245,0.7)", fontSize:14, maxWidth:440, lineHeight:1.7 }}>
              Share the occasion, your budget & what they love — our team handcrafts the perfect surprise, just for them 🌸
            </p>
          </div>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap", position:"relative" }}>
            <button style={{ background:C.btnGrad, color:"#fff", border:"none", borderRadius:13, padding:"14px 30px", fontSize:14, fontWeight:900, cursor:"pointer", letterSpacing:0.3, whiteSpace:"nowrap", boxShadow:`0 8px 28px ${C.rose}55` }}>
              Request Custom Gift ✨
            </button>
            <button style={{ background:"rgba(255,240,245,0.1)", color:"#fde8f0", border:`1.5px solid rgba(253,200,215,0.35)`, borderRadius:13, padding:"14px 22px", fontSize:13.5, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", backdropFilter:"blur(4px)" }}>
              Chat with Us 💬
            </button>
          </div>
        </div>

      </div>

      {cartOpen && <CartDrawer cart={cart} onClose={()=>setCartOpen(false)} onRemove={remCart} />}
    </div>
  );
}
