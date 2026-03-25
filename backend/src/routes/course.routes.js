const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");

// PUBLIC – browse courses
router.get("/", courseController.getAllCourses);

module.exports = router;
