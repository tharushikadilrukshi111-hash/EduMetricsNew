import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "Others"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "", code: "", credits: 3, grade: "A",
    semester: "1st Semester", year: "1st Year", category: "Core",
  });

  const load = () => API.get("/courses").then((r) => setCourses(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/courses", form);
    setForm({ ...form, name: "", code: "" });
    load();
  };

  const remove = async (id) => {
    await API.delete(`/courses/${id}`);
    load();
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-ocean-800 mb-6">My Courses</h1>

        {/* Add Course Form */}
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="Course name" required
            className="p-2 border rounded col-span-2"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Code"
            className="p-2 border rounded"
            value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <input type="number" placeholder="Credits" min="1" max="6" required
            className="p-2 border rounded"
            value={form.credits} onChange={(e) => setForm({ ...form, credits: +e.target.value })} />

          <select className="p-2 border rounded" value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}>
            {GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>

          <select className="p-2 border rounded" value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}>
            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => <option key={y}>{y}</option>)}
          </select>

          <select className="p-2 border rounded" value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}>
            {["1st Semester", "2nd Semester"].map((s) => <option key={s}>{s}</option>)}
          </select>

          <select className="p-2 border rounded" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["Core", "Technical", "Elective"].map((c) => <option key={c}>{c}</option>)}
          </select>

          <button className="bg-ocean-500 hover:bg-ocean-600 text-white p-2 rounded col-span-2 md:col-span-4">
            Add Course
          </button>
        </form>

        {/* Course List */}
        <div className="bg-white rounded-xl shadow divide-y">
          {courses.length === 0 && <p className="p-4 text-gray-500">No courses yet.</p>}
          {courses.map((c) => (
            <div key={c._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-ocean-800">{c.name} {c.code && `(${c.code})`}</p>
                <p className="text-sm text-gray-500">
                  {c.year} • {c.semester} • {c.credits} credits • Grade: {c.grade} • {c.category}
                </p>
              </div>
              <button onClick={() => remove(c._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}