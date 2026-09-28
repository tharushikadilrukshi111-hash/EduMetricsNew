const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    code: { type: String, default: "" },
    credits: { type: Number, required: true },
    grade: { type: String, required: true }, // e.g., "A+", "B"
    semester: { type: String, required: true }, // e.g., "1st Semester"
    year: { type: String, required: true }, // e.g., "1st Year"
    category: { type: String, default: "Core" }, // Core / Technical / Elective
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);