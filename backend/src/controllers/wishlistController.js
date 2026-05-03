const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/add/:productId
 * @access  Private
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // 2️⃣ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3️⃣ Fetch user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Prevent duplicates
    if (!user.wishlist.some((id) => id.toString() === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("🔥 Wishlist Add Error:", error);
    res.status(500).json({ message: "Wishlist add failed" });
  }
};

/**
 * @desc    Get wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Safely fetch products even if some IDs are invalid
    const wishlist = [];
    for (const id of user.wishlist) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const product = await Product.findById(id);
        if (product) wishlist.push(product);
      }
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("🔥 Wishlist Fetch Error:", error);
    res.status(500).json({ message: "Wishlist fetch failed" });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("🔥 Wishlist Remove Error:", error);
    res.status(500).json({ message: "Wishlist remove failed" });
  }
};
