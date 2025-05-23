import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

/**
 * Custom hook for authentication and authorization
 * @returns {Object} Authentication state and helper functions
 */
const useAuth = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const isAuthenticated = () => {
    return user !== null;
  };

  /**
   * Check if user is an admin
   * @returns {boolean} True if user is an admin
   */
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  /**
   * Check if user is a regular user
   * @returns {boolean} True if user is a regular user
   */
  const isUser = () => {
    return user && (user.role === 'user' || !user.role);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isUser
  };
};

export default useAuth;
