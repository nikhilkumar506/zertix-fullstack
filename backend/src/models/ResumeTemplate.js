const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({

  templateId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  previewImage: {
    type: String,
    default: ""
  },

  premium: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "ResumeTemplate",
  templateSchema
);