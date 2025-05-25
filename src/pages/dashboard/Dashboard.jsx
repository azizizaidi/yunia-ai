import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import ChatDashboard from "../../components/chat/ChatDashboard";
import UsageMonitor from "../../components/subscription/UsageMonitor";
import useAuth from "../../hooks/useAuth";

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
      <div className="p-2 max-w-7xl mx-auto">
        {/* Usage Monitor - Shows subscription warnings */}
        <UsageMonitor className="mb-4" />

        {/* Chat and Voice Interface */}
        <ChatDashboard />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
