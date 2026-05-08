const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({

  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume"
  },

  atsScore: Number,

  grammarIssues: [
    {
      type: String
    }
  ],

  keywordSuggestions: [
    {
      type: String
    }
  ],

  aiSuggestions: [
    {
      type: String
    }
  ]

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "ResumeAnalysis",
  analysisSchema
);