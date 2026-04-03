const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const gifts = await Gift.find(filter).sort({ createdAt: -1 });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
