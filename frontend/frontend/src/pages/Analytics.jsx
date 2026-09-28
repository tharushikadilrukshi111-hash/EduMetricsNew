import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function Analytics() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses").then((r) => setCourses(r.data));
  }, []);

  // Best/worst subject based on grade points
  const gradeMap = { "A+":4, A:4, "A-":3.7, "B+":3.3, B:3, "B-":2.7, "C+":2.3, C:2, "C-":1.7, Others:0 };
  const chartData = courses.map((c) => ({
    name: c.name.slice(0, 8),
    GradePoint: gradeMap[c.grade] ?? 0,
  }));

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-ocean-800 mb-6">Skill & Grade Analytics</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-ocean-700">Grade Points Per Course</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              <Bar dataKey="GradePoint" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}