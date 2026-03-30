const Flower = require("../models/Flower");

exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ inStock: -1, name: 1 });
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flowers", error: error.message });
  }
};

exports.getFlowersByCity = async (req, res) => {
  try {
    const flowers = await Flower.find({ city: req.params.city }).sort({ inStock: -1, name: 1 });
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flowers", error: error.message });
  }
};

exports.addFlower = async (req, res) => {
  try {
    const newFlower = new Flower(req.body);
    await newFlower.save();
    res.status(201).json({ message: "Flower added successfully", flower: newFlower });
  } catch (error) {
    res.status(500).json({ message: "Error adding flower", error: error.message });
  }
};

exports.getMyFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find({ retailer: req.user._id });
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your flowers", error: error.message });
  }
};

exports.getFlowersByShop = async (req, res) => {
  try {
    const flowers = await Flower.find({ retailer: req.params.shopId }).sort({ inStock: -1 });
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop flowers", error: error.message });
  }
};
