import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import HabitTracker from "./pages/HabitTracker";
import DailyBriefings from "./pages/DailyBriefings";
import ReminderPanel from "./pages/ReminderPanel";
import Subscription from "./pages/Subscription";
import {
  TaskManager,
  GoogleCalendar,
  LiveData,
  WeatherTraffic,
  GPSTracking,
  MemoryStorage,
  DailySchedule,
  WakeupAssistant,
  Analytics,
  ChatHistory
} from "./pages/ComingSoonPages";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman awam - tidak boleh diakses selepas login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-history"
          element={
            <ProtectedRoute requiredRole="user">
              <ChatHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute requiredRole="user">
              <HabitTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/briefings"
          element={
            <ProtectedRoute requiredRole="user">
              <DailyBriefings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute requiredRole="user">
              <ReminderPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute requiredRole="user">
              <Subscription />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute requiredRole="user">
              <TaskManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute requiredRole="user">
              <GoogleCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-data"
          element={
            <ProtectedRoute requiredRole="user">
              <LiveData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <ProtectedRoute requiredRole="user">
              <WeatherTraffic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/location"
          element={
            <ProtectedRoute requiredRole="user">
              <GPSTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memory"
          element={
            <ProtectedRoute requiredRole="user">
              <MemoryStorage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute requiredRole="user">
              <DailySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wakeup"
          element={
            <ProtectedRoute requiredRole="user">
              <WakeupAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole="user">
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Redirect ke login untuk semua laluan yang tidak dikenali */}
        <Route
          path="*"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
