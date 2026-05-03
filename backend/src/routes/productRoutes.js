const express = require("express");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  addReview,
  getProductById,
} = require("../controllers/productController");
const multer = require("multer");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= PRODUCT ROUTES =================
router.post("/add", protect, admin, upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, updateProduct);

// ================= REVIEW ROUTES =================
// Add a review to a product
router.post("/:id/review", protect, addReview);

// Get single product with reviews
router.get("/:id", getProductById);

module.exports = router;
