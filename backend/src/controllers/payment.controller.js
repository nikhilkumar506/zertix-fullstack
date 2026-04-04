import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Enrollment from "../models/Enrollment.js";

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay Order Created:", order.id);

    res.json(order);

  } catch (error) {
    console.error("❌ Create Order Error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = req.body;

    // 🔐 Generate signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // ❌ Signature mismatch
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    // ✅ Prevent duplicate purchase
    const existing = await Enrollment.findOne({
      userId: req.user.id,
      courseId
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Already purchased"
      });
    }

    // ✅ Save enrollment
    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "completed"
    });

    console.log("🎉 Enrollment saved:", enrollment._id);

    res.json({
      success: true,
      message: "Payment verified & course unlocked",
      enrollment
    });

  } catch (error) {
    console.error("❌ Verify Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};