import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-ocean-700 text-center">
          EduMetrics Sign Up
        </h2>
        <input
          placeholder="Name"
          className="w-full p-2 border rounded focus:outline-ocean-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded focus:outline-ocean-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded focus:outline-ocean-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-ocean-500 hover:bg-ocean-600 text-white p-2 rounded">
          Register
        </button>
        <p className="text-center text-sm">
          Already have account? <Link to="/" className="text-ocean-600">Login</Link>
        </p>
      </form>
    </div>
  );
}