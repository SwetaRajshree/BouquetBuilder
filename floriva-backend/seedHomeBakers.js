require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./models/Shop');

const homeBakers = [
  { name: "Cakey Bakey Bhubaneswar", type: "cake", category: "home_baker", area: "Saheed Nagar", city: "Bhubaneswar", keywords: ["home bakery","custom cake","fondant","birthday"], location: { type: "Point", coordinates: [85.8310, 20.2978] } },
  { name: "The Cream Box", type: "cake", category: "home_baker", area: "Gajapati Nagar", city: "Bhubaneswar", keywords: ["home bakery","custom cake","dessert"], location: { type: "Point", coordinates: [85.8162, 20.3001] } },
  { name: "Tiny Delights", type: "cake", category: "home_baker", area: "Patia", city: "Bhubaneswar", keywords: ["cupcakes","home bakery","dessert"], location: { type: "Point", coordinates: [85.8235, 20.3522] } },
  { name: "Creme De La Cakes", type: "cake", category: "home_baker", area: "Chandrasekharpur", city: "Bhubaneswar", keywords: ["custom cake","fondant","premium"], location: { type: "Point", coordinates: [85.8180, 20.3310] } },
  { name: "Yum Yum Cakes", type: "cake", category: "home_baker", area: "Nayapalli", city: "Bhubaneswar", keywords: ["home bakery","cake","dessert"], location: { type: "Point", coordinates: [85.8048, 20.2972] } },
  { name: "Citrus & Crumb", type: "cake", category: "home_baker", area: "Patia", city: "Bhubaneswar", keywords: ["custom cake","dessert","home bakery"], location: { type: "Point", coordinates: [85.8242, 20.3529] } },
  { name: "Leena's Creation", type: "cake", category: "home_baker", area: "Khandagiri", city: "Bhubaneswar", keywords: ["home bakery","birthday cake","dessert"], location: { type: "Point", coordinates: [85.7801, 20.2572] } },
  { name: "Zira Cakes & Bakes", type: "cake", category: "home_baker", area: "Patia", city: "Bhubaneswar", keywords: ["custom cake","home bakery","dessert"], location: { type: "Point", coordinates: [85.8238, 20.3525] } },
  { name: "Crafted Light Bakery", type: "cake", category: "home_baker", area: "Saheed Nagar", city: "Bhubaneswar", keywords: ["premium cake","custom cake","home bakery"], location: { type: "Point", coordinates: [85.8305, 20.2970] } },
  { name: "Rebellion Bakery", type: "cake", category: "home_baker", area: "KIIT", city: "Bhubaneswar", keywords: ["cloud kitchen","dessert","cake"], location: { type: "Point", coordinates: [85.8208, 20.3545] } },
  { name: "Sweet Treats by Riya", type: "cake", category: "home_baker", area: "Jaydev Vihar", city: "Bhubaneswar", keywords: ["home bakery","custom cake","birthday"], location: { type: "Point", coordinates: [85.8189, 20.2960] } },
  { name: "Bake Bliss Bhubaneswar", type: "cake", category: "home_baker", area: "Unit 6", city: "Bhubaneswar", keywords: ["home bakery","cupcakes","dessert"], location: { type: "Point", coordinates: [85.8265, 20.2895] } },
  { name: "Heavenly Cakes", type: "cake", category: "home_baker", area: "Old Town", city: "Bhubaneswar", keywords: ["cake","home bakery","birthday"], location: { type: "Point", coordinates: [85.8332, 20.2405] } },
  { name: "Bake My Day", type: "cake", category: "home_baker", area: "Rasulgarh", city: "Bhubaneswar", keywords: ["custom cake","home bakery","dessert"], location: { type: "Point", coordinates: [85.8610, 20.2915] } },
  { name: "Oven Fresh Home Bakery", type: "cake", category: "home_baker", area: "Kalinga Nagar", city: "Bhubaneswar", keywords: ["home bakery","cake","custom cake"], location: { type: "Point", coordinates: [85.7630, 20.2710] } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const count = await Shop.countDocuments({ type: 'cake', category: 'home_baker' });
  if (count > 0) {
    await Shop.deleteMany({ type: 'cake', category: 'home_baker' });
    console.log('Cleared old home bakers.');
  }
  await Shop.insertMany(homeBakers);
  console.log(`✅ Seeded ${homeBakers.length} home bakers!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
