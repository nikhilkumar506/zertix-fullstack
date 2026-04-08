require("dotenv").config();

const express = require("express");
const path = require("path");

// ✅ Create app FIRST
const app = express();

// ✅ DB connect (non-blocking)
const connectDB = require("./src/config/db");
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

// ✅ Import routes AFTER app init
try {
  const apiApp = require("./src/app");
  app.use("/api", apiApp);
} catch (err) {
  console.log("⚠️ src/app load issue:", err.message);
}

// ✅ FRONTEND PATH
const FRONTEND_PATH = path.join(__dirname, "frontend");

// ✅ Static files
app.use(express.static(FRONTEND_PATH));

// ✅ Health check (VERY IMPORTANT for Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// ✅ Routes
app.get("/mcqs", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

app.get("/mcq.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

app.get("/mcq", (req, res) => {
  res.redirect("/mcq.html" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""));
});

// ✅ 404
app.use((req, res) => {
  res.status(404).send("❌ Route Not Found");
});

// ✅ ERROR HANDLER (important)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).send("Internal Server Error");
});

// ✅ PORT (Render fix)
const PORT = process.env.PORT || 10000;

// ⚠️ IMPORTANT: 0.0.0.0 binding (fixes 521 issue)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});