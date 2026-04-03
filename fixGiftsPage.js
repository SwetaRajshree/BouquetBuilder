const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find the line after </JewelleryCatStrip> closing
let insertAt = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('activeCat={jewellerySubCat}') ) {
    // next line should be />
    insertAt = i + 2; // after the />
    break;
  }
}

if (insertAt === -1) { console.log('NOT FOUND'); process.exit(1); }

const newStrips = `
        {/* Forever Flowers Strip */}
        <div style={{ marginBottom:56 }}>
          <div style={{ background:"linear-gradient(90deg,#fff0f5,#fde8f0,#f8e0f8,#fff0f5)", borderRadius:16, padding:"22px 28px", marginBottom:18, textAlign:"center", border:"1px solid #f0e8eb" }}>
            <p style={{ margin:"0 0 5px", fontSize:10.5, fontWeight:900, color:"#e8476a", letterSpacing:3.5, textTransform:"uppercase" }}>Handcrafted with Love</p>
            <h2 style={{ margin:"0 0 4px", fontSize:25, fontWeight:900, color:"#2c1a2e", letterSpacing:-0.5 }}>Shop Forever Flowers</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
              <div style={{ width:28, height:2, background:"#e8476a", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#f7b8c8", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#c9a84c", borderRadius:2 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, borderRadius:18, overflow:"hidden", boxShadow:"0 8px 32px rgba(232,71,106,0.12)" }}>
            {[
              { name:"Crochet Bouquets", img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775237006/flower4_bkj8u3.webp" },
              { name:"Rose Bouquets",    img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775236998/Pipe_cleaners5.jpg_jprfkd.jpg" },
              { name:"Tulip Bouquets",   img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775237003/flower2_kszvls.webp" },
              { name:"Mixed Baskets",    img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775237002/flower8_j1bdyr.webp" },
            ].map((c,i)=>(
              <div key={i} onClick={()=>navigate('/forever-flowers')}
                style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden", cursor:"pointer" }}
                onMouseEnter={e=>{e.currentTarget.querySelector("img").style.transform="scale(1.1)";e.currentTarget.querySelector(".fov").style.opacity="1";}}
                onMouseLeave={e=>{e.currentTarget.querySelector("img").style.transform="scale(1)";e.currentTarget.querySelector(".fov").style.opacity="0";}}>
                <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.45s ease", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(44,26,46,0.78) 0%,rgba(44,26,46,0.1) 52%,transparent 100%)" }} />
                <div className="fov" style={{ position:"absolute", inset:0, background:"rgba(232,71,106,0.18)", opacity:0, transition:"opacity 0.3s" }} />
                <div style={{ position:"absolute", bottom:12, left:12, color:"#fff" }}>
                  <div style={{ fontSize:11.5, fontWeight:900, letterSpacing:1.2, textTransform:"uppercase", textShadow:"0 1px 6px rgba(0,0,0,0.6)" }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"#f7b8c8", marginTop:3, fontWeight:700 }}>Shop →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instant Gifts Strip */}
        <div style={{ marginBottom:56 }}>
          <div style={{ background:"linear-gradient(90deg,#fff8f2,#fff4e8,#fdf0e0,#fff8f2)", borderRadius:16, padding:"22px 28px", marginBottom:18, textAlign:"center", border:"1px solid #f0e8eb" }}>
            <p style={{ margin:"0 0 5px", fontSize:10.5, fontWeight:900, color:"#c05a10", letterSpacing:3.5, textTransform:"uppercase" }}>Same Day Delivery</p>
            <h2 style={{ margin:"0 0 4px", fontSize:25, fontWeight:900, color:"#2c1a2e", letterSpacing:-0.5 }}>Shop Instant Gifts</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
              <div style={{ width:28, height:2, background:"#c05a10", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#fdd0a0", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#c9a84c", borderRadius:2 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, borderRadius:18, overflow:"hidden", boxShadow:"0 8px 32px rgba(192,90,16,0.12)" }}>
            {[
              { name:"LED Lamps",      img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775232385/Desidiya_DIY_Infinity_Mirror_Tulip_Cube_LED_Lamp_-_20_LED_Flower_Lights_Dual-Purpose_Tabletop_Mirror_Decor_ihxp79.webp" },
              { name:"Home Decor",     img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775232386/Evil_Eye_Dream_Catcher_amtnyo.webp" },
              { name:"Wall Art",       img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775232388/Blue_Indian_Floral_Charm_Wall_Art_-_Set_of_Seven_sddgue.webp" },
              { name:"Dream Catchers", img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775232387/dream_catcher_1_ho6iet.jpg" },
            ].map((c,i)=>(
              <div key={i} onClick={()=>navigate('/instant-gifts')}
                style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden", cursor:"pointer" }}
                onMouseEnter={e=>{e.currentTarget.querySelector("img").style.transform="scale(1.1)";e.currentTarget.querySelector(".iov").style.opacity="1";}}
                onMouseLeave={e=>{e.currentTarget.querySelector("img").style.transform="scale(1)";e.currentTarget.querySelector(".iov").style.opacity="0";}}>
                <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.45s ease", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(44,26,46,0.78) 0%,rgba(44,26,46,0.1) 52%,transparent 100%)" }} />
                <div className="iov" style={{ position:"absolute", inset:0, background:"rgba(192,90,16,0.18)", opacity:0, transition:"opacity 0.3s" }} />
                <div style={{ position:"absolute", bottom:12, left:12, color:"#fff" }}>
                  <div style={{ fontSize:11.5, fontWeight:900, letterSpacing:1.2, textTransform:"uppercase", textShadow:"0 1px 6px rgba(0,0,0,0.6)" }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"#fdd0a0", marginTop:3, fontWeight:700 }}>Shop →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift Hampers Strip */}
        <div style={{ marginBottom:56 }}>
          <div style={{ background:"linear-gradient(90deg,#fdf8f0,#fdf4dc,#fdf0e8,#fdf8f0)", borderRadius:16, padding:"22px 28px", marginBottom:18, textAlign:"center", border:"1px solid #f0e8eb" }}>
            <p style={{ margin:"0 0 5px", fontSize:10.5, fontWeight:900, color:"#92630a", letterSpacing:3.5, textTransform:"uppercase" }}>Curated with Love</p>
            <h2 style={{ margin:"0 0 4px", fontSize:25, fontWeight:900, color:"#2c1a2e", letterSpacing:-0.5 }}>Shop Gift Hampers</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
              <div style={{ width:28, height:2, background:"#c9a84c", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#f0d898", borderRadius:2 }} />
              <div style={{ width:28, height:2, background:"#e8476a", borderRadius:2 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, borderRadius:18, overflow:"hidden", boxShadow:"0 8px 32px rgba(201,168,76,0.15)" }}>
            {[
              { name:"Love Hampers",     img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775229840/hamper1_xk1a83.webp" },
              { name:"Birthday Hampers", img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775229838/hamper9_vyrx0t.webp" },
              { name:"Romantic Sets",    img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775229835/hamper8_djm2oe.webp" },
              { name:"Premium Hampers",  img:"https://res.cloudinary.com/deixioyzo/image/upload/v1775229840/hamper10_g3tvsz.webp" },
            ].map((c,i)=>(
              <div key={i} onClick={()=>navigate('/gift-hampers')}
                style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden", cursor:"pointer" }}
                onMouseEnter={e=>{e.currentTarget.querySelector("img").style.transform="scale(1.1)";e.currentTarget.querySelector(".gov").style.opacity="1";}}
                onMouseLeave={e=>{e.currentTarget.querySelector("img").style.transform="scale(1)";e.currentTarget.querySelector(".gov").style.opacity="0";}}>
                <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.45s ease", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(44,26,46,0.78) 0%,rgba(44,26,46,0.1) 52%,transparent 100%)" }} />
                <div className="gov" style={{ position:"absolute", inset:0, background:"rgba(201,168,76,0.18)", opacity:0, transition:"opacity 0.3s" }} />
                <div style={{ position:"absolute", bottom:12, left:12, color:"#fff" }}>
                  <div style={{ fontSize:11.5, fontWeight:900, letterSpacing:1.2, textTransform:"uppercase", textShadow:"0 1px 6px rgba(0,0,0,0.6)" }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"#f0d898", marginTop:3, fontWeight:700 }}>Shop →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
`;

lines.splice(insertAt, 0, newStrips);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Inserted 3 category strips at line', insertAt);
