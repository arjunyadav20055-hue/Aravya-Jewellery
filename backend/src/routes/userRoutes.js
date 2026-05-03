const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// GET all users (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
