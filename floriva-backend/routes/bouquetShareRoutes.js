const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const SharedBouquet = require('../models/SharedBouquet');

// POST /api/bouquet/share — save and return short id
router.post('/share', async (req, res) => {
  try {
    const { bouquet, recipient, message, sender, cardStyle, voiceId, spotifyId, musicUrl } = req.body;
    const id = uuidv4();
    await SharedBouquet.create({ _id: id, bouquet, recipient, message, sender, cardStyle, voiceId, spotifyId, musicUrl });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save bouquet' });
  }
});

// GET /api/bouquet/:id — retrieve by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await SharedBouquet.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Bouquet not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bouquet' });
  }
});

module.exports = router;
