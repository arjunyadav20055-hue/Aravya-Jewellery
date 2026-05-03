const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// =====================
// Razorpay instance
// =====================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================
// User: Place Order (COD / Razorpay)
// =====================
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalAmount = 0;

    // Calculate total & reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `${product.name} out of stock` });

      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    // ---------------------
    // COD ORDER
    // ---------------------
    if (paymentMethod === "COD") {
      const order = await Order.create({
        user: req.user._id,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod: "COD",
        status: "Pending",
      });

      const user = await User.findById(req.user._id);
      user.cart = [];
      await user.save();

      return res.status(201).json({
        message: "Order placed successfully (COD)",
        order,
      });
    }

    // ---------------------
    // RAZORPAY ORDER
    // ---------------------
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: "RAZORPAY",
      paymentResult: {
        razorpayOrderId: razorpayOrder.id,
      },
      status: "Pending",
    });

    res.status(201).json({
      message: "Razorpay order created",
      order,
      razorpayOrder,
    });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// =====================
// Razorpay Payment Verify
// =====================
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentResult = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    order.status = "Processing";
    await order.save();

    const user = await User.findById(order.user);
    user.cart = [];
    await user.save();

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// =====================
// User: Get My Orders
// =====================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// =====================
// Admin: Get All Orders
// =====================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");

    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// =====================
// Admin: Update Order Status
// =====================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
