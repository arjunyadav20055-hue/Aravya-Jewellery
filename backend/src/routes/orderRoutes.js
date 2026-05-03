const express = require("express"); 
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  verifyRazorpayPayment,
} = require("../controllers/orderController");

// =====================
// User routes
// =====================

// Place order (COD / Razorpay order creation)
router.post("/", protect, placeOrder);

// Verify Razorpay payment
router.post("/verify-payment", protect, verifyRazorpayPayment);

// Get logged-in user's orders
router.get("/my", protect, getMyOrders);

// =====================
// Admin routes
// =====================

// Get all orders
router.get("/", protect, admin, getAllOrders);

// Update order status
router.put("/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;
