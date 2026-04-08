const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Enrollment = require("../models/Enrollment");
const protect = require("../middleware/auth.middleware");

require("dotenv").config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ================= CREATE ORDER =================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount missing" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order failed" });
  }
});

// ================= VERIFY PAYMENT =================
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = req.body;

    const userId = req.userId;

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    // ✅ Check existing enrollment
    const exists = await Enrollment.findOne({
      user: userId,
      courseId
    });

    // ✅ Create if not exists
    if (!exists) {
      await Enrollment.create({
        user: userId,
        courseId
      });

      console.log("🎓 Enrollment created");
    } else {
      console.log("⚠️ Already enrolled");
    }

    res.json({
      success: true,
      message: "Payment verified"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
});

module.exports = router;