console.log("💳 Razorpay loaded");

import { apiPost } from "../core/api.js";

/* ================= START PAYMENT ================= */
export async function startPayment(courseId) {
  try {
    // 1️⃣ Create order
    const order = await apiPost("/payment/create-order", {
      courseId
    });

    if (order.error) {
      alert(order.error);
      return;
    }

    console.log("Order:", order);

    // 2️⃣ Razorpay options
    const options = {
      key: "YOUR_RAZORPAY_KEY", // 🔴 replace this
      amount: order.amount,
      currency: "INR",
      name: "SkilllCertify",
      description: "Course Purchase",
      order_id: order.id,

      handler: async function (response) {
        console.log("Payment success:", response);

        // 3️⃣ Verify payment
        const verify = await apiPost("/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courseId
        });

        if (verify.error) {
          alert("Payment verification failed");
          return;
        }

        alert("🎉 Payment successful & enrolled!");
        window.location.href = "../dashboard/index.html";
      },

      theme: {
        color: "#fbbf24"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment failed");
  }
}