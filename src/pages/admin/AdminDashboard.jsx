// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserStats, getSystemSettings } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/ui/Loader";

/**
 * Admin Dashboard page component
 * @returns {JSX.Element} Admin Dashboard page
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [navigate, isAuthenticated, isAdmin]);

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, settingsData] = await Promise.all([
          getUserStats(),
          getSystemSettings()
        ]);

        setUserStats(statsData);
        setSystemSettings(settingsData);
      } catch (err) {
        setError("Failed to load admin dashboard data");
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated() && isAdmin()) {
      fetchAdminData();
    }
  }, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    logoutUser();

    // Add timestamp parameter to ensure login page is not cached
    const timestamp = new Date().getTime();

    // Redirect to admin login page
    navigate(`/admin/login?t=${timestamp}`, { replace: true });
  };

  const showLogoutModal = () => {
    document.getElementById('logout_modal_admin').showModal();
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
            onClick={showLogoutModal}
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <span className="material-icons text-red-500 mr-2">error</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Admin Sections */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management Section */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">User Management</h3>
                <p className="text-gray-600 mb-4">Manage user accounts, permissions, and activities.</p>
                <div className="bg-gray-100 p-4 rounded-md">
                  {userStats ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Total Users: {userStats.totalUsers}</p>
                      <p className="text-sm text-gray-500">Active Users: {userStats.activeUsers}</p>
                      <p className="text-sm text-gray-500">Admin Users: {userStats.adminUsers}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading user stats...</p>
                  )}
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
                {systemSettings ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Last Updated: {systemSettings.lastUpdated
                        ? new Date(systemSettings.lastUpdated).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                    <p className="text-sm text-gray-500">Version: {systemSettings.version}</p>
                    <p className="text-sm text-gray-500">Status: {systemSettings.status}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading system info...</p>
                )}
              </div>
              <button className="mt-4 w-full bg-[#4a4a9c] text-white py-2 px-4 rounded font-medium hover:bg-[#3a3a7c] focus:outline-none">
                Manage Settings
              </button>
            </div>

            {/* System Performance Section */}
            {systemSettings?.performance && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">System Performance</h3>
                <p className="text-gray-600 mb-4">Monitor system health and performance metrics.</p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Uptime: {systemSettings.performance.uptime}</p>
                    <p className="text-sm text-gray-500">Response Time: {systemSettings.performance.responseTime}</p>
                    <p className="text-sm text-gray-500">Error Rate: {systemSettings.performance.errorRate}</p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-[#4a4a9c] text-white py-2 px-4 rounded font-medium hover:bg-[#3a3a7c] focus:outline-none">
                  View Details
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal_admin" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to logout from the admin panel?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AdminDashboard;
