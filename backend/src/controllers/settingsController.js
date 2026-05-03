const Settings = require("../models/Settings");
const Product = require("../models/Product");

// Helper function to calculate product price
const calculatePrice = (product, settings) => {
  const goldPricePerGram = product.carat === "20K" ? settings.goldRate20K : settings.goldRate18K;
  const baseGoldValue = goldPricePerGram * (product.goldWeight || 0);
  const makingChargesAmt = baseGoldValue * ((product.makingCharges || 0) / 100);
  const gstAmt = baseGoldValue * ((product.gst || 0) / 100);
  const profitMarginAmt = baseGoldValue * ((product.profitMargin || 0) / 100);
  
  return Math.round(baseGoldValue + makingChargesAmt + gstAmt + profitMarginAmt);
};

// Get settings (create if doesn't exist)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ goldRate18K: 0, previousGoldRate18K: 0, goldRate20K: 0, previousGoldRate20K: 0 });
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Gold Price and Recalculate Product Prices
exports.updateGoldPrice = async (req, res) => {
  try {
    const { goldRate18K, goldRate20K } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ goldRate18K: 0, previousGoldRate18K: 0, goldRate20K: 0, previousGoldRate20K: 0 });
    }

    let updatedCarats = [];

    if (goldRate18K !== undefined && goldRate18K >= 0) {
      settings.previousGoldRate18K = settings.goldRate18K;
      settings.goldRate18K = goldRate18K;
      updatedCarats.push("18K");
    }

    if (goldRate20K !== undefined && goldRate20K >= 0) {
      settings.previousGoldRate20K = settings.goldRate20K;
      settings.goldRate20K = goldRate20K;
      updatedCarats.push("20K");
    }

    await settings.save();

    if (updatedCarats.length > 0) {
      const products = await Product.find({ carat: { $in: updatedCarats } });
      
      await Promise.all(
        products.map(async (product) => {
          product.price = calculatePrice(product, settings);
          await product.save();
        })
      );
    }

    res.json({ 
      message: "Gold price updated and product prices recalculated successfully",
      settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.calculatePrice = calculatePrice;
