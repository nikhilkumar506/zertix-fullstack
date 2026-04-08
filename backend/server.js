require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

// ✅ DB connect
const connectDB = require("./src/config/db");
connectDB().catch(err => {
  console.log("❌ MongoDB Error:", err.message);
});

// ✅ FRONTEND
const FRONTEND_PATH = path.resolve(__dirname, "frontend");
app.use(express.static(FRONTEND_PATH));

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

app.get("/mcqs", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

app.get("/mcq.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

app.get("/mcq", (req, res) => {
  res.redirect("/mcq.html?" + req.url.split("?")[1]);
});

// ✅ fallback
app.use((req, res) => {
  res.status(404).send("❌ Route Not Found");
});

// ✅ IMPORTANT FIX
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});