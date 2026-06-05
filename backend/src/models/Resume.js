const mongoose = require("mongoose");

// ─── Sub-Schemas ────────────────────────────────────────────────────────────

const PersonalInfoSchema = new mongoose.Schema(
  {
    fullName:    { type: String, trim: true, default: "" },
    email:       { type: String, trim: true, lowercase: true, default: "" },
    phone:       { type: String, trim: true, default: "" },
    location:    { type: String, trim: true, default: "" },
    linkedin:    { type: String, trim: true, default: "" },
    github:      { type: String, trim: true, default: "" },
    portfolio:   { type: String, trim: true, default: "" },
    jobTitle:    { type: String, trim: true, default: "" },
    summary:     { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, trim: true, default: "" },
    degree:      { type: String, trim: true, default: "" },
    field:       { type: String, trim: true, default: "" },
    startDate:   { type: String, default: "" },
    endDate:     { type: String, default: "" },
    grade:       { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company:     { type: String, trim: true, default: "" },
    position:    { type: String, trim: true, default: "" },
    location:    { type: String, trim: true, default: "" },
    startDate:   { type: String, default: "" },
    endDate:     { type: String, default: "" },
    current:     { type: Boolean, default: false },
    description: { type: String, trim: true, default: "" }, // bullet-point achievements
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name:        { type: String, trim: true, default: "" },
    techStack:   { type: String, trim: true, default: "" },
    liveUrl:     { type: String, trim: true, default: "" },
    githubUrl:   { type: String, trim: true, default: "" },
    startDate:   { type: String, default: "" },
    endDate:     { type: String, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const CertificationSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true, default: "" },
    issuer:       { type: String, trim: true, default: "" },
    issueDate:    { type: String, default: "" },
    expiryDate:   { type: String, default: "" },
    credentialId: { type: String, trim: true, default: "" },
    credentialUrl:{ type: String, trim: true, default: "" },
  },
  { _id: true }
);

const SkillsSchema = new mongoose.Schema(
  {
    technical:  { type: [String], default: [] }, // ["JavaScript", "Node.js", ...]
    soft:       { type: [String], default: [] }, // ["Leadership", ...]
    languages:  { type: [String], default: [] }, // ["English", "Hindi", ...]
    tools:      { type: [String], default: [] }, // ["Git", "Docker", ...]
  },
  { _id: false }
);

// ─── Main Resume Schema ──────────────────────────────────────────────────────

const ResumeSchema = new mongoose.Schema(
  {
    // Owner — link to your existing User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Meta
    title: {
      type: String,
      trim: true,
      default: "My Resume",
      maxlength: [100, "Resume title cannot exceed 100 characters"],
    },
    template: {
      type: String,
      enum: ["classic", "modern", "minimal", "executive"],
      default: "modern",
    },
    targetJobRole: {
      type: String,
      trim: true,
      default: "",
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Core Sections
    personalInfo:   { type: PersonalInfoSchema,      default: () => ({}) },
    education:      { type: [EducationSchema],        default: [] },
    experience:     { type: [ExperienceSchema],       default: [] },
    projects:       { type: [ProjectSchema],          default: [] },
    certifications: { type: [CertificationSchema],   default: [] },
    skills:         { type: SkillsSchema,             default: () => ({}) },

    // AI-generated content cache (avoid repeated API calls)
    aiCache: {
      summary:          { type: String, default: "" },
      atsSuggestions:   { type: [String], default: [] },
      lastGeneratedAt:  { type: Date, default: null },
    },
  },
  {
    timestamps: true, // createdAt + updatedAt auto-managed
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

ResumeSchema.index({ userId: 1, createdAt: -1 }); // fast list queries per user
ResumeSchema.index({ userId: 1, title: 1 });       // avoid duplicate title lookups

// ─── Virtuals ────────────────────────────────────────────────────────────────

// Human-readable completeness score (not stored in DB)
ResumeSchema.virtual("completeness").get(function () {
  let score = 0;
  const p = this.personalInfo;

  if (p?.fullName)               score += 15;
  if (p?.email)                  score += 10;
  if (p?.phone)                  score += 5;
  if (p?.summary?.length > 50)   score += 15;
  if (this.experience?.length)   score += 20;
  if (this.education?.length)    score += 10;
  if (this.skills?.technical?.length) score += 10;
  if (this.projects?.length)     score += 10;
  if (this.certifications?.length) score += 5;

  return Math.min(score, 100);
});

// ─── Pre-save Middleware ──────────────────────────────────────────────────────

// Auto-title fallback
ResumeSchema.pre("save", function (next) {
  if (!this.title || this.title.trim() === "") {
    const name = this.personalInfo?.fullName || "Untitled";
    this.title = `${name}'s Resume`;
  }
  next();
});

// ─── Static Methods ───────────────────────────────────────────────────────────

// Get all resumes for a user (lightweight list — no aiCache bloat)
ResumeSchema.statics.findByUser = function (userId) {
  return this.find({ userId })
    .select("title template targetJobRole atsScore completeness createdAt updatedAt")
    .sort({ updatedAt: -1 });
};

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = mongoose.model("Resume", ResumeSchema);