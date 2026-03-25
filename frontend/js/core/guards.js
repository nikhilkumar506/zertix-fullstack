// guards.js
if (!localStorage.getItem("token")) {
  alert("Please login first");
  window.location.href = "../auth/login.html";
}
