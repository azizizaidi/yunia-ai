import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import UserProfile from "../components/dashboard/UserProfile";
import TaskList from "../components/dashboard/TaskList";
import NotificationList from "../components/dashboard/NotificationList";
import ReminderList from "../components/dashboard/ReminderList";
import ChatDashboard from "../components/chat/ChatDashboard";
import useAuth from "../hooks/useAuth";

/**
 * Dashboard page component - Yunia AI Personal Assistant SaaS
 * Domain: Personal Assistant Dashboard for managing AI interactions, tasks, and reminders
 * @returns {JSX.Element} Dashboard page
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState('overview'); // 'overview' or 'chat'

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
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${activeView === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <span className="material-icons mr-2">dashboard</span>
              Dashboard Overview
            </button>
            <button
              className={`tab ${activeView === 'chat' ? 'tab-active' : ''}`}
              onClick={() => setActiveView('chat')}
            >
              <span className="material-icons mr-2">chat</span>
              AI Chat
            </button>
          </div>
        </div>

        {activeView === 'overview' ? (
          <>
            {/* User Profile Panel - Required Component 1 */}
            <UserProfile />

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">
                    <span className="material-icons">psychology</span>
                    AI Interactions Today
                  </h2>
                  <div className="stat-value text-3xl">24</div>
                  <div className="stat-desc text-primary-content/70">+12% from yesterday</div>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="card bg-gradient-to-r from-success to-info text-white shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">
                    <span className="material-icons">task_alt</span>
                    Tasks Completed
                  </h2>
                  <div className="stat-value text-3xl">8/12</div>
                  <div className="stat-desc text-white/70">4 tasks remaining</div>
                </div>
              </div>

              {/* Reminders Active */}
              <div className="card bg-gradient-to-r from-warning to-error text-white shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">
                    <span className="material-icons">notifications_active</span>
                    Active Reminders
                  </h2>
                  <div className="stat-value text-3xl">5</div>
                  <div className="stat-desc text-white/70">2 due today</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Task/Item Overview Section - Required Component 2 */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">
                      <span className="material-icons">assignment</span>
                      AI Assistant Tasks
                    </h2>
                    <TaskList />
                  </div>
                </div>

                {/* Reminders Section */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">
                      <span className="material-icons">schedule</span>
                      Smart Reminders
                    </h2>
                    <ReminderList />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Notifications/Reminders - Required Component 3 */}
                <NotificationList />

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">
                      <span className="material-icons">bolt</span>
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setActiveView('chat')}
                      >
                        <span className="material-icons">chat</span>
                        Start AI Chat
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/voice-chat')}
                      >
                        <span className="material-icons">mic</span>
                        Voice Chat
                      </button>
                      <button className="btn btn-accent">
                        <span className="material-icons">add_task</span>
                        Add Task
                      </button>
                      <button className="btn btn-info">
                        <span className="material-icons">schedule</span>
                        Set Reminder
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Status */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title">
                      <span className="material-icons">smart_toy</span>
                      Yunia AI Status
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="badge badge-success gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        Online
                      </div>
                      <span className="text-sm opacity-70">Ready to assist you</span>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm opacity-70 mb-2">Today's Usage</div>
                      <progress className="progress progress-primary w-full" value="60" max="100"></progress>
                      <div className="text-xs opacity-50 mt-1">60% of daily limit used</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* AI Chat View */
          <div className="h-[calc(100vh-12rem)]">
            <ChatDashboard />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
