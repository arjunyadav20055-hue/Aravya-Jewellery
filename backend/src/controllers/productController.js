const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const Settings = require("../models/Settings");
const { calculatePrice } = require("./settingsController");

// ================= EXISTING CONTROLLERS =================

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, stock, goldWeight, makingCharges, gst, profitMargin } = req.body;

    const files = req.files || [];
    const imageUrls = [];

    // 🔴 ONLY THIS LOOP IS CHANGED
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "aravya-jewels" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer); // ✅ buffer instead of path
      });

      imageUrls.push(result.secure_url);
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = { goldRate18K: 0, goldRate20K: 0 };
    }

    const newProductData = {
      name,
      description,
      category,
      stock,
      goldWeight: Number(goldWeight) || 0,
      makingCharges: Number(makingCharges) || 0,
      gst: Number(gst) || 0,
      profitMargin: Number(profitMargin) || 0,
      images: imageUrls,
      carat: req.body.carat || "18K", // Ensure carat is set
    };

    newProductData.price = calculatePrice(newProductData, settings);

    const product = await Product.create(newProductData);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, stock, goldWeight, makingCharges, gst, profitMargin } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = { goldRate18K: 0, goldRate20K: 0 };
    }

    const updateData = {
      name,
      description,
      category,
      stock,
      goldWeight: Number(goldWeight) || 0,
      makingCharges: Number(makingCharges) || 0,
      gst: Number(gst) || 0,
      profitMargin: Number(profitMargin) || 0,
      carat: req.body.carat || "18K", // Ensure carat is set
    };

    updateData.price = calculatePrice(updateData, settings);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= NEW CONTROLLERS FOR REVIEWS =================

// Add a review to a product
exports.addReview = async (req, res) => {
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ message: "Comment is required" });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = {
      user: req.user._id, // comes from protect middleware
      comment,
    };

    product.reviews.unshift(review); // newest review first
    await product.save();

    // populate user name before sending response
    const populatedReview = await Product.populate(review, { path: "user", select: "name" });

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product with reviews populated
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
