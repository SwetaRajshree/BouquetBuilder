const WoodenSculpture = require('../models/WoodenSculpture');

exports.getAll = async (req, res) => {
  try {
    const items = await WoodenSculpture.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
