const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["flower", "plant", "baker", "cakeshop", "cake"], default: "flower" },
    category: { type: String },
    area: { type: String },
    city: { type: String },
    keywords: { type: [String] },
    location: {
      type: { type: String },
      coordinates: { type: [Number] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
