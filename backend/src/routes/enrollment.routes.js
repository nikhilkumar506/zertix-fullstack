const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const Enrollment = require("../models/Enrollment");

// 🔍 Check purchase
router.get("/:courseId", protect, async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    const exists = await Enrollment.findOne({
      user: userId,
      courseId
    });

    res.json({ purchased: !!exists });

  } catch (err) {
    console.error(err);
    res.json({ purchased: false });
  }
});

module.exports = router;