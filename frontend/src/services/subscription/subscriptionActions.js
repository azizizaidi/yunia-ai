/**
 * Subscription Actions
 * Handles main subscription actions (upgrade, cancel, reactivate)
 */

import { SUBSCRIPTION_PLANS } from './subscriptionPlans';
import { getSubscriptionData, saveSubscriptionData } from './subscriptionStorage';
import { addBillingRecord } from './subscriptionBilling';

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

    const { getCurrentUser } = require('../api');
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
 * Cancel subscription (sets to cancel at end of billing period)
 * @param {number} userId - User ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelSubscription = async (userId, reason = '') => {
  try {
    const { getCurrentUser } = require('../api');
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
    const { getCurrentUser } = require('../api');
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
