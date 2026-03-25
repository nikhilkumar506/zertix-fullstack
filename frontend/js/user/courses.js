console.log("✅ Browse Courses JS loaded");

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

/* ================= LOAD COURSES ================= */
async function loadCourses() {
  const grid = document.getElementById("courseGrid");

  if (!grid) {
    console.error("❌ courseGrid not found");
    return;
  }

  grid.innerHTML = "<p class='muted'>Loading courses...</p>";

  try {
    const res = await fetch(`${API_BASE}/courses`);

    if (!res.ok) {
      throw new Error("Courses API failed");
    }

    const data = await res.json();
    console.log("📦 Courses API response:", data);

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
          ${course.isEnrolled ? "Go to Week 1" : "Enroll"}
        </button>
      `;

      const btn = card.querySelector("button");

      // ✅ If already enrolled → direct access
      if (course.isEnrolled) {
        btn.addEventListener("click", () => {
          goToWeek1();
        });
      } 
      // ✅ Not enrolled → open modal
      else {
        btn.addEventListener("click", () => {
          openEnrollModal(course._id, course.title);
        });
      }

      grid.appendChild(card);
    });

    console.log("✅ Courses rendered");

  } catch (err) {
    console.error("❌ Load courses error:", err);
    grid.innerHTML = "<p class='muted'>Failed to load courses</p>";
  }
}

/* ================= GO TO WEEK 1 ================= */
function goToWeek1() {
  window.location.href = "../courses/frontend-courses/week1.html";
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

/* ================= ENROLL FORM ================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enrollForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

    try {
      const res = await fetch(`${API_BASE}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          courseId,
          name,
          email,
          phone
        })
      });

      const data = await res.json();

      // ✅ New enrollment
      if (res.ok) {
        alert("🎉 Enrollment successful");
        closeEnrollModal();
        goToWeek1();
        return;
      }

      // ✅ Already enrolled
      if (data.message === "Already enrolled") {
        alert("You are already enrolled");
        closeEnrollModal();
        goToWeek1();
        return;
      }

      alert(data.message || "Enrollment failed");

    } catch (err) {
      console.error("❌ Enroll error:", err);
      alert("Server error");
    }
  });
});

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", loadCourses);
