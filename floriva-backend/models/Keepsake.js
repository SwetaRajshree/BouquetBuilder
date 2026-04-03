const mongoose = require('mongoose');

const KeepsakeSchema = new mongoose.Schema({
  _id:      { type: String },
  photos:   [{ type: String }], // Cloudinary URLs
  audioUrl: { type: String, required: true }, // Cloudinary audio URL
  duration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days
});

module.exports = mongoose.model('Keepsake', KeepsakeSchema);
