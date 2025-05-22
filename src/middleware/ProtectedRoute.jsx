import { Navigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * ProtectedRoute component to protect pages that require authentication
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child component to render if user is logged in
 * @returns {JSX.Element} Child component if user is logged in, or redirect to login page
 */
const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by checking localStorage
  const isAuthenticated = localStorage.getItem("user") !== null;

  useEffect(() => {
    // Add headers to prevent caching on protected pages
    // This helps prevent users from using the back button after logout
    const setNoCache = () => {
      document.getElementsByTagName("html")[0].setAttribute("data-no-cache", "true");

      // Add meta tags to prevent caching
      const metaTag = document.createElement("meta");
      metaTag.setAttribute("http-equiv", "Cache-Control");
      metaTag.setAttribute("content", "no-cache, no-store, must-revalidate");
      document.head.appendChild(metaTag);

      const pragmaTag = document.createElement("meta");
      pragmaTag.setAttribute("http-equiv", "Pragma");
      pragmaTag.setAttribute("content", "no-cache");
      document.head.appendChild(pragmaTag);

      const expiresTag = document.createElement("meta");
      expiresTag.setAttribute("http-equiv", "Expires");
      expiresTag.setAttribute("content", "0");
      document.head.appendChild(expiresTag);
    };

    if (isAuthenticated) {
      setNoCache();
    }

    // Add event listener to check authentication whenever the page becomes active
    const checkAuth = () => {
      if (!localStorage.getItem("user")) {
        window.location.href = "/login";
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
  }, [isAuthenticated]);

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component
  return children;
};

export default ProtectedRoute;
