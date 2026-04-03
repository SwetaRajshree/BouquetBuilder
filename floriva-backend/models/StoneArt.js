const mongoose = require('mongoose');

const stoneArtSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String },
  type:        { type: String },
  material:    { type: String },
  price:       { type: Number },
  image:       { type: String },
  description: { type: String },
  keywords:    [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('StoneArt', stoneArtSchema);
