/**
 * Memory Preferences Functions
 * Handles user preferences and AI learning data
 */

import { getUserData, setUserData } from '../storage/storageUtils';

/**
 * Save user preferences for AI learning
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Saved preferences
 */
export const saveAILearningPreferences = async (preferences) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const existingPreferences = getUserData('preferences', {});

    const updatedPreferences = {
      ...existingPreferences,
      ...preferences,
      lastUpdated: new Date().toISOString(),
      userId: currentUser.id
    };

    const success = setUserData('preferences', updatedPreferences);

    if (success) {
      return updatedPreferences;
    } else {
      throw new Error('Failed to save preferences');
    }
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

/**
 * Get AI learning preferences
 * @returns {Promise<Object>} AI learning preferences
 */
export const getAILearningPreferences = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    return await getUserData('preferences', {});
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

/**
 * Update specific AI learning preference
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 * @returns {Promise<boolean>} Success status
 */
export const updateAILearningPreference = async (key, value) => {
  try {
    const preferences = await getAILearningPreferences();
    preferences[key] = value;
    preferences.lastUpdated = new Date().toISOString();

    return setUserData('preferences', preferences);
  } catch (error) {
    console.error('Error updating AI learning preference:', error);
    return false;
  }
};

/**
 * Save AI learning preference (alias for updateAILearningPreference for backward compatibility)
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 * @returns {Promise<boolean>} Success status
 */
export const saveAILearningPreference = async (key, value) => {
  return updateAILearningPreference(key, value);
};
