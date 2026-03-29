console.log("core/api.js loaded");

/* ================= CONFIG ================= */
export const API_BASE = "http://localhost:5000/api";

/* ================= GET TOKEN ================= */
function getToken() {
  return localStorage.getItem("token");
}

/* ================= COMMON FETCH ================= */
async function request(url, options = {}) {
  try {
    const token = getToken();

    const res = await fetch(API_BASE + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
        ...options.headers
      }
    });

    const data = await res.json();

    // ❌ If unauthorized → logout
    if (res.status === 401) {
      console.warn("Unauthorized. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/auth/login.html";
      return;
    }

    // ❌ If API error
    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;

  } catch (err) {
    console.error("API Error:", err);
    return { error: err.message };
  }
}

/* ================= GET ================= */
export async function apiGet(url) {
  return request(url, {
    method: "GET"
  });
}

/* ================= POST ================= */
export async function apiPost(url, body) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

/* ================= PUT ================= */
export async function apiPut(url, body) {
  return request(url, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

/* ================= DELETE ================= */
export async function apiDelete(url) {
  return request(url, {
    method: "DELETE"
  });
}