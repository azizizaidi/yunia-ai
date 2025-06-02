/**
 * Subscription Billing Management
 * Handles billing history and payment method management
 */

import { getSubscriptionData, saveSubscriptionData } from './subscriptionStorage';

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
 * Get billing history from localStorage
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {Array} Billing history
 */
export const getBillingHistory = (userId = null) => {
  try {
    const { getCurrentUser } = require('../api');
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
