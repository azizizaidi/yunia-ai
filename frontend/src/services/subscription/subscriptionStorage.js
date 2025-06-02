/**
 * Subscription Storage Management
 * Handles localStorage operations for subscription data
 */

import { SUBSCRIPTION_PLANS } from './subscriptionPlans';

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
 * Get current subscription status and details
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {Object} Current subscription details
 */
export const getCurrentSubscription = (userId = null) => {
  try {
    const { getCurrentUser } = require('../api');
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
