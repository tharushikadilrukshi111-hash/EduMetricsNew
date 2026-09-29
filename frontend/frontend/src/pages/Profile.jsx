import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [form, setForm] = useState({
    name: "", email: "", university: "", department: "", year: "", semester: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/profile").then((r) => {
      setForm({ ...r.data });
      setLoading(false);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await API.put("/auth/profile", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (loading) return <div><Navbar /><p className="p-6">Loading...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-ocean-800 mb-6">👤 My Profile</h1>

        {/* Avatar */}
        <div className="card mb-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-700 flex items-center justify-center text-white text-4xl font-bold shadow-ocean-lg animate-float">
            {form.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ocean-800">{form.name || "Student"}</h2>
            <p className="text-gray-500">{form.email}</p>
            <p className="text-sm text-ocean-600 mt-1">
              {form.department || "Department not set"} • {form.year || "Year not set"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.name} onChange={update("name")} />
            <Field label="Email" value={form.email} onChange={update("email")} disabled />
            <Field label="University" value={form.university} onChange={update("university")} />
            <Field label="Department" value={form.department} onChange={update("department")} />

            <div>
              <label className="block text-sm font-semibold text-ocean-800 mb-1">Year</label>
              <select className="input-ocean" value={form.year} onChange={update("year")}>
                <option value="">Select Year</option>
                {["1st Year","2nd Year","3rd Year","4th Year"].map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ocean-800 mb-1">Semester</label>
              <select className="input-ocean" value={form.semester} onChange={update("semester")}>
                <option value="">Select Semester</option>
                {["1st Semester","2nd Semester"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-ocean w-full">💾 Save Changes</button>

          {saved && (
            <p className="text-green-600 text-center font-semibold animate-fade-in">
              ✅ Profile updated successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ocean-800 mb-1">{label}</label>
      <input
        className="input-ocean disabled:bg-gray-100"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}