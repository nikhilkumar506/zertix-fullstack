console.log("Dashboard JS loaded");

const authToken = localStorage.getItem("token"); // ✅ UNIQUE NAME

async function loadUser() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: "Bearer " + authToken
      }
    });

    const data = await res.json();
    console.log("ME API data:", data);

    document.getElementById("userName").innerText = data.fullName;
    document.getElementById("userEmail").innerText = data.email;

  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Session expired. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "../auth/login.html";
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../auth/login.html";
});

loadUser();
