const Course = require("../models/Course");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.json(
      courses.map(course => ({
        _id: course._id,
        title: course.title,
        description: course.description || "",
        price: course.price || 0,
        slug: course.slug,   // ✅ THIS WAS MISSING
        isEnrolled: false
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load courses" });
  }
};