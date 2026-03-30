require("dotenv").config();
const mongoose = require("mongoose");
const Shop = require("./models/Shop");

const nurseries = [
  { name: "Green Splash Nursery",         type: "plant", area: "Raghunathpur",       city: "Bhubaneswar", keywords: ["plants","wholesale","garden","landscaping"],       location: { type: "Point", coordinates: [85.8200, 20.3550] } },
  { name: "M S Nursery",                  type: "plant", area: "Lingipur",            city: "Bhubaneswar", keywords: ["flower plants","seeds","pots"],                    location: { type: "Point", coordinates: [85.8500, 20.2300] } },
  { name: "Regional Plant Resource Center",type:"plant", area: "Nayapalli",           city: "Bhubaneswar", keywords: ["indoor plants","air purifying","cheap plants"],     location: { type: "Point", coordinates: [85.8200, 20.3000] } },
  { name: "Medicinal Plants Center",      type: "plant", area: "Patrapada",           city: "Bhubaneswar", keywords: ["medicinal","herbal","ayurvedic"],                   location: { type: "Point", coordinates: [85.7800, 20.2500] } },
  { name: "Central Nursery Ghatikia",     type: "plant", area: "Ghatikia",            city: "Bhubaneswar", keywords: ["trees","saplings","forest plants"],                 location: { type: "Point", coordinates: [85.7800, 20.2700] } },
  { name: "DFO City Forest Nursery",      type: "plant", area: "Saheed Nagar",        city: "Bhubaneswar", keywords: ["eco plants","tree plantation"],                     location: { type: "Point", coordinates: [85.8400, 20.2950] } },
  { name: "Khandagiri Nursery",           type: "plant", area: "Khandagiri",          city: "Bhubaneswar", keywords: ["garden plants","flowers"],                          location: { type: "Point", coordinates: [85.7800, 20.2500] } },
  { name: "Green Earth Nursery",          type: "plant", area: "Tapoban",             city: "Bhubaneswar", keywords: ["organic plants","home garden"],                     location: { type: "Point", coordinates: [85.7750, 20.2550] } },
  { name: "Maa Durga Nursery",            type: "plant", area: "Ghatikia",            city: "Bhubaneswar", keywords: ["flower plants","pots"],                             location: { type: "Point", coordinates: [85.7700, 20.2600] } },
  { name: "Utkal Seeds & Nursery",        type: "plant", area: "Surya Nagar",         city: "Bhubaneswar", keywords: ["seeds","agriculture"],                              location: { type: "Point", coordinates: [85.8400, 20.2800] } },
  { name: "Ashoka Kalinga Nursery",       type: "plant", area: "Unit 9",              city: "Bhubaneswar", keywords: ["decor plants","landscaping"],                       location: { type: "Point", coordinates: [85.8200, 20.2900] } },
  { name: "Dev Nursery",                  type: "plant", area: "Mancheswar",          city: "Bhubaneswar", keywords: ["bulk plants","wholesale"],                          location: { type: "Point", coordinates: [85.8700, 20.3200] } },
  { name: "Maa Jagulai Nursery",          type: "plant", area: "Phulnakhara",         city: "Bhubaneswar", keywords: ["garden supplies","plants"],                         location: { type: "Point", coordinates: [85.9000, 20.3500] } },
  { name: "Garden City Nursery",          type: "plant", area: "Gajapati Nagar",      city: "Bhubaneswar", keywords: ["indoor plants","decor"],                            location: { type: "Point", coordinates: [85.8200, 20.3050] } },
  { name: "Radha Krishna Nursery",        type: "plant", area: "Patrapada",           city: "Bhubaneswar", keywords: ["ornamental plants"],                                location: { type: "Point", coordinates: [85.7800, 20.2400] } },
  { name: "Barunei Nursery",              type: "plant", area: "Barunei",             city: "Bhubaneswar", keywords: ["forest plants","trees"],                            location: { type: "Point", coordinates: [85.7000, 20.2200] } },
  { name: "Green Star Nursery",           type: "plant", area: "Kalinga Nagar",       city: "Bhubaneswar", keywords: ["garden design","landscaping"],                      location: { type: "Point", coordinates: [85.8000, 20.2900] } },
  { name: "Ficus Landscape Nursery",      type: "plant", area: "Patrapada",           city: "Bhubaneswar", keywords: ["landscaping","garden setup"],                       location: { type: "Point", coordinates: [85.7900, 20.2450] } },
  { name: "Om Nursery & Landscaping",     type: "plant", area: "Jagamara",            city: "Bhubaneswar", keywords: ["home garden","landscaping"],                        location: { type: "Point", coordinates: [85.8000, 20.2600] } },
  { name: "Taj Nursery",                  type: "plant", area: "Old Town",            city: "Bhubaneswar", keywords: ["flowers","indoor plants"],                          location: { type: "Point", coordinates: [85.8300, 20.2400] } },
  { name: "Urban Green Nursery",          type: "plant", area: "Patia",               city: "Bhubaneswar", keywords: ["modern plants","decor"],                            location: { type: "Point", coordinates: [85.8200, 20.3500] } },
  { name: "EcoGrow Nursery",              type: "plant", area: "Chandrasekharpur",    city: "Bhubaneswar", keywords: ["organic","eco friendly"],                           location: { type: "Point", coordinates: [85.8200, 20.3300] } },
  { name: "Plant Paradise",               type: "plant", area: "Baramunda",           city: "Bhubaneswar", keywords: ["flower plants","garden"],                           location: { type: "Point", coordinates: [85.7800, 20.2800] } },
  { name: "Green Leaf Nursery",           type: "plant", area: "Unit 4",              city: "Bhubaneswar", keywords: ["decor plants","indoor"],                            location: { type: "Point", coordinates: [85.8300, 20.2900] } },
  { name: "Nature Basket Nursery",        type: "plant", area: "KIIT",                city: "Bhubaneswar", keywords: ["gift plants"],                                      location: { type: "Point", coordinates: [85.8200, 20.3500] } },
  { name: "Fresh Roots Nursery",          type: "plant", area: "Sailashree Vihar",    city: "Bhubaneswar", keywords: ["saplings","garden"],                                location: { type: "Point", coordinates: [85.8100, 20.3300] } },
  { name: "Green Haven Nursery",          type: "plant", area: "Rasulgarh",           city: "Bhubaneswar", keywords: ["indoor","outdoor plants"],                          location: { type: "Point", coordinates: [85.8600, 20.3000] } },
  { name: "Bloom Garden Nursery",         type: "plant", area: "Bomikhal",            city: "Bhubaneswar", keywords: ["flowers","decor"],                                  location: { type: "Point", coordinates: [85.8600, 20.2900] } },
  { name: "Happy Plants Nursery",         type: "plant", area: "Pokhariput",          city: "Bhubaneswar", keywords: ["low maintenance","indoor"],                         location: { type: "Point", coordinates: [85.7900, 20.2600] } },
  { name: "Green World Nursery",          type: "plant", area: "Jaydev Vihar",        city: "Bhubaneswar", keywords: ["all plants","tools"],                               location: { type: "Point", coordinates: [85.8200, 20.3000] } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  await Shop.insertMany(nurseries);
  console.log(`✅ Inserted ${nurseries.length} plant nurseries successfully!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
