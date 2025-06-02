/**
 * User Preferences Functions
 * Handles user preference management
 */

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Updated preferences
 */
export const updateUserPreferences = async (preferences) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update preferences in localStorage
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences
      },
      lastActive: new Date().toISOString()
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser.preferences;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

/**
 * Get user preferences
 * @returns {Promise<Object>} User preferences
 */
export const getUserPreferences = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {};
    }

    return currentUser.preferences || {};
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return {};
  }
};

/**
 * Save specific user preference
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 * @returns {Promise<void>}
 */
export const saveUserPreference = async (key, value) => {
  try {
    const currentPreferences = await getUserPreferences();
    const updatedPreferences = {
      ...currentPreferences,
      [key]: value
    };

    await updateUserPreferences(updatedPreferences);
  } catch (error) {
    console.error("Error saving user preference:", error);
    throw error;
  }
};

/**
 * Get specific user preference
 * @param {string} key - Preference key
 * @param {any} defaultValue - Default value if preference doesn't exist
 * @returns {Promise<any>} Preference value
 */
export const getUserPreference = async (key, defaultValue = null) => {
  try {
    const preferences = await getUserPreferences();
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  } catch (error) {
    console.error("Error getting user preference:", error);
    return defaultValue;
  }
};
