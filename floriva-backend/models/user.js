const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "retailer", "admin"],
      default: "customer"
    },
    location: {
      city: String,
      coordinates: { type: [Number] }
    },
    phone: { type: String, default: '' },
    addresses: {
      type: [{
        label:    { type: String, default: 'Home' },
        fullName: String,
        phone:    String,
        line1:    String,
        line2:    String,
        city:     String,
        state:    String,
        pincode:  String,
        isDefault:{ type: Boolean, default: false },
      }],
      default: []
    },
    wishlist: { type: Array, default: [] },
    cart: { type: Array, default: [] },
    orders: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
