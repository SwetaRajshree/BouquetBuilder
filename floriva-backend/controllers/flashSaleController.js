const FlashSale = require("../models/FlashSale");

const SEED_DATA = [
  { name: "Red Roses", category: "Romantic", occasion: "Romance", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774530770/pexels-marcelo-joaquim-3414006-5706666_kvne9v.jpg", originalPrice: 40, salePrice: 24, discountPct: 40, stock: 12, totalStock: 15 },
  { name: "White Lilies", category: "Elegant", occasion: "Anniversary", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774531035/pexels-thisisjooh-36179363_dzlorr.jpg", originalPrice: 100, salePrice: 50, discountPct: 50, stock: 8, totalStock: 15 },
  { name: "Tulips", category: "Elegant", occasion: "Birthday", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774531021/pexels-romanakr-3906068_f9bbko.jpg", originalPrice: 150, salePrice: 90, discountPct: 40, stock: 5, totalStock: 15 },
  { name: "Sunflowers", category: "Bright", occasion: "Birthday", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774530942/pexels-dilrubasaricimen-7534347_vtms1x.jpg", originalPrice: 60, salePrice: 30, discountPct: 50, stock: 3, totalStock: 15 },
  { name: "Orchids", category: "Exotic", occasion: "General", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774530792/pexels-studio-naae-15863863-7276512_drbrnh.jpg", originalPrice: 100, salePrice: 60, discountPct: 40, stock: 10, totalStock: 15 },
  { name: "Hydrangea", category: "Elegant", occasion: "Anniversary", image: "https://res.cloudinary.com/deixioyzo/image/upload/v1774532229/pexels-nubikini-1178986_kahdtt.jpg", originalPrice: 120, salePrice: 60, discountPct: 50, stock: 7, totalStock: 15 },
];

function getEndOfDay() {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 24);
  return d;
}

// GET active flash sales
exports.getFlashSales = async (req, res) => {
  try {
    let sales = await FlashSale.find({ active: true, stock: { $gt: 0 } }).sort({ discountPct: -1 });

    // Auto-seed if empty
    if (sales.length === 0) {
      const endsAt = getEndOfDay();
      await FlashSale.insertMany(SEED_DATA.map(s => ({ ...s, endsAt, active: true })));
      sales = await FlashSale.find({ active: true }).sort({ discountPct: -1 });
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flash sales", error: error.message });
  }
};

// Reduce stock when added to cart
exports.reduceStock = async (req, res) => {
  try {
    const sale = await FlashSale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    if (sale.stock <= 0) return res.status(400).json({ message: "Out of stock" });
    sale.stock -= 1;
    if (sale.stock === 0) sale.active = false;
    await sale.save();
    res.json({ stock: sale.stock });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
};

// Reset / re-seed for next day (can be called by a cron or manually)
exports.resetSales = async (req, res) => {
  try {
    await FlashSale.deleteMany({});
    const endsAt = getEndOfDay();
    await FlashSale.insertMany(SEED_DATA.map(s => ({ ...s, endsAt, active: true })));
    res.json({ message: "Flash sales reset for today" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting sales", error: error.message });
  }
};
