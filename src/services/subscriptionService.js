/**
 * Subscription Service - Memory-based pricing management for Yunia AI
 * Handles subscription plans, usage tracking, and billing logic
 */

import { getCurrentUser, getMemoryStatistics } from './api';

// Subscription plan definitions
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'RM',
    period: 'month',
    memoryLimit: 50, // MB
    conversationLimit: 100,
    interactionLimit: 500,
    reminderLimit: 20,
    dataRetention: 30, // days
    features: [
      'Basic AI Chat',
      'Simple Reminders',
      '30-day data retention',
      'Community support'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 19,
    currency: 'RM',
    period: 'month',
    memoryLimit: 500, // MB
    conversationLimit: 1000,
    interactionLimit: 5000,
    reminderLimit: 100,
    dataRetention: 365, // days
    features: [
      'Advanced AI Learning',
      'Topic Categorization',
      'Data Export',
      '1-year data retention',
      'Email support'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 49,
    currency: 'RM',
    period: 'month',
    memoryLimit: 2048, // MB (2GB)
    conversationLimit: 5000, // High but limited
    interactionLimit: 20000,
    reminderLimit: 500,
    dataRetention: 1095, // 3 years
    features: [
      '5,000 Conversations',
      'Advanced Analytics',
      'Priority Support',
      '3-year data retention',
      'API Access'
    ]
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 149,
    currency: 'RM',
    period: 'month',
    memoryLimit: 5120, // MB (5GB)
    conversationLimit: 10000,
    interactionLimit: 50000,
    reminderLimit: 1000,
    dataRetention: 1825, // 5 years
    features: [
      '10,000 Conversations',
      'Advanced Analytics',
      'Priority Support',
      '5-year data retention',
      'API Access',
      'Team Management'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact Sales',
    currency: '',
    period: '',
    memoryLimit: 'Custom',
    conversationLimit: 'Custom',
    interactionLimit: 'Custom',
    reminderLimit: 'Custom',
    dataRetention: 'Custom',
    contactSales: true,
    features: [
      'Custom Storage Limits',
      'Unlimited Conversations',
      'Custom Integrations',
      'Dedicated Support Team',
      'Custom Data Retention',
      'White-label Solutions',
      'On-premise Deployment',
      'SLA Guarantees',
      'Custom Contracts'
    ]
  }
};

/**
 * Get current user's subscription plan
 * @returns {Object} Current subscription plan
 */
export const getCurrentSubscription = () => {
  try {
    const user = getCurrentUser();
    if (!user) return SUBSCRIPTION_PLANS.free;

    const planId = user.subscription || 'free';
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  } catch (error) {
    console.error('Error getting current subscription:', error);
    return SUBSCRIPTION_PLANS.free;
  }
};

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
    const currentPlan = getCurrentSubscription();
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

/**
 * Get recommended plan based on current usage
 * @returns {Promise<Object>} Recommended plan
 */
export const getRecommendedPlan = async () => {
  try {
    const memoryStats = await getMemoryStatistics();
    const memoryUsage = calculateMemoryUsage(memoryStats);
    const conversations = memoryStats.totalConversations || 0;
    const reminders = memoryStats.activeReminders || 0;

    // Find the most suitable plan
    const plans = Object.values(SUBSCRIPTION_PLANS);

    for (const plan of plans) {
      const memoryFits = memoryUsage <= plan.memoryLimit * 0.8; // 80% buffer
      const conversationsFit = conversations <= plan.conversationLimit * 0.8;
      const remindersFit = reminders <= plan.reminderLimit * 0.8;

      if (memoryFits && conversationsFit && remindersFit) {
        return plan;
      }
    }

    // If no plan fits, recommend enterprise (highest tier)
    return SUBSCRIPTION_PLANS.enterprise;
  } catch (error) {
    console.error('Error getting recommended plan:', error);
    return SUBSCRIPTION_PLANS.free;
  }
};

/**
 * Format limit value for display
 * @param {number} limit - Limit value
 * @returns {string} Formatted limit
 */
export const formatLimit = (limit) => {
  return limit.toLocaleString();
};

/**
 * Get plan comparison data
 * @returns {Array} Array of plans with comparison data
 */
export const getPlanComparison = () => {
  return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
    ...plan,
    memoryLimitFormatted: `${plan.memoryLimit}MB`,
    conversationLimitFormatted: formatLimit(plan.conversationLimit),
    interactionLimitFormatted: formatLimit(plan.interactionLimit),
    reminderLimitFormatted: formatLimit(plan.reminderLimit),
    dataRetentionFormatted: `${plan.dataRetention} days`
  }));
};

/**
 * Simulate subscription upgrade (placeholder for payment integration)
 * @param {string} planId - Target plan ID
 * @returns {Promise<Object>} Upgrade result
 */
export const upgradeSubscription = async (planId) => {
  try {
    const targetPlan = SUBSCRIPTION_PLANS[planId];
    if (!targetPlan) {
      throw new Error('Invalid plan ID');
    }

    // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
    // For now, just simulate the upgrade

    const user = getCurrentUser();
    if (user) {
      // Update user subscription in localStorage (temporary)
      const updatedUser = { ...user, subscription: planId };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    return {
      success: true,
      message: `Successfully upgraded to ${targetPlan.name} plan!`,
      plan: targetPlan
    };
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return {
      success: false,
      message: 'Failed to upgrade subscription. Please try again.',
      error: error.message
    };
  }
};

/**
 * Get billing history (placeholder)
 * @returns {Array} Billing history
 */
export const getBillingHistory = () => {
  // TODO: Implement actual billing history from backend
  return [
    {
      id: 1,
      date: '2025-01-01',
      plan: 'Premium',
      amount: 19,
      currency: 'RM',
      status: 'paid'
    }
  ];
};
