const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const VoiceNote = require('../models/VoiceNote');
const Keepsake  = require('../models/Keepsake');
const { uploadBase64, uploadAudio } = require('../utils/cloudinaryUpload');

// POST /api/voice — upload raw audio buffer (existing)
router.post('/', express.raw({ type: 'audio/*', limit: '20mb' }), async (req, res) => {
  try {
    const id = uuidv4();
    const mimeType = req.headers['content-type'] || 'audio/webm';
    await VoiceNote.create({ _id: id, data: req.body, mimeType });
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save voice note' });
  }
});

// GET /api/voice/:id — stream audio back (existing)
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

// POST /api/voice/keepsake — save full keepsake (photos + audio) to Cloudinary + DB
router.post('/keepsake', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { photos = [], audioBase64, mimeType = 'audio/webm', duration = 0 } = req.body;
    if (!audioBase64) return res.status(400).json({ error: 'audioBase64 is required' });

    // Upload audio to Cloudinary
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const audioUrl = await uploadAudio(audioBuffer, mimeType);

    // Upload photos to Cloudinary (base64 data URLs)
    const photoUrls = await Promise.all(
      photos.map(p => uploadBase64(p, 'floriva-keepsake'))
    );

    const id = uuidv4();
    await Keepsake.create({ _id: id, photos: photoUrls, audioUrl, duration });

    res.json({ id });
  } catch (err) {
    console.error('Keepsake save error:', err);
    res.status(500).json({ error: 'Failed to save keepsake' });
  }
});

// GET /api/voice/keepsake/:id — retrieve keepsake
router.get('/keepsake/:id', async (req, res) => {
  try {
    const doc = await Keepsake.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Keepsake not found or expired' });
    res.json({ photos: doc.photos, audioUrl: doc.audioUrl, duration: doc.duration });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch keepsake' });
  }
});

module.exports = router;
