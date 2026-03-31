const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  text:       { type: String, required: true },
  rating:     { type: Number, min: 1, max: 5, default: 5 },
  bouquetId:  { type: String }, // which shared bouquet triggered this
  approved:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
