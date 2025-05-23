import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * ProtectedRoute component to protect routes based on authentication and role
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child component to render if conditions are met
 * @param {string} props.requiredRole - Required role to access the route ('admin', 'user', or null for any authenticated user)
 * @returns {JSX.Element} Child component if conditions are met, or redirect to appropriate page
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isLoading, isAuthenticated, isAdmin, isUser } = useAuth();

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  // If role is required, check for specific role
  if (requiredRole) {
    // If admin role is required but user is not admin
    if (requiredRole === 'admin' && !isAdmin()) {
      return <Navigate to="/dashboard" replace />;
    }

    // If user role is required but user is not a regular user
    if (requiredRole === 'user' && !isUser()) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // If all conditions are met, render the children
  return children;
};

export default ProtectedRoute;
