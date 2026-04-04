const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

/* ================= GET ALL COURSES ================= */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    console.log("📦 RAW DB COURSES:", courses); // 🔍 DEBUG

    const formatted = courses.map(course => {
      console.log("🔍 SINGLE COURSE:", course); // 🔍 DEBUG

      return {
        _id: course._id,
        title: course.title,
        description: course.description || "",
        slug: course.slug || null,   // 🔥 fallback added
        price: course.price || 0,
        isEnrolled: false
      };
    });

    console.log("🚀 FINAL RESPONSE:", formatted); // 🔍 DEBUG

    res.json(formatted);

  } catch (err) {
    console.error("❌ Course fetch error:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;