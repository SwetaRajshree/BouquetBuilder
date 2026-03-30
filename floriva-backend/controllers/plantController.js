const Plant = require("../models/Plant");

const seedData = [
  { name: "Lucky Bamboo in Golden Pot",    category: "Indoor Plants",   nursery: "Green Valley Nursery, Pune",       price: 199, original: 299, discount: 33, img: "🎋" },
  { name: "Syngonium in Blue Ceramic Pot", category: "Indoor Plants",   nursery: "City Greens Wholesale, Mumbai",    price: 149, original: 199, discount: 25, img: "🌿" },
  { name: "Money Plant in Copper Pot",     category: "Indoor Plants",   nursery: "Delhi Plant Bazaar",               price: 99,  original: 149, discount: 34, img: "🪴" },
  { name: "Snake Plant (Sansevieria)",     category: "Indoor Plants",   nursery: "Roots & Leaves, Bangalore",        price: 149, original: 249, discount: 40, img: "🌱" },
  { name: "Hibiscus Plant (Red)",          category: "Outdoor Plants",  nursery: "Kolkata Phool Bazar",              price: 119, original: 199, discount: 40, img: "🌺" },
  { name: "Bougainvillea (Pink)",          category: "Outdoor Plants",  nursery: "Green Valley Nursery, Pune",       price: 149, original: 249, discount: 40, img: "🌸" },
  { name: "Croton Outdoor Shrub",          category: "Outdoor Plants",  nursery: "City Greens Wholesale, Mumbai",    price: 179, original: 279, discount: 36, img: "🍂" },
  { name: "Areca Palm",                    category: "Outdoor Plants",  nursery: "Delhi Plant Bazaar",               price: 249, original: 399, discount: 38, img: "🌴" },
  { name: "Cactus Trio Set",               category: "Succulents",      nursery: "Desert Dreams, Rajasthan",         price: 99,  original: 179, discount: 45, img: "🌵" },
  { name: "Echeveria Rosette",             category: "Succulents",      nursery: "Desert Dreams, Rajasthan",         price: 79,  original: 129, discount: 39, img: "🪸" },
  { name: "Aloe Vera Pot",                 category: "Succulents",      nursery: "Roots & Leaves, Bangalore",        price: 89,  original: 149, discount: 40, img: "🌿" },
  { name: "Jade Plant",                    category: "Succulents",      nursery: "Green Valley Nursery, Pune",       price: 129, original: 199, discount: 35, img: "🌱" },
  { name: "Peace Lily",                    category: "Air Purifying",   nursery: "Delhi Plant Bazaar",               price: 199, original: 299, discount: 33, img: "🌸" },
  { name: "Spider Plant",                  category: "Air Purifying",   nursery: "City Greens Wholesale, Mumbai",    price: 99,  original: 149, discount: 34, img: "🌾" },
  { name: "Arrowhead Plant",               category: "Air Purifying",   nursery: "Roots & Leaves, Bangalore",        price: 149, original: 229, discount: 35, img: "🌿" },
  { name: "Boston Fern",                   category: "Air Purifying",   nursery: "Green Valley Nursery, Pune",       price: 119, original: 199, discount: 40, img: "🍃" },
  { name: "Red Rose Bush",                 category: "Flower Plants",   nursery: "Kolkata Phool Bazar",              price: 129, original: 229, discount: 44, img: "🌹" },
  { name: "White Lily Plant",              category: "Flower Plants",   nursery: "Green Valley Nursery, Pune",       price: 149, original: 249, discount: 40, img: "🪷" },
  { name: "Sunflower Sapling",             category: "Flower Plants",   nursery: "Roots & Leaves, Bangalore",        price: 79,  original: 129, discount: 39, img: "🌻" },
  { name: "Marigold Pot (Genda)",          category: "Flower Plants",   nursery: "Kolkata Phool Bazar",              price: 49,  original: 89,  discount: 45, img: "🌼" },
  { name: "Jasmine Creeper (Mogra)",       category: "Flower Plants",   nursery: "Delhi Plant Bazaar",               price: 99,  original: 179, discount: 45, img: "🌸" },
  { name: "Lavender Pot",                  category: "Flower Plants",   nursery: "Desert Dreams, Rajasthan",         price: 119, original: 199, discount: 40, img: "💜" },
  { name: "Pink Tulip Bulb Pot",           category: "Flower Plants",   nursery: "City Greens Wholesale, Mumbai",    price: 159, original: 249, discount: 36, img: "🌷" },
  { name: "Chrysanthemum (Shevanti)",      category: "Flower Plants",   nursery: "Kolkata Phool Bazar",              price: 69,  original: 119, discount: 42, img: "🌸" },
  { name: "Dahlia Plant",                  category: "Flower Plants",   nursery: "Green Valley Nursery, Pune",       price: 89,  original: 159, discount: 44, img: "🌺" },
  { name: "Orchid in Ceramic Pot",         category: "Flower Plants",   nursery: "Roots & Leaves, Bangalore",        price: 199, original: 349, discount: 43, img: "🌸" },
];

exports.getAllPlants = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const plants = await Plant.find(filter).sort({ category: 1, name: 1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedPlants = async (req, res) => {
  try {
    const count = await Plant.countDocuments();
    if (count > 0) return res.json({ message: `Already seeded (${count} plants exist)` });
    await Plant.insertMany(seedData);
    res.status(201).json({ message: `Seeded ${seedData.length} plants successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
