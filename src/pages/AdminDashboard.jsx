// src/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import useAuth from "../hooks/useAuth";

/**
 * Admin Dashboard page component
 * @returns {JSX.Element} Admin Dashboard page
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Add event listener to check authentication whenever the page becomes active
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!isAdmin()) {
        navigate("/dashboard", { replace: true });
      }
    };

    window.addEventListener("focus", checkAuth);
    window.addEventListener("popstate", checkAuth);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        checkAuth();
      }
    });

    // Cleanup event listeners when component unmounts
    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("popstate", checkAuth);
      window.removeEventListener("pageshow", checkAuth);
    };
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-[#4a4a9c] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-[#4a4a9c] px-4 py-2 rounded-md font-medium hover:bg-gray-100 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Admin Panel</h2>
          <p className="text-gray-600">
            This is the admin dashboard where you can manage users, content, and system settings.
          </p>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">User Management</h3>
            <p className="text-gray-600 mb-4">Manage user accounts, permissions, and activities.</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Users: 0</p>
            </div>
            <button className="mt-4 w-full bg-[#4a4a9c] text-white py-2 px-4 rounded font-medium hover:bg-[#3a3a7c] focus:outline-none">
              Manage Users
            </button>
          </div>

    

          {/* System Settings Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure system settings and preferences.</p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-500">Last Updated: Never</p>
            </div>
            <button className="mt-4 w-full bg-[#4a4a9c] text-white py-2 px-4 rounded font-medium hover:bg-[#3a3a7c] focus:outline-none">
              Manage Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
