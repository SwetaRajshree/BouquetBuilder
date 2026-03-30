const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    category:     { type: String, required: true },
    type:         { type: String },
    emotion:      { type: String },
    occasion:     { type: [String] },
    availability: { type: String },
    nursery:      { type: String },
    price:        { type: Number },
    pricePerStem: { type: Number },
    priceRange:   { min: { type: Number }, max: { type: Number } },
    original:     { type: Number },
    discount:     { type: Number, default: 0 },
    img:          { type: String, default: "🌿" },
    image:        { type: String },
    color:        { type: String },
    city:         { type: String },
    inStock:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
