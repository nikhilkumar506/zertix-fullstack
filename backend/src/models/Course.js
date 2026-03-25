const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: String,
    level: String,
    instructor: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
