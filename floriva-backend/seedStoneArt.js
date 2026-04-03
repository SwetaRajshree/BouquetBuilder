require('dotenv').config();
const mongoose = require('mongoose');
const StoneArt = require('./models/StoneArt');

const data = [
  { name: "Sandstone Ganesha Idol", category: "Stone Art", type: "Religious Sculpture", material: "Sandstone", price: 12500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248065/2-feet-Ganesha-Idol_blackignite_xd7oyc.jpg", description: "Hand-carved sandstone Ganesha idol crafted with traditional Indian techniques.", keywords: ["ganesha statue","sandstone idol","stone ganesha murti","home temple decor","indian handicraft"] },
  { name: "Marble Ganesha Statue", category: "Stone Art", type: "Religious Sculpture", material: "Marble", price: 9800, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248045/18-inch-marble-Ganesha-statue_jsjtv0.jpg", description: "Elegant marble Ganesha idol perfect for home temples and gifting.", keywords: ["marble ganesha","white ganesha idol","spiritual decor","home temple statue"] },
  { name: "Ram Darbar Statue", category: "Stone Art", type: "Temple Sculpture", material: "Stone", price: 28500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248066/2-feet-Ram-Darbar-statue_ai8mi3.jpg", description: "Intricately carved Ram Darbar statue depicting Lord Rama, Sita, Lakshmana, and Hanuman.", keywords: ["ram darbar statue","hindu temple sculpture","stone carving india"] },
  { name: "Krishna Stone Statue", category: "Stone Art", type: "Religious Sculpture", material: "Granite", price: 24000, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248065/2-feet-krishna-statue-jpg_blackignite_qtybxc.webp", description: "Beautiful Krishna statue carved in black granite with detailed craftsmanship.", keywords: ["krishna statue","granite sculpture","god idol","home decor spiritual"] },
  { name: "Garuda Stone Statue", category: "Stone Art", type: "Temple Sculpture", material: "Granite", price: 32000, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248065/3-feet-Garuda-Statue_blackignite_jtox0y.jpg", description: "Large Garuda statue crafted from premium stone, ideal for temple installations.", keywords: ["garuda statue","temple sculpture","granite carving","indian stone art"] },
  { name: "Black Buddha Statue", category: "Stone Art", type: "Meditation Sculpture", material: "Black Stone", price: 35000, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248064/4-feet-black-buddha-statue-jpg_blackignite_ciljlq.webp", description: "Peaceful Buddha statue designed for meditation spaces and luxury decor.", keywords: ["buddha statue","black stone sculpture","meditation decor","zen decor"] },
  { name: "Sandstone Buddha Statue", category: "Stone Art", type: "Meditation Sculpture", material: "Sandstone", price: 15500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775247893/20-inch-Stone-Buddha-Statue_sandstone_f1pzxy.jpg", description: "Classic sandstone Buddha statue symbolizing peace and harmony.", keywords: ["buddha idol","sandstone statue","spiritual decor","peace statue"] },
  { name: "Classic Buddha Stone Statue", category: "Stone Art", type: "Meditation Sculpture", material: "Stone", price: 16500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248004/2-feet-buddha-statue-online-1_joxqbf.png", description: "Traditional Buddha statue crafted in fine stone, ideal for peaceful interiors and meditation spaces.", keywords: ["buddha statue","stone buddha idol","meditation decor","spiritual sculpture"] },
  { name: "Hanuman Stone Statue", category: "Stone Art", type: "Religious Sculpture", material: "Sandstone", price: 18500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775247893/2-feet-Hanuman-statue_sandstone2_ptuwhw.jpg", description: "Detailed Hanuman statue symbolizing strength and devotion.", keywords: ["hanuman statue","stone idol","hindu god statue","home temple decor"] },
  { name: "Modern Stone Face Sculpture", category: "Stone Art", type: "Modern Art", material: "Stone", price: 7200, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775247893/sandstone1_mxyikt.webp", description: "Abstract modern face sculpture ideal for contemporary interiors.", keywords: ["modern sculpture","stone art decor","abstract face statue"] },
  { name: "Pebble Deer Art", category: "Stone Art", type: "Pebble Art", material: "Natural Stones", price: 3200, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248021/pebble_art1_dpqrjs.jpg", description: "Creative deer artwork made using natural pebbles.", keywords: ["pebble art","stone wall decor","animal stone art"] },
  { name: "Pebble Family Frame", category: "Stone Art", type: "Pebble Art", material: "Natural Stones", price: 2800, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248020/pebble_art2_jqw4rd.jpg", description: "Handcrafted pebble art representing family love and bonding.", keywords: ["family art","pebble frame","home decor gift"] },
  { name: "Pebble Tree Art", category: "Stone Art", type: "Pebble Art", material: "Natural Stones", price: 3000, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248019/pebble_art3_kd4sak.jpg", description: "Beautiful tree artwork made from pebbles and natural elements.", keywords: ["tree art","stone artwork","nature decor"] },
  { name: "Pebble Couple Art", category: "Stone Art", type: "Pebble Art", material: "Natural Stones", price: 3100, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248020/pebble_art4_wcmbzr.webp", description: "Romantic pebble art showing a couple sitting under a tree.", keywords: ["couple art","romantic decor","stone frame art"] },
  { name: "Pebble Flower Frame", category: "Stone Art", type: "Pebble Art", material: "Natural Stones", price: 2600, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775248019/pebble_art5_igmvbq.webp", description: "Colorful pebble flower artwork for vibrant home decoration.", keywords: ["flower art","colorful decor","handmade stone art"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await StoneArt.deleteMany({});
  await StoneArt.insertMany(data);
  console.log(`✅ Seeded ${data.length} stone art items!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
