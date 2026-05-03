const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin@example.com",
    });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      });

      console.log("✅ Admin user created");
    }
  } catch (error) {
    console.error("❌ Admin creation failed", error);
  }
};

module.exports = createAdmin;
