const Pottery = require('../models/Pottery');

exports.getAll = async (req, res) => {
  try {
    const items = await Pottery.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
