import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * PublicRoute component for routes that should not be accessible when logged in
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child component to render if user is not logged in
 * @returns {JSX.Element} Child component if user is not logged in, or redirect to appropriate dashboard
 */
const PublicRoute = ({ children }) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated()) {
    if (isAdmin()) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If not authenticated, render the children
  return children;
};

export default PublicRoute;
