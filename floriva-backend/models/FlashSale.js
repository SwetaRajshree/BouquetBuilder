const mongoose = require("mongoose");

const flashSaleSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    category:      { type: String },
    occasion:      { type: String },
    image:         { type: String },
    originalPrice: { type: Number, required: true },
    salePrice:     { type: Number, required: true },
    discountPct:   { type: Number, required: true },
    stock:         { type: Number, default: 15 },
    totalStock:    { type: Number, default: 15 },
    endsAt:        { type: Date, required: true },
    active:        { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlashSale", flashSaleSchema);
