const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    university: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
    semester: { type: String, default: "" },
    role: { type: String, default: "student" }, // or "admin"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);