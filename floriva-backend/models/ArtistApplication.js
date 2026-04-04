const mongoose = require('mongoose');

const artistApplicationSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  location:     { type: String, required: true },
  craftCategory:{ type: String, required: true },
  experience:   { type: String, required: true },
  description:  { type: String, required: true },
  priceRange:   { type: String },
  instagram:    { type: String },
  website:      { type: String },
  status:       { type: String, enum: ['pending','reviewed','approved','rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('ArtistApplication', artistApplicationSchema);
