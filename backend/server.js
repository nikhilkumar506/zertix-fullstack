require("dotenv").config();

const express = require("express");
const path = require("path");

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ✅ Connect DB (safe)
connectDB().catch(err => {
console.error("❌ DB Connection Failed:", err.message);
});

// ✅ Serve frontend (IMPORTANT)
const FRONTEND_PATH = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND_PATH));

// ✅ Homepage
app.get("/", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// ✅ MCQs page (clean URL)
app.get("/mcqs", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

// ✅ MCQ quiz page
app.get("/mcq.html", (req, res) => {
res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

// ✅ Fallback (VERY IMPORTANT for debugging)
app.use((req, res) => {
res.status(404).send("❌ Route Not Found");
});

// ✅ PORT (Render friendly)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
