const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

// Called by the app right after Firebase sign-in/sign-up succeeds.
// Verifies the token, then creates the Mongo User doc if it doesn't exist yet.
router.post("/sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No auth token provided" });

    const decoded = await admin.auth().verifyIdToken(token);
    const { name } = req.body;

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: name || decoded.name || decoded.email.split("@")[0],
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Auth sync failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Returns the current logged-in user's profile.
router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
