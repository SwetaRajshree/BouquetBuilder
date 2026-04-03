require('dotenv').config();
const mongoose = require('mongoose');
const Painting = require('./models/Painting');

const data = [
  { name: "Water Lilies Wall Painting", category: "Painting", price: 799, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235996/Water_Lilies_Wall_Painting_zzyz1a.jpg", tags: ["painting","wall art","lotus","nature","home decor","canvas"], rating: 4.7, description: "Elegant lotus water lilies canvas painting perfect for modern interiors." },
  { name: "Madhubani Nature Wall Art", category: "Painting", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235996/Madhubhani_Nature_Wall_Art_muaiij.webp", tags: ["madhubani","indian art","traditional","nature","wall decor"], rating: 4.8, description: "Traditional Madhubani art showcasing vibrant nature elements." },
  { name: "Lord Jagannath Pattachitra Painting", category: "Painting", price: 749, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235996/Lord_Jagannath_Pattachitra_Painting_wuzrlh.webp", tags: ["pattachitra","lord jagannath","religious","spiritual","indian art"], rating: 4.9, description: "Sacred Pattachitra painting of Lord Jagannath with intricate detailing." },
  { name: "Chhath Puja Traditional Painting", category: "Painting", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235996/chhath_puja...mahaparav_l6qdvg.jpg", tags: ["chhath puja","festival","indian culture","traditional","folk art"], rating: 4.6, description: "Cultural painting representing Chhath Puja traditions and rituals." },
  { name: "Vana Gopala Krishna Wall Art", category: "Painting", price: 799, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235993/Vana_Gopala_Wall_Art_With_Resin_Frame_zqqbir.webp", tags: ["krishna","god","religious","wall decor","spiritual"], rating: 4.9, description: "Beautiful Krishna artwork surrounded by nature for peaceful vibes." },
  { name: "Warli Tribal Art Painting", category: "Painting", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775235991/Charming_Traditional_Indian_Folk_Art_Warli_Canvas_Wall_Painting_qel85l.webp", tags: ["warli","tribal","minimal","indian folk art","wall decor"], rating: 4.7, description: "Minimalist Warli tribal painting showcasing traditional lifestyle." },
  { name: "Madhubani Ramayana Scene Painting", category: "Painting", price: 799, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236509/Madhubani_Ramayana_Scene_Canvas_Wall_Cultural_Decor_Painting_pphmhv.webp", tags: ["ramayana","madhubani","mythology","indian art","wall decor"], rating: 4.8, description: "Detailed Madhubani painting depicting a scene from the Ramayana." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Painting.deleteMany({});
  await Painting.insertMany(data);
  console.log(`✅ Seeded ${data.length} paintings!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
