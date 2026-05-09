const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({
  dest: "uploads/"
});

const {

  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  uploadResume

} = require("../controllers/resumeController");

/* ================= CREATE ================= */

router.post("/", createResume);

/* ================= GET ALL ================= */

router.get("/", getAllResumes);

/* ================= GET SINGLE ================= */

router.get("/:id", getResumeById);

/* ================= UPDATE ================= */

router.put("/:id", updateResume);

/* ================= DELETE ================= */

router.delete("/:id", deleteResume);

/* ================= UPLOAD RESUME ================= */

router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

module.exports = router;