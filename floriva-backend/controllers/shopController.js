const Shop = require("../models/Shop");

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ name: 1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
