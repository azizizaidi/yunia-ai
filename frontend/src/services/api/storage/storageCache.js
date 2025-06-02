/**
 * Storage Cache Functions
 * Handles caching mechanisms for better performance
 */

import { getFromStorage, setToStorage } from './storageCore';

/**
 * Set cached data with expiration
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expirationMs - Expiration time in milliseconds
 * @returns {boolean} Success status
 */
export const setCachedData = (key, data, expirationMs = 5 * 60 * 1000) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiration: Date.now() + expirationMs
    };

    return setToStorage(`cache_${key}`, cacheEntry);
  } catch (error) {
    console.error('Error setting cached data:', error);
    return false;
  }
};

/**
 * Get cached data if not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
  try {
    const cacheEntry = getFromStorage(`cache_${key}`, null);
    
    if (!cacheEntry) {
      return null;
    }

    // Check if expired
    if (Date.now() > cacheEntry.expiration) {
      // Remove expired cache
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

/**
 * Clear specific cached data
 * @param {string} key - Cache key
 * @returns {boolean} Success status
 */
export const clearCachedData = (key) => {
  try {
    localStorage.removeItem(`cache_${key}`);
    return true;
  } catch (error) {
    console.error('Error clearing cached data:', error);
    return false;
  }
};

/**
 * Clear all expired cache entries
 * @returns {number} Number of entries cleared
 */
export const clearExpiredCache = () => {
  try {
    let clearedCount = 0;
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        const cacheEntry = getFromStorage(key, null);
        if (cacheEntry && Date.now() > cacheEntry.expiration) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      clearedCount++;
    });

    return clearedCount;
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return 0;
  }
};

/**
 * Clear all cache entries
 * @returns {number} Number of entries cleared
 */
export const clearAllCache = () => {
  try {
    let clearedCount = 0;
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      clearedCount++;
    });

    return clearedCount;
  } catch (error) {
    console.error('Error clearing all cache:', error);
    return 0;
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  try {
    let totalEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        totalEntries++;
        const size = localStorage[key].length * 2; // Rough estimate
        totalSize += size;

        const cacheEntry = getFromStorage(key, null);
        if (cacheEntry && now > cacheEntry.expiration) {
          expiredEntries++;
        }
      }
    }

    return {
      totalEntries,
      expiredEntries,
      activeEntries: totalEntries - expiredEntries,
      totalSize,
      formattedSize: formatBytes(totalSize)
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalEntries: 0,
      expiredEntries: 0,
      activeEntries: 0,
      totalSize: 0,
      formattedSize: '0 B'
    };
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
