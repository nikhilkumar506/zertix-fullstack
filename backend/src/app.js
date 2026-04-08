const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// ================= CORS =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// ✅ SAME ROUTE USED FOR BOTH
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/enrollment", enrollmentRoutes);

app.use("/api/payment", paymentRoutes);

// ================= STATUS =================
app.get("/api/status", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;