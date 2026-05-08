const express = require("express");

const router = express.Router();

const {
  getTemplates
} = require("../controllers/templateController");

/* ================= GET TEMPLATES ================= */
router.get("/", getTemplates);

module.exports = router;