const API_BASE = "https://zertix-fullstack.onrender.com";

// ================= LOGIN =================
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      alert("Login successful 🚀");
      window.location.href = "../courses/browse-courses.html";
    } else {
      alert("Invalid credentials");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ================= REGISTER =================
async function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.message) {
      alert("Registered successfully ✅");
      window.location.href = "login.html";
    } else {
      alert("Error registering user");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}