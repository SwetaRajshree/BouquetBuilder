const Painting = require('../models/Painting');

exports.getAll = async (req, res) => {
  try {
    const items = await Painting.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
