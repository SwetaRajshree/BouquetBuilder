const StoneArt = require('../models/StoneArt');

exports.getAll = async (req, res) => {
  try {
    const items = await StoneArt.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
