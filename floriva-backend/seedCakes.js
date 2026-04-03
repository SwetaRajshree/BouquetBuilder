require('dotenv').config();
const mongoose = require('mongoose');
const Cake = require('./models/Cake');

const cakes = [
  { name: "Royal Citrus Wedding Cake", category: "Wedding", price: 999, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224453/4-tier_Cake_With_Sliced_Oranges_on_Surface_bgfgmb.jpg", tags: ["wedding","premium","fruit","multi-tier"], rating: 4.8, description: "Elegant multi-tier wedding cake with fresh citrus toppings." },
  { name: "Golden Rose Anniversary Cake", category: "Anniversary", price: 899, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224480/Delicate_Pink_Cake_with_Floral_Decoration_cm7o0k.jpg", tags: ["anniversary","rose","gold","romantic"], rating: 4.7 },
  { name: "Floral Garden Cake", category: "Wedding", price: 949, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224433/Elegant_Wedding_Cake_Decorated_with_Floral_Arrangements_qsyohl.jpg", tags: ["floral","wedding","premium"], rating: 4.6 },
  { name: "Colorful Flower Cake", category: "Birthday", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224524/Cake_for_Birthday_piqc45.jpg", tags: ["birthday","colorful","flowers"], rating: 4.5 },
  { name: "Minimal Floral Cake", category: "Dessert", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224526/Elegantly_Decorated_Floral_Cake_on_Display_ntuocf.jpg", tags: ["simple","floral","modern"], rating: 4.3 },
  { name: "Pink Celebration Cake", category: "Birthday", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224480/Delicate_Pink_Cake_with_Floral_Decoration_cm7o0k.jpg", tags: ["pink","cute","birthday"], rating: 4.4 },
  { name: "Thank You Cake", category: "Occasion", price: 499, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224535/Decorative_Thank_You_Cake_with_Floral_Decoration_vskpnw.jpg", tags: ["custom","message","gift"], rating: 4.2 },
  { name: "Classic Cream Cake", category: "Dessert", price: 399, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224428/Mouthwatering_White_Cake_with_Berries_Topping_pdumgn.jpg", tags: ["classic","cream"], rating: 4.1 },
  { name: "Heart Shape Love Cake", category: "Anniversary", price: 799, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224429/Elegant_Heart-Shaped_White_Cake_on_Display_ulnqgp.jpg", tags: ["heart","love","romantic"], rating: 4.7 },
  { name: "Berry Delight Cake", category: "Dessert", price: 649, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224428/Mouthwatering_White_Cake_with_Berries_Topping_pdumgn.jpg", tags: ["berries","fresh","fruit"], rating: 4.6 },
  { name: "Chocolate Strawberry Cake", category: "Dessert", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224426/Delicious_Chocolate_Cake_with_Strawberries_xzawkj.jpg", tags: ["chocolate","strawberry"], rating: 4.8 },
  { name: "Strawberry Cream Cake", category: "Dessert", price: 599, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224428/Delicious_Strawberry_Shortcake_with_Whipped_Cream_c6kr5c.jpg", tags: ["strawberry","cream"], rating: 4.5 },
  { name: "Fruit Overload Cake", category: "Dessert", price: 749, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224428/Delicious_Fruit-Topped_Celebration_Cake_on_Rustic_Table_a9ggwj.jpg", tags: ["fruit","premium"], rating: 4.7 },
  { name: "Jungle Theme Kids Cake", category: "Birthday", price: 899, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224430/A_Safari_Themed_Three_Tier_Birthday_Cake_vvbssc.jpg", tags: ["kids","jungle","theme"], rating: 4.9 },
  { name: "Dinosaur Theme Cake", category: "Birthday", price: 849, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224431/Layer_Cake_with_Dinosaurs_for_a_Kids_Birthday_Party_pwnjdr.jpg", tags: ["kids","dinosaur"], rating: 4.8 },
  { name: "Car Theme Cake", category: "Birthday", price: 699, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224525/Colorful_Transport-Themed_Second_Birthday_Cake_ireoqv.jpg", tags: ["kids","cars"], rating: 4.6 },
  { name: "Luxury Wedding Cake", category: "Wedding", price: 999, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224460/A_Tall_Layer_Wedding_Cake_with_Floral_Decorations_rnm7ru.jpg", tags: ["luxury","wedding"], rating: 5.0 },
  { name: "Classic White Wedding Cake", category: "Wedding", price: 949, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224447/White_4-tier_Cake_mesosx.jpg", tags: ["white","classic"], rating: 4.9 },
  { name: "Rustic Wedding Cake", category: "Wedding", price: 899, image: "https://res.cloudinary.com/deixioyzo/image/upload/v1775224428/Elegant_Rustic_Cake_with_Floral_and_Berry_Decorations_bv8kwq.jpg", tags: ["rustic","natural"], rating: 4.7 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const count = await Cake.countDocuments();
  if (count > 0) {
    console.log(`Already seeded (${count} cakes exist). Done.`);
  } else {
    await Cake.insertMany(cakes);
    console.log(`✅ Seeded ${cakes.length} cakes successfully!`);
  }
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
