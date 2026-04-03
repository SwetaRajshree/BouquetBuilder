import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Outfit',sans-serif;background:#0a0a0f;color:#fff;overflow-x:hidden}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-track{background:#111}
    ::-webkit-scrollbar-thumb{background:#f59e0b;border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-12px)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.3)}50%{box-shadow:0 0 40px rgba(245,158,11,0.6)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes countUp{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
    @keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}
    @keyframes toastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .btn-glow:hover{animation:glow 1.5s infinite}
    .float-anim{animation:float 3s ease-in-out infinite}
    .fade-up{animation:fadeUp 0.6s ease both}
    .product-card:hover .card-img img{transform:scale(1.08)}
    .nav-link{position:relative}
    .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#f59e0b;transition:width .3s}
    .nav-link:hover::after{width:100%}
    input:focus,select:focus,textarea:focus{outline:none;border-color:#f59e0b!important;box-shadow:0 0 0 3px rgba(245,158,11,0.15)!important}
    .img-fade{transition:opacity 0.4s ease}
  `}</style>
);

/* ═══════════════════════════════════════════
   PRODUCT IMAGE MAPPING (Unsplash)
═══════════════════════════════════════════ */
const PRODUCT_IMAGES = {
  1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  2: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=80",
  3: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
  4: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
  5: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=400&q=80",
  6: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
  7: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
  8: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
  9: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
  10: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  11: "https://images.unsplash.com/photo-1630948629488-d9e91d8fa96d?w=400&q=80",
  12: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=400&q=80",
};

const CATEGORY_IMAGES = {
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
  "Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
  "Jewellery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80",
  "Gifts": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80",
  "Stationery": "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=300&q=80",
  "Paintings": "https://images.unsplash.com/photo-1578926288207-a90a103d44f6?w=300&q=80",
};

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const HERO_SLIDES = [
  {bg:"linear-gradient(135deg,#1a0533 0%,#3b0764 50%,#1e1b4b 100%)",accent:"#a855f7",title:"Handcrafted With",highlight:"Love & Soul",sub:"Discover 10,000+ authentic artisan products from across India",btn:"Explore Collections",emoji:"🎨"},
  {bg:"linear-gradient(135deg,#1c0a00 0%,#7c2d12 50%,#1e1b4b 100%)",accent:"#f59e0b",title:"From Indian",highlight:"Artisan Hands",sub:"Support local craftsmen. Every purchase tells a story.",btn:"Shop Handmade",emoji:"🪡"},
  {bg:"linear-gradient(135deg,#022c22 0%,#14532d 50%,#0f172a 100%)",accent:"#10b981",title:"Sell Your",highlight:"Masterpiece",sub:"Join 500+ sellers and turn your passion into income",btn:"Start Selling",emoji:"💎"},
];

const CATS = [
  {name:"Home & Living",icon:"🏡",color:"#f59e0b",count:2840},
  {name:"Fashion",icon:"👗",color:"#ec4899",count:1920},
  {name:"Jewellery",icon:"💎",color:"#8b5cf6",count:3100},
  {name:"Gifts",icon:"🎁",color:"#ef4444",count:1450},
  {name:"Stationery",icon:"✏️",color:"#10b981",count:890},
  {name:"Paintings",icon:"🎨",color:"#3b82f6",count:2200},
];

const PRODUCTS = [
  {id:1,name:"Darjeeling 3D Clay Fridge Magnet",shop:"Sahera's Handmade",price:249,original:415,cat:"Home & Living",rating:4.8,reviews:124,customizable:false,desc:"Handcrafted 3D clay magnet depicting the scenic Darjeeling landscape with the famous toy train. Each piece is individually handmade and painted with food-safe, non-toxic colours.",material:"Air-dry clay, acrylic paint",dimensions:"6×4 cm",deliveryDays:5},
  {id:2,name:"Pichwai Inspired Wall Décor Plate",shop:"Sahera's Handmade",price:449,original:748,cat:"Home & Living",rating:4.9,reviews:89,customizable:false,desc:"Stunning hand-painted Pichwai inspired decorative wall plate, perfect for home décor. The intricate lotus and cow motifs are a hallmark of this ancient Indian art form.",material:"Ceramic, natural pigments",dimensions:"30 cm diameter",deliveryDays:7},
  {id:3,name:"Miniature Food Fridge Magnet Set",shop:"Sahera's Handmade",price:199,original:332,cat:"Gifts",rating:4.7,reviews:203,customizable:false,desc:"Adorable miniature food fridge magnets, a perfect gifting option for food lovers. Set includes 6 pieces — pizza, sushi, burger, taco, ramen & dumpling.",material:"Polymer clay",dimensions:"3-4 cm each",deliveryDays:4},
  {id:4,name:"Bengali Bridal Gachkouto",shop:"Jayati's Art Gallery",price:899,original:1499,cat:"Jewellery",rating:5.0,reviews:56,customizable:true,desc:"Traditional Bengali bridal accessory, beautifully handcrafted with intricate details. Made with gold-finish base metal, glass beads, and hand-sewn cloth.",material:"Metal alloy, glass beads, fabric",dimensions:"One size fits all",deliveryDays:10},
  {id:5,name:"Madhubani Painting — Krishna",shop:"Art by Priya",price:1299,original:2165,cat:"Paintings",rating:4.9,reviews:78,customizable:false,desc:"Authentic Madhubani painting depicting Lord Krishna in vibrant traditional colors. Created using natural pigments and bamboo pens on handmade paper.",material:"Natural pigments on handmade paper",dimensions:"30×40 cm",deliveryDays:6},
  {id:6,name:"Macramé Dream Catcher",shop:"Craft Studio",price:349,original:582,cat:"Home & Living",rating:4.6,reviews:167,customizable:true,desc:"Handwoven macramé dream catcher with colourful feathers and beads. Perfect for bohemian and Scandi-inspired interiors.",material:"Cotton rope, feathers, beads",dimensions:"35 cm diameter",deliveryDays:5},
  {id:7,name:"Terracotta Jewellery Set",shop:"Mitti Arts",price:599,original:998,cat:"Jewellery",rating:4.8,reviews:91,customizable:false,desc:"Beautiful terracotta jewellery set with traditional motifs painted by hand. Includes earrings, necklace and a bracelet.",material:"Terracotta clay, acrylic",dimensions:"Earrings 4cm, Necklace 40cm",deliveryDays:5},
  {id:8,name:"Hand-Painted Tote Bag",shop:"Canvas Creations",price:479,original:799,cat:"Fashion",rating:4.7,reviews:145,customizable:true,desc:"Cotton tote bag with a unique hand-painted Van Gogh-inspired design. 100% cotton, machine washable.",material:"100% cotton canvas, fabric paint",dimensions:"38×42 cm",deliveryDays:4},
  {id:9,name:"Resin Coaster Set of 4",shop:"Resin Art Hub",price:649,original:1082,cat:"Home & Living",rating:4.9,reviews:212,customizable:true,desc:"Gorgeous resin art coasters with embedded dried flowers and gold flakes. Heat-resistant up to 120°C.",material:"Epoxy resin, dried flowers, gold foil",dimensions:"10 cm diameter each",deliveryDays:7},
  {id:10,name:"Personalized Name Neon Light",shop:"Glow Crafts",price:1499,original:2499,cat:"Gifts",rating:4.8,reviews:67,customizable:true,desc:"Custom LED neon sign for your name or message. Perfect for home décor, cafes, and events.",material:"LED strip, acrylic backing",dimensions:"As per name length",deliveryDays:14},
  {id:11,name:"Handmade Clay Earrings",shop:"Claymate Studio",price:299,original:499,cat:"Jewellery",rating:4.6,reviews:188,customizable:false,desc:"Lightweight clay earrings with hand-painted floral designs. Hypoallergenic steel hooks.",material:"Air-dry clay, steel hooks",dimensions:"3×2 cm each",deliveryDays:4},
  {id:12,name:"Madhubani Saree",shop:"Weave Story",price:2499,original:4165,cat:"Fashion",rating:5.0,reviews:43,customizable:false,desc:"Pure cotton saree with authentic Madhubani hand-painted art by skilled artisans from Mithila.",material:"Pure cotton, natural pigments",dimensions:"5.5 metres",deliveryDays:8},
];

const SUB_CATS = {
  "Home & Living":["Woodcrafts","Vases","Decorative Bottles","Candles","Metal Products","Kitchen Accessories","Wall Decor","Dream Catcher","Table Mat & Cover","Furniture","Coaster","Tealight","Table Decor","Plants & Planters","Lampshade","Wall Clock","Nameplates","Pooja Articles"],
  "Fashion":["T-shirt","Kurta","Ladies Side Bag","Ladies Purse","Saree","Dupattas For Women","Shoes","Tops"],
  "Jewellery":["Clay Jewellery","Jute Jewellery","Fabric Jewellery","Handmade Earrings","Bamboo Jewellery","Hand Accessories","Hair Accessories","Crochet Jewellery","Jewellery Box","Embroidery Jewellery","Resin Jewellery","Junk Jewellery"],
  "Gifts":["Photo Frames","Coffee Mug","Wall Clock","Keyring","Cushion","Wrist Watch","Calendar","Lamps","Explosion Boxes","Neon Light","Gift Combo","Gift for Him"],
  "Paintings":["Sketch","Glass Paintings","Acrylic","Oil Painting","Water Colour","Digital Painting","Mixed Media","M-seal Work","Madhubani Painting"],
  "Stationery":["Notebooks","Gift Cards","Bookmarks","Pens & Pencils","Art Kits","Planners"],
};

const MOCK_ORDERS = [
  {id:"CB-2024-001",date:"15 Mar 2024",items:[{...PRODUCTS[0],qty:2},{...PRODUCTS[4],qty:1}],status:"Delivered",total:1797},
  {id:"CB-2024-002",date:"28 Feb 2024",items:[{...PRODUCTS[7],qty:1}],status:"Shipped",total:479},
  {id:"CB-2024-003",date:"10 Feb 2024",items:[{...PRODUCTS[11],qty:1},{...PRODUCTS[3],qty:1}],status:"Delivered",total:3398},
];

/* ═══════════════════════════════════════════
   PRODUCT IMAGE COMPONENT
═══════════════════════════════════════════ */
function ProductImage({id, size="100%", height=200, radius=0, fallbackEmoji="🎨"}){
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const src = PRODUCT_IMAGES[id];
  if(!src || err) return (
    <div style={{width:size,height,display:"flex",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(135deg,#1a1025,#1e1b4b)",borderRadius:radius,fontSize:Math.min(height*0.4,72)}}>
      {fallbackEmoji}
    </div>
  );
  return (
    <div style={{width:size,height,overflow:"hidden",borderRadius:radius,position:"relative",background:"#1a1025"}}>
      {!loaded && <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,#1a1025 25%,#2a1a35 50%,#1a1025 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>}
      <img src={src} alt="" onLoad={()=>setLoaded(true)} onError={()=>setErr(true)}
        style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.4s",display:"block"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════ */
function Toast({toasts,remove}){
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:10}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background:t.type==="success"?"#065f46":t.type==="error"?"#7f1d1d":"#1e1b4b",
          border:`1px solid ${t.type==="success"?"#10b981":t.type==="error"?"#ef4444":"#f59e0b"}`,
          color:"#fff",padding:"12px 20px",borderRadius:12,fontSize:14,fontWeight:600,
          display:"flex",alignItems:"center",gap:10,minWidth:260,maxWidth:340,
          animation:"toastIn 0.4s ease both",cursor:"pointer",
          boxShadow:"0 8px 30px rgba(0,0,0,0.5)"
        }} onClick={()=>remove(t.id)}>
          <span style={{fontSize:18}}>{t.type==="success"?"✅":t.type==="error"?"❌":"ℹ️"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function useToast(){
  const [toasts,setToasts]=useState([]);
  const add=useCallback((msg,type="success")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);
  },[]);
  const remove=useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  return{toasts,add,remove};
}

/* ═══════════════════════════════════════════
   STAR RATING
═══════════════════════════════════════════ */
function Stars({rating,size=14,interactive=false,onRate}){
  const [hovered,setHovered]=useState(0);
  return(
    <span style={{display:"inline-flex",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i}
          style={{fontSize:size,color:i<=(interactive?hovered||rating:rating)?"#f59e0b":"#374151",cursor:interactive?"pointer":"default",transition:"color .15s"}}
          onMouseEnter={()=>interactive&&setHovered(i)}
          onMouseLeave={()=>interactive&&setHovered(0)}
          onClick={()=>interactive&&onRate&&onRate(i)}>
          {i<=(interactive?hovered||rating:Math.floor(rating))?"★":i-0.5<=rating?"⯨":"☆"}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════ */
function Counter({end,suffix="",prefix=""}){
  const [val,setVal]=useState(0);
  const ref=useRef();
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        let start=0;
        const step=end/60;
        const t=setInterval(()=>{
          start=Math.min(start+step,end);
          setVal(Math.floor(start));
          if(start>=end)clearInterval(t);
        },16);
      }
    },{threshold:.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[end]);
  return<span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   HERO SLIDER
═══════════════════════════════════════════ */
function HeroSlider({setPage}){
  const [cur,setCur]=useState(0);
  const [transitioning,setTransitioning]=useState(false);
  const timerRef=useRef();

  const go=useCallback((n)=>{
    if(transitioning)return;
    setTransitioning(true);
    setTimeout(()=>{setCur(n);setTransitioning(false);},400);
  },[transitioning]);

  useEffect(()=>{
    timerRef.current=setInterval(()=>setCur(c=>(c+1)%HERO_SLIDES.length),5000);
    return()=>clearInterval(timerRef.current);
  },[]);

  const s=HERO_SLIDES[cur];

  return(
    <div style={{position:"relative",height:"92vh",minHeight:560,overflow:"hidden",background:s.bg,transition:"background 0.8s ease"}}>
      {[0,1,2,3,4].map(i=>(
        <div key={i} style={{
          position:"absolute",
          width:[400,300,250,350,200][i],height:[400,300,250,350,200][i],
          borderRadius:"50%",
          background:`radial-gradient(circle, ${s.accent}22 0%, transparent 70%)`,
          top:["-15%","60%","20%","-10%","70%"][i]+"%",
          left:["-10%","65%","80%","45%","-8%"][i]+"%",
          animation:`float ${[6,8,7,9,5][i]}s ease-in-out infinite`,
          animationDelay:`${i*0.8}s`,pointerEvents:"none"
        }}/>
      ))}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`,backgroundSize:"60px 60px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:"0 20px",opacity:transitioning?0:1,transform:transitioning?"translateY(20px)":"translateY(0)",transition:"all 0.4s ease"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(10px)",border:`1px solid ${s.accent}44`,padding:"8px 20px",borderRadius:40,fontSize:13,color:s.accent,fontWeight:600,marginBottom:28,animation:"fadeUp 0.6s ease both"}}>
          <span style={{animation:"bounce 1s infinite"}}>{s.emoji}</span>ArtisanWorld — India's Artisan Marketplace
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:1.1,marginBottom:16,animation:"fadeUp 0.6s 0.1s ease both",opacity:0,animationFillMode:"both"}}>
          <span style={{color:"rgba(255,255,255,0.9)"}}>{s.title} </span>
          <span style={{background:`linear-gradient(135deg,${s.accent},#fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{s.highlight}</span>
        </h1>
        <p style={{fontSize:"clamp(1rem,2vw,1.25rem)",color:"rgba(255,255,255,0.65)",maxWidth:560,lineHeight:1.7,marginBottom:40,animation:"fadeUp 0.6s 0.2s ease both",opacity:0,animationFillMode:"both"}}>{s.sub}</p>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp 0.6s 0.3s ease both",opacity:0,animationFillMode:"both"}}>
          <button onClick={()=>setPage("shop")} style={{padding:"16px 36px",borderRadius:50,border:"none",background:`linear-gradient(135deg,${s.accent},${s.accent}99)`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",boxShadow:`0 8px 30px ${s.accent}44`,letterSpacing:.3}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.03)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";}}>{s.btn} →</button>
          <button onClick={()=>setPage("seller")} style={{padding:"16px 36px",borderRadius:50,border:"1.5px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(10px)",color:"rgba(255,255,255,0.9)",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.12)";e.currentTarget.style.transform="translateY(-3px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)";}}>Become a Seller</button>
        </div>
        <div style={{display:"flex",gap:40,marginTop:60,animation:"fadeUp 0.6s 0.4s ease both",opacity:0,animationFillMode:"both"}}>
          {[["10K+","Products"],["500+","Artisans"],["50K+","Happy Buyers"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"1.6rem",fontWeight:800,fontFamily:"'Syne',sans-serif",color:s.accent}}>{n}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {[["←",(cur-1+HERO_SLIDES.length)%HERO_SLIDES.length,"20px","auto"],["→",(cur+1)%HERO_SLIDES.length,"auto","20px"]].map(([arrow,idx,l,r])=>(
        <button key={arrow} onClick={()=>go(idx)} style={{position:"absolute",top:"50%",left:l,right:r,transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.2)";e.currentTarget.style.transform="translateY(-50%) scale(1.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.transform="translateY(-50%) scale(1)";}}>{arrow}</button>
      ))}
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
        {HERO_SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>go(i)} style={{width:i===cur?32:8,height:8,borderRadius:4,border:"none",background:i===cur?s.accent:"rgba(255,255,255,0.3)",cursor:"pointer",transition:"all .3s",padding:0}}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRUST BAR
═══════════════════════════════════════════ */
function TrustBar(){
  const items=[{icon:"🔐",label:"Secure Payments"},{icon:"✦",label:"Authentic Products"},{icon:"🚀",label:"Free & Fast Delivery"},{icon:"↩️",label:"Easy Returns"}];
  return(
    <div style={{background:"#111117",borderBottom:"1px solid #1e1e2e"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
        {items.map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"16px 20px",background:i===1?"linear-gradient(135deg,#f59e0b,#d97706)":"transparent",borderRight:i<3?"1px solid #1e1e2e":"none"}}>
            <span style={{fontSize:18}}>{item.icon}</span>
            <span style={{fontWeight:600,fontSize:13,color:i===1?"#1a0a00":"rgba(255,255,255,0.7)"}}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════ */
function ProductCard({product,onAddToCart,onToggleWish,wished,toast,onOpenDetail}){
  const [adding,setAdding]=useState(false);
  const disc=Math.round((1-product.price/product.original)*100);

  const handleAdd=(e)=>{
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    toast(`"${product.name.slice(0,30)}..." added to cart!`,"success");
    setTimeout(()=>setAdding(false),1200);
  };

  return(
    <div className="product-card" onClick={()=>onOpenDetail&&onOpenDetail(product)} style={{background:"#111117",borderRadius:20,overflow:"hidden",border:"1px solid #1e1e2e",transition:"all .3s",cursor:"pointer",position:"relative"}}
    onMouseEnter={e=>{e.currentTarget.style.borderColor="#f59e0b44";e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 24px 60px rgba(0,0,0,0.5)";}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
      <div className="card-img" style={{height:200,position:"relative",overflow:"hidden"}}>
        <ProductImage id={product.id} height={200}/>
        <span style={{position:"absolute",top:12,left:12,background:"#ef4444",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20}}>{disc}% OFF</span>
        {product.customizable&&(<span style={{position:"absolute",top:12,right:44,background:"#7c3aed",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 8px",borderRadius:6}}>✦ CUSTOM</span>)}
        <button onClick={e=>{e.stopPropagation();onToggleWish(product.id);}} style={{position:"absolute",top:8,right:8,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",animation:wished?"heartbeat 0.6s ease":"none",transition:"transform .2s"}}>
          {wished?"❤️":"🤍"}
        </button>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:4,letterSpacing:.5}}>{product.shop}</div>
        <div style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.9)",marginBottom:8,lineHeight:1.4,minHeight:38}}>{product.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
          <Stars rating={product.rating} size={12}/><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>({product.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{fontWeight:800,fontSize:18,color:"#fff"}}>₹{product.price}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>₹{product.original}</span>
          <span style={{fontSize:11,color:"#10b981",fontWeight:600}}>Save ₹{product.original-product.price}</span>
        </div>
        <button onClick={handleAdd} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:adding?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,transition:"all .3s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transform:adding?"scale(0.97)":"scale(1)"}}>
          {adding?"✓ Added!":"🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT DETAIL MODAL
═══════════════════════════════════════════ */
function ProductDetail({product,onClose,onAddToCart,onToggleWish,wished,toast}){
  const [qty,setQty]=useState(1);
  const [tab,setTab]=useState("desc");
  const [userRating,setUserRating]=useState(0);
  const [reviewText,setReviewText]=useState("");
  const [reviews,setReviews]=useState([
    {author:"Priya M.",rating:5,text:"Absolutely beautiful! The craftsmanship is outstanding.",date:"12 Mar 2024"},
    {author:"Rahul K.",rating:4,text:"Great quality, packed well. Slight delay in shipping but worth it.",date:"5 Feb 2024"},
  ]);
  const disc=Math.round((1-product.price/product.original)*100);

  const handleAdd=()=>{
    for(let i=0;i<qty;i++) onAddToCart(product);
    toast(`${qty}x "${product.name.slice(0,25)}..." added!`,"success");
    onClose();
  };

  const submitReview=()=>{
    if(!userRating||!reviewText.trim()){toast("Please add a rating and review","error");return;}
    setReviews(r=>[{author:"You",rating:userRating,text:reviewText,date:"Just now"},...r]);
    setReviewText("");setUserRating(0);
    toast("Review submitted!","success");
  };

  useEffect(()=>{
    const handleKey=(e)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  },[onClose]);

  return(
    <div style={{position:"fixed",inset:0,zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)"}}/>
      <div style={{position:"relative",background:"#111117",borderRadius:28,border:"1px solid #1e1e2e",width:"100%",maxWidth:900,maxHeight:"90vh",overflow:"auto",animation:"modalIn 0.35s ease both",boxShadow:"0 40px 100px rgba(0,0,0,0.8)"}}>
        <button onClick={onClose} style={{position:"sticky",top:16,float:"right",margin:"16px 16px -40px 0",zIndex:10,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
          {/* Image side */}
          <div style={{padding:32,background:"linear-gradient(135deg,#0d0d14,#1a1025)"}}>
            <div style={{borderRadius:20,overflow:"hidden",height:320,marginBottom:16}}>
              <ProductImage id={product.id} height={320}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{borderRadius:12,overflow:"hidden",height:80,opacity:i===0?1:0.5,border:i===0?"2px solid #f59e0b":"2px solid transparent"}}>
                  <ProductImage id={product.id} height={80}/>
                </div>
              ))}
            </div>
          </div>
          {/* Info side */}
          <div style={{padding:32}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,letterSpacing:1,marginBottom:8}}>{product.shop}</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.5rem",color:"#fff",marginBottom:12,lineHeight:1.3}}>{product.name}</h2>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <Stars rating={product.rating} size={16}/>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>({product.reviews} reviews)</span>
              {product.customizable&&<span style={{background:"#7c3aed22",color:"#a855f7",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,border:"1px solid #7c3aed44"}}>✦ Customizable</span>}
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,marginBottom:20}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2rem",color:"#fff"}}>₹{product.price}</span>
              <span style={{fontSize:14,color:"rgba(255,255,255,0.3)",textDecoration:"line-through",marginBottom:4}}>₹{product.original}</span>
              <span style={{background:"#ef444422",color:"#ef4444",fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,marginBottom:4}}>{disc}% OFF</span>
            </div>
            <div style={{background:"#10b98122",border:"1px solid #10b98144",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#10b981"}}>
              ✓ You save ₹{product.original-product.price} on this order
            </div>

            {/* Tabs */}
            <div style={{display:"flex",gap:4,background:"#0a0a0f",borderRadius:10,padding:3,marginBottom:16}}>
              {["desc","details","delivery"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab===t?"#f59e0b":"transparent",color:tab===t?"#000":"rgba(255,255,255,0.5)",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",transition:"all .2s",textTransform:"capitalize"}}>
                  {t==="desc"?"Description":t==="details"?"Details":"Delivery"}
                </button>
              ))}
            </div>
            {tab==="desc"&&<p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,marginBottom:20}}>{product.desc}</p>}
            {tab==="details"&&(
              <div style={{marginBottom:20}}>
                {[["Material",product.material],["Dimensions",product.dimensions],["Category",product.cat],["Shop",product.shop]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e1e2e",fontSize:13}}>
                    <span style={{color:"rgba(255,255,255,0.4)"}}>{k}</span>
                    <span style={{color:"rgba(255,255,255,0.85)",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {tab==="delivery"&&(
              <div style={{marginBottom:20}}>
                <div style={{background:"#0a0a0f",borderRadius:12,padding:16,fontSize:13}}>
                  <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>🚚 Free Delivery</div>
                  <div style={{color:"rgba(255,255,255,0.6)",marginBottom:8}}>Estimated delivery: {product.deliveryDays}-{product.deliveryDays+2} business days</div>
                  <div style={{color:"rgba(255,255,255,0.6)"}}>↩️ 7-day hassle-free returns</div>
                </div>
              </div>
            )}

            {/* Qty & CTA */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12,background:"#0a0a0f",borderRadius:12,padding:"8px 16px",border:"1px solid #1e1e2e"}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:28,height:28,borderRadius:"50%",border:"1px solid #374151",background:"transparent",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{color:"#fff",fontWeight:700,minWidth:20,textAlign:"center"}}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} style={{width:28,height:28,borderRadius:"50%",border:"1px solid #374151",background:"transparent",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              <button onClick={handleAdd} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 30px rgba(245,158,11,0.3)"}}>
                Add {qty} to Cart — ₹{product.price*qty}
              </button>
            </div>
            <button onClick={()=>{onToggleWish(product.id);toast(wished?"Removed from wishlist":"Added to wishlist!","success");}} style={{width:"100%",padding:"12px",borderRadius:14,border:`1.5px solid ${wished?"#ef4444":"rgba(255,255,255,0.15)"}`,background:"transparent",color:wished?"#ef4444":"rgba(255,255,255,0.6)",fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>
              {wished?"❤️ Remove from Wishlist":"🤍 Add to Wishlist"}
            </button>
          </div>
        </div>

        {/* Reviews section */}
        <div style={{padding:"28px 32px",borderTop:"1px solid #1e1e2e"}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.2rem",color:"#fff",marginBottom:20}}>Customer Reviews</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
            <div>
              {reviews.map((r,i)=>(
                <div key={i} style={{background:"#0a0a0f",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1e1e2e"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontWeight:700,color:"#fff",fontSize:13}}>{r.author}</span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{r.date}</span>
                  </div>
                  <Stars rating={r.rating} size={13}/>
                  <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:8,lineHeight:1.6}}>{r.text}</p>
                </div>
              ))}
            </div>
            <div>
              <div style={{background:"#0a0a0f",borderRadius:16,padding:20,border:"1px solid #1e1e2e"}}>
                <div style={{fontWeight:700,color:"#fff",marginBottom:12,fontSize:14}}>Write a Review</div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6}}>Your Rating</div>
                  <Stars rating={userRating} size={22} interactive={true} onRate={setUserRating}/>
                </div>
                <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Share your experience..." rows={3} style={{width:"100%",padding:"12px",borderRadius:10,border:"1.5px solid #1e1e2e",background:"#111117",color:"#fff",fontSize:13,fontFamily:"'Outfit',sans-serif",resize:"none",boxSizing:"border-box"}}/>
                <button onClick={submitReview} style={{marginTop:10,padding:"10px 20px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Submit Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHECKOUT MODAL
═══════════════════════════════════════════ */
function CheckoutModal({cart,onClose,onSuccess,toast}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",phone:"",address:"",city:"",pincode:"",payment:"upi"});
  const [loading,setLoading]=useState(false);
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSubmit=()=>{
    if(!form.name||!form.phone||!form.address||!form.city||!form.pincode){toast("Please fill all delivery details","error");return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);setStep(3);},2000);
  };

  const inp={width:"100%",padding:"12px 16px",borderRadius:10,border:"1.5px solid #1e1e2e",background:"#0a0a0f",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",transition:"border .2s"};

  return(
    <div style={{position:"fixed",inset:0,zIndex:6000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget&&step!==3)onClose();}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)"}}/>
      <div style={{position:"relative",background:"#111117",borderRadius:28,border:"1px solid #1e1e2e",width:"100%",maxWidth:560,animation:"modalIn 0.35s ease both",boxShadow:"0 40px 100px rgba(0,0,0,0.8)"}}>
        {step!==3&&<button onClick={onClose} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}

        {/* Step indicators */}
        {step!==3&&<div style={{padding:"24px 32px 0"}}>
          <div style={{display:"flex",gap:0,marginBottom:24}}>
            {[{n:1,l:"Cart"},{n:2,l:"Delivery"},{n:3,l:"Payment"}].map((s,i)=>(
              <div key={s.n} style={{flex:1,display:"flex",alignItems:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:step>=s.n?"linear-gradient(135deg,#f59e0b,#d97706)":"#1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:step>=s.n?"#000":"rgba(255,255,255,0.3)"}}>
                    {step>s.n?"✓":s.n}
                  </div>
                  <span style={{fontSize:11,color:step>=s.n?"#f59e0b":"rgba(255,255,255,0.3)",fontWeight:600}}>{s.l}</span>
                </div>
                {i<2&&<div style={{flex:1,height:2,background:step>s.n?"#f59e0b":"#1e1e2e",margin:"0 8px",marginBottom:20,transition:"background .3s"}}/>}
              </div>
            ))}
          </div>
        </div>}

        {step===1&&(
          <div style={{padding:"0 32px 32px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.3rem",color:"#fff",marginBottom:16}}>Order Summary</h3>
            {cart.map(item=>(
              <div key={item.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1e1e2e"}}>
                <div style={{width:48,height:48,borderRadius:10,overflow:"hidden",flexShrink:0}}>
                  <ProductImage id={item.id} height={48}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{item.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Qty: {item.qty}</div>
                </div>
                <div style={{fontWeight:700,color:"#f59e0b"}}>₹{item.price*item.qty}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,fontWeight:800,fontSize:18,color:"#fff"}}>
              <span>Total</span><span style={{color:"#f59e0b"}}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={()=>setStep(2)} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginTop:20}}>
              Continue to Delivery →
            </button>
          </div>
        )}

        {step===2&&(
          <div style={{padding:"0 32px 32px"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.3rem",color:"#fff",marginBottom:16}}>Delivery Details</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <input placeholder="Full Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/>
              <input placeholder="Phone Number *" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp}/>
              <textarea placeholder="Full Address *" rows={2} value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} style={{...inp,resize:"none"}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <input placeholder="City *" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} style={inp}/>
                <input placeholder="PIN Code *" value={form.pincode} onChange={e=>setForm(f=>({...f,pincode:e.target.value}))} style={inp}/>
              </div>
              <div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:10,fontWeight:600}}>Payment Method</div>
                {[{v:"upi",l:"UPI / QR Code",i:"📱"},{v:"card",l:"Credit / Debit Card",i:"💳"},{v:"cod",l:"Cash on Delivery",i:"💵"}].map(m=>(
                  <div key={m.v} onClick={()=>setForm(f=>({...f,payment:m.v}))} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,border:`1.5px solid ${form.payment===m.v?"#f59e0b":"#1e1e2e"}`,background:form.payment===m.v?"rgba(245,158,11,0.08)":"#0a0a0f",cursor:"pointer",marginBottom:8,transition:"all .2s"}}>
                    <span style={{fontSize:20}}>{m.i}</span>
                    <span style={{fontWeight:600,color:form.payment===m.v?"#f59e0b":"rgba(255,255,255,0.7)",fontSize:14}}>{m.l}</span>
                    {form.payment===m.v&&<span style={{marginLeft:"auto",color:"#f59e0b"}}>✓</span>}
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{padding:"14px",borderRadius:14,border:"none",background:loading?"#374151":"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                {loading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> Processing...</>:"Place Order →"}
              </button>
            </div>
          </div>
        )}

        {step===3&&(
          <div style={{padding:48,textAlign:"center"}}>
            <div style={{fontSize:72,marginBottom:16,animation:"bounce 1s infinite"}}>🎉</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.8rem",color:"#fff",marginBottom:8}}>Order Placed!</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:15,marginBottom:8}}>Your order has been confirmed</p>
            <p style={{color:"#f59e0b",fontWeight:700,fontSize:16,marginBottom:24}}>Order #CB-{Date.now().toString().slice(-6)}</p>
            <div style={{background:"#0a0a0f",borderRadius:16,padding:"16px 24px",marginBottom:28,textAlign:"left"}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:8}}>Delivery to: {form.city}, {form.pincode}</div>
              <div style={{fontSize:13,color:"#10b981"}}>🚚 Expected delivery in 5-7 business days</div>
            </div>
            <button onClick={()=>{onSuccess();onClose();}} style={{padding:"14px 36px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
              Continue Shopping →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function Navbar({page,setPage,cartCount,wishCount,user,setUser,onSearch,searchQuery}){
  const [scrolled,setScrolled]=useState(false);
  const [search,setSearch]=useState(searchQuery||"");
  const [searchFocus,setSearchFocus]=useState(false);

  useEffect(()=>{setSearch(searchQuery||"");},[searchQuery]);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const handleSearch=(e)=>{
    const v=e.target.value;
    setSearch(v);
    if(onSearch) onSearch(v);
  };

  const handleSearchKey=(e)=>{
    if(e.key==="Enter"&&search.trim()){
      if(onSearch) onSearch(search);
      setPage("shop");
    }
  };

  return(
    <nav style={{position:"sticky",top:0,zIndex:1000,background:scrolled?"rgba(10,10,15,0.95)":"rgba(10,10,15,0.8)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"all .3s"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:16,height:68}}>
        <div onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎨</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff",letterSpacing:"-0.5px"}}>Craft<span style={{color:"#f59e0b"}}>Baazar</span></span>
        </div>

        <div style={{flex:1,maxWidth:480,position:"relative"}}>
          <input value={search} onChange={handleSearch} onKeyDown={handleSearchKey}
            onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)}
            placeholder="Search crafts, artisans, categories..."
            style={{width:"100%",padding:"10px 44px 10px 18px",borderRadius:40,border:`1.5px solid ${searchFocus?"#f59e0b":"rgba(255,255,255,0.1)"}`,background:"rgba(255,255,255,0.06)",color:"#fff",fontSize:14,transition:"all .3s",fontFamily:"'Outfit',sans-serif",boxSizing:"border-box"}}/>
          <button onClick={()=>{if(search.trim()){if(onSearch)onSearch(search);setPage("shop");}}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"rgba(255,255,255,0.4)"}}>🔍</button>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {[["home","Home"],["shop","Shop"],["seller","Sell"]].map(([pg,label])=>(
            <button key={pg} onClick={()=>setPage(pg)} className="nav-link" style={{padding:"8px 14px",borderRadius:10,border:"none",background:page===pg?"rgba(245,158,11,0.15)":"transparent",color:page===pg?"#f59e0b":"rgba(255,255,255,0.7)",fontWeight:600,cursor:"pointer",fontSize:14,transition:"all .2s",fontFamily:"'Outfit',sans-serif"}}>{label}</button>
          ))}
          <button onClick={()=>setPage("wishlist")} style={{position:"relative",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:20,transition:"transform .2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            ❤️{wishCount>0&&<span style={{position:"absolute",top:2,right:2,background:"#ef4444",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{wishCount}</span>}
          </button>
          <button onClick={()=>setPage("cart")} style={{position:"relative",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:20,transition:"transform .2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            🛒{cartCount>0&&<span style={{position:"absolute",top:2,right:2,background:"#f59e0b",color:"#000",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,animation:"countUp .3s ease"}}>{cartCount}</span>}
          </button>
          {user?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#db2777)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",border:"2px solid #f59e0b"}} onClick={()=>setPage("profile")}>{user.name[0].toUpperCase()}</div>
              <button onClick={()=>setUser(null)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"'Outfit',sans-serif"}}>Logout</button>
            </div>
          ):(
            <button onClick={()=>setPage("login")} style={{padding:"9px 20px",borderRadius:30,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",boxShadow:"0 4px 15px rgba(245,158,11,0.3)"}}>Login / Register</button>
          )}
        </div>
      </div>
      <div style={{background:"#0d0d14",borderTop:"1px solid rgba(255,255,255,0.04)",overflowX:"auto",scrollbarWidth:"none"}}>
        <div style={{display:"flex",padding:"0 24px",maxWidth:1280,margin:"0 auto"}}>
          {CATS.map(cat=>(
            <button key={cat.name} onClick={()=>setPage("shop")} style={{padding:"10px 18px",border:"none",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:13,fontWeight:500,whiteSpace:"nowrap",transition:"all .2s",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:6,borderBottom:"2px solid transparent"}}
            onMouseEnter={e=>{e.currentTarget.style.color=cat.color;e.currentTarget.style.borderBottomColor=cat.color;}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.borderBottomColor="transparent";}}><span>{cat.icon}</span>{cat.name}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
function HomePage({setPage,setCart,wishlist,toggleWish,toast,onOpenDetail}){
  const [activeCat,setActiveCat]=useState("Home & Living");
  const addToCart=useCallback((product)=>{setCart(prev=>{const ex=prev.find(i=>i.id===product.id);return ex?prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i):[...prev,{...product,qty:1}];});},[setCart]);
  return(
    <div style={{background:"#0a0a0f"}}>
      <HeroSlider setPage={setPage}/>
      <TrustBar/>
      <div style={{background:"#0d0d14",padding:"60px 24px",borderBottom:"1px solid #1e1e2e"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {[{n:10000,suffix:"+",label:"Handmade Products",icon:"📦"},{n:500,suffix:"+",label:"Indian Artisans",icon:"🧑‍🎨"},{n:50000,suffix:"+",label:"Happy Customers",icon:"😊"},{n:100,suffix:"%",label:"Authentic Products",icon:"✅"}].map(s=>(
            <div key={s.label} style={{background:"#111117",borderRadius:20,padding:"28px 24px",border:"1px solid #1e1e2e",textAlign:"center",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#f59e0b44";e.currentTarget.style.transform="translateY(-4px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:36,marginBottom:12}}>{s.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2rem",color:"#f59e0b"}}><Counter end={s.n} suffix={s.suffix}/></div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{padding:"80px 24px",background:"#0a0a0f"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span style={{color:"#f59e0b",fontSize:13,fontWeight:600,letterSpacing:2}}>BROWSE BY</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.5rem",color:"#fff",marginTop:8}}>Featured Categories</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:20}}>
            {CATS.map(cat=>(
              <div key={cat.name} onClick={()=>setPage("shop")} style={{background:"#111117",borderRadius:20,overflow:"hidden",cursor:"pointer",border:"1px solid #1e1e2e",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=cat.color+"66";e.currentTarget.style.transform="translateY(-6px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{height:100,overflow:"hidden",position:"relative"}}>
                  <img src={CATEGORY_IMAGES[cat.name]} alt={cat.name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.6}}/>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,#111117,transparent)`}}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:30}}>{cat.icon}</div>
                </div>
                <div style={{padding:"12px 16px"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#fff",marginBottom:4}}>{cat.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{cat.count.toLocaleString()} items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"0 24px 80px",background:"#0a0a0f"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:36}}>
            <div><span style={{color:"#f59e0b",fontSize:13,fontWeight:600,letterSpacing:2}}>FRESHLY ADDED</span><h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.2rem",color:"#fff",marginTop:6}}>New Arrivals</h2></div>
            <button onClick={()=>setPage("shop")} style={{padding:"10px 24px",borderRadius:30,border:"1.5px solid rgba(245,158,11,0.5)",background:"transparent",color:"#f59e0b",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(245,158,11,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>View All →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:20}}>
            {PRODUCTS.slice(0,8).map(p=>(
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onToggleWish={()=>toggleWish(p.id)} wished={wishlist.includes(p.id)} toast={toast} onOpenDetail={onOpenDetail}/>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"0 24px 80px",background:"#0a0a0f"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <span style={{color:"#f59e0b",fontSize:13,fontWeight:600,letterSpacing:2}}>BROWSE WITHIN</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.2rem",color:"#fff",marginTop:6}}>Shop by Sub-Category</h2>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:32,flexWrap:"wrap",justifyContent:"center"}}>
            {Object.keys(SUB_CATS).map(cat=>{const c=CATS.find(x=>x.name===cat);return(
              <button key={cat} onClick={()=>setActiveCat(cat)} style={{padding:"10px 20px",borderRadius:30,background:activeCat===cat?c?.color||"#f59e0b":"#111117",color:activeCat===cat?"#fff":"rgba(255,255,255,0.6)",fontWeight:600,cursor:"pointer",fontSize:13,transition:"all .2s",fontFamily:"'Outfit',sans-serif",border:`1.5px solid ${activeCat===cat?c?.color||"#f59e0b":"#1e1e2e"}`}}>{c?.icon} {cat}</button>
            );})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:14}}>
            {(SUB_CATS[activeCat]||[]).map(sub=>{const c=CATS.find(x=>x.name===activeCat);return(
              <div key={sub} onClick={()=>setPage("shop")} style={{background:"#111117",borderRadius:14,padding:"18px 12px",textAlign:"center",cursor:"pointer",border:"1px solid #1e1e2e",transition:"all .25s",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c?.color+"55";e.currentTarget.style.color="#fff";e.currentTarget.style.background=c?.color+"11";e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.color="rgba(255,255,255,0.8)";e.currentTarget.style.background="#111117";e.currentTarget.style.transform="translateY(0)";}}>{sub}</div>
            );})}
          </div>
        </div>
      </section>

      <section style={{padding:"80px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{borderRadius:28,padding:"64px 56px",background:"linear-gradient(135deg,#1a0533,#3b0764)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:32,flexWrap:"wrap",boxShadow:"0 0 80px rgba(168,85,247,0.15)"}}>
            <div>
              <div style={{color:"#a855f7",fontSize:13,fontWeight:600,letterSpacing:2,marginBottom:12}}>FOR ARTISANS</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1.8rem,4vw,2.8rem)",color:"#fff",marginBottom:16,lineHeight:1.2}}>Turn Your Passion<br/><span style={{color:"#a855f7"}}>Into Income</span></h2>
              <p style={{color:"rgba(255,255,255,0.6)",maxWidth:440,lineHeight:1.7,marginBottom:28}}>Join 500+ artisans already selling on ArtisanWorld. Setup takes under 5 minutes. Keep 85% of every sale.</p>
              <button onClick={()=>setPage("seller")} style={{padding:"15px 36px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 30px rgba(168,85,247,0.4)",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>Start Selling for Free →</button>
            </div>
            <div style={{fontSize:120,animation:"float 4s ease-in-out infinite"}}>🧑‍🎨</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHOP PAGE (with wired search)
═══════════════════════════════════════════ */
function ShopPage({cart,setCart,wishlist,toggleWish,toast,onOpenDetail,initialSearch=""}){
  const [filter,setFilter]=useState("All");
  const [sort,setSort]=useState("featured");
  const [search,setSearch]=useState(initialSearch);
  const [priceRange,setPriceRange]=useState(5000);

  useEffect(()=>{setSearch(initialSearch);},[initialSearch]);

  const filtered=PRODUCTS
    .filter(p=>filter==="All"||p.cat===filter)
    .filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.shop.toLowerCase().includes(search.toLowerCase())||p.cat.toLowerCase().includes(search.toLowerCase()))
    .filter(p=>p.price<=priceRange)
    .sort((a,b)=>{
      if(sort==="price-low")return a.price-b.price;
      if(sort==="price-high")return b.price-a.price;
      if(sort==="rating")return b.rating-a.rating;
      return 0;
    });

  const addToCart=useCallback((product)=>{setCart(prev=>{const ex=prev.find(i=>i.id===product.id);return ex?prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i):[...prev,{...product,qty:1}];});},[setCart]);

  return(
    <div style={{background:"#0a0a0f",minHeight:"100vh",padding:"40px 24px"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{marginBottom:40}}>
          <span style={{color:"#f59e0b",fontSize:13,fontWeight:600,letterSpacing:2}}>ALL PRODUCTS</span>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.5rem",color:"#fff",marginTop:8}}>Shop Handmade</h1>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, shops, categories..."
            style={{padding:"10px 18px",borderRadius:30,border:"1.5px solid #1e1e2e",background:"#111117",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",flex:1,minWidth:200}}/>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"10px 18px",borderRadius:30,border:"1.5px solid #1e1e2e",background:"#111117",color:"#fff",fontSize:13,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#111117",borderRadius:30,padding:"8px 16px",border:"1.5px solid #1e1e2e"}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Max ₹</span>
            <input type="range" min={100} max={5000} value={priceRange} onChange={e=>setPriceRange(+e.target.value)} style={{width:100,accentColor:"#f59e0b"}}/>
            <span style={{fontSize:12,color:"#f59e0b",fontWeight:700,minWidth:44}}>₹{priceRange}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
          {["All",...CATS.map(c=>c.name)].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"8px 16px",borderRadius:20,background:filter===f?"#f59e0b":"#111117",color:filter===f?"#000":"rgba(255,255,255,0.6)",fontWeight:600,cursor:"pointer",fontSize:12,transition:"all .2s",fontFamily:"'Outfit',sans-serif",border:`1px solid ${filter===f?"#f59e0b":"#1e1e2e"}`}}>{f}</button>
          ))}
        </div>
        <div style={{marginBottom:16,fontSize:13,color:"rgba(255,255,255,0.4)"}}>Showing {filtered.length} of {PRODUCTS.length} products</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:20}}>
          {filtered.map(p=>(<ProductCard key={p.id} product={p} onAddToCart={addToCart} onToggleWish={()=>toggleWish(p.id)} wished={wishlist.includes(p.id)} toast={toast} onOpenDetail={onOpenDetail}/>))}
        </div>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"80px 0",color:"rgba(255,255,255,0.3)"}}>
            <div style={{fontSize:64,marginBottom:16}}>🔍</div>
            <div style={{fontSize:18,fontWeight:600}}>No products found</div>
            <div style={{fontSize:14,marginTop:8}}>Try adjusting your filters or search</div>
            <button onClick={()=>{setSearch("");setFilter("All");setPriceRange(5000);}} style={{marginTop:16,padding:"10px 24px",borderRadius:20,border:"none",background:"#f59e0b",color:"#000",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CART PAGE
═══════════════════════════════════════════ */
function CartPage({cart,setCart,setPage,toast,setShowCheckout}){
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const savings=cart.reduce((s,i)=>s+(i.original-i.price)*i.qty,0);
  const updateQty=(id,delta)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));
  const remove=(id)=>{setCart(prev=>prev.filter(i=>i.id!==id));toast("Item removed","info");};

  if(cart.length===0)return(
    <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:20}}>
      <div style={{fontSize:80}}>🛒</div>
      <h2 style={{fontFamily:"'Syne',sans-serif",color:"#fff",fontSize:"2rem"}}>Your cart is empty</h2>
      <p style={{color:"rgba(255,255,255,0.4)"}}>Add some handcrafted goodies!</p>
      <button onClick={()=>setPage("shop")} style={{padding:"14px 36px",borderRadius:30,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15,fontFamily:"'Outfit',sans-serif"}}>Browse Products →</button>
    </div>
  );

  return(
    <div style={{background:"#0a0a0f",minHeight:"100vh",padding:"40px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2rem",color:"#fff",marginBottom:32}}>
          Your Cart <span style={{color:"#f59e0b",fontSize:"1.2rem"}}>({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
        </h1>
        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:32,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {cart.map(item=>(
              <div key={item.id} style={{background:"#111117",borderRadius:20,padding:"20px",border:"1px solid #1e1e2e",display:"flex",gap:20,alignItems:"center"}}>
                <div style={{width:80,height:80,borderRadius:16,overflow:"hidden",flexShrink:0}}>
                  <ProductImage id={item.id} height={80}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:4}}>{item.shop}</div>
                  <div style={{fontWeight:600,color:"#fff",marginBottom:8}}>{item.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>updateQty(item.id,-1)} style={{width:28,height:28,borderRadius:"50%",border:"1px solid #374151",background:"transparent",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{color:"#fff",fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                      <button onClick={()=>updateQty(item.id,1)} style={{width:28,height:28,borderRadius:"50%",border:"1px solid #374151",background:"transparent",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                    <span style={{fontWeight:800,color:"#f59e0b",fontSize:18}}>₹{(item.price*item.qty).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={()=>remove(item.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:18,color:"rgba(255,255,255,0.3)",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#ef4444"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>✕</button>
              </div>
            ))}
          </div>
          <div style={{background:"#111117",borderRadius:24,padding:"28px",border:"1px solid #1e1e2e",position:"sticky",top:90}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",marginBottom:20,fontSize:"1.2rem"}}>Order Summary</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"rgba(255,255,255,0.6)"}}><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"#10b981"}}><span>You Save</span><span>₹{savings.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"rgba(255,255,255,0.6)"}}><span>Delivery</span><span style={{color:"#10b981"}}>FREE</span></div>
              <div style={{height:1,background:"#1e1e2e",margin:"4px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:20,color:"#fff"}}><span>Total</span><span style={{color:"#f59e0b"}}>₹{total.toLocaleString()}</span></div>
            </div>
            <button onClick={()=>setShowCheckout(true)} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",boxShadow:"0 8px 30px rgba(245,158,11,0.3)"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Proceed to Checkout →</button>
            <button onClick={()=>setPage("shop")} style={{width:"100%",padding:"12px",borderRadius:14,border:"1px solid #1e1e2e",background:"transparent",color:"rgba(255,255,255,0.5)",fontWeight:600,cursor:"pointer",fontSize:14,marginTop:10,fontFamily:"'Outfit',sans-serif"}}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WISHLIST PAGE
═══════════════════════════════════════════ */
function WishlistPage({wishlist,toggleWish,setCart,setPage,toast,onOpenDetail}){
  const items=PRODUCTS.filter(p=>wishlist.includes(p.id));
  const moveToCart=(product)=>{
    setCart(prev=>{const ex=prev.find(i=>i.id===product.id);return ex?prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i):[...prev,{...product,qty:1}];});
    toggleWish(product.id);toast("Moved to cart!","success");
  };
  if(items.length===0)return(
    <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:20}}>
      <div style={{fontSize:80}}>❤️</div>
      <h2 style={{fontFamily:"'Syne',sans-serif",color:"#fff",fontSize:"2rem"}}>Your wishlist is empty</h2>
      <p style={{color:"rgba(255,255,255,0.4)"}}>Save items you love!</p>
      <button onClick={()=>setPage("shop")} style={{padding:"14px 36px",borderRadius:30,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15,fontFamily:"'Outfit',sans-serif"}}>Browse Products →</button>
    </div>
  );
  return(
    <div style={{background:"#0a0a0f",minHeight:"100vh",padding:"40px 24px"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2rem",color:"#fff",marginBottom:32}}>Wishlist <span style={{color:"#f59e0b",fontSize:"1.2rem"}}>({items.length} items)</span></h1>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
          {items.map(p=>(
            <div key={p.id} style={{background:"#111117",borderRadius:20,overflow:"hidden",border:"1px solid #1e1e2e",transition:"all .3s",cursor:"pointer"}}
            onClick={()=>onOpenDetail&&onOpenDetail(p)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#f59e0b44";e.currentTarget.style.transform="translateY(-6px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{height:160,position:"relative"}}>
                <ProductImage id={p.id} height={160}/>
                <button onClick={e=>{e.stopPropagation();toggleWish(p.id);}} style={{position:"absolute",top:8,right:8,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>❤️</button>
              </div>
              <div style={{padding:"16px"}}>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:4}}>{p.shop}</div>
                <div style={{fontWeight:600,color:"#fff",marginBottom:10,fontSize:14}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <span style={{fontWeight:800,fontSize:18,color:"#fff"}}>₹{p.price}</span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>₹{p.original}</span>
                </div>
                <button onClick={e=>{e.stopPropagation();moveToCart(p);}} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Move to Cart 🛒</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════ */
function ProfilePage({user,setUser,setPage,cart,wishlist,toast}){
  const [tab,setTab]=useState("orders");
  const [orders,setOrders]=useState(MOCK_ORDERS);

  if(!user)return(
    <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:20}}>
      <div style={{fontSize:80}}>🔐</div>
      <h2 style={{fontFamily:"'Syne',sans-serif",color:"#fff",fontSize:"2rem"}}>Please log in</h2>
      <button onClick={()=>setPage("login")} style={{padding:"14px 36px",borderRadius:30,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15,fontFamily:"'Outfit',sans-serif"}}>Login →</button>
    </div>
  );

  const statusColor={Delivered:"#10b981",Shipped:"#3b82f6",Processing:"#f59e0b",Cancelled:"#ef4444"};

  return(
    <div style={{background:"#0a0a0f",minHeight:"100vh",padding:"40px 24px"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        {/* Profile header */}
        <div style={{background:"#111117",borderRadius:24,padding:"32px",border:"1px solid #1e1e2e",marginBottom:28,display:"flex",gap:24,alignItems:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#db2777)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:800,color:"#fff",flexShrink:0}}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.8rem",color:"#fff",marginBottom:4}}>{user.name}</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>{user.email}</p>
            <span style={{marginTop:8,display:"inline-block",background:user.role==="seller"?"#7c3aed22":"#10b98122",color:user.role==="seller"?"#a855f7":"#10b981",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>
              {user.role==="seller"?"⭐ Seller":"🛍️ Buyer"}
            </span>
          </div>
          <div style={{display:"flex",gap:16}}>
            {[{v:orders.length,l:"Orders"},{v:wishlist.length,l:"Wishlist"},{v:cart.length,l:"In Cart"}].map(({v,l})=>(
              <div key={l} style={{textAlign:"center",padding:"12px 20px",background:"#0a0a0f",borderRadius:16,border:"1px solid #1e1e2e"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.5rem",color:"#f59e0b"}}>{v}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,background:"#111117",borderRadius:16,padding:6,marginBottom:24,border:"1px solid #1e1e2e"}}>
          {[{v:"orders",l:"📦 Order History"},{v:"settings",l:"⚙️ Account Settings"}].map(t=>(
            <button key={t.v} onClick={()=>setTab(t.v)} style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:tab===t.v?"#f59e0b":"transparent",color:tab===t.v?"#000":"rgba(255,255,255,0.6)",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>{t.l}</button>
          ))}
        </div>

        {tab==="orders"&&(
          <div>
            {orders.length===0&&(
              <div style={{textAlign:"center",padding:"60px",color:"rgba(255,255,255,0.3)"}}>
                <div style={{fontSize:48,marginBottom:12}}>📦</div>
                <div style={{fontSize:16,fontWeight:600}}>No orders yet</div>
                <button onClick={()=>setPage("shop")} style={{marginTop:16,padding:"10px 24px",borderRadius:20,border:"none",background:"#f59e0b",color:"#000",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Start Shopping</button>
              </div>
            )}
            {orders.map(order=>(
              <div key={order.id} style={{background:"#111117",borderRadius:20,padding:"24px",border:"1px solid #1e1e2e",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div>
                    <div style={{fontWeight:700,color:"#fff",fontSize:15}}>{order.id}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>Ordered on {order.date}</div>
                  </div>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontWeight:800,color:"#f59e0b",fontSize:18}}>₹{order.total.toLocaleString()}</span>
                    <span style={{padding:"6px 14px",borderRadius:20,background:`${statusColor[order.status]}22`,color:statusColor[order.status],fontSize:12,fontWeight:700}}>{order.status}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {order.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:"#0a0a0f",borderRadius:12,padding:"10px 14px",border:"1px solid #1e1e2e"}}>
                      <div style={{width:40,height:40,borderRadius:8,overflow:"hidden",flexShrink:0}}>
                        <ProductImage id={item.id} height={40}/>
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{item.name.slice(0,24)}...</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Qty: {item.qty} × ₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {order.status==="Delivered"&&(
                  <button style={{marginTop:12,padding:"8px 18px",borderRadius:10,border:"1px solid rgba(245,158,11,0.3)",background:"transparent",color:"#f59e0b",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>
                    ⭐ Write a Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab==="settings"&&(
          <div style={{background:"#111117",borderRadius:20,padding:"28px",border:"1px solid #1e1e2e"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",marginBottom:20}}>Account Settings</h3>
            {[["Full Name",user.name],["Email",user.email],["Phone","Not added"],["Location","Not added"]].map(([label,val])=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #1e1e2e"}}>
                <div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,0.85)",fontWeight:600}}>{val}</div>
                </div>
                <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid #1e1e2e",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Edit</button>
              </div>
            ))}
            <button onClick={()=>{setUser(null);setPage("home");toast("Logged out","info");}} style={{marginTop:20,padding:"12px 24px",borderRadius:12,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'Outfit',sans-serif"}}>
              Logout from all devices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
function LoginPage({setUser,setPage,toast}){
  const [tab,setTab]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:"",role:"buyer"});
  const [loading,setLoading]=useState(false);
  const inp={width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid #1e1e2e",background:"#0a0a0f",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",transition:"border .2s"};
  const handle=()=>{
    if(!form.email||!form.password){toast("Please fill all required fields","error");return;}
    setLoading(true);
    setTimeout(()=>{
      setUser({name:form.name||form.email.split("@")[0],email:form.email,role:form.role});
      toast(`Welcome${form.name?" "+form.name:""}! 🎉`,"success");
      setPage(form.role==="seller"?"seller":"profile");
      setLoading(false);
    },1200);
  };
  return(
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{background:"#111117",borderRadius:28,padding:"48px",border:"1px solid #1e1e2e",width:"100%",maxWidth:440,boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>🎨</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#fff",fontSize:"1.8rem"}}>{tab==="login"?"Welcome Back":"Join ArtisanWorld"}</h2>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginTop:8}}>{tab==="login"?"Sign in to continue shopping":"Create your account today"}</p>
        </div>
        <div style={{display:"flex",background:"#0a0a0f",borderRadius:12,padding:4,marginBottom:28}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:tab===t?"#f59e0b":"transparent",color:tab===t?"#000":"rgba(255,255,255,0.5)",fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"'Outfit',sans-serif",transition:"all .2s",textTransform:"capitalize"}}>{t==="login"?"Sign In":"Register"}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {tab==="register"&&<input placeholder="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/>}
          <input placeholder="Email Address *" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp}/>
          <input placeholder="Password *" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={inp}/>
          {tab==="register"&&<select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{...inp,cursor:"pointer"}}>
            <option value="buyer">I'm a Buyer</option>
            <option value="seller">I'm a Seller / Artisan</option>
          </select>}
          <button onClick={handle} disabled={loading} style={{padding:"15px",borderRadius:14,border:"none",background:loading?"#374151":"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",marginTop:8,boxShadow:loading?"none":"0 8px 30px rgba(245,158,11,0.3)"}}>
            {loading?"Please wait...":tab==="login"?"Sign In →":"Create Account →"}
          </button>
        </div>
        <div style={{marginTop:24,display:"flex",gap:12}}>
          {["Google","Facebook"].map(p=>(
            <button key={p} style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid #1e1e2e",background:"transparent",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#f59e0b44";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}>{p==="Google"?"🌐":"📘"} {p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SELLER PAGE
═══════════════════════════════════════════ */
function SellerPage({user,setPage,toast}){
  const [tab,setTab]=useState("dashboard");
  const [myProducts,setMyProducts]=useState(PRODUCTS.slice(0,3));
  const [form,setForm]=useState({name:"",category:"Home & Living",desc:"",price:"",stock:""});
  const [formLoading,setFormLoading]=useState(false);
  const sellerInput={width:"100%",padding:"13px 16px",borderRadius:12,border:"1.5px solid #1e1e2e",background:"#0a0a0f",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",transition:"border .2s"};

  const addProduct=()=>{
    if(!form.name||!form.price){toast("Product name and price are required","error");return;}
    setFormLoading(true);
    setTimeout(()=>{
      setMyProducts(p=>[{id:Date.now(),name:form.name,shop:user?.name||"My Shop",price:parseInt(form.price),original:Math.round(parseInt(form.price)*1.67),cat:form.category,rating:5.0,reviews:0,customizable:false,desc:form.desc,material:"Handmade",dimensions:"As described",deliveryDays:7},...p]);
      setForm({name:"",category:"Home & Living",desc:"",price:"",stock:""});
      toast("Product listed successfully! 🎉","success");
      setTab("products");
      setFormLoading(false);
    },1500);
  };

  if(!user)return(
    <div style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:20}}>
      <div style={{fontSize:80}}>🔐</div>
      <h2 style={{fontFamily:"'Syne',sans-serif",color:"#fff",fontSize:"2rem"}}>Seller Access Required</h2>
      <p style={{color:"rgba(255,255,255,0.4)"}}>Please login to access the seller dashboard</p>
      <button onClick={()=>setPage("login")} style={{padding:"14px 36px",borderRadius:30,border:"none",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15,fontFamily:"'Outfit',sans-serif"}}>Login / Register →</button>
    </div>
  );

  const stats=[{label:"Total Products",value:myProducts.length,icon:"📦",color:"#f59e0b"},{label:"Total Orders",value:24,icon:"🛒",color:"#10b981"},{label:"Revenue",value:"₹18,420",icon:"💰",color:"#a855f7"},{label:"Rating",value:"4.8★",icon:"⭐",color:"#3b82f6"}];

  return(
    <div style={{background:"#0a0a0f",minHeight:"100vh",padding:"40px 24px"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div><span style={{color:"#f59e0b",fontSize:13,fontWeight:600,letterSpacing:2}}>SELLER HUB</span><h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2rem",color:"#fff",marginTop:6}}>Welcome, {user.name} 👋</h1></div>
        </div>
        <div style={{display:"flex",gap:8,background:"#111117",borderRadius:16,padding:6,marginBottom:28,border:"1px solid #1e1e2e",maxWidth:500}}>
          {[{v:"dashboard",l:"Dashboard"},{v:"products",l:"My Products"},{v:"add",l:"+ Add Product"}].map(t=>(
            <button key={t.v} onClick={()=>setTab(t.v)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:tab===t.v?"#f59e0b":"transparent",color:tab===t.v?"#000":"rgba(255,255,255,0.5)",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>{t.l}</button>
          ))}
        </div>

        {tab==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:28}}>
              {stats.map(s=>(
                <div key={s.label} style={{background:"#111117",borderRadius:20,padding:"24px",border:"1px solid #1e1e2e"}}>
                  <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.6rem",color:s.color}}>{s.value}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#111117",borderRadius:20,padding:"24px",border:"1px solid #1e1e2e"}}>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",marginBottom:16}}>Recent Orders</h3>
              {[{id:"#3847",product:"Madhubani Painting",buyer:"Priya M.",amount:1299,status:"Shipped"},{id:"#3846",product:"Terracotta Set",buyer:"Amit K.",amount:599,status:"Delivered"},{id:"#3845",product:"Clay Earrings",buyer:"Neha R.",amount:299,status:"Processing"}].map(o=>(
                <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #1e1e2e",fontSize:13}}>
                  <span style={{color:"#f59e0b",fontWeight:700}}>{o.id}</span>
                  <span style={{color:"rgba(255,255,255,0.8)",flex:1,margin:"0 16px"}}>{o.product}</span>
                  <span style={{color:"rgba(255,255,255,0.5)",marginRight:16}}>{o.buyer}</span>
                  <span style={{color:"#fff",fontWeight:700,marginRight:16}}>₹{o.amount}</span>
                  <span style={{padding:"4px 10px",borderRadius:10,background:o.status==="Delivered"?"#10b98122":o.status==="Shipped"?"#3b82f622":"#f59e0b22",color:o.status==="Delivered"?"#10b981":o.status==="Shipped"?"#3b82f6":"#f59e0b",fontWeight:600,fontSize:11}}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="products"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20}}>
            {myProducts.map(p=>(
              <div key={p.id} style={{background:"#111117",borderRadius:20,overflow:"hidden",border:"1px solid #1e1e2e"}}>
                <div style={{height:140,position:"relative"}}>
                  <ProductImage id={p.id} height={140}/>
                </div>
                <div style={{padding:"14px"}}>
                  <div style={{fontWeight:600,color:"#fff",fontSize:13,marginBottom:8}}>{p.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:"#f59e0b",fontWeight:800}}>₹{p.price}</span>
                    <button onClick={()=>setMyProducts(prev=>prev.filter(x=>x.id!==p.id))} style={{padding:"5px 10px",borderRadius:8,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",fontSize:11,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="add"&&(
          <div style={{maxWidth:600}}>
            <div style={{background:"#111117",borderRadius:24,padding:"32px",border:"1px solid #1e1e2e"}}>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#fff",marginBottom:20}}>Add New Product</h3>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <input placeholder="Product Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={sellerInput}/>
                <textarea placeholder="Description" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} style={{...sellerInput,resize:"none"}}/>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{...sellerInput,cursor:"pointer"}}>
                  {CATS.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <input placeholder="Price (₹) *" type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} style={sellerInput}/>
                  <input placeholder="Stock Quantity" type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} style={sellerInput}/>
                </div>
                <button onClick={addProduct} disabled={formLoading} style={{padding:"15px",borderRadius:14,border:"none",background:formLoading?"#374151":"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",fontWeight:700,fontSize:15,cursor:formLoading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .3s",marginTop:4}}>
                  {formLoading?"Adding Product...":"Add Product →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer({setPage}){
  return(
    <footer style={{background:"#080810",borderTop:"1px solid #1e1e2e",padding:"60px 24px 32px"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎨</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff"}}>Craft<span style={{color:"#f59e0b"}}>Baazar</span></span>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.9,maxWidth:280}}>India's premier marketplace for handmade artisan products. Connecting creators with craft lovers since 2024.</p>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              {["📘","📸","🐦","▶️"].map((icon,i)=>(
                <div key={i} style={{width:36,height:36,borderRadius:10,background:"#111117",border:"1px solid #1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>{icon}</div>
              ))}
            </div>
          </div>
          {[["Shop",["Home & Living","Fashion","Jewellery","Gifts","Stationery","Paintings"]],["Sellers",["Start Selling","Seller Dashboard","Seller FAQs","Pricing & Fees","Success Stories"]],["Support",["Track Order","Returns Policy","Contact Us","FAQs","Size Guide"]]].map(([title,links])=>(
            <div key={title}>
              <h4 style={{color:"rgba(255,255,255,0.9)",fontWeight:700,marginBottom:16,fontSize:14,letterSpacing:.5}}>{title}</h4>
              {links.map(l=>(
                <div key={l} style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:10,cursor:"pointer",transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color="#f59e0b"}
                onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #1e1e2e",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>© 2024 ArtisanWorld. Made with ❤️ in India. All rights reserved.</p>
          <div style={{display:"flex",gap:16}}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l=>(
              <span key={l} style={{fontSize:12,color:"rgba(255,255,255,0.25)",cursor:"pointer"}}
              onMouseEnter={e=>e.target.style.color="#f59e0b"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   HANDCRAFT PAGE (main export)
═══════════════════════════════════════════ */
export default function HandcraftPage(){
  const navigate=useNavigate();
  const [page,setPage]=useState("home");

  const handleSetPage=(p)=>{
    if(p==="shop"){navigate("/buy");return;}
    if(p==="seller"){navigate("/auth");return;}
    if(p==="login"){navigate("/auth");return;}
    if(p==="cart"){navigate("/cart");return;}
    if(p==="profile"){navigate("/account");return;}
    setPage(p);
  };
  const [cart,setCart]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [detailProduct,setDetailProduct]=useState(null);
  const [showCheckout,setShowCheckout]=useState(false);
  const [globalSearch,setGlobalSearch]=useState("");
  const {toasts,add:addToast,remove:removeToast}=useToast();

  const toggleWish=useCallback((id)=>{
    setWishlist(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  },[]);

  const handleOrderSuccess=()=>{
    setCart([]);
    addToast("Order placed! View in your orders 🎉","success");
    navigate("/tracking");
  };

  const openDetail=(product)=>setDetailProduct(product);
  const closeDetail=()=>setDetailProduct(null);

  return(
    <>
      <GlobalStyles/>
      {page==="home"&&<HomePage setPage={handleSetPage} setCart={setCart} wishlist={wishlist} toggleWish={toggleWish} toast={addToast} onOpenDetail={openDetail}/>}
      {page==="shop"&&<ShopPage cart={cart} setCart={setCart} wishlist={wishlist} toggleWish={toggleWish} toast={addToast} onOpenDetail={openDetail} initialSearch={globalSearch}/>}
      {page==="wishlist"&&<WishlistPage wishlist={wishlist} toggleWish={toggleWish} setCart={setCart} setPage={handleSetPage} toast={addToast} onOpenDetail={openDetail}/>}
      {page==="seller"&&<SellerPage user={null} setPage={handleSetPage} toast={addToast}/>}
      <Toast toasts={toasts} remove={removeToast}/>

      {detailProduct&&(
        <ProductDetail
          product={detailProduct}
          onClose={closeDetail}
          onAddToCart={(p)=>{setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}];});}}
          onToggleWish={toggleWish}
          wished={wishlist.includes(detailProduct.id)}
          toast={addToast}
        />
      )}

      {showCheckout&&cart.length>0&&(
        <CheckoutModal
          cart={cart}
          onClose={()=>setShowCheckout(false)}
          onSuccess={handleOrderSuccess}
          toast={addToast}
        />
      )}
    </>
  );
}
