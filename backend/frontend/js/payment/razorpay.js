console.log("💳 Razorpay loaded");

import { apiPost } from "../core/api.js";

export async function startPayment() {

  // 🔥 GET FROM STORAGE
  const courseId = localStorage.getItem("selectedCourseId");
  const slug = localStorage.getItem("selectedCourseSlug");

  console.log("🔥 courseId:", courseId);
  console.log("🔥 slug:", slug);

  if (!courseId || !slug) {
    alert("Course data missing ❌");
    return;
  }

  try {
    // 1️⃣ CREATE ORDER
    const order = await apiPost("/payment/create-order", {
      amount: 29900
    });

    console.log("🧾 Order:", order);

    const options = {
      key: "rzp_test_SXVFnE3ssCJ4vF",
      amount: order.amount,
      currency: "INR",
      name: "SkilllCertify",
      description: "Course Purchase",
      order_id: order.id,

      handler: async function (response) {

        console.log("📦 Sending courseId:", courseId);

        // 2️⃣ VERIFY PAYMENT
        const verify = await apiPost("/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courseId: courseId   // DB ke liye
        });

        console.log("🔍 Verify:", verify);

        if (!verify.success) {
          alert("Verification failed ❌");
          return;
        }

        alert("🎉 Enrolled successfully!");

        // 🔥 CLEAN STORAGE
        localStorage.removeItem("selectedCourseId");
        localStorage.removeItem("selectedCourseSlug");

        // 🔥 REDIRECT USING SLUG
        window.location.href = `../courses/course-player.html?id=${slug}`;
      },

      theme: {
        color: "#fbbf24"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("❌ Payment error:", err);
    alert("Payment failed ❌");
  }
}