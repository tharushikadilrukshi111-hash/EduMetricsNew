const Course = require("../models/Course");

// GET all courses for logged-in user
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.userId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, user: req.userId });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET GPA calculation
exports.getGPA = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.userId });

    const gradeMap = {
      "A+": 4.0, A: 4.0, "A-": 3.7,
      "B+": 3.3, B: 3.0, "B-": 2.7,
      "C+": 2.3, C: 2.0, "C-": 1.7,
      Others: 0,
    };

    // Group by semester
    const semesterMap = {};
    courses.forEach((c) => {
      const key = `${c.year} - ${c.semester}`;
      if (!semesterMap[key]) semesterMap[key] = [];
      semesterMap[key].push(c);
    });

    const semesters = Object.keys(semesterMap).map((key) => {
      const list = semesterMap[key];
      let totalPoints = 0;
      let totalCredits = 0;
      list.forEach((c) => {
        const gp = gradeMap[c.grade] ?? 0;
        totalPoints += gp * c.credits;
        totalCredits += c.credits;
      });
      return {
        semester: key,
        gpa: totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0,
        credits: totalCredits,
      };
    });

    // Overall CGPA
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      totalPoints += (gradeMap[c.grade] ?? 0) * c.credits;
      totalCredits += c.credits;
    });
    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;

    res.json({ cgpa, totalCredits, semesters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};