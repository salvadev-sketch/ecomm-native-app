const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// POST /api/orders — create an order for the logged-in user
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingCost, tax } = req.body;

    const totalAmount = subtotal + (shippingCost || 0) + (tax || 0);
    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders — the logged-in user's own orders
router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id — a single order (owner or admin)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user._id) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/admin/all — admin: every order, most recent first
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — admin: update order status
router.put("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const update = { orderStatus };
    if (orderStatus === "delivered") update.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
