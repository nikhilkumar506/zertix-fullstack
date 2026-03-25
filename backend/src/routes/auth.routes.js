const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ================= AUTH ROUTES =================

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get logged-in user (JWT protected)
router.get("/me", authMiddleware, me);

module.exports = router;
