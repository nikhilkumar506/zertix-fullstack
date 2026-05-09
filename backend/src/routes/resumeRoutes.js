const express = require("express");

const router = express.Router();

const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume
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

module.exports = router;const express = require("express");

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

/* ================= UPLOAD + PARSE ================= */

router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

module.exports = router;