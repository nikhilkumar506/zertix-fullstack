console.log("✅ Courses.js loaded");

import { apiGet } from "../core/api.js";
import { startPayment } from "../payment/razorpay.js";

/* ================= LOAD COURSES ================= */
async function loadCourses() {
  const grid = document.getElementById("courseGrid");

  if (!grid) return;

  grid.innerHTML = "<p class='muted'>Loading courses...</p>";

  const data = await apiGet("/courses");

  if (data.error) {
    grid.innerHTML = "<p class='muted'>Failed to load courses</p>";
    return;
  }

  if (!Array.isArray(data) || data.length === 0) {
    grid.innerHTML = "<p class='muted'>No courses available</p>";
    return;
  }

  grid.innerHTML = "";

  data.forEach(course => {
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

    if (course.isEnrolled) {
      btn.addEventListener("click", () => {
        goToCourse(course._id);
      });
    } else {
      btn.addEventListener("click", () => {
        openEnrollModal(course._id, course.title);
      });
    }

    grid.appendChild(card);
  });
}

/* ================= GO TO COURSE ================= */
function goToCourse(courseId) {
  window.location.href = `../courses/course.html?id=${courseId}`;
}

/* ================= MODAL ================= */
function openEnrollModal(courseId, courseTitle) {
  const modal = document.getElementById("enrollModal");
  if (!modal) return;

  document.getElementById("courseId").value = courseId;
  document.getElementById("courseTitle").value = courseTitle;

  modal.classList.add("active");
}

function closeEnrollModal() {
  const modal = document.getElementById("enrollModal");
  if (!modal) return;

  modal.classList.remove("active");
}

window.closeEnrollModal = closeEnrollModal;

/* ================= ENROLL (NOW PAYMENT BASED) ================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enrollForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "../auth/login.html";
      return;
    }

    const courseId = document.getElementById("courseId").value;
    const name = document.getElementById("enrollName").value.trim();
    const email = document.getElementById("enrollEmail").value.trim();
    const phone = document.getElementById("enrollPhone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    // 💳 Close modal & start payment
    closeEnrollModal();

    startPayment(courseId);
  });
});

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", loadCourses);