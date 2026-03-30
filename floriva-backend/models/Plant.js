const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    category: { type: String, enum: ["Flower Plants", "Indoor Plants", "Outdoor Plants", "Succulents", "Air Purifying"], required: true },
    nursery:  { type: String, required: true },
    price:    { type: Number, required: true },
    original: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    img:      { type: String, default: "🌿" },
    inStock:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
