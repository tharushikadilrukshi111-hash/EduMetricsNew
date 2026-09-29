import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { generatePDF } from "../utils/generatePDF";
// ... other imports

// Inside component:
const [courses, setCourses] = useState([]);

useEffect(() => {
  API.get("/courses/gpa").then((res) => setGpaData(res.data));
  API.get("/courses").then((res) => setCourses(res.data));
}, []);

const handleExport = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  generatePDF(user, gpaData, courses);
};

export default function Dashboard() {
  const [gpaData, setGpaData] = useState({ cgpa: 0, totalCredits: 0, semesters: [] });

  useEffect(() => {
    API.get("/courses/gpa").then((res) => setGpaData(res.data));
  }, []);

  const chartData = gpaData.semesters.map((s) => ({
    name: s.semester,

    GPA: parseFloat(s.gpa),
  }));

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-ocean-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title="Current CGPA" value={gpaData.cgpa} />
          <Card title="Total Credits" value={gpaData.totalCredits} />
          <Card title="Semesters" value={gpaData.semesters.length} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-ocean-700">
            GPA Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="GPA"
                stroke="#0ea5e9"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-ocean-500">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-ocean-700">{value}</p>
    </div>
  );
}


<div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-ocean-800">Dashboard</h1>
  <button onClick={handleExport} className="btn-ocean">
    📄 Export PDF
  </button>
</div>