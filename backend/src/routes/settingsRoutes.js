const express = require("express");
const router = express.Router();
const { getSettings, updateGoldPrice } = require("../controllers/settingsController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/settings
// @desc    Get current settings (including gold price)
// @access  Public
router.get("/", getSettings);

// @route   PUT /api/settings/gold-price
// @desc    Update global gold price and recalculate product prices
// @access  Private/Admin
router.put("/gold-price", protect, admin, updateGoldPrice);

module.exports = router;
