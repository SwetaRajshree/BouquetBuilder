const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String },
  price:       { type: Number },
  image:       { type: String },
  tags:        [{ type: String }],
  rating:      { type: Number },
  description: { type: String },
  inStock:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Cake', cakeSchema);
