const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

// ─── Auth Middleware ──────────────────────────────────────────────────────────
// Reuses your existing session/JWT auth — adjust to match your actual middleware
const requireAuth = (req, res, next) => {
  const userId = req.session?.userId || req.user?._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
  }
  req.userId = userId.toString();
  next();
};

// ─── Anthropic AI Helper ──────────────────────────────────────────────────────
const callClaude = async (prompt) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "AI service error");
  }

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || "";
};

// ─── RESUME CRUD ──────────────────────────────────────────────────────────────

/**
 * GET /api/resumes
 * List all resumes for logged-in user
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const resumes = await Resume.findByUser(req.userId);
    res.json({ success: true, resumes });
  } catch (err) {
    console.error("[Resume List]", err);
    res.status(500).json({ success: false, message: "Failed to fetch resumes." });
  }
});

/**
 * GET /api/resumes/:id
 * Get single resume by ID
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }
    res.json({ success: true, resume });
  } catch (err) {
    console.error("[Resume Get]", err);
    res.status(500).json({ success: false, message: "Failed to fetch resume." });
  }
});

/**
 * POST /api/resumes
 * Create new resume
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      title, template, targetJobRole,
      personalInfo, education, experience,
      projects, certifications, skills,
    } = req.body;

    const resume = new Resume({
      userId: req.userId,
      title: title || "My Resume",
      template: template || "modern",
      targetJobRole: targetJobRole || "",
      personalInfo:   personalInfo   || {},
      education:      education      || [],
      experience:     experience     || [],
      projects:       projects       || [],
      certifications: certifications || [],
      skills:         skills         || {},
    });

    await resume.save();
    res.status(201).json({ success: true, message: "Resume created.", resume });
  } catch (err) {
    console.error("[Resume Create]", err);
    res.status(500).json({ success: false, message: "Failed to create resume." });
  }
});

/**
 * PUT /api/resumes/:id
 * Update existing resume (full update)
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const allowed = [
      "title", "template", "targetJobRole", "isPublic",
      "personalInfo", "education", "experience",
      "projects", "certifications", "skills",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    res.json({ success: true, message: "Resume updated.", resume });
  } catch (err) {
    console.error("[Resume Update]", err);
    res.status(500).json({ success: false, message: "Failed to update resume." });
  }
});

/**
 * DELETE /api/resumes/:id
 * Delete a resume
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    res.json({ success: true, message: "Resume deleted successfully." });
  } catch (err) {
    console.error("[Resume Delete]", err);
    res.status(500).json({ success: false, message: "Failed to delete resume." });
  }
});

// ─── AI ENDPOINTS ─────────────────────────────────────────────────────────────

/**
 * POST /api/resumes/ai/summary
 * Generate professional summary based on role + experience
 */
router.post("/ai/summary", requireAuth, async (req, res) => {
  try {
    const { jobTitle, experience, skills, targetJobRole } = req.body;

    if (!jobTitle && !targetJobRole) {
      return res.status(400).json({ success: false, message: "Job title is required." });
    }

    const prompt = `You are a professional resume writer. Write a compelling, ATS-optimized professional summary for a resume.

Job Title: ${jobTitle || targetJobRole}
Target Role: ${targetJobRole || jobTitle}
Years of Experience: ${experience || "Not specified"}
Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not specified"}

Requirements:
- 3-4 sentences maximum
- Start with a strong action-oriented opening
- Include quantifiable achievements if possible
- Use industry-relevant keywords for ATS
- Professional, confident tone
- Do NOT use first person (I, me, my)
- Return ONLY the summary text, no labels or extra commentary`;

    const summary = await callClaude(prompt);
    res.json({ success: true, summary });
  } catch (err) {
    console.error("[AI Summary]", err);
    res.status(500).json({ success: false, message: "Failed to generate summary." });
  }
});

/**
 * POST /api/resumes/ai/improve
 * Improve existing resume bullet points / descriptions
 */
router.post("/ai/improve", requireAuth, async (req, res) => {
  try {
    const { content, type, jobRole } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required." });
    }

    const typeLabel = type || "experience description";

    const prompt = `You are a professional resume writer specializing in ATS optimization.

Improve the following ${typeLabel} for a ${jobRole || "professional"} role:

"${content}"

Requirements:
- Use strong action verbs (Led, Built, Optimized, Delivered, etc.)
- Add quantifiable metrics where logical (%, $, time saved, team size)
- Make it ATS-friendly with relevant keywords
- Keep it concise and impactful
- Use bullet point format (start each point with •)
- Maximum 4 bullet points
- Return ONLY the improved content, no explanations`;

    const improved = await callClaude(prompt);
    res.json({ success: true, improved });
  } catch (err) {
    console.error("[AI Improve]", err);
    res.status(500).json({ success: false, message: "Failed to improve content." });
  }
});

/**
 * POST /api/resumes/ai/skills
 * Suggest skills based on job role
 */
router.post("/ai/skills", requireAuth, async (req, res) => {
  try {
    const { jobRole, existingSkills } = req.body;

    if (!jobRole) {
      return res.status(400).json({ success: false, message: "Job role is required." });
    }

    const prompt = `You are a technical recruiter and career coach. Suggest relevant skills for the following job role.

Job Role: ${jobRole}
Existing Skills: ${existingSkills?.join(", ") || "None"}

Return a JSON object with exactly this structure (no markdown, no extra text):
{
  "technical": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "soft": ["skill1", "skill2", "skill3", "skill4"],
  "tools": ["tool1", "tool2", "tool3", "tool4"]
}

Rules:
- Suggest only skills NOT already in the existing skills list
- Focus on high-demand, ATS-recognized skills for ${jobRole}
- technical: programming languages, frameworks, technologies
- soft: interpersonal and professional skills
- tools: software, platforms, dev tools`;

    const raw = await callClaude(prompt);

    // Safe JSON parse
    let suggestions;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = { technical: [], soft: [], tools: [] };
    }

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("[AI Skills]", err);
    res.status(500).json({ success: false, message: "Failed to suggest skills." });
  }
});

/**
 * POST /api/resumes/ai/project
 * Generate project description
 */
router.post("/ai/project", requireAuth, async (req, res) => {
  try {
    const { projectName, techStack, jobRole } = req.body;

    if (!projectName) {
      return res.status(400).json({ success: false, message: "Project name is required." });
    }

    const prompt = `You are a professional resume writer. Write an impactful project description for a resume.

Project Name: ${projectName}
Tech Stack: ${techStack || "Not specified"}
Target Job Role: ${jobRole || "Software Developer"}

Requirements:
- 2-3 bullet points starting with •
- Start with a strong action verb
- Mention the tech stack naturally
- Highlight impact, scale, or outcome
- ATS-optimized with relevant keywords
- Return ONLY the bullet points, no extra text`;

    const description = await callClaude(prompt);
    res.json({ success: true, description });
  } catch (err) {
    console.error("[AI Project]", err);
    res.status(500).json({ success: false, message: "Failed to generate project description." });
  }
});

/**
 * POST /api/resumes/ai/ats
 * Analyze resume and return ATS improvement suggestions
 */
router.post("/ai/ats", requireAuth, async (req, res) => {
  try {
    const { resumeId, targetJobRole } = req.body;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: "Resume ID is required." });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    // Build resume text snapshot for AI analysis
    const resumeText = `
Name: ${resume.personalInfo?.fullName || ""}
Job Title: ${resume.personalInfo?.jobTitle || ""}
Summary: ${resume.personalInfo?.summary || ""}
Skills: ${[
      ...(resume.skills?.technical || []),
      ...(resume.skills?.tools || []),
    ].join(", ")}
Experience: ${resume.experience?.map((e) => `${e.position} at ${e.company}: ${e.description}`).join(" | ")}
Education: ${resume.education?.map((e) => `${e.degree} in ${e.field} from ${e.institution}`).join(" | ")}
Projects: ${resume.projects?.map((p) => p.name).join(", ")}
Certifications: ${resume.certifications?.map((c) => c.name).join(", ")}
    `.trim();

    const prompt = `You are an ATS (Applicant Tracking System) expert and resume coach.

Analyze this resume for ATS compatibility:
---
${resumeText}
---
Target Job Role: ${targetJobRole || resume.targetJobRole || "Not specified"}

Return a JSON object with exactly this structure (no markdown, no extra text):
{
  "score": 72,
  "suggestions": [
    "Add more quantifiable achievements in your experience section",
    "Include relevant keywords like Docker, CI/CD for this role",
    "Your summary is missing target job title keyword"
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "strengths": ["strength1", "strength2"]
}

Rules:
- score: integer 0-100 based on ATS compatibility
- suggestions: 3-5 specific, actionable improvements
- missingKeywords: important keywords missing for the target role
- strengths: 2-3 things the resume does well`;

    const raw = await callClaude(prompt);

    let analysis;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { score: 0, suggestions: [], missingKeywords: [], strengths: [] };
    }

    // Persist ATS score + suggestions to resume
    await Resume.findByIdAndUpdate(resumeId, {
      $set: {
        atsScore: analysis.score,
        "aiCache.atsSuggestions": analysis.suggestions,
        "aiCache.lastGeneratedAt": new Date(),
      },
    });

    res.json({ success: true, analysis });
  } catch (err) {
    console.error("[AI ATS]", err);
    res.status(500).json({ success: false, message: "Failed to analyze resume." });
  }
});

module.exports = router;