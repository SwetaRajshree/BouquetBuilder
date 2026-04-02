const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const SharedGarden = require('../models/SharedGarden');
const { uploadBase64 } = require('../utils/cloudinaryUpload');

// POST /api/gardens/share
router.post('/share', async (req, res) => {
  try {
    const { type, title, image, flowerCount, state } = req.body;
    const id = uuidv4();

    let imageUrl = '';

    // Upload image to Cloudinary if provided (garden snapshot)
    if (image && image.startsWith('data:')) {
      imageUrl = await uploadBase64(image, 'floriva-gardens');
    }

    // For polaroid: upload each slot image in state to Cloudinary
    let savedState = state || null;
    if (type === 'polaroid' && state && state.images) {
      const uploadedImages = {};
      for (const [slot, dataUrl] of Object.entries(state.images)) {
        if (dataUrl && dataUrl.startsWith('data:')) {
          uploadedImages[slot] = await uploadBase64(dataUrl, 'floriva-polaroids');
        } else {
          uploadedImages[slot] = dataUrl;
        }
      }
      savedState = { ...state, images: uploadedImages };
    }

    await SharedGarden.create({ _id: id, type: type || 'garden', title, image: imageUrl, flowerCount, state: savedState });
    res.json({ id });
  } catch (err) {
    console.error('Garden share error:', err);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// GET /api/gardens/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await SharedGarden.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;
