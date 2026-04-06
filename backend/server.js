require("dotenv").config();

const express = require("express");
const path = require("path");

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ✅ Connect DB
connectDB();

// ✅ Serve ALL frontend files
app.use(express.static(path.join(__dirname, "../frontend")));
// ✅ Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// 🔥 ADD THIS (VERY IMPORTANT)
app.get("/mcqs", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/pages/mcqs/index.html"));});

// 🔥 ADD THIS ALSO (for mcq.html)
app.get("/mcq.html", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/pages/mcqs/mcq.html"));});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});