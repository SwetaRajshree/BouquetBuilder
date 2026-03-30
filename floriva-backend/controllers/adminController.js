const Flower = require("../models/Flower");
const Shop   = require("../models/Shop");
const Order  = require("../models/Order");
const User   = require("../models/user");
const Plant  = require("../models/Plant");

// ── Flowers ──
exports.adminGetFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ createdAt: -1 });
    res.json(flowers);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminAddFlower = async (req, res) => {
  try {
    const flower = await Flower.create(req.body);
    res.status(201).json(flower);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminUpdateFlower = async (req, res) => {
  try {
    const flower = await Flower.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flower) return res.status(404).json({ message: "Flower not found" });
    res.json(flower);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminDeleteFlower = async (req, res) => {
  try {
    await Flower.findByIdAndDelete(req.params.id);
    res.json({ message: "Flower deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Shops ──
exports.adminGetShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminAddShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json(shop);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminUpdateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminDeleteShop = async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Shop deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Orders ──
exports.adminGetOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Users ──
exports.adminGetUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Plants ──
exports.adminGetPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminAddPlant = async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminUpdatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.adminDeletePlant = async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
