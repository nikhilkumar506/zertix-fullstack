/* ================= ATS SCORE ================= */

exports.calculateATS = async (req, res) => {
  try {

    const { skills, summary, projects } = req.body;

    let score = 50;

    if (skills && skills.length > 20) score += 20;
    if (summary && summary.length > 100) score += 15;
    if (projects && projects.length > 50) score += 15;

    if (score > 100) score = 100;

    res.json({
      success: true,
      atsScore: score,
      suggestions: [
        "Add more industry keywords",
        "Improve project descriptions",
        "Use action verbs"
      ]
    });

  } catch (err) {
    console.error("ATS Error:", err);

    res.status(500).json({
      success: false,
      message: "ATS analysis failed"
    });
  }
};