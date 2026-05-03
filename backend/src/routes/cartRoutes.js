const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");

// Get cart
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    console.error("Cart Get Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to cart
router.post("/add/:productId", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = Number(req.body.quantity) || 1;

    const existingItem = user.cart.find(
      (item) =>
        item.product &&
        item.product.toString() === product._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ product: product._id, quantity: qty });
    }

    await user.save();

    return res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    console.error("🔥 Cart Fatal Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


// Remove from cart
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();
    const populatedUser = await user.populate("cart.product");
    res.json(populatedUser.cart);
  } catch (err) {
    console.error("Cart Remove Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
