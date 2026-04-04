const mongoose = require('mongoose');

const handloomSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  category:      { type: String },
  price:         { type: Number },
  originalPrice: { type: Number },
  location:      { type: String },
  artisan:       { type: String },
  images:        [{ type: String }],
  tags:          [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Handloom', handloomSchema);
