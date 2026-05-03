const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("Auth Error: No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.log("Auth Error: Token valid, but user not found in DB");
    }
    next();
  } catch (err) {
    console.error("Auth Error: JWT verify failed", err.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin check
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.log("Auth Error: User is not admin", req.user ? req.user.role : "null user");
    res.status(401).json({ message: "Not authorized as admin" });
  }
};
