import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function TargetGPA() {
  const [gpaData, setGpaData] = useState({ cgpa: 0, totalCredits: 0 });
  const [target, setTarget] = useState(3.5);
  const [remaining, setRemaining] = useState(30);
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get("/courses/gpa").then((r) => setGpaData(r.data));
  }, []);

  const calculate = () => {
    const currentCGPA = parseFloat(gpaData.cgpa) || 0;
    const currentCredits = gpaData.totalCredits;
    const totalCredits = currentCredits + remaining;

    // Formula: required future GPA = (target * totalCredits - currentCGPA * currentCredits) / remaining
    const required = (target * totalCredits - currentCGPA * currentCredits) / remaining;

    // Determine feasibility
    let feasibility = "achievable";
    let message = "On track! Keep this average.";
    let emoji = "✅";
    let color = "green";

    if (required > 4.0) {
      feasibility = "impossible";
      message = "Not possible with the current plan. Consider more credits or lower target.";
      emoji = "❌";
      color = "red";
    } else if (required >= 3.7) {
      feasibility = "hard";
      message = "Achievable but requires mostly A grades.";
      emoji = "⚠️";
      color = "yellow";
    } else if (required < 0) {
      feasibility = "secured";
      message = "You've already met this target. Any performance keeps you above it!";
      emoji = "🎉";
      color = "green";
    }

    setResult({
      required: Math.max(0, required).toFixed(2),
      currentCGPA,
      target,
      totalCredits,
      feasibility,
      message,
      emoji,
      color,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-ocean-800 mb-2">🎯 Target GPA Planner</h1>
        <p className="text-gray-500 mb-6">Find out what average GPA you need to reach your goal.</p>

        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 rounded-xl bg-ocean-50 border border-ocean-200">
              <p className="text-sm text-ocean-600">Current CGPA</p>
              <p className="text-2xl font-bold text-ocean-800">{gpaData.cgpa}</p>
            </div>
            <div className="p-4 rounded-xl bg-ocean-50 border border-ocean-200">
              <p className="text-sm text-ocean-600">Credits Earned</p>
              <p className="text-2xl font-bold text-ocean-800">{gpaData.totalCredits}</p>
            </div>
            <div className="p-4 rounded-xl bg-ocean-50 border border-ocean-200">
              <p className="text-sm text-ocean-600">Remaining Credits</p>
              <input
                type="number"
                className="w-full bg-transparent text-2xl font-bold text-ocean-800 focus:outline-none"
                value={remaining}
                onChange={(e) => setRemaining(+e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-ocean-800 mb-2">
              Target CGPA: <span className="text-ocean-600">{target.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="2.0"
              max="4.0"
              step="0.05"
              value={target}
              onChange={(e) => setTarget(+e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer
                         bg-gradient-to-r from-ocean-300 via-ocean-500 to-ocean-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2.00</span><span>3.00</span><span>4.00</span>
            </div>
          </div>

          <button onClick={calculate} className="btn-ocean w-full">
            🔍 Calculate Required GPA
          </button>
        </div>

        {result && (
          <div className="card animate-slide-up text-center">
            <div className="text-6xl mb-3">{result.emoji}</div>
            <p className="text-gray-500 mb-1">Required average GPA for remaining credits</p>
            <p className="text-6xl font-bold text-ocean-700 mb-3">{result.required}</p>

            <div className={`inline-block px-4 py-2 rounded-full mb-4
              ${result.color === "green" ? "bg-green-100 text-green-700" :
                result.color === "yellow" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"}`}>
              {result.feasibility.toUpperCase()}
            </div>

            <p className="text-gray-700">{result.message}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-ocean-50 rounded-xl">
                <p className="text-xs text-ocean-600">Target</p>
                <p className="text-xl font-bold text-ocean-800">{result.target.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-ocean-50 rounded-xl">
                <p className="text-xs text-ocean-600">Final Credits</p>
                <p className="text-xl font-bold text-ocean-800">{result.totalCredits}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}