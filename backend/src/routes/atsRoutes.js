const express = require("express");

const router = express.Router();

const {
  calculateATS
} = require("../controllers/atsController");

/* ================= ATS ANALYSIS ================= */
router.post("/analyze", calculateATS);

module.exports = router;