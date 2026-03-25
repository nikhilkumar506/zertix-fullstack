const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { enrollCourse } = require("../controllers/enrollment.controller");

// POST /api/enroll
router.post("/", protect, enrollCourse);

module.exports = router;
