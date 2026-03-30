const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    type: { type: String },
    emotion: { type: String },
    occasion: { type: [String] },
    availability: { type: String },
    pricePerStem: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    color: { type: String },
    image: { type: String },
    city: { type: String },
    inStock: { type: Boolean, default: true },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flower", flowerSchema);
