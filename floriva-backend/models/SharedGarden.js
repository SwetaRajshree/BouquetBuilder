const mongoose = require('mongoose');

const SharedGardenSchema = new mongoose.Schema({
  _id:         { type: String },
  title:       { type: String, default: 'My Garden of Flowers' },
  image:       { type: String, required: true }, // base64 PNG
  flowerCount: { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days
});

module.exports = mongoose.model('SharedGarden', SharedGardenSchema);
