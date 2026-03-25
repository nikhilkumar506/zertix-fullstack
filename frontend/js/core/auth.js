console.log("core/auth.js loaded");

const API_URL = "http://localhost:5000/api/auth";

/* ================= REGISTER ================= */
async function registerUser(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

/* ================= LOGIN ================= */
async function loginUser(data) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
