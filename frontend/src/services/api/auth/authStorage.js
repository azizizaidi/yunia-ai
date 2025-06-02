/**
 * Authentication Storage Functions
 * Handles authentication-related storage operations
 */

/**
 * Save user session data
 * @param {Object} user - User object to save
 * @param {boolean} rememberMe - Whether to persist session
 */
export const saveUserSession = (user, rememberMe = false) => {
  try {
    const sessionData = {
      ...user,
      loginTime: new Date().toISOString(),
      rememberMe
    };

    if (rememberMe) {
      // Use localStorage for persistent session
      localStorage.setItem("user", JSON.stringify(sessionData));
    } else {
      // Use sessionStorage for temporary session
      sessionStorage.setItem("user", JSON.stringify(sessionData));
      // Also save to localStorage for compatibility
      localStorage.setItem("user", JSON.stringify(sessionData));
    }
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

/**
 * Clear user session data
 */
export const clearUserSession = () => {
  try {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Get user session data
 * @returns {Object|null} User session data or null
 */
export const getUserSession = () => {
  try {
    // Try localStorage first
    let userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }

    // Fallback to sessionStorage
    userData = sessionStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }

    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

/**
 * Check if user session is valid
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = () => {
  try {
    const session = getUserSession();
    if (!session) return false;

    // Check if session has expired (24 hours for non-remember sessions)
    if (!session.rememberMe) {
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        clearUserSession();
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
};
