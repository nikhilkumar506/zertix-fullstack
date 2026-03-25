const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseTitle: String,
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
