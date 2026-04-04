const ArtistApplication = require('../models/ArtistApplication');

exports.submit = async (req, res) => {
  try {
    const app = await ArtistApplication.create(req.body);
    res.status(201).json({ success: true, id: app._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const apps = await ArtistApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
