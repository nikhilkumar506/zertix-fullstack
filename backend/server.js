require("dotenv").config();

const express = require("express");   // ✅ ADD THIS
const path = require("path");

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ✅ Connect DB
connectDB();

// ✅ Serve frontend (IMPORTANT)
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ Default route (homepage)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});