console.log("💳 Razorpay loaded");

import { apiPost } from "../core/api.js";

export async function startPayment() {

  // 🔥 GET COURSE DATA
  const courseId = localStorage.getItem("selectedCourseId");
  const slug = localStorage.getItem("selectedCourseSlug");
  const token = localStorage.getItem("token");

  console.log("🔥 courseId:", courseId);
  console.log("🔥 slug:", slug);

  // ❌ VALIDATION
  if (!courseId || !slug) {
    alert("Course data missing ❌");
    return;
  }

  if (!token) {
    alert("Please login first ❌");
    return;
  }

  try {
    // ================= CREATE ORDER =================
    const order = await apiPost("/payment/create-order", {
      amount: 29900 // ₹299
    });

    console.log("🧾 Order:", order);

    // ================= RAZORPAY OPTIONS =================
    const options = {
      key: "rzp_live_SZJjtsX853sdMm",
      amount: order.amount,
      currency: "INR",
      name: "Zertix",
      description: "Course Purchase",
      order_id: order.id,

      // ================= SUCCESS HANDLER =================
      handler: async function (response) {

        console.log("📦 Payment success:", response);

        try {
          // 🔐 VERIFY PAYMENT + SAVE ENROLLMENT
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseId
            })
          });

          const data = await verify.json();

          console.log("🔍 Verify:", data);

          if (!data.success) {
            alert("Verification failed ❌");
            return;
          }

          // ✅ SUCCESS
          alert("🎉 Payment successful! Course unlocked");

          // 🔥 CLEAN STORAGE
          localStorage.removeItem("selectedCourseId");
          localStorage.removeItem("selectedCourseSlug");

          // 🔥 REDIRECT TO COURSE
          window.location.href = `../courses/course-player.html?id=${slug}`;

        } catch (err) {
          console.error("❌ Verify error:", err);
          alert("Verification error ❌");
        }
      },

      // ================= FAILURE =================
      modal: {
        ondismiss: function () {
          console.log("❌ Payment popup closed");
        }
      },

      theme: {
        color: "#fbbf24"
      }
    };

    // ================= OPEN RAZORPAY =================
    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("❌ Payment error:", err);
    alert("Payment failed ❌");
  }
}