const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Enrollment = require("../models/Enrollment"); // ✅ ADD THIS

require("dotenv").config();

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ================= CREATE ORDER =================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Incoming amount:", amount);

    if (!amount) {
      return res.status(400).json({ error: "Amount missing" });
    }

    const order = await razorpay.orders.create({
      amount: amount, // already in paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    console.log("✅ Order created:", order.id);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (err) {
    console.error("❌ Razorpay Error:", err);

    res.status(500).json({
      error: "Payment order failed",
      details: err.error || err.message
    });
  }
});

// ================= VERIFY PAYMENT =================
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Invalid signature");

      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    console.log("✅ Payment verified:", razorpay_payment_id);

    // ================= SAVE ENROLLMENT =================
    const existing = await Enrollment.findOne({
      userId: "TEMP_USER",
      courseId: courseId
    });

    if (!existing) {
      const enrollment = await Enrollment.create({
        user: "6987c3d8c41411d080ac7d1c",
        courseId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

      console.log("🎓 Course saved in DB:", enrollment);
    } else {
      console.log("⚠️ Already enrolled");
    }

    return res.json({
      success: true,
      message: "Payment verified & course unlocked"
    });

  } catch (err) {
    console.error("❌ Verify error:", err);

    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
});

module.exports = router;