/**
 * Memory Cleanup Functions
 * Handles memory cleanup and maintenance operations
 */

import { getUserData, setUserData } from '../storage/storageUtils';

/**
 * Generate conversation hash for duplicate detection
 * @param {Object} conversation - Conversation data
 * @returns {string} Hash string
 */
const generateConversationHash = (conversation) => {
  const content = [
    conversation.title || '',
    conversation.content || '',
    conversation.lastUserMessage || '',
    conversation.lastAIMessage || ''
  ].join('|').toLowerCase();

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

/**
 * Detect conversation topic/category
 * @param {Object} conversation - Conversation data
 * @returns {string} Topic category
 */
const detectConversationTopic = (conversation) => {
  const content = [
    conversation.title || '',
    conversation.content || '',
    conversation.lastUserMessage || '',
    conversation.lastAIMessage || ''
  ].join(' ').toLowerCase();

  // Topic keywords mapping
  const topicKeywords = {
    'income': ['income', 'salary', 'money', 'earnings', 'revenue', 'profit', 'financial', 'budget', 'expense'],
    'planner': ['plan', 'schedule', 'calendar', 'appointment', 'meeting', 'reminder', 'task', 'todo', 'organize'],
    'weather': ['weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast', 'climate'],
    'health': ['health', 'exercise', 'fitness', 'diet', 'medical', 'doctor', 'wellness'],
    'work': ['work', 'job', 'career', 'project', 'deadline', 'office', 'business', 'professional'],
    'personal': ['personal', 'family', 'friend', 'relationship', 'hobby', 'interest', 'lifestyle']
  };

  // Check for topic matches
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return topic;
    }
  }

  return 'general';
};

/**
 * Scan for and remove duplicate conversations
 * @returns {Promise<Object>} Scan and removal report
 */
export const scanAndRemoveDuplicates = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const conversations = getUserData('conversations', []);
    const totalScanned = conversations.length;

    if (totalScanned === 0) {
      return {
        success: true,
        totalScanned: 0,
        duplicatesFound: 0,
        duplicatesRemoved: 0,
        uniqueConversations: 0,
        removedConversations: []
      };
    }

    // Create hash map to track duplicates
    const hashMap = new Map();
    const uniqueConversations = [];
    const duplicates = [];

    conversations.forEach(conv => {
      const hash = generateConversationHash(conv);

      if (hashMap.has(hash)) {
        // This is a duplicate
        duplicates.push({
          ...conv,
          hash,
          duplicateOf: hashMap.get(hash).id
        });
      } else {
        // This is unique, add to hash map and unique list
        const convWithHash = { ...conv, hash };
        hashMap.set(hash, convWithHash);
        uniqueConversations.push(convWithHash);
      }
    });

    // Save the cleaned conversations back to storage
    setUserData('conversations', uniqueConversations);

    const report = {
      success: true,
      totalScanned,
      duplicatesFound: duplicates.length,
      duplicatesRemoved: duplicates.length,
      uniqueConversations: uniqueConversations.length,
      removedConversations: duplicates.map(dup => ({
        id: dup.id,
        title: dup.title || 'Untitled',
        timestamp: dup.timestamp,
        duplicateOf: dup.duplicateOf
      }))
    };

    console.log('Duplicate scan completed:', report);
    return report;
  } catch (error) {
    console.error('Error scanning for duplicates:', error);
    return {
      success: false,
      error: error.message,
      totalScanned: 0,
      duplicatesFound: 0,
      duplicatesRemoved: 0,
      uniqueConversations: 0,
      removedConversations: []
    };
  }
};

/**
 * Find groups of similar conversations (same topic, recent timeframe)
 * @returns {Promise<Array>} Array of similar conversation groups
 */
export const findSimilarConversations = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const conversations = getUserData('conversations', []);

    if (conversations.length === 0) {
      return [];
    }

    // Group conversations by topic
    const topicGroups = {};
    conversations.forEach(conv => {
      const topic = conv.topic || detectConversationTopic(conv);
      if (!topicGroups[topic]) {
        topicGroups[topic] = [];
      }
      topicGroups[topic].push(conv);
    });

    // Find similar groups (same topic with multiple conversations in recent timeframe)
    const similarGroups = [];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    Object.entries(topicGroups).forEach(([topic, convs]) => {
      if (topic === 'general') return; // Skip general conversations

      // Filter to recent conversations
      const recentConvs = convs.filter(conv => {
        const convDate = new Date(conv.timestamp);
        return convDate > oneDayAgo;
      });

      // If there are multiple recent conversations of the same topic, they're similar
      if (recentConvs.length > 1) {
        similarGroups.push({
          topic,
          count: recentConvs.length,
          conversations: recentConvs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        });
      }
    });

    return similarGroups;
  } catch (error) {
    console.error('Error finding similar conversations:', error);
    return [];
  }
};

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
 * Clear all user memory data (conversations, reminders, preferences, AI memory, etc.)
 * @returns {Promise<Object>} Clear operation result
 */
export const clearAllUserMemory = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    // Clear all memory data types
    const dataTypes = [
      'conversations',
      'user_reminders',
      'preferences',
      'environmental_data',
      'shared_memory',
      'ai_memory_gemini',
      'ai_memory_rime'
    ];

    let clearedCount = 0;
    const results = {};

    dataTypes.forEach(dataType => {
      try {
        const currentData = getUserData(dataType, dataType === 'preferences' || dataType === 'shared_memory' ? {} : []);
        const itemCount = Array.isArray(currentData) ? currentData.length : Object.keys(currentData).length;

        // Clear the data
        setUserData(dataType, dataType === 'preferences' || dataType === 'shared_memory' ? {} : []);

        results[dataType] = {
          success: true,
          itemsCleared: itemCount
        };
        clearedCount += itemCount;
      } catch (error) {
        results[dataType] = {
          success: false,
          error: error.message,
          itemsCleared: 0
        };
      }
    });

    // Also clear AI memory from localStorage (legacy format)
    try {
      localStorage.removeItem(`ai_memory_gemini_${currentUser.id}`);
      localStorage.removeItem(`ai_memory_rime_${currentUser.id}`);
      localStorage.removeItem(`shared_memory_${currentUser.id}`);
    } catch (error) {
      console.warn('Error clearing legacy AI memory from localStorage:', error);
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      totalItemsCleared: clearedCount,
      results
    };
  } catch (error) {
    console.error('Error clearing all user memory:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      totalItemsCleared: 0
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
