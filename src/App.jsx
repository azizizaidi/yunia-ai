import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register } from "./pages/auth";
import { AdminLogin, AdminDashboard } from "./pages/admin";
import {
  Dashboard,
  MemoryManager,
  HabitTracker,
  DailyBriefings,
  ReminderPanel,
  Subscription
} from "./pages/dashboard";
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
import { PublicRoute, ProtectedRoute } from "./components/auth";
// import { AIMemoryProvider } from "./context/AIMemoryContext";

function App() {
  return (
    // <AIMemoryProvider>
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
              <MemoryManager />
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
    // </AIMemoryProvider>
  );
}

export default App;
