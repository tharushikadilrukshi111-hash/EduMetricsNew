import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "Others"];
const GRADE_POINTS = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7, Others: 0,
};

export default function Simulator() {
  const [existingCourses, setExistingCourses] = useState([]);
  const [hypothetical, setHypothetical] = useState([
    { name: "Future Course 1", credits: 3, grade: "A" },
  ]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get("/courses").then((r) => setExistingCourses(r.data));
  }, []);

  const addRow = () => {
    setHypothetical([
      ...hypothetical,
      { name: `Future Course ${hypothetical.length + 1}`, credits: 3, grade: "A" },
    ]);
  };

  const removeRow = (i) => {
    setHypothetical(hypothetical.filter((_, idx) => idx !== i));
  };

  const update = (i, field, value) => {
    const copy = [...hypothetical];
    copy[i][field] = field === "credits" ? +value : value;
    setHypothetical(copy);
  };

  const simulate = () => {
    // Current GPA
    let curPoints = 0, curCredits = 0;
    existingCourses.forEach((c) => {
      curPoints += (GRADE_POINTS[c.grade] ?? 0) * c.credits;
      curCredits += c.credits;
    });
    const currentGPA = curCredits ? curPoints / curCredits : 0;

    // Future GPA
    let futPoints = 0, futCredits = 0;
    hypothetical.forEach((c) => {
      futPoints += (GRADE_POINTS[c.grade] ?? 0) * c.credits;
      futCredits += c.credits;
    });
    const futureOnly = futCredits ? futPoints / futCredits : 0;

    // Combined new CGPA
    const newCGPA = (curPoints + futPoints) / (curCredits + futCredits);

    setResult({
      currentGPA: currentGPA.toFixed(2),
      futureOnly: futureOnly.toFixed(2),
      newCGPA: newCGPA.toFixed(2),
      delta: (newCGPA - currentGPA).toFixed(2),
      totalCredits: curCredits + futCredits,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-ocean-800 mb-2">🔮 What-If Simulator</h1>
        <p className="text-gray-500 mb-6">
          Try hypothetical grades to see how your CGPA would change — nothing is saved.
        </p>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-ocean-700">Hypothetical Courses</h2>
            <button onClick={addRow} className="btn-ocean text-sm">+ Add Course</button>
          </div>

          {hypothetical.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 mb-3 items-center">
              <input
                className="input-ocean col-span-6"
                value={row.name}
                onChange={(e) => update(i, "name", e.target.value)}
              />
              <input
                type="number"
                min="1" max="6"
                className="input-ocean col-span-2"
                value={row.credits}
                onChange={(e) => update(i, "credits", e.target.value)}
              />
              <select
                className="input-ocean col-span-3"
                value={row.grade}
                onChange={(e) => update(i, "grade", e.target.value)}
              >
                {GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
              <button
                onClick={() => removeRow(i)}
                className="col-span-1 bg-red-100 text-red-600 rounded-lg py-2 hover:bg-red-200"
              >
                ✕
              </button>
            </div>
          ))}

          <button onClick={simulate} className="btn-ocean w-full mt-4">
            🚀 Simulate GPA
          </button>
        </div>

        {result && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
            <ResultCard label="Current CGPA" value={result.currentGPA} />
            <ResultCard label="Future GPA Only" value={result.futureOnly} />
            <ResultCard label="New CGPA" value={result.newCGPA} highlight />
            <ResultCard
              label="Change"
              value={`${result.delta >= 0 ? "▲" : "▼"} ${Math.abs(result.delta)}`}
              positive={result.delta >= 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight, positive }) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-lg transition-all hover:scale-105
        ${highlight
          ? "bg-gradient-to-br from-ocean-500 to-ocean-700 text-white shadow-ocean-lg"
          : positive === undefined
          ? "bg-white border border-ocean-100"
          : positive
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
        }`}
    >
      <p className={`text-sm ${highlight ? "text-ocean-100" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-3xl font-bold mt-1 ${highlight ? "text-white" : "text-ocean-700"}`}>
        {value}
      </p>
    </div>
  );
}