const Order = require("../models/Order");

// ── Place Order ──────────────────────────────────────────────
exports.placeOrder = async (req, res) => {
  try {
    const {
      items, subtotal, deliveryFee, discount, total,
      paymentMethod, upiId, upiRef, deliveryType,
      guestName, guestEmail, deliveryAddress,
      scheduledDate, timeSlot,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const order = new Order({
      user: req.user?._id || null,
      guestName,
      guestEmail,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      upiId,
      upiRef,
      deliveryType,
      deliveryAddress,
      scheduledDate,
      timeSlot,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: "placed",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// ── Get My Orders ────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const query = req.user
      ? { $or: [{ user: req.user._id }, { guestEmail: req.user.email }] }
      : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ── Get Order by ID ──────────────────────────────────────────
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};
