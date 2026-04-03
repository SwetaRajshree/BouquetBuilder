require('dotenv').config();
const mongoose = require('mongoose');
const Pottery = require('./models/Pottery');

const data = [
  { name: "Blue Ceramic Bird Lotus Vase", category: "Pottery", subCategory: "Ceramic Vase", price: 2200, originalPrice: 3000, currency: "INR", location: "Jaipur, India", artist: "Ramesh Kumhar", description: "Handcrafted ceramic vase featuring a colorful bird and lotus design. Perfect for home decor and artistic interiors.", materials: ["ceramic","glaze"], dimensions: "10-12 inches", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775250612/handmade-ceramic-bud-vase-bird-lotus_ehb1nq.webp", rating: 4.6, reviews: 120, stock: 15, tags: ["ceramic vase","bird design pottery","lotus vase","handmade decor","artistic pottery","home decoration","jaipur pottery"] },
  { name: "Hand-Carved Ceramic Face Sculpture", category: "Pottery", subCategory: "Decor Sculpture", price: 1800, originalPrice: 2500, currency: "INR", location: "Rajasthan, India", artist: "Meena Devi", description: "Unique hand-carved ceramic sculpture representing nature and human expression. Ideal for artistic display.", materials: ["clay","ceramic"], dimensions: "8-10 inches", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775250613/hand-carved-ceramic-sculptures-bringing_t3nnrx.webp", rating: 4.5, reviews: 85, stock: 10, tags: ["ceramic sculpture","face art pottery","decor sculpture","handcrafted clay art","modern pottery","art piece"] },
  { name: "Terracotta Dinnerware Set", category: "Pottery", subCategory: "Kitchenware", price: 1800, originalPrice: 2500, currency: "INR", location: "Rajasthan, India", artist: "Meena Devi", description: "Eco-friendly handmade terracotta dinner set including plates, bowls, and cups. Traditional and sustainable.", materials: ["terracotta","clay"], dimensions: "Full set", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775250612/handmade-terracotta-dinnerware-set_oerjpy.webp", rating: 4.7, reviews: 150, stock: 20, tags: ["terracotta dinner set","clay utensils","eco friendly kitchenware","handmade pottery","traditional cookware","rustic dining"] },
  { name: "Handmade Ceramic Flower Bouquet", category: "Pottery", subCategory: "Decor", price: 950, originalPrice: 1400, currency: "INR", location: "Uttar Pradesh, India", artist: "Suresh Prajapat", description: "Everlasting ceramic flower arrangement crafted with vibrant colors. Adds elegance to interiors.", materials: ["ceramic","paint"], dimensions: "12 inches", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775250613/handmade-ceramic-flowerseverlasting_owgdml.webp", rating: 4.4, reviews: 60, stock: 25, tags: ["ceramic flowers","flower vase decor","handmade bouquet","home decor","colorful pottery","gift item"] },
  { name: "Family Ceramic Bud Vases Set", category: "Pottery", subCategory: "Mini Vases", price: 1200, originalPrice: 1800, currency: "INR", location: "Pune, India", artist: "Priya Sharma", description: "Set of handcrafted ceramic bud vases with artistic human designs. Perfect for minimal decor styling.", materials: ["ceramic"], dimensions: "6-8 inches", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775250613/family-ceramic-bud-vases-pottery_xmjuce.webp", rating: 4.6, reviews: 90, stock: 18, tags: ["bud vases","ceramic mini vases","artistic pottery","home decor set","modern ceramic","designer vases"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Pottery.deleteMany({});
  await Pottery.insertMany(data);
  console.log(`✅ Seeded ${data.length} pottery items!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
