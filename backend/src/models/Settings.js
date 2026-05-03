const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    goldRate18K: { type: Number, required: true, default: 0 },
    previousGoldRate18K: { type: Number, default: 0 },
    goldRate20K: { type: Number, required: true, default: 0 },
    previousGoldRate20K: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
