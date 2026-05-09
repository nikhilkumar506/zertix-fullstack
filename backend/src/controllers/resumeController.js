const Resume = require("../models/Resume");

/* ================= CREATE RESUME ================= */
exports.createResume = async (req, res) => {
  try {

    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume
    });

  } catch (err) {
    console.error("Create Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create resume"
    });
  }
};

/* ================= GET ALL RESUMES ================= */
exports.getAllResumes = async (req, res) => {
  try {

    const resumes = await Resume.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: resumes.length,
      resumes
    });

  } catch (err) {
    console.error("Get Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes"
    });
  }
};

/* ================= GET SINGLE RESUME ================= */
exports.getResumeById = async (req, res) => {
  try {

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    res.json({
      success: true,
      resume
    });

  } catch (err) {
    console.error("Single Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume"
    });
  }
};

/* ================= UPDATE RESUME ================= */
exports.updateResume = async (req, res) => {
  try {

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Resume updated",
      updatedResume
    });

  } catch (err) {
    console.error("Update Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update resume"
    });
  }
};

/* ================= DELETE RESUME ================= */
exports.deleteResume = async (req, res) => {
  try {

    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Resume deleted successfully"
    });

  } catch (err) {
    console.error("Delete Resume Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume"
    });
  }
};
const fs = require("fs");

const pdfParse = require("pdf-parse");

/* ================= UPLOAD RESUME ================= */

exports.uploadResume = async (req, res) => {

  try {

    const pdfBuffer =
      fs.readFileSync(req.file.path);

    const data =
      await pdfParse(pdfBuffer);

    const text = data.text;

    /* ================= EXTRACT ================= */

    const phoneMatch =
      text.match(/(\+91)?[6-9]\d{9}/);

    const emailMatch =
      text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
      );

    const lines =
      text.split("\n");

    const name =
      lines[0];

    /* ================= RESPONSE ================= */

    res.json({

      success: true,

      parsedData: {

        name:
          name || "",

        phone:
          phoneMatch
          ? phoneMatch[0]
          : "",

        email:
          emailMatch
          ? emailMatch[0]
          : "",

        skills: "",

        projects: "",

        experience: ""

      }

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message:
        "Resume parsing failed"

    });

  }

};