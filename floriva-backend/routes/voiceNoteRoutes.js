const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const VoiceNote = require('../models/VoiceNote');

// POST /api/voice — upload raw audio buffer
router.post('/', express.raw({ type: 'audio/*', limit: '10mb' }), async (req, res) => {
  try {
    const id = uuidv4();
    const mimeType = req.headers['content-type'] || 'audio/webm';
    await VoiceNote.create({ _id: id, data: req.body, mimeType });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save voice note' });
  }
});

// GET /api/voice/:id — stream audio back
router.get('/:id', async (req, res) => {
  try {
    const doc = await VoiceNote.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Voice note not found or expired' });
    res.set('Content-Type', doc.mimeType);
    res.send(doc.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voice note' });
  }
});

module.exports = router;
