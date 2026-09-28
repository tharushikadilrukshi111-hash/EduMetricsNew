const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getGPA,
} = require("../controllers/courseController");

router.use(protect); // All routes below need login

router.get("/", getCourses);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/gpa", getGPA);

module.exports = router;