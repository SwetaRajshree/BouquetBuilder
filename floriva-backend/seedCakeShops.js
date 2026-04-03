require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./models/Shop');

const cakeShops = [
  { name: "Monginis Cake Shop", type: "cake", category: "shop", area: "Saheed Nagar", city: "Bhubaneswar", keywords: ["cake","bakery","birthday","dessert","pastry"], location: { type: "Point", coordinates: [85.8315, 20.2980] } },
  { name: "Choco Galleria", type: "cake", category: "shop", area: "Patia", city: "Bhubaneswar", keywords: ["cake","chocolate","dessert","premium"], location: { type: "Point", coordinates: [85.8240, 20.3535] } },
  { name: "Mother's Oven", type: "cake", category: "shop", area: "Unit 4", city: "Bhubaneswar", keywords: ["cake","bakery","snacks","fast delivery"], location: { type: "Point", coordinates: [85.8248, 20.2856] } },
  { name: "Just Bake", type: "cake", category: "shop", area: "Patia", city: "Bhubaneswar", keywords: ["cake","custom cake","bakery"], location: { type: "Point", coordinates: [85.8223, 20.3538] } },
  { name: "Cake N Candy", type: "cake", category: "shop", area: "Nayapalli", city: "Bhubaneswar", keywords: ["cake","pastry","dessert","birthday"], location: { type: "Point", coordinates: [85.8052, 20.2968] } },
  { name: "Fruitolite Bakery", type: "cake", category: "shop", area: "Saheed Nagar", city: "Bhubaneswar", keywords: ["cake","bakery","snacks"], location: { type: "Point", coordinates: [85.8318, 20.2975] } },
  { name: "N-joy Cookies", type: "cake", category: "shop", area: "Patia", city: "Bhubaneswar", keywords: ["cookies","cake","dessert"], location: { type: "Point", coordinates: [85.8251, 20.3527] } },
  { name: "Coffeekery Mother Foods", type: "cake", category: "shop", area: "Chandrasekharpur", city: "Bhubaneswar", keywords: ["cake","coffee","bakery"], location: { type: "Point", coordinates: [85.8187, 20.3302] } },
  { name: "Sonali Bakery", type: "cake", category: "shop", area: "Old Town", city: "Bhubaneswar", keywords: ["cake","bakery","budget"], location: { type: "Point", coordinates: [85.8335, 20.2398] } },
  { name: "Cake Corner", type: "cake", category: "shop", area: "Khandagiri", city: "Bhubaneswar", keywords: ["cake","dessert","birthday"], location: { type: "Point", coordinates: [85.7792, 20.2565] } },
  { name: "Friend's Bakery", type: "cake", category: "shop", area: "Rasulgarh", city: "Bhubaneswar", keywords: ["cake","bakery","pastry","dessert"], location: { type: "Point", coordinates: [85.8615, 20.2921] } },
  { name: "The Cookies World", type: "cake", category: "shop", area: "Patia", city: "Bhubaneswar", keywords: ["cookies","cake","dessert","bakery"], location: { type: "Point", coordinates: [85.8230, 20.3515] } },
  { name: "Ganguram Sweets", type: "cake", category: "shop", area: "Janpath", city: "Bhubaneswar", keywords: ["cake","sweets","dessert","indian sweets"], location: { type: "Point", coordinates: [85.8289, 20.2695] } },
  { name: "Cheesecake Masters", type: "cake", category: "shop", area: "Patia", city: "Bhubaneswar", keywords: ["cheesecake","cake","premium","dessert"], location: { type: "Point", coordinates: [85.8248, 20.3530] } },
  { name: "Milly's Patisserie", type: "cake", category: "shop", area: "KIIT Square", city: "Bhubaneswar", keywords: ["patisserie","cake","dessert","premium"], location: { type: "Point", coordinates: [85.8205, 20.3540] } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const count = await Shop.countDocuments({ type: 'cake', category: 'shop' });
  if (count > 0) {
    await Shop.deleteMany({ type: 'cake', category: 'shop' });
    console.log('Cleared old cake shops.');
  }
  await Shop.insertMany(cakeShops);
  console.log(`✅ Seeded ${cakeShops.length} cake shops!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
