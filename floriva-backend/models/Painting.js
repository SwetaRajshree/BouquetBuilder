const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String },
  price:       { type: Number },
  image:       { type: String },
  tags:        [{ type: String }],
  rating:      { type: Number },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Painting', paintingSchema);
