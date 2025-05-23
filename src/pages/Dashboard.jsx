import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import UserProfile from "../components/dashboard/UserProfile";
import TaskList from "../components/dashboard/TaskList";
import ReminderList from "../components/dashboard/ReminderList";
import useAuth from "../hooks/useAuth";

/**
 * Dashboard page component
 * @returns {JSX.Element} Dashboard page
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate("/login", { replace: true });
        return;
      }
      if (isAdmin()) {
        navigate("/admin/dashboard", { replace: true });
      }
    };

    window.addEventListener("focus", checkAuth);
    window.addEventListener("popstate", checkAuth);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("popstate", checkAuth);
      window.removeEventListener("pageshow", checkAuth);
    };
  }, [navigate, isAuthenticated, isAdmin]);

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default DashboardPage;
