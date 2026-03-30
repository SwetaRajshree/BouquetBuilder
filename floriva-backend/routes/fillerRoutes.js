const express = require('express');
const router  = express.Router();
const Filler  = require('../models/Filler');

router.get('/', async (req, res) => {
  try {
    const fillers = await Filler.find({ inStock: true }).sort({ name: 1 });
    res.json(fillers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
