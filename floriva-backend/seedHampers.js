require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('./models/Gift');

const gifts = [
  { name: "Cute Plush Love Hamper", category: "Gift Hampers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229840/hamper1_xk1a83.webp", tags: ["love","plush","soft toys","romantic","gift box","cute","valentine"], rating: 4.8, description: "Adorable hamper with plush toys, scrunchies, and accessories perfect for gifting your loved ones." },
  { name: "Light-Up Memory Hamper", category: "Gift Hampers", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229839/hamper_cfomvt.webp", tags: ["led lights","photo frame","memories","romantic","custom gift"], rating: 4.7, description: "Beautiful LED hamper with photo memories, jewelry, and aesthetic decor items." },
  { name: "Princess Theme Blue Hamper", category: "Gift Hampers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229838/hamper6_p6ggsq.webp", tags: ["princess","blue theme","cute","gift box","girls gift"], rating: 4.6, description: "Elegant blue themed hamper with accessories, bows, and aesthetic goodies." },
  { name: "Plum Berry Combo Hamper", category: "Gift Hampers", price: 549, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229837/hamper2_qbjvqi.webp", tags: ["purple","combo","premium","jewelry","gift set"], rating: 4.7, description: "Premium purple themed hamper with jewelry and curated accessories." },
  { name: "Love Message Hamper", category: "Gift Hampers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229838/hamper5_fzxpdt.webp", tags: ["love","message card","romantic","gift box"], rating: 4.6, description: "Romantic hamper with love notes, accessories, and cute decorative items." },
  { name: "Birthday Surprise Hamper", category: "Gift Hampers", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229838/hamper9_vyrx0t.webp", tags: ["birthday","surprise","kinder joy","decor","celebration"], rating: 4.9, description: "Fun birthday hamper with chocolates, toys, and festive decorations." },
  { name: "Bold Petals Aesthetic Hamper", category: "Gift Hampers", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229840/hamper7_t7zbvl.webp", tags: ["aesthetic","scrunchies","jewelry","cute","gift box"], rating: 4.7, description: "Trendy aesthetic hamper with scrunchies, jewelry, and soft accessories." },
  { name: "Romantic Red Love Hamper", category: "Gift Hampers", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229835/hamper8_djm2oe.webp", tags: ["red","love","valentine","romantic","gift set"], rating: 4.8, description: "Romantic red themed hamper with bangles, teddy, and love accessories." },
  { name: "Premium Birthday Jewelry Hamper", category: "Gift Hampers", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775229840/hamper10_g3tvsz.webp", tags: ["birthday","jewelry","premium","celebration","gift box"], rating: 4.9, description: "Premium birthday hamper with jewelry, decor items, and festive packaging." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Gift.deleteMany({ category: 'Gift Hampers' });
  await Gift.insertMany(gifts);
  console.log(`✅ Seeded ${gifts.length} gift hampers!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
