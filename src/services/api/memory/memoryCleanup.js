/**
 * Memory Cleanup Functions
 * Handles memory cleanup and maintenance operations
 */

import { getUserData, setUserData } from '../storage/storageUtils';

/**
 * Clean up old conversations based on retention policy
 * @param {number} retentionDays - Number of days to retain data
 * @returns {Promise<Object>} Cleanup result
 */
export const cleanupOldConversations = async (retentionDays = 90) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const conversations = getUserData('conversations', []);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const originalCount = conversations.length;
    const filteredConversations = conversations.filter(conv => {
      const convDate = new Date(conv.timestamp);
      return convDate > cutoffDate;
    });

    const removedCount = originalCount - filteredConversations.length;

    if (removedCount > 0) {
      setUserData('conversations', filteredConversations);
    }

    return {
      success: true,
      originalCount,
      removedCount,
      remainingCount: filteredConversations.length
    };
  } catch (error) {
    console.error('Error cleaning up old conversations:', error);
    return {
      success: false,
      error: error.message,
      originalCount: 0,
      removedCount: 0,
      remainingCount: 0
    };
  }
};

/**
 * Clean up completed reminders older than specified days
 * @param {number} retentionDays - Number of days to retain completed reminders
 * @returns {Promise<Object>} Cleanup result
 */
export const cleanupCompletedReminders = async (retentionDays = 30) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const reminders = getUserData('user_reminders', []);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const originalCount = reminders.length;
    const filteredReminders = reminders.filter(reminder => {
      // Keep active reminders regardless of age
      if (reminder.status === 'active') {
        return true;
      }

      // For completed/cancelled reminders, check age
      const completedDate = new Date(reminder.completedAt || reminder.updatedAt || reminder.createdAt);
      return completedDate > cutoffDate;
    });

    const removedCount = originalCount - filteredReminders.length;

    if (removedCount > 0) {
      setUserData('user_reminders', filteredReminders);
    }

    return {
      success: true,
      originalCount,
      removedCount,
      remainingCount: filteredReminders.length
    };
  } catch (error) {
    console.error('Error cleaning up completed reminders:', error);
    return {
      success: false,
      error: error.message,
      originalCount: 0,
      removedCount: 0,
      remainingCount: 0
    };
  }
};

/**
 * Clean up old environmental data
 * @param {number} retentionDays - Number of days to retain environmental data
 * @returns {Promise<Object>} Cleanup result
 */
export const cleanupEnvironmentalData = async (retentionDays = 60) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const environmentalData = getUserData('environmental_data', []);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const originalCount = environmentalData.length;
    const filteredData = environmentalData.filter(data => {
      const dataDate = new Date(data.timestamp);
      return dataDate > cutoffDate;
    });

    const removedCount = originalCount - filteredData.length;

    if (removedCount > 0) {
      setUserData('environmental_data', filteredData);
    }

    return {
      success: true,
      originalCount,
      removedCount,
      remainingCount: filteredData.length
    };
  } catch (error) {
    console.error('Error cleaning up environmental data:', error);
    return {
      success: false,
      error: error.message,
      originalCount: 0,
      removedCount: 0,
      remainingCount: 0
    };
  }
};

/**
 * Perform comprehensive memory cleanup
 * @param {Object} options - Cleanup options
 * @returns {Promise<Object>} Comprehensive cleanup result
 */
export const performMemoryCleanup = async (options = {}) => {
  try {
    const {
      conversationRetentionDays = 90,
      reminderRetentionDays = 30,
      environmentalRetentionDays = 60
    } = options;

    const results = await Promise.all([
      cleanupOldConversations(conversationRetentionDays),
      cleanupCompletedReminders(reminderRetentionDays),
      cleanupEnvironmentalData(environmentalRetentionDays)
    ]);

    const [conversationResult, reminderResult, environmentalResult] = results;

    return {
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        conversations: conversationResult,
        reminders: reminderResult,
        environmental: environmentalResult
      },
      totalRemoved: (conversationResult.removedCount || 0) + 
                   (reminderResult.removedCount || 0) + 
                   (environmentalResult.removedCount || 0)
    };
  } catch (error) {
    console.error('Error performing memory cleanup:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      totalRemoved: 0
    };
  }
};

/**
 * Get cleanup recommendations based on current data
 * @returns {Promise<Object>} Cleanup recommendations
 */
export const getCleanupRecommendations = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const conversations = getUserData('conversations', []);
    const reminders = getUserData('user_reminders', []);
    const environmentalData = getUserData('environmental_data', []);

    const now = new Date();
    const recommendations = [];

    // Check old conversations (>90 days)
    const oldConversations = conversations.filter(conv => {
      const convDate = new Date(conv.timestamp);
      const daysDiff = (now - convDate) / (1000 * 60 * 60 * 24);
      return daysDiff > 90;
    });

    if (oldConversations.length > 0) {
      recommendations.push({
        type: 'conversations',
        count: oldConversations.length,
        message: `${oldConversations.length} conversations older than 90 days can be cleaned up`,
        priority: 'medium'
      });
    }

    // Check completed reminders (>30 days)
    const oldCompletedReminders = reminders.filter(reminder => {
      if (reminder.status !== 'completed') return false;
      const completedDate = new Date(reminder.completedAt || reminder.updatedAt);
      const daysDiff = (now - completedDate) / (1000 * 60 * 60 * 24);
      return daysDiff > 30;
    });

    if (oldCompletedReminders.length > 0) {
      recommendations.push({
        type: 'reminders',
        count: oldCompletedReminders.length,
        message: `${oldCompletedReminders.length} completed reminders older than 30 days can be cleaned up`,
        priority: 'low'
      });
    }

    // Check environmental data (>60 days)
    const oldEnvironmentalData = environmentalData.filter(data => {
      const dataDate = new Date(data.timestamp);
      const daysDiff = (now - dataDate) / (1000 * 60 * 60 * 24);
      return daysDiff > 60;
    });

    if (oldEnvironmentalData.length > 0) {
      recommendations.push({
        type: 'environmental',
        count: oldEnvironmentalData.length,
        message: `${oldEnvironmentalData.length} environmental data points older than 60 days can be cleaned up`,
        priority: 'low'
      });
    }

    return {
      hasRecommendations: recommendations.length > 0,
      recommendations,
      totalItems: conversations.length + reminders.length + environmentalData.length,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting cleanup recommendations:', error);
    return {
      hasRecommendations: false,
      recommendations: [],
      error: error.message
    };
  }
};
