// src/pages/DashboardPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import UserProfile from "../components/UserProfile";
import TaskList from "../components/TaskList";
import ReminderList from "../components/ReminderList";

/**
 * Dashboard page component
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();

    // If no user data, redirect to login page
    if (!user) {
      navigate("/login");
      return;
    }

    // Add event listener to check authentication whenever the page becomes active
    const checkAuth = () => {
      if (!getCurrentUser()) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("focus", checkAuth);

    // Add event listener to check authentication whenever the user presses the back button
    window.addEventListener("popstate", checkAuth);

    // Add event listener to check authentication whenever the page is loaded from cache
    window.addEventListener("pageshow", (event) => {
      // Check if the page is retrieved from cache (bfcache)
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* User profile section with logout button */}
      <UserProfile />

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task list section */}
        <TaskList />

        {/* Reminders section */}
        <ReminderList />
      </div>
    </div>
  );
};

export default Dashboard;
