const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const SharedGarden = require('../models/SharedGarden');

// POST /api/gardens/share — save garden and return id
router.post('/share', async (req, res) => {
  try {
    const { title, image, flowerCount } = req.body;
    if (!image) return res.status(400).json({ error: 'Image is required' });
    const id = uuidv4();
    await SharedGarden.create({ _id: id, title, image, flowerCount });
    res.json({ id });
  } catch (err) {
    console.error('Garden share error:', err);
    res.status(500).json({ error: 'Failed to save garden' });
  }
});

// GET /api/gardens/:id — retrieve garden by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await SharedGarden.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Garden not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch garden' });
  }
});

module.exports = router;
