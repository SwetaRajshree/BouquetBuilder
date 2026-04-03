const mongoose = require('mongoose');

const woodenSculptureSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String },
  price:       { type: Number },
  image:       { type: String },
  description: { type: String },
  tags:        [{ type: String }],
  material:    { type: String },
  rating:      { type: Number },
  stock:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('WoodenSculpture', woodenSculptureSchema);
