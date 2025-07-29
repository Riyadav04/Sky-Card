import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-white text-teal-700 font-semibold py-3 px-4 rounded text-2xl"
      : "text-white hover:bg-teal-600 py-3 px-4 rounded transition text-lg";

  const handleLogout = () => {
    localStorage.removeItem("token"); // or any admin-specific token
    navigate("/sign-in"); // redirect to login
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-teal-500 to-teal-700 text-white p-6 shadow-lg relative">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-8">My Dashboard</h2>

      {/* Nav Links */}
      <nav className="flex flex-col gap-4 text-xl">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Manage Users
        </NavLink>
        <NavLink to="/admin/manage-template" className={linkClass}>
          Manage Template
        </NavLink>
        <NavLink to="/admin/add-template" className={linkClass}>
          Add Template
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute bottom-6 left-6 right-6 bg-gradient-to-b from-teal-500 to-teal-700 text-white p-6 shadow-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
