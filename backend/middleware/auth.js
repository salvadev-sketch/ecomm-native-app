const admin = require("../config/firebase");
const User = require("../models/User");

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>"
// and attaches the corresponding Mongo user doc to req.user.
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Use after requireAuth. Rejects non-admins.
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
