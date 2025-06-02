/**
 * Storage Utility Functions
 * Additional utility functions for storage management
 */

import { getFromStorage, setToStorage } from './storageCore';

/**
 * Get user-specific storage key
 * @param {string} key - Base key
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {string} User-specific key
 */
export const getUserStorageKey = async (key, userId = null) => {
  try {
    if (userId) {
      return `${key}_${userId}`;
    }

    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user authenticated');
    }

    return `${key}_${currentUser.id}`;
  } catch (error) {
    console.error('Error getting user storage key:', error);
    return key; // Fallback to base key
  }
};

/**
 * Get user-specific data from storage
 * @param {string} key - Base storage key
 * @param {any} defaultValue - Default value
 * @param {number} userId - User ID (optional)
 * @returns {any} Stored value or default
 */
export const getUserData = async (key, defaultValue = null, userId = null) => {
  try {
    const userKey = await getUserStorageKey(key, userId);
    return getFromStorage(userKey, defaultValue);
  } catch (error) {
    console.error('Error getting user data:', error);
    return defaultValue;
  }
};

/**
 * Set user-specific data to storage
 * @param {string} key - Base storage key
 * @param {any} value - Value to store
 * @param {number} userId - User ID (optional)
 * @returns {boolean} Success status
 */
export const setUserData = async (key, value, userId = null) => {
  try {
    const userKey = await getUserStorageKey(key, userId);
    return setToStorage(userKey, value);
  } catch (error) {
    console.error('Error setting user data:', error);
    return false;
  }
};

/**
 * Append data to an array in storage
 * @param {string} key - Storage key
 * @param {any} item - Item to append
 * @param {number} maxItems - Maximum number of items to keep
 * @returns {boolean} Success status
 */
export const appendToStorageArray = (key, item, maxItems = 100) => {
  try {
    const array = getFromStorage(key, []);
    array.push(item);

    // Keep only the last maxItems
    if (array.length > maxItems) {
      array.splice(0, array.length - maxItems);
    }

    return setToStorage(key, array);
  } catch (error) {
    console.error('Error appending to storage array:', error);
    return false;
  }
};

/**
 * Update item in storage array by ID
 * @param {string} key - Storage key
 * @param {number|string} itemId - Item ID to update
 * @param {Object} updateData - Data to update
 * @returns {boolean} Success status
 */
export const updateStorageArrayItem = (key, itemId, updateData) => {
  try {
    const array = getFromStorage(key, []);
    const itemIndex = array.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return false; // Item not found
    }

    array[itemIndex] = {
      ...array[itemIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    return setToStorage(key, array);
  } catch (error) {
    console.error('Error updating storage array item:', error);
    return false;
  }
};

/**
 * Remove item from storage array by ID
 * @param {string} key - Storage key
 * @param {number|string} itemId - Item ID to remove
 * @returns {boolean} Success status
 */
export const removeStorageArrayItem = (key, itemId) => {
  try {
    const array = getFromStorage(key, []);
    const filteredArray = array.filter(item => item.id !== itemId);

    if (filteredArray.length === array.length) {
      return false; // Item not found
    }

    return setToStorage(key, filteredArray);
  } catch (error) {
    console.error('Error removing storage array item:', error);
    return false;
  }
};

/**
 * Search items in storage array
 * @param {string} key - Storage key
 * @param {Function} searchFunction - Function to test each item
 * @returns {Array} Array of matching items
 */
export const searchStorageArray = (key, searchFunction) => {
  try {
    const array = getFromStorage(key, []);
    return array.filter(searchFunction);
  } catch (error) {
    console.error('Error searching storage array:', error);
    return [];
  }
};

/**
 * Get storage statistics for user data
 * @param {number} userId - User ID (optional)
 * @returns {Object} Storage statistics
 */
export const getUserStorageStats = async (userId = null) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) return {};

    const userPrefix = `_${user.id}`;
    let totalSize = 0;
    let itemCount = 0;
    const categories = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.endsWith(userPrefix)) {
        const size = (localStorage[key].length + key.length) * 2;
        totalSize += size;
        itemCount++;

        // Categorize by key prefix
        const category = key.split('_')[0];
        if (!categories[category]) {
          categories[category] = { count: 0, size: 0 };
        }
        categories[category].count++;
        categories[category].size += size;
      }
    }

    return {
      userId: user.id,
      totalSize,
      itemCount,
      categories,
      formattedSize: formatBytes(totalSize)
    };
  } catch (error) {
    console.error('Error getting user storage stats:', error);
    return {};
  }
};

/**
 * Format bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
