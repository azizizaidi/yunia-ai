/**
 * Subscription Usage Management
 * Handles usage tracking and limit checking
 */

import { getCurrentSubscriptionPlan } from './subscriptionPlans';

/**
 * Calculate memory usage in MB
 * @param {Object} memoryStats - Memory statistics from getMemoryStatistics()
 * @returns {number} Memory usage in MB
 */
export const calculateMemoryUsage = (memoryStats) => {
  // Simplified memory calculation (in MB)
  const conversationSize = (memoryStats.totalConversations || 0) * 0.5; // ~0.5MB per conversation
  const memorySize = (memoryStats.totalMemoryItems || 0) * 0.1; // ~0.1MB per memory item
  const reminderSize = (memoryStats.totalReminders || 0) * 0.05; // ~0.05MB per reminder
  const envDataSize = (memoryStats.environmentalDataPoints || 0) * 0.02; // ~0.02MB per data point

  return Math.round((conversationSize + memorySize + reminderSize + envDataSize) * 100) / 100;
};

/**
 * Check if user is within plan limits
 * @returns {Promise<Object>} Usage status and warnings
 */
export const checkUsageLimits = async () => {
  try {
    const { getMemoryStatistics } = require('../api');
    const currentPlan = getCurrentSubscriptionPlan();
    const memoryStats = await getMemoryStatistics();
    const memoryUsage = calculateMemoryUsage(memoryStats);

    const status = {
      withinLimits: true,
      warnings: [],
      usage: {
        memory: {
          used: memoryUsage,
          limit: currentPlan.memoryLimit,
          percentage: (memoryUsage / currentPlan.memoryLimit) * 100
        },
        conversations: {
          used: memoryStats.totalConversations || 0,
          limit: currentPlan.conversationLimit,
          percentage: ((memoryStats.totalConversations || 0) / currentPlan.conversationLimit) * 100
        },
        reminders: {
          used: memoryStats.activeReminders || 0,
          limit: currentPlan.reminderLimit,
          percentage: ((memoryStats.activeReminders || 0) / currentPlan.reminderLimit) * 100
        }
      }
    };

    // Check memory limit
    if (memoryUsage >= currentPlan.memoryLimit) {
      status.withinLimits = false;
      status.warnings.push({
        type: 'memory_limit_exceeded',
        message: 'Memory storage limit exceeded. Please upgrade your plan or clear some data.',
        severity: 'error'
      });
    } else if (status.usage.memory.percentage > 80) {
      status.warnings.push({
        type: 'memory_limit_warning',
        message: 'You are approaching your memory storage limit.',
        severity: 'warning'
      });
    }

    // Check conversation limit
    if ((memoryStats.totalConversations || 0) >= currentPlan.conversationLimit) {
      status.withinLimits = false;
      status.warnings.push({
        type: 'conversation_limit_exceeded',
        message: 'Conversation limit exceeded. Please upgrade your plan.',
        severity: 'error'
      });
    }

    // Check reminder limit
    if ((memoryStats.activeReminders || 0) >= currentPlan.reminderLimit) {
      status.withinLimits = false;
      status.warnings.push({
        type: 'reminder_limit_exceeded',
        message: 'Active reminder limit exceeded. Please upgrade your plan or complete some reminders.',
        severity: 'error'
      });
    }

    return status;
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return {
      withinLimits: true,
      warnings: [],
      usage: {}
    };
  }
};
