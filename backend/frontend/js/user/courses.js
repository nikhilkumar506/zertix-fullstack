console.log("✅ Courses.js loaded");

import { apiGet } from "../core/api.js";
import { startPayment } from "../payment/razorpay.js";

async function loadCourses() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  grid.innerHTML = "<p>Loading...</p>";

  try {
    const courses = await apiGet("/courses");

    grid.innerHTML = "";

    for (const course of courses) {
      const card = document.createElement("div");
      card.className = "course-card";

      card.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description || ""}</p>
      `;

      const btn = document.createElement("button");
      btn.innerText = "Checking...";
      btn.className = "primary-btn";

      card.appendChild(btn);

      // 🔥 CHECK PURCHASE
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/enrollment/${course._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        // ✅ PURCHASED
        if (data.purchased) {
          btn.innerText = "Continue";

          btn.onclick = () => {
            window.location.href = `../courses/course-player.html?id=${course.slug}`;
          };
        }

        // ❌ NOT PURCHASED
        else {
          btn.innerText = "Buy Now";

          btn.onclick = () => {
            localStorage.setItem("selectedCourseId", course._id);
            localStorage.setItem("selectedCourseSlug", course.slug);
            startPayment();
          };
        }

      } catch (err) {
        console.error(err);
        btn.innerText = "Error";
      }

      grid.appendChild(card);
    }

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Failed to load</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadCourses);