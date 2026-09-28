import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-ocean-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/dashboard" className="text-xl font-bold">
        🌊 EduMetrics
      </Link>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/analytics">Analytics</Link>
        <span>Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-ocean-500 px-3 py-1 rounded hover:bg-ocean-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}