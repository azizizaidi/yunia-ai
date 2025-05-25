/**
 * Memory Statistics Functions
 * Handles memory statistics and analytics
 */

import { getUserData } from '../storage/storageUtils';

/**
 * Get comprehensive memory statistics for current user
 * @returns {Promise<Object>} Memory statistics object
 */
export const getMemoryStatistics = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    // Get all user data
    const conversations = getUserData('conversations', []);
    const reminders = getUserData('user_reminders', []);
    const preferences = getUserData('preferences', {});
    const environmentalData = getUserData('environmental_data', []);

    // Calculate statistics
    const stats = {
      // Conversation statistics
      totalConversations: conversations.length,
      conversationsByTopic: getConversationsByTopic(conversations),
      recentConversations: getRecentCount(conversations, 7), // Last 7 days

      // Reminder statistics
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.status === 'active').length,
      completedReminders: reminders.filter(r => r.status === 'completed').length,
      reminderCompletionRate: reminders.length > 0 
        ? Math.round((reminders.filter(r => r.status === 'completed').length / reminders.length) * 100)
        : 0,

      // Preference statistics
      totalPreferences: Object.keys(preferences).length,
      preferencesLastUpdated: preferences.lastUpdated || null,

      // Environmental data statistics
      environmentalDataPoints: environmentalData.length,
      recentEnvironmentalData: getRecentCount(environmentalData, 7),

      // Memory items (combined)
      totalMemoryItems: conversations.length + reminders.length + environmentalData.length,

      // User engagement
      engagementScore: calculateEngagementScore({
        conversations: conversations.length,
        reminders: reminders.length,
        completedReminders: reminders.filter(r => r.status === 'completed').length,
        recentActivity: getRecentCount([...conversations, ...reminders], 7)
      }),

      // Last activity
      lastActivity: getLastActivity([...conversations, ...reminders, ...environmentalData]),

      // Generated timestamp
      generatedAt: new Date().toISOString()
    };

    return stats;
  } catch (error) {
    console.error('Error getting memory statistics:', error);
    return {};
  }
};

/**
 * Get conversations grouped by topic
 * @param {Array} conversations - Array of conversations
 * @returns {Object} Object with topic counts
 */
const getConversationsByTopic = (conversations) => {
  const topicCounts = {};
  
  conversations.forEach(conv => {
    const topic = conv.topic || 'general';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  return topicCounts;
};

/**
 * Get count of recent items (within specified days)
 * @param {Array} items - Array of items with timestamp
 * @param {number} days - Number of days to look back
 * @returns {number} Count of recent items
 */
const getRecentCount = (items, days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return items.filter(item => {
    const itemDate = new Date(item.timestamp || item.createdAt || item.date);
    return itemDate > cutoffDate;
  }).length;
};

/**
 * Calculate user engagement score
 * @param {Object} data - Engagement data
 * @returns {number} Engagement score (0-100)
 */
const calculateEngagementScore = (data) => {
  let score = 0;

  // Conversations contribute 30%
  score += Math.min(30, data.conversations * 2);

  // Reminders contribute 25%
  score += Math.min(25, data.reminders * 2.5);

  // Completion rate contributes 25%
  if (data.reminders > 0) {
    const completionRate = (data.completedReminders / data.reminders) * 100;
    score += (completionRate * 0.25);
  }

  // Recent activity contributes 20%
  score += Math.min(20, data.recentActivity * 4);

  return Math.min(100, Math.round(score));
};

/**
 * Get last activity timestamp
 * @param {Array} items - Array of items with timestamps
 * @returns {string|null} Last activity timestamp
 */
const getLastActivity = (items) => {
  if (items.length === 0) return null;

  const timestamps = items.map(item => 
    new Date(item.timestamp || item.createdAt || item.date || 0)
  ).filter(date => !isNaN(date.getTime()));

  if (timestamps.length === 0) return null;

  const lastTimestamp = new Date(Math.max(...timestamps));
  return lastTimestamp.toISOString();
};

/**
 * Get memory usage breakdown
 * @returns {Promise<Object>} Memory usage statistics
 */
export const getMemoryUsageBreakdown = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const conversations = getUserData('conversations', []);
    const reminders = getUserData('user_reminders', []);
    const preferences = getUserData('preferences', {});
    const environmentalData = getUserData('environmental_data', []);

    // Estimate storage usage (rough calculation)
    const conversationSize = JSON.stringify(conversations).length;
    const reminderSize = JSON.stringify(reminders).length;
    const preferenceSize = JSON.stringify(preferences).length;
    const environmentalSize = JSON.stringify(environmentalData).length;

    const totalSize = conversationSize + reminderSize + preferenceSize + environmentalSize;

    return {
      breakdown: {
        conversations: {
          count: conversations.length,
          size: conversationSize,
          percentage: totalSize > 0 ? Math.round((conversationSize / totalSize) * 100) : 0
        },
        reminders: {
          count: reminders.length,
          size: reminderSize,
          percentage: totalSize > 0 ? Math.round((reminderSize / totalSize) * 100) : 0
        },
        preferences: {
          count: Object.keys(preferences).length,
          size: preferenceSize,
          percentage: totalSize > 0 ? Math.round((preferenceSize / totalSize) * 100) : 0
        },
        environmental: {
          count: environmentalData.length,
          size: environmentalSize,
          percentage: totalSize > 0 ? Math.round((environmentalSize / totalSize) * 100) : 0
        }
      },
      totalSize,
      formattedSize: formatBytes(totalSize),
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting memory usage breakdown:', error);
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
