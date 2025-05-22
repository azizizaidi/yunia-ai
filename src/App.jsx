import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./middleware/ProtectedRoute";
import PublicRoute from "./middleware/PublicRoute";

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

        {/* Halaman yang dilindungi - memerlukan authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
