require("dotenv").config();

const express = require("express");
const path = require("path");

// ✅ Use existing app (API routes already inside)
const app = require("./src/app");

// ✅ DB connect (safe - app crash नहीं होगा)
const connectDB = require("./src/config/db");
connectDB().catch(err => {
console.log("❌ MongoDB Error:", err.message);
});

// ✅ FRONTEND PATH (VERY IMPORTANT FIX)
const FRONTEND_PATH = path.join(__dirname, "../frontend");

// ✅ Serve all static frontend files (CSS, JS, images)
app.use(express.static(FRONTEND_PATH));

// ✅ Homepage
app.get("/", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// ✅ MCQs listing page
app.get("/mcqs", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

// ✅ Individual MCQ page
app.get("/mcq.html", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

// ✅ Optional: direct subject route (smart UX)
app.get("/mcq", (req, res) => {
res.redirect("/mcq.html?" + req.url.split("?")[1]);
});

// ✅ 404 fallback (debugging friendly)
app.use((req, res) => {
res.status(404).send("❌ Route Not Found");
});

// ✅ PORT (Render compatible)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
