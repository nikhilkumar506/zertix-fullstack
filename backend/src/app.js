const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// ✅ CORS (production friendly)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Optional: status route (safe)
app.get("/api/status", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;