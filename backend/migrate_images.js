require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aryan-jewellery", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      if (product.get('imageUrl') && (!product.images || product.images.length === 0)) {
        product.images = [product.get('imageUrl')];
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
