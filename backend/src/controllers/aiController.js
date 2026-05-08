/* ================= AI RESUME ANALYZER ================= */

exports.analyzeResume = async (req, res) => {
  try {

    const { summary, skills, projects } = req.body;

    const improvements = [];

    if (!summary || summary.length < 50) {
      improvements.push(
        "Professional summary is too short"
      );
    }

    if (!skills || skills.length < 5) {
      improvements.push(
        "Add more technical skills"
      );
    }

    if (!projects || projects.length < 1) {
      improvements.push(
        "Add at least one project"
      );
    }

    res.json({
      success: true,
      improvements,
      aiScore: 82
    });

  } catch (err) {
    console.error("AI Analyze Error:", err);

    res.status(500).json({
      success: false,
      message: "AI analysis failed"
    });
  }
};