require("dotenv").config();

const express = require("express");
const path = require("path");

// ✅ Import app (routes already inside)
const app = require("./src/app");

// ✅ DB connect
const connectDB = require("./src/config/db");
connectDB().catch(err => {
  console.log("❌ MongoDB Error:", err.message);
});

// ================= FRONTEND =================

const FRONTEND_PATH = path.resolve(__dirname, "frontend");

// Static files
app.use(express.static(FRONTEND_PATH));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// MCQs page
app.get("/mcqs", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

// MCQ single
app.get("/mcq.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

// Smart redirect
app.get("/mcq", (req, res) => {
  res.redirect("/mcq.html?" + req.url.split("?")[1]);
});

// 404
app.use((req, res) => {
  res.status(404).send("❌ Route Not Found");
});

// ================= SERVER =================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});