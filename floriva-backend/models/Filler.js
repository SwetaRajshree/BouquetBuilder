const mongoose = require('mongoose');

const fillerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String },
  type:         { type: String },
  emotion:      { type: String },
  occasion:     { type: [String] },
  availability: { type: String },
  pricePerStem: { type: Number },
  priceRange:   { min: Number, max: Number },
  city:         { type: String },
  inStock:      { type: Boolean, default: true },
  image:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Filler', fillerSchema, 'fillers');
