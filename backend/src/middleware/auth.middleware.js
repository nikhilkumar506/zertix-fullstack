const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * JWT Authentication Middleware
 * - Checks Authorization header
 * - Verifies JWT token
 * - Attaches logged-in user to req.user
 */
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing."
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ❌ JWT secret missing
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured"
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
