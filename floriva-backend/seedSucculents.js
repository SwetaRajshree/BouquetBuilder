require("dotenv").config();
const mongoose = require("mongoose");
const Plant = require("./models/Plant");

const succulents = [
  { name: "Cactus Trio Set",    category: "Succulents", type: "Succulent", emotion: "Resilience", occasion: ["Home Decor"], availability: "All season", pricePerStem: 99,  price: 99,  original: 179, discount: 45, priceRange: { min: 60,  max: 150 }, color: "Green", img: "🌵", city: "Bhubaneswar", nursery: "Desert Dreams, Rajasthan",      inStock: true },
  { name: "Aloe Vera Pot",      category: "Succulents", type: "Succulent", emotion: "Healing",    occasion: ["Home"],      availability: "All season", pricePerStem: 89,  price: 89,  original: 149, discount: 40, priceRange: { min: 60,  max: 130 }, color: "Green", img: "🌿", city: "Bhubaneswar", nursery: "Roots & Leaves, Bangalore",   inStock: true },
  { name: "Jade Plant",         category: "Succulents", type: "Succulent", emotion: "Good Luck",  occasion: ["Gift"],      availability: "All season", pricePerStem: 129, price: 129, original: 199, discount: 35, priceRange: { min: 80,  max: 200 }, color: "Green", img: "🌱", city: "Bhubaneswar", nursery: "Green Valley Nursery, Pune",  inStock: true },
  { name: "Echeveria Rosette",  category: "Succulents", type: "Succulent", emotion: "Beauty",     occasion: ["Decor"],     availability: "All season", pricePerStem: 79,  price: 79,  original: 129, discount: 39, priceRange: { min: 50,  max: 120 }, color: "Pink",  img: "🪸", city: "Bhubaneswar", nursery: "Desert Dreams, Rajasthan",      inStock: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  await Plant.insertMany(succulents);
  console.log(`✅ Added ${succulents.length} succulents!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
