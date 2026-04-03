require('dotenv').config();
const mongoose = require('mongoose');
const WoodenSculpture = require('./models/WoodenSculpture');

const data = [
  { name: "Tirupati Balaji Wooden Wall Mount", category: "wooden_sculpture", price: 18500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240705/wooden-tirupati-balaji-wall-mount_qs0cxw.webp", description: "Intricately carved wooden Tirupati Balaji wall mount, perfect for spiritual home décor and temple aesthetics.", tags: ["balaji","tirupati","wood carving","wall decor","hindu god","spiritual art","temple decor","premium wooden art"], material: "teak wood", rating: 4.8, stock: 15 },
  { name: "Murugan Mayil Vahanam Wooden Sculpture", category: "wooden_sculpture", price: 16200, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240709/murugan-s-mayil-vahanam_s9kyls.webp", description: "Beautiful handcrafted Lord Murugan with peacock (Mayil Vahanam), a symbol of strength and devotion.", tags: ["murugan","peacock","mayil","wood sculpture","indian art","temple decor","religious statue"], material: "sheesham wood", rating: 4.7, stock: 10 },
  { name: "Lord Ganesha Wooden Idol", category: "wooden_sculpture", price: 14900, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240716/godess_ganesh_gzvmgb.webp", description: "Premium carved wooden Ganesha idol symbolizing wisdom, prosperity, and good fortune.", tags: ["ganesha","ganpati","wood idol","hindu god","decor","home temple","auspicious gift"], material: "teak wood", rating: 4.9, stock: 20 },
  { name: "Goddess Amman Wooden Sculpture", category: "wooden_sculpture", price: 15800, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240708/godess_amman_fptq8u.webp", description: "Traditional wooden sculpture of Goddess Amman, handcrafted with vibrant detailing.", tags: ["amman","goddess","wood carving","religious decor","indian culture","spiritual statue"], material: "rosewood", rating: 4.6, stock: 12 },
  { name: "Ram Darbar Wooden Wall Hanging", category: "wooden_sculpture", price: 17200, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240717/ram_darbar_wall_hanging_vlw05x.webp", description: "Exquisite Ram Darbar wooden wall panel featuring Lord Rama, Sita, Lakshmana, and Hanuman.", tags: ["ram darbar","rama","hanuman","wall art","wood panel","religious decor"], material: "teak wood", rating: 4.8, stock: 8 },
  { name: "Radha Krishna Wooden Carved Panel", category: "wooden_sculpture", price: 19500, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775240718/Radha_krishna_doebwx.webp", description: "Elegant Radha Krishna wooden carving showcasing divine love and artistic craftsmanship.", tags: ["radha krishna","wood carving","love symbol","indian art","wall decor","premium sculpture"], material: "sheesham wood", rating: 4.9, stock: 6 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await WoodenSculpture.deleteMany({});
  await WoodenSculpture.insertMany(data);
  console.log(`✅ Seeded ${data.length} wooden sculptures!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
