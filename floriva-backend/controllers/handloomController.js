const Handloom = require('../models/Handloom');

exports.getAll = async (req, res) => {
  try {
    const items = await Handloom.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
