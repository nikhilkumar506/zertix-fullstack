const API_BASE = "http://localhost:5000/api";

export async function apiPost(url, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_BASE + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function apiGet(url) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_BASE + url, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return res.json();
}
