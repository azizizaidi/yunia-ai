import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated()) {
      router.push(requiredRole === 'admin' ? '/admin/login' : '/login');
      return;
    }

    // If role is required, check for specific role
    if (!isLoading && isAuthenticated() && requiredRole) {
      // If admin role is required but user is not admin
      if (requiredRole === 'admin' && !isAdmin()) {
        router.push("/dashboard");
        return;
      }

      // If user role is required but user is not a regular user
      if (requiredRole === 'user' && !isUser()) {
        router.push("/admin/dashboard");
        return;
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, isUser, requiredRole, router]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  // If role is required, check for specific role
  if (requiredRole) {
    // If admin role is required but user is not admin
    if (requiredRole === 'admin' && !isAdmin()) {
      return <div>Redirecting...</div>;
    }

    // If user role is required but user is not a regular user
    if (requiredRole === 'user' && !isUser()) {
      return <div>Redirecting...</div>;
    }
  }

  // If all conditions are met, render the children
  return children;
};

export default ProtectedRoute;
