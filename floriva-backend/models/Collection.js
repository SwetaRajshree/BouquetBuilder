const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true, lowercase: true },
  price:       { type: Number, required: true },
  material:    { type: String },
  stock:       { type: Number, default: 0 },
  rating:      { type: Number, default: 0 },
  reviews:     { type: Number, default: 0 },
  description: { type: String },
  images:      [{ type: String }],
  tags:        [{ type: String }],
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Collection', CollectionSchema);
