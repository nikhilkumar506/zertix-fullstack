const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({

  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String
  },

  summary: {
    type: String,
    default: ""
  },

  skills: [
    {
      type: String
    }
  ],

  education: [
    {
      college: String,
      degree: String,
      cgpa: String,
      year: String
    }
  ],

  experience: [
    {
      company: String,
      role: String,
      duration: String,
      description: String
    }
  ],

  projects: [
    {
      title: String,
      techStack: String,
      description: String,
      github: String
    }
  ],

  certifications: [
    {
      name: String,
      issuer: String,
      date: String
    }
  ],

  template: {
    type: String,
    default: "modern"
  },

  atsScore: {
    type: Number,
    default: 0
  },

  aiSuggestions: [
    {
      type: String
    }
  ]

}, {
  timestamps: true
});

module.exports = mongoose.model("Resume", resumeSchema);