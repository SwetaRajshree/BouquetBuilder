const mongoose = require('mongoose');

const potterySchema = new mongoose.Schema({
  name:          { type: String, required: true },
  category:      { type: String },
  subCategory:   { type: String },
  price:         { type: Number },
  originalPrice: { type: Number },
  currency:      { type: String },
  location:      { type: String },
  artist:        { type: String },
  description:   { type: String },
  materials:     [{ type: String }],
  dimensions:    { type: String },
  image:         { type: String },
  rating:        { type: Number },
  reviews:       { type: Number },
  stock:         { type: Number },
  tags:          [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Pottery', potterySchema);
