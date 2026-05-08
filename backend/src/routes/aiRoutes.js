const express = require("express");

const router = express.Router();

const {
  analyzeResume
} = require("../controllers/aiController");

/* ================= AI ANALYZE ================= */
router.post("/analyze", analyzeResume);

module.exports = router;