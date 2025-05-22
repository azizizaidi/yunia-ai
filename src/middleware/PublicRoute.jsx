import { Navigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * PublicRoute component for public pages that cannot be accessed after login
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child component to render if user is not logged in
 * @returns {JSX.Element} Child component if user is not logged in, or redirect to dashboard
 */
const PublicRoute = ({ children }) => {
  // Check if user is logged in by checking localStorage
  const isAuthenticated = localStorage.getItem("user") !== null;

  useEffect(() => {
    // Add event listener to check authentication whenever the page becomes active
    const checkAuth = () => {
      if (localStorage.getItem("user")) {
        window.location.href = "/dashboard";
      }
    };

    // Add event listener to check authentication whenever the page is loaded
    window.addEventListener("pageshow", (event) => {
      // Check if the page is retrieved from cache (bfcache)
      if (event.persisted) {
        checkAuth();
      }
    });

    // Add event listener to check authentication whenever the user presses the back button
    window.addEventListener("popstate", () => {
      checkAuth();
    });

    return () => {
      window.removeEventListener("pageshow", checkAuth);
      window.removeEventListener("popstate", checkAuth);
    };
  }, []);

  // If user is logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not logged in, render the child component
  return children;
};

export default PublicRoute;
