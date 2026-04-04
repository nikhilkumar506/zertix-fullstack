console.log("✅ Courses.js loaded");

import { apiGet } from "../core/api.js";
import { startPayment } from "../payment/razorpay.js";

/* ================= LOAD COURSES ================= */
async function loadCourses() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  grid.innerHTML = "<p class='muted'>Loading courses...</p>";

  try {
    const data = await apiGet("/courses");

    console.log("📦 API DATA:", data);

    if (!Array.isArray(data) || data.length === 0) {
      grid.innerHTML = "<p class='muted'>No courses found</p>";
      return;
    }

    grid.innerHTML = "";

    data.forEach(course => {
      console.log("📦 COURSE:", course);

      const card = document.createElement("div");
      card.className = "course-card";

      card.innerHTML = `
        <h3>${course.title}</h3>
        <p class="muted">${course.description || ""}</p>
        <button class="primary-btn">
          ${course.isEnrolled ? "Go to Course" : "Enroll Now"}
        </button>
      `;

      const btn = card.querySelector("button");

      /* ================= ENROLLED ================= */
      if (course.isEnrolled) {
        btn.onclick = () => {

          if (!course.slug) {
            alert("Slug missing ❌");
            console.error("❌ Missing slug:", course);
            return;
          }

          console.log("🚀 Opening course:", course.slug);

          window.location.href = `../courses/course-player.html?id=${course.slug}`;
        };
      }

      /* ================= NEW ENROLL ================= */
      else {
        btn.onclick = () => {

          console.log("📦 Selected:", course);

          // 🔥 HARD VALIDATION
          if (!course._id || !course.slug) {
            alert("Course data missing ❌");
            console.error("❌ Broken course:", course);
            return;
          }

          // 🔥 SAVE DATA
          localStorage.setItem("selectedCourseId", course._id);
          localStorage.setItem("selectedCourseSlug", course.slug);

          console.log("💾 Stored ID:", course._id);
          console.log("💾 Stored Slug:", course.slug);

          // 💳 START PAYMENT
          startPayment();
        };
      }

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Load error:", err);
    grid.innerHTML = "<p class='muted'>Failed to load courses</p>";
  }
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", loadCourses);