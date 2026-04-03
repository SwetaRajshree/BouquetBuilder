const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');

// GET /api/collection — all items, optional ?category=rings&featured=true
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category.toLowerCase();
    if (req.query.featured === 'true') filter.isFeatured = true;
    const items = await Collection.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/collection/categories — distinct category list
router.get('/categories', async (req, res) => {
  try {
    const cats = await Collection.distinct('category');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
