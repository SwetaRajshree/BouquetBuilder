require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('./models/Gift');

const gifts = [
  { name: "Tulip Infinity Mirror Lamp", category: "Instant Gifts", price: 499, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232385/Desidiya_DIY_Infinity_Mirror_Tulip_Cube_LED_Lamp_-_20_LED_Flower_Lights_Dual-Purpose_Tabletop_Mirror_Decor_ihxp79.webp", tags: ["lamp","led","romantic","gift","decor","tulip"], rating: 4.6, description: "Aesthetic LED tulip mirror lamp perfect for romantic and instant gifting." },
  { name: "3D Crystal Ball Night Lamp", category: "Instant Gifts", price: 549, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232385/8cm_3D_Crystal_Ball_Night_Lamp_wabcbq.webp", tags: ["crystal","lamp","night","gift","premium"], rating: 4.7, description: "Elegant glowing crystal ball lamp for night decor and gifting." },
  { name: "Opal Moon Hanging Charm", category: "Home Decor", price: 399, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232386/Sparkling_Opal_Moon_Charm_for_Home_Decor_16.5_inches_Decorative_White_Opal_Acrylic_Crescent_Hanging_Charm_Auspicious_Home_Gift_Wall_Hangings_Car_Charm_jskmam.jpg", tags: ["moon","hanging","decor","aesthetic","gift"], rating: 4.5, description: "Beautiful moon charm wall hanging with sparkling reflections." },
  { name: "Evil Eye Dream Catcher", category: "Home Decor", price: 349, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232386/Evil_Eye_Dream_Catcher_amtnyo.webp", tags: ["dreamcatcher","evil eye","boho","decor"], rating: 4.4, description: "Protective evil eye dream catcher for home positivity." },
  { name: "Classic Dream Catcher", category: "Home Decor", price: 299, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232387/dream_catcher_1_ho6iet.jpg", tags: ["dreamcatcher","feather","boho","wall decor"], rating: 4.3, description: "Handcrafted dream catcher with feathers and crochet design." },
  { name: "Lotus Toran Wall Hanging Set", category: "Home Decor", price: 449, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232386/Torans_-_Pink_Wood_Lotus_Flower_Decorative_Wall_Hanging_for_Home_Decor_Set_of_4_-_Pepperfry_ky4hpx.webp", tags: ["lotus","toran","festival","decor","traditional"], rating: 4.6, description: "Traditional lotus toran for festive home decoration." },
  { name: "Royal Fort Wall Art Set", category: "Wall Art", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232388/Artvibes_Royal_Fort_And_Rides_Moder_Art_Decorative_Wall_Art_MDF_Wooden_Wall_Hanger_for_Home_uommk3.webp", tags: ["wall art","royal","indian","decor"], rating: 4.7, description: "Modern Indian royal fort themed decorative wall art." },
  { name: "Indian Floral Wall Art Set", category: "Wall Art", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232388/Blue_Indian_Floral_Charm_Wall_Art_-_Set_of_Seven_sddgue.webp", tags: ["floral","wall art","indian","premium"], rating: 4.8, description: "Premium floral wall art set for aesthetic interiors." },
  { name: "Flamingo Wall Art Set", category: "Wall Art", price: 499, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232389/flamingo_set_of_3_vz7pe2.webp", tags: ["flamingo","modern","wall decor"], rating: 4.5, description: "Colorful flamingo themed wall art set." },
  { name: "Modern Frame Set (4 Pieces)", category: "Wall Art", price: 549, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232389/frames_of_4_iopdj0.webp", tags: ["frames","modern","decor","minimal"], rating: 4.4, description: "Minimal modern frame set for stylish interiors." },
  { name: "Wooden Hanging Frames", category: "Wall Art", price: 399, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775232392/Wooden_Frames_Hanging_on_a_Wall_ife7gk.jpg", tags: ["wooden","frames","rustic","decor"], rating: 4.3, description: "Rustic wooden hanging frames for cozy decor." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Gift.deleteMany({ category: { $in: ['Instant Gifts', 'Home Decor', 'Wall Art'] } });
  await Gift.insertMany(gifts);
  console.log(`✅ Seeded ${gifts.length} instant gifts!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
