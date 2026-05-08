/* ================= GET TEMPLATES ================= */

exports.getTemplates = async (req, res) => {
  try {

    const templates = [
      {
        id: "modern",
        name: "Modern",
        premium: false
      },

      {
        id: "minimal",
        name: "Minimal",
        premium: false
      },

      {
        id: "dark",
        name: "Dark",
        premium: true
      },

      {
        id: "developer",
        name: "Developer",
        premium: true
      }
    ];

    res.json({
      success: true,
      templates
    });

  } catch (err) {
    console.error("Template Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch templates"
    });
  }
};