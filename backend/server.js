require("dotenv").config();

const path = require("path");

// ✅ USE YOUR EXISTING APP (routes + cors already inside)
const app = require("./src/app");

// ✅ DB connect
const connectDB = require("./src/config/db");
connectDB();

// ✅ Serve frontend
app.use(require("express").static(path.join(__dirname, "../frontend")));

// ✅ Homepage
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🔥 IMPORTANT FIX (THIS WAS MISSING)
app.get("/mcq.html", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/pages/mcqs/mcq.html"));
});

// 🔥 OPTIONAL (clean URL)
app.get("/mcqs", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/pages/mcqs/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
