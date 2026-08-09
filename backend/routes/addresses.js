const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const { requireAuth } = require("../middleware/auth");

// GET /api/addresses — the logged-in user's addresses
router.get("/", requireAuth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/addresses
router.post("/", requireAuth, async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const address = await Address.create({ ...req.body, user: req.user._id });
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/addresses/:id
router.put("/:id", requireAuth, async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/addresses/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
