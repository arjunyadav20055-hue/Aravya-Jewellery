const mongoose = require("mongoose");
const User = require("../models/User");

// Add your MongoDB URI here
const MONGO_URI = "mongodb+srv://arjunyadav448591:448591@jewels.cb1wpze.mongodb.net/Jewels?appName=Jewels";

const createUser = async () => {
  try {
    // Connect to MongoDB (Mongoose 7+)
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Check if user exists
    const existing = await User.findOne({ email: "user@example.com" });
    if (existing) {
      console.log("User already exists");
      return process.exit(0);
    }

    // Create user
    const user = await User.create({
      name: "Test User",
      email: "user@example.com",
      password: "user123",
      role: "user",
    });

    console.log("✅ User created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ User creation failed", err);
    process.exit(1);
  }
};

createUser();
