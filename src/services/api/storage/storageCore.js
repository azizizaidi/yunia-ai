/**
 * Storage Core Functions
 * Handles localStorage operations with error handling and fallbacks
 */

/**
 * Get data from localStorage with fallback
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item to localStorage (${key}):`, error);
    
    // If quota exceeded, try to clear some old data
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, attempting to clear old data...');
      clearOldData();
      
      // Try again after clearing
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (retryError) {
        console.error('Failed to store data even after clearing:', retryError);
        return false;
      }
    }
    
    return false;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} Storage usage stats
 */
export const getStorageUsage = () => {
  try {
    let totalSize = 0;
    const itemSizes = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage[key].length + key.length) * 2; // Rough estimate in bytes
        itemSizes[key] = size;
        totalSize += size;
      }
    }

    return {
      totalSize,
      itemCount: Object.keys(itemSizes).length,
      itemSizes,
      formattedSize: formatBytes(totalSize)
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return {
      totalSize: 0,
      itemCount: 0,
      itemSizes: {},
      formattedSize: '0 B'
    };
  }
};

/**
 * Clear old data to free up storage space
 */
const clearOldData = () => {
  try {
    const keysToCheck = [];
    
    // Collect all keys
    for (let i = 0; i < localStorage.length; i++) {
      keysToCheck.push(localStorage.key(i));
    }

    // Remove old cache entries
    keysToCheck.forEach(key => {
      if (key.startsWith('cache_timestamp_')) {
        const timestamp = localStorage.getItem(key);
        if (timestamp) {
          const age = Date.now() - parseInt(timestamp);
          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          
          if (age > oneWeek) {
            const cacheKey = key.replace('cache_timestamp_', 'cache_');
            localStorage.removeItem(key);
            localStorage.removeItem(cacheKey);
          }
        }
      }
    });

    console.log('Cleared old cache data');
  } catch (error) {
    console.error('Error clearing old data:', error);
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

/**
 * Backup localStorage data
 * @returns {Object} Backup data object
 */
export const backupStorage = () => {
  try {
    const backup = {};
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        backup[key] = localStorage[key];
      }
    }

    return {
      timestamp: new Date().toISOString(),
      data: backup
    };
  } catch (error) {
    console.error('Error creating storage backup:', error);
    return null;
  }
};

/**
 * Restore localStorage data from backup
 * @param {Object} backup - Backup data object
 * @returns {boolean} Success status
 */
export const restoreStorage = (backup) => {
  try {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup data');
    }

    // Clear current storage
    localStorage.clear();

    // Restore data
    Object.keys(backup.data).forEach(key => {
      localStorage.setItem(key, backup.data[key]);
    });

    return true;
  } catch (error) {
    console.error('Error restoring storage:', error);
    return false;
  }
};
