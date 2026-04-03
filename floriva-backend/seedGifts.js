require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('./models/Gift');

const gifts = [
  { name: "Pink Lily Crochet Bouquet", category: "Flowers", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237006/flower4_bkj8u3.webp", tags: ["crochet","pink lily","romantic","handmade","gift","soft"], rating: 4.8, description: "Beautiful handmade pink lily crochet bouquet, perfect for romantic and aesthetic gifting." },
  { name: "Sunflower Crochet Bouquet", category: "Flowers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237006/flower6_gshmui.webp", tags: ["sunflower","bright","happy","handmade","gift"], rating: 4.7, description: "Bright sunflower crochet bouquet that spreads happiness and positivity." },
  { name: "White Lily Elegant Bouquet", category: "Flowers", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237005/flower3.jpg_ym4oaf.jpg", tags: ["white lily","elegant","premium","gift","minimal"], rating: 4.6, description: "Elegant white lily bouquet designed for classy and minimal gifting." },
  { name: "Cute Pink Floral Wrap", category: "Flowers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237004/flower5_kkimne.webp", tags: ["pink","cute","bouquet","gift","soft"], rating: 4.5, description: "Soft pink floral crochet bouquet with a cute and charming vibe." },
  { name: "Red Tulip Crochet Bouquet", category: "Flowers", price: 549, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237003/flower2_kszvls.webp", tags: ["tulip","red","love","romantic","gift"], rating: 4.7, description: "Romantic red tulip bouquet made with crochet craftsmanship." },
  { name: "Mixed Crochet Flower Basket", category: "Flowers", price: 749, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775237002/flower8_j1bdyr.webp", tags: ["mixed flowers","colorful","premium","gift","handmade"], rating: 4.9, description: "A vibrant mix of crochet flowers arranged beautifully for premium gifting." },
  { name: "Pastel Tulip Crochet Bouquet", category: "Flowers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236999/Pipe_cleaners4.jpg_ynj7dp.jpg", tags: ["tulip","pastel","cute","gift","aesthetic"], rating: 4.6, description: "Pastel-themed tulip bouquet perfect for aesthetic and soft gifting." },
  { name: "Peach Floral Crochet Bundle", category: "Flowers", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236998/Pipe_cleaners3.jpg_hjfabm.jpg", tags: ["peach","soft","floral","gift","handmade"], rating: 4.5, description: "Peach-themed crochet floral bundle designed for warm and cozy gifting." },
  { name: "Classic Red Rose Crochet Bouquet", category: "Flowers", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236998/Pipe_cleaners5.jpg_jprfkd.jpg", tags: ["rose","red","love","romantic","valentine"], rating: 4.8, description: "Classic red rose bouquet symbolizing love and passion." },
  { name: "Sunflower Daisy Crochet Combo", category: "Flowers", price: 749, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236995/Pipe_cleaners2.jpg_x7ns6l.jpg", tags: ["sunflower","daisy","bright","combo","gift"], rating: 4.7, description: "A joyful combination of sunflowers and daisies for cheerful gifting." },
  { name: "Rose Baby Breath Crochet Bouquet", category: "Flowers", price: 799, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775236995/Pipe_cleaners1.jpg_wjdhrw.jpg", tags: ["rose","baby breath","premium","romantic"], rating: 4.9, description: "Premium crochet bouquet with roses and baby breath detailing." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Gift.deleteMany({ category: 'Flowers' });
  await Gift.insertMany(gifts);
  console.log(`✅ Seeded ${gifts.length} forever flower gifts!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
