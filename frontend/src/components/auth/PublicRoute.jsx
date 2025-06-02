import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";

/**
 * PublicRoute component for routes that should not be accessible when logged in
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child component to render if user is not logged in
 * @returns {JSX.Element} Child component if user is not logged in, or redirect to appropriate dashboard
 */
const PublicRoute = ({ children }) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authenticated, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated()) {
      if (isAdmin()) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If authenticated, show loading while redirecting
  if (isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  // If not authenticated, render the children
  return children;
};

export default PublicRoute;
