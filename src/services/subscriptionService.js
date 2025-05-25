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
 * Get current user's subscription plan (legacy function for backward compatibility)
 * @returns {Object} Current subscription plan
 */
export const getCurrentSubscriptionPlan = () => {
  try {
    const user = getCurrentUser();
    if (!user) return SUBSCRIPTION_PLANS.free;

    const planId = user.subscription || 'free';
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  } catch (error) {
    console.error('Error getting current subscription plan:', error);
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
 * Get subscription data from localStorage
 * @param {number} userId - User ID
 * @returns {Object} Subscription data
 */
export const getSubscriptionData = (userId) => {
  try {
    const subscriptionKey = `subscription_${userId}`;
    const data = localStorage.getItem(subscriptionKey);

    if (!data) {
      // Return default free subscription
      return {
        userId,
        planId: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: null,
        autoRenew: true,
        billingHistory: [],
        paymentMethods: [],
        usageTracking: {
          memory: { used: 0, limit: SUBSCRIPTION_PLANS.free.memoryLimit },
          conversations: { used: 0, limit: SUBSCRIPTION_PLANS.free.conversationLimit },
          interactions: { used: 0, limit: SUBSCRIPTION_PLANS.free.interactionLimit },
          reminders: { used: 0, limit: SUBSCRIPTION_PLANS.free.reminderLimit }
        },
        extensions: [],
        lastUpdated: new Date().toISOString()
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting subscription data:', error);
    return null;
  }
};

/**
 * Save subscription data to localStorage
 * @param {Object} subscriptionData - Subscription data to save
 * @returns {boolean} Success status
 */
export const saveSubscriptionData = (subscriptionData) => {
  try {
    const subscriptionKey = `subscription_${subscriptionData.userId}`;
    subscriptionData.lastUpdated = new Date().toISOString();
    localStorage.setItem(subscriptionKey, JSON.stringify(subscriptionData));
    return true;
  } catch (error) {
    console.error('Error saving subscription data:', error);
    return false;
  }
};

/**
 * Add billing record to subscription history
 * @param {number} userId - User ID
 * @param {Object} billingRecord - Billing record to add
 * @returns {boolean} Success status
 */
export const addBillingRecord = (userId, billingRecord) => {
  try {
    const subscriptionData = getSubscriptionData(userId);
    if (!subscriptionData) return false;

    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...billingRecord
    };

    subscriptionData.billingHistory.unshift(record);

    // Keep only last 24 months of billing history
    if (subscriptionData.billingHistory.length > 24) {
      subscriptionData.billingHistory = subscriptionData.billingHistory.slice(0, 24);
    }

    return saveSubscriptionData(subscriptionData);
  } catch (error) {
    console.error('Error adding billing record:', error);
    return false;
  }
};

/**
 * Update subscription usage tracking
 * @param {number} userId - User ID
 * @param {Object} usageUpdate - Usage data to update
 * @returns {boolean} Success status
 */
export const updateUsageTracking = (userId, usageUpdate) => {
  try {
    const subscriptionData = getSubscriptionData(userId);
    if (!subscriptionData) return false;

    subscriptionData.usageTracking = {
      ...subscriptionData.usageTracking,
      ...usageUpdate
    };

    return saveSubscriptionData(subscriptionData);
  } catch (error) {
    console.error('Error updating usage tracking:', error);
    return false;
  }
};

/**
 * Simulate subscription upgrade with comprehensive data storage
 * @param {string} planId - Target plan ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Upgrade result
 */
export const upgradeSubscription = async (planId, paymentData = {}) => {
  try {
    const targetPlan = SUBSCRIPTION_PLANS[planId];
    if (!targetPlan) {
      throw new Error('Invalid plan ID');
    }

    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current subscription data
    const subscriptionData = getSubscriptionData(user.id);

    // Calculate billing dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

    // Update subscription data
    const updatedSubscription = {
      ...subscriptionData,
      planId: planId,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: true,
      usageTracking: {
        memory: { used: subscriptionData.usageTracking.memory.used, limit: targetPlan.memoryLimit },
        conversations: { used: subscriptionData.usageTracking.conversations.used, limit: targetPlan.conversationLimit },
        interactions: { used: subscriptionData.usageTracking.interactions.used, limit: targetPlan.interactionLimit },
        reminders: { used: subscriptionData.usageTracking.reminders.used, limit: targetPlan.reminderLimit }
      }
    };

    // Add billing record
    const billingRecord = {
      planId: planId,
      planName: targetPlan.name,
      amount: targetPlan.price,
      currency: targetPlan.currency,
      status: 'paid',
      paymentMethod: paymentData.paymentMethod || 'card',
      transactionId: paymentData.transactionId || `txn_${Date.now()}`,
      description: `Subscription to ${targetPlan.name} plan`
    };

    addBillingRecord(user.id, billingRecord);

    // Save updated subscription
    if (saveSubscriptionData(updatedSubscription)) {
      // Update user object with current subscription
      const updatedUser = { ...user, subscription: planId };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        message: `Successfully upgraded to ${targetPlan.name} plan!`,
        plan: targetPlan,
        subscription: updatedSubscription,
        billingRecord
      };
    } else {
      throw new Error('Failed to save subscription data');
    }
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
 * Get billing history from localStorage
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {Array} Billing history
 */
export const getBillingHistory = (userId = null) => {
  try {
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) return [];

    const subscriptionData = getSubscriptionData(user.id);
    return subscriptionData ? subscriptionData.billingHistory : [];
  } catch (error) {
    console.error('Error getting billing history:', error);
    return [];
  }
};

/**
 * Cancel subscription (sets to cancel at end of billing period)
 * @param {number} userId - User ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelSubscription = async (userId, reason = '') => {
  try {
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const subscriptionData = getSubscriptionData(user.id);
    if (!subscriptionData) {
      throw new Error('No subscription found');
    }

    // Set subscription to cancel at end of billing period
    const updatedSubscription = {
      ...subscriptionData,
      status: 'cancelled',
      autoRenew: false,
      cancellationDate: new Date().toISOString(),
      cancellationReason: reason
    };

    // Add cancellation record to billing history
    const cancellationRecord = {
      planId: subscriptionData.planId,
      planName: SUBSCRIPTION_PLANS[subscriptionData.planId]?.name || 'Unknown',
      amount: 0,
      currency: 'RM',
      status: 'cancelled',
      paymentMethod: 'system',
      transactionId: `cancel_${Date.now()}`,
      description: `Subscription cancelled - ${reason || 'No reason provided'}`
    };

    addBillingRecord(user.id, cancellationRecord);

    if (saveSubscriptionData(updatedSubscription)) {
      return {
        success: true,
        message: 'Subscription cancelled successfully. Access will continue until the end of your billing period.',
        subscription: updatedSubscription
      };
    } else {
      throw new Error('Failed to save cancellation data');
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      message: 'Failed to cancel subscription. Please try again.',
      error: error.message
    };
  }
};

/**
 * Reactivate cancelled subscription
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Reactivation result
 */
export const reactivateSubscription = async (userId) => {
  try {
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const subscriptionData = getSubscriptionData(user.id);
    if (!subscriptionData) {
      throw new Error('No subscription found');
    }

    if (subscriptionData.status !== 'cancelled') {
      throw new Error('Subscription is not cancelled');
    }

    // Reactivate subscription
    const updatedSubscription = {
      ...subscriptionData,
      status: 'active',
      autoRenew: true,
      cancellationDate: null,
      cancellationReason: null
    };

    // Add reactivation record to billing history
    const reactivationRecord = {
      planId: subscriptionData.planId,
      planName: SUBSCRIPTION_PLANS[subscriptionData.planId]?.name || 'Unknown',
      amount: 0,
      currency: 'RM',
      status: 'reactivated',
      paymentMethod: 'system',
      transactionId: `reactivate_${Date.now()}`,
      description: 'Subscription reactivated'
    };

    addBillingRecord(user.id, reactivationRecord);

    if (saveSubscriptionData(updatedSubscription)) {
      return {
        success: true,
        message: 'Subscription reactivated successfully!',
        subscription: updatedSubscription
      };
    } else {
      throw new Error('Failed to save reactivation data');
    }
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return {
      success: false,
      message: 'Failed to reactivate subscription. Please try again.',
      error: error.message
    };
  }
};

/**
 * Get current subscription status and details
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {Object} Current subscription details
 */
export const getCurrentSubscription = (userId = null) => {
  try {
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) return null;

    const subscriptionData = getSubscriptionData(user.id);
    if (!subscriptionData) return null;

    const plan = SUBSCRIPTION_PLANS[subscriptionData.planId];

    return {
      ...subscriptionData,
      plan: plan,
      isActive: subscriptionData.status === 'active',
      isCancelled: subscriptionData.status === 'cancelled',
      daysUntilExpiry: subscriptionData.endDate ?
        Math.ceil((new Date(subscriptionData.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
    };
  } catch (error) {
    console.error('Error getting current subscription:', error);
    return null;
  }
};

/**
 * Add payment method to subscription
 * @param {number} userId - User ID
 * @param {Object} paymentMethod - Payment method details
 * @returns {boolean} Success status
 */
export const addPaymentMethod = (userId, paymentMethod) => {
  try {
    const subscriptionData = getSubscriptionData(userId);
    if (!subscriptionData) return false;

    const method = {
      id: Date.now(),
      ...paymentMethod,
      addedDate: new Date().toISOString(),
      isDefault: subscriptionData.paymentMethods.length === 0
    };

    subscriptionData.paymentMethods.push(method);
    return saveSubscriptionData(subscriptionData);
  } catch (error) {
    console.error('Error adding payment method:', error);
    return false;
  }
};

/**
 * Remove payment method from subscription
 * @param {number} userId - User ID
 * @param {number} paymentMethodId - Payment method ID to remove
 * @returns {boolean} Success status
 */
export const removePaymentMethod = (userId, paymentMethodId) => {
  try {
    const subscriptionData = getSubscriptionData(userId);
    if (!subscriptionData) return false;

    subscriptionData.paymentMethods = subscriptionData.paymentMethods.filter(
      method => method.id !== paymentMethodId
    );

    // If removed method was default, set first remaining as default
    if (subscriptionData.paymentMethods.length > 0) {
      const hasDefault = subscriptionData.paymentMethods.some(method => method.isDefault);
      if (!hasDefault) {
        subscriptionData.paymentMethods[0].isDefault = true;
      }
    }

    return saveSubscriptionData(subscriptionData);
  } catch (error) {
    console.error('Error removing payment method:', error);
    return false;
  }
};
