const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');

// POST /api/reviews — submit a review
router.post('/', async (req, res) => {
  try {
    const { name, text, rating, bouquetId } = req.body;
    if (!name?.trim() || !text?.trim()) return res.status(400).json({ error: 'Name and review are required' });
    const review = await Review.create({ name: name.trim(), text: text.trim(), rating: rating || 5, bouquetId });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews — fetch approved reviews for Our Story page
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(20);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
