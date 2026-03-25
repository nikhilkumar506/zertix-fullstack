const Enrollment = require("../models/Enrollment");

exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, courseTitle, name, email, phone } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // 🔍 Check already enrolled
    const already = await Enrollment.findOne({
      user: userId,
      courseId
    });

    if (already) {
      return res.status(409).json({
        message: "Already enrolled",
        enrolled: true
      });
    }

    // ✅ New enrollment
    const enrollment = new Enrollment({
      user: userId,
      courseId,
      courseTitle
    });

    await enrollment.save();

    return res.status(201).json({
      message: "Enrollment successful",
      enrolled: true,
      courseId
    });

  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({
      message: "Enrollment failed",
      error: err.message
    });
  }
};
