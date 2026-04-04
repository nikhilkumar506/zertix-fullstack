const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  // 🔥 ADD THIS (MAIN FIX)
  slug: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: Number,
    default: 0
  },

  content: [
    {
      title: String,
      video: String,
      notes: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);