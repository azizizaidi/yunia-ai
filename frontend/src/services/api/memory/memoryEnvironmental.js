/**
 * Memory Environmental Functions
 * Handles environmental data and context tracking
 */

import { getUserData, setUserData, appendToStorageArray } from '../storage/storageUtils';

/**
 * Save environmental data point
 * @param {Object} environmentalData - Environmental data
 * @returns {Promise<Object>} Saved data point
 */
export const saveEnvironmentalData = async (environmentalData) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const dataPoint = {
      id: Date.now(),
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      ...environmentalData
    };

    const success = appendToStorageArray('environmental_data', dataPoint, 500);

    if (success) {
      return dataPoint;
    } else {
      throw new Error('Failed to save environmental data');
    }
  } catch (error) {
    console.error('Error saving environmental data:', error);
    throw error;
  }
};

/**
 * Get environmental data for current user
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of environmental data points
 */
export const getEnvironmentalData = async (limit = 100) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const data = await getUserData('environmental_data', []);

    // Return most recent data points
    return data.slice(-limit).reverse();
  } catch (error) {
    console.error('Error getting environmental data:', error);
    return [];
  }
};
