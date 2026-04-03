require('dotenv').config();
const mongoose = require('mongoose');
const Collection = require('./models/Collection');

const data = [
  { name:"Gold Knot Hoop Earrings", category:"earrings", price:29.99, material:"gold plated", stock:50, rating:4.5, reviews:120, description:"Elegant gold knot hoop earrings designed for everyday wear and special occasions.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/earing_l73gr3.webp"], tags:["gold earrings","hoop earrings","minimal jewelry"], isFeatured:true },
  { name:"Star & Shell Charm Earrings Set", category:"earrings", price:34.99, material:"gold plated", stock:40, rating:4.6, reviews:95, description:"Charm earrings set with starfish and shell design.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/earing1_bud5bj.webp"], tags:["charm earrings","beach jewelry"] },
  { name:"Triple Drop Gold Earrings", category:"earrings", price:27.99, material:"gold plated", stock:35, rating:4.4, reviews:70, description:"Modern triple drop gold earrings.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220920/earing2_hvwktf.webp"], tags:["drop earrings","statement earrings"] },
  { name:"Multicolor Heart Drop Earrings", category:"earrings", price:31.99, material:"gold plated", stock:25, rating:4.7, reviews:110, description:"Colorful heart-shaped drop earrings.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220924/earing3_lwcvqm.webp"], tags:["heart earrings","colorful jewelry"], isFeatured:true },
  { name:"Vintage Coin Gold Bracelet", category:"bracelets", price:39.99, material:"gold plated", stock:30, rating:4.8, reviews:140, description:"Vintage coin style bracelet.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220922/breclate_qlqz5e.webp"], tags:["coin bracelet","vintage"], isFeatured:true },
  { name:"Minimal Open Cuff Bracelet", category:"bracelets", price:22.99, material:"gold plated", stock:60, rating:4.3, reviews:65, description:"Minimal cuff bracelet.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/bracelet1_ytlvaw.webp"], tags:["cuff bracelet"] },
  { name:"Crystal Tennis Bracelet", category:"bracelets", price:44.99, material:"gold plated", stock:20, rating:4.9, reviews:200, description:"Sparkling crystal tennis bracelet.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/bracelet2_dxakzm.webp"], tags:["tennis bracelet"], isFeatured:true },
  { name:"Layered Diamond Bangle", category:"bracelets", price:49.99, material:"gold plated", stock:15, rating:4.8, reviews:150, description:"Layered diamond bangle.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/bracelet4_fbsslu.webp"], tags:["bangle"] },
  { name:"Heart Charm Bracelet", category:"bracelets", price:35.99, material:"gold plated", stock:25, rating:4.7, reviews:130, description:"Heart charm bracelet.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/bracelet6_yf7bsr.webp"], tags:["heart bracelet"] },
  { name:"Pearl Wave Bracelet", category:"bracelets", price:38.99, material:"gold plated", stock:18, rating:4.6, reviews:85, description:"Wave bracelet with pearls.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/bracelet7_ysndds.webp"], tags:["pearl bracelet"] },
  { name:"Colorful Heart Chain Necklace", category:"necklaces", price:29.99, material:"gold plated", stock:45, rating:4.5, reviews:100, description:"Colorful heart necklace.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/neck_h5hysm.webp"], tags:["heart necklace"] },
  { name:"Double Stone Pendant Necklace", category:"necklaces", price:33.99, material:"gold plated", stock:35, rating:4.6, reviews:75, description:"Double stone pendant.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220923/neck1_o14rkk.webp"], tags:["pendant"] },
  { name:"Diamond Solitaire Necklace", category:"necklaces", price:54.99, material:"gold plated", stock:20, rating:4.9, reviews:210, description:"Classic solitaire necklace.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220922/neck3_m0tdmn.webp"], tags:["diamond"] },
  { name:"Green Flower Pendant Necklace", category:"necklaces", price:36.99, material:"gold plated", stock:28, rating:4.7, reviews:90, description:"Flower pendant necklace.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220922/neck4_hnsims.webp"], tags:["flower"] },
  { name:"Cross Diamond Necklace", category:"necklaces", price:42.99, material:"gold plated", stock:22, rating:4.8, reviews:140, description:"Cross diamond necklace.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220922/neck5_c4bnif.webp"], tags:["cross"] },
  { name:"Emerald Cut Solitaire Ring", category:"rings", price:39.99, material:"gold plated", stock:30, rating:4.8, reviews:150, description:"Emerald cut solitaire ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/ring_fzi8rw.webp"], tags:["solitaire"] },
  { name:"Double Square Crystal Ring", category:"rings", price:34.99, material:"gold plated", stock:25, rating:4.6, reviews:90, description:"Double square crystal ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/ring1_zdvgoy.webp"], tags:["open ring"] },
  { name:"Twisted Gold Band Ring", category:"rings", price:28.99, material:"gold plated", stock:40, rating:4.5, reviews:70, description:"Twisted band ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/ring2_b29zkd.webp"], tags:["band ring"] },
  { name:"Diamond Eternity Ring", category:"rings", price:44.99, material:"gold plated", stock:20, rating:4.9, reviews:210, description:"Eternity diamond ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220922/ring3_rocx9s.webp"], tags:["diamond"], isFeatured:true },
  { name:"Minimal Wave Diamond Ring", category:"rings", price:32.99, material:"gold plated", stock:35, rating:4.6, reviews:85, description:"Wave diamond ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/ring4_prrv9h.webp"], tags:["minimal"] },
  { name:"Pear Cut Open Ring", category:"rings", price:36.99, material:"gold plated", stock:28, rating:4.7, reviews:110, description:"Pear cut open ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220921/ring5_kbrw7l.webp"], tags:["pear"] },
  { name:"Dual Stone Statement Ring", category:"rings", price:38.99, material:"gold plated", stock:22, rating:4.8, reviews:130, description:"Dual stone statement ring.", images:["https://res.cloudinary.com/deixioyzo/image/upload/v1775220920/ring6_gfknqk.webp"], tags:["statement"] },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Collection.deleteMany({});
    await Collection.insertMany(data);
    console.log(`✅ Seeded ${data.length} collection items`);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
