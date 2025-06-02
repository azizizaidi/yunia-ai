/**
 * Memory Conversations Functions
 * Handles conversation management with duplicate detection and topic categorization
 */

import { getFromStorage, setToStorage } from '../storage';
import { saveAIMemory } from './memoryCore';

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

  // Find matching topic
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return topic;
    }
  }

  return 'general';
};

/**
 * Check if conversation is similar to existing ones
 * @param {Object} newConversation - New conversation to check
 * @param {Array} existingConversations - Existing conversations
 * @returns {Object|null} Similar conversation or null
 */
const findSimilarConversation = (newConversation, existingConversations) => {
  const newHash = generateConversationHash(newConversation);
  const newTopic = detectConversationTopic(newConversation);

  // Check for exact hash match (duplicate)
  const exactMatch = existingConversations.find(conv => conv.hash === newHash);
  if (exactMatch) {
    return { type: 'duplicate', conversation: exactMatch };
  }

  // Check for similar topic within last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentSimilar = existingConversations.find(conv => {
    const convDate = new Date(conv.timestamp);
    return conv.topic === newTopic &&
           convDate > oneDayAgo &&
           newTopic !== 'general'; // Don't merge general conversations
  });

  if (recentSimilar) {
    return { type: 'similar', conversation: recentSimilar };
  }

  return null;
};

/**
 * Save conversation to memory with duplicate detection and topic categorization
 * @param {Object} conversation - Conversation data
 * @returns {Promise<Object>} Saved conversation object
 */
export const saveConversation = async (conversation) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    // Get existing conversations
    const conversationsKey = `conversations_${currentUser.id}`;
    const existingConversations = getFromStorage(conversationsKey, []);

    // Check for duplicates or similar conversations
    const similarCheck = findSimilarConversation(conversation, existingConversations);

    if (similarCheck) {
      if (similarCheck.type === 'duplicate') {
        console.log('Duplicate conversation detected, skipping save');
        return similarCheck.conversation;
      } else if (similarCheck.type === 'similar') {
        // Update existing similar conversation instead of creating new one
        const existingIndex = existingConversations.findIndex(c => c.id === similarCheck.conversation.id);
        if (existingIndex !== -1) {
          existingConversations[existingIndex] = {
            ...existingConversations[existingIndex],
            content: conversation.content || existingConversations[existingIndex].content,
            summary: conversation.summary || existingConversations[existingIndex].summary,
            messageCount: (existingConversations[existingIndex].messageCount || 0) + (conversation.messageCount || 0),
            lastUserMessage: conversation.lastUserMessage || existingConversations[existingIndex].lastUserMessage,
            lastAIMessage: conversation.lastAIMessage || existingConversations[existingIndex].lastAIMessage,
            timestamp: new Date().toISOString(), // Update timestamp
            updatedCount: (existingConversations[existingIndex].updatedCount || 0) + 1
          };

          setToStorage(conversationsKey, existingConversations);
          console.log('Updated similar conversation:', existingConversations[existingIndex].topic);
          return existingConversations[existingIndex];
        }
      }
    }

    // Create new conversation with enhanced data
    const conversationData = {
      id: Date.now(),
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      hash: generateConversationHash(conversation),
      topic: detectConversationTopic(conversation),
      updatedCount: 0,
      ...conversation
    };

    existingConversations.push(conversationData);

    // Keep only last 50 conversations
    if (existingConversations.length > 50) {
      existingConversations.splice(0, existingConversations.length - 50);
    }

    setToStorage(conversationsKey, existingConversations);

    // Also save to AI memory for sync
    saveAIMemory(conversation.aiType || 'gemini', {
      type: 'conversation',
      conversationId: conversationData.id,
      topic: conversationData.topic,
      ...conversation
    });

    console.log('New conversation saved:', conversationData.topic);
    return conversationData;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for current user
 * @returns {Promise<Array>} Array of conversations
 */
export const getConversations = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const conversationsKey = `conversations_${currentUser.id}`;
    return getFromStorage(conversationsKey, []);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

/**
 * Get conversations grouped by topic
 * @returns {Promise<Object>} Object with topics as keys and conversation arrays as values
 */
export const getConversationsByTopic = async () => {
  try {
    const conversations = await getConversations();
    const groupedConversations = {};

    conversations.forEach(conv => {
      const topic = conv.topic || 'general';
      if (!groupedConversations[topic]) {
        groupedConversations[topic] = [];
      }
      groupedConversations[topic].push(conv);
    });

    // Sort conversations within each topic by timestamp (newest first)
    Object.keys(groupedConversations).forEach(topic => {
      groupedConversations[topic].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });

    return groupedConversations;
  } catch (error) {
    console.error('Error getting conversations by topic:', error);
    return {};
  }
};

/**
 * Get conversation topic statistics
 * @returns {Promise<Object>} Topic statistics object
 */
export const getConversationTopicStats = async () => {
  try {
    const conversations = await getConversations();

    if (conversations.length === 0) {
      return {
        total: 0,
        byTopic: {},
        mergedConversations: 0
      };
    }

    // Count conversations by topic
    const topicCounts = {};
    let mergedCount = 0;

    conversations.forEach(conv => {
      const topic = conv.topic || 'general';

      if (!topicCounts[topic]) {
        topicCounts[topic] = {
          count: 0,
          conversations: []
        };
      }

      topicCounts[topic].count++;
      topicCounts[topic].conversations.push(conv);

      // Count merged conversations (those with updatedCount > 0)
      if (conv.updatedCount && conv.updatedCount > 0) {
        mergedCount++;
      }
    });

    return {
      total: conversations.length,
      byTopic: topicCounts,
      mergedConversations: mergedCount,
      topicDistribution: Object.entries(topicCounts).map(([topic, data]) => ({
        topic,
        count: data.count,
        percentage: Math.round((data.count / conversations.length) * 100)
      })).sort((a, b) => b.count - a.count)
    };
  } catch (error) {
    console.error('Error getting conversation topic stats:', error);
    return {
      total: 0,
      byTopic: {},
      mergedConversations: 0
    };
  }
};
