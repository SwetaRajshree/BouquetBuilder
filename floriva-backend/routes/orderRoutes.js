const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Public — guest checkout allowed
router.post("/place", placeOrder);

// Protected
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
