require("dotenv").config();

const express = require("express");
const path = require("path");

// ✅ Use existing app (API routes already inside)
const app = require("./src/app");

// ✅ DB connect (safe)
const connectDB = require("./src/config/db");
connectDB().catch(err => {
  console.log("❌ MongoDB Error:", err.message);
});

// ================= API ROUTES =================

// 🔥 IMPORTANT: add enrollment check route
app.use("/api/enrollment", require("./src/routes/enrollment.check"));

// (Make sure these already exist inside src/app OR add if missing)
// app.use("/api/payment", require("./src/routes/payment.routes"));
// app.use("/api/courses", require("./src/routes/course.routes"));


// ================= FRONTEND =================

// ✅ FRONTEND PATH
const FRONTEND_PATH = path.resolve(__dirname, "frontend");

// ✅ Static files
app.use(express.static(FRONTEND_PATH));

// ✅ Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// ✅ MCQs listing
app.get("/mcqs", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

// ✅ Individual MCQ
app.get("/mcq.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

// ✅ Smart redirect
app.get("/mcq", (req, res) => {
  res.redirect("/mcq.html?" + req.url.split("?")[1]);
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).send("❌ Route Not Found");
});

// ================= SERVER =================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});