const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestName: { type: String },
    guestEmail: { type: String },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String,
        color: String,
        city: String,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 99 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "upi" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    upiId: { type: String },
    upiRef: { type: String },
    deliveryType: { type: String, default: "scheduled" },
    scheduledDate: { type: Date },
    timeSlot: { type: String, enum: ["morning", "afternoon", "evening"], default: "morning" },
    deliveryAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
