const mongoose = require("mongoose");

// Review sub-schema
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    goldWeight: { type: Number, default: 0 },
    makingCharges: { type: Number, default: 0 }, // percentage
    gst: { type: Number, default: 0 }, // percentage
    profitMargin: { type: Number, default: 0 }, // percentage
    images: [{ type: String }], // Cloudinary URLs
    category: { type: String },
    stock: { type: Number, default: 1 },
    carat: { type: String, enum: ["18K", "20K"], default: "18K" },
    reviews: [reviewSchema], // ✅ add this
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
