/**
 * Data Retention Extension Service - Add-on plans for Yunia AI
 * Allows users to extend data retention beyond their base plan limits
 */

import { getCurrentUser, getMemoryStatistics } from './api';
import { getCurrentSubscription } from './subscriptionService';

// Data Retention Extension Plans
export const RETENTION_EXTENSIONS = {
  // For FREE users (base: 30 days)
  free_extensions: [
    {
      id: 'free_3months',
      name: '3 Months Extension',
      basePlan: 'free',
      extensionDays: 90,
      totalRetention: 120, // 30 + 90
      price: 5,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 4 months total'
    },
    {
      id: 'free_6months',
      name: '6 Months Extension',
      basePlan: 'free',
      extensionDays: 180,
      totalRetention: 210, // 30 + 180
      price: 9,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 7 months total',
      popular: true
    }
  ],

  // For PREMIUM users (base: 1 year)
  premium_extensions: [
    {
      id: 'premium_1year',
      name: '1 Year Extension',
      basePlan: 'premium',
      extensionDays: 365,
      totalRetention: 730, // 365 + 365
      price: 15,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 2 years total'
    },
    {
      id: 'premium_2years',
      name: '2 Years Extension',
      basePlan: 'premium',
      extensionDays: 730,
      totalRetention: 1095, // 365 + 730
      price: 25,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 3 years total',
      popular: true
    }
  ],

  // For PROFESSIONAL users (base: 3 years)
  professional_extensions: [
    {
      id: 'professional_2years',
      name: '2 Years Extension',
      basePlan: 'professional',
      extensionDays: 730,
      totalRetention: 1825, // 1095 + 730
      price: 35,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 5 years total'
    },
    {
      id: 'professional_5years',
      name: '5 Years Extension',
      basePlan: 'professional',
      extensionDays: 1825,
      totalRetention: 2920, // 1095 + 1825
      price: 75,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 8 years total',
      popular: true
    }
  ],

  // For BUSINESS users (base: 5 years)
  business_extensions: [
    {
      id: 'business_2years',
      name: '2 Years Extension',
      basePlan: 'business',
      extensionDays: 730,
      totalRetention: 2555, // 1825 + 730
      price: 49,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 7 years total'
    },
    {
      id: 'business_5years',
      name: '5 Years Extension',
      basePlan: 'business',
      extensionDays: 1825,
      totalRetention: 3650, // 1825 + 1825
      price: 99,
      currency: 'RM',
      period: 'one-time',
      description: 'Extend your data retention to 10 years total',
      popular: true
    },
    {
      id: 'business_lifetime',
      name: 'Lifetime Extension',
      basePlan: 'business',
      extensionDays: -1, // Unlimited
      totalRetention: -1,
      price: 199,
      currency: 'RM',
      period: 'one-time',
      description: 'Lifetime data retention - never expires',
      premium: true
    }
  ]
};

/**
 * Get available retention extensions for current user's plan
 * @returns {Array} Available extension options
 */
export const getAvailableExtensions = () => {
  try {
    const currentPlan = getCurrentSubscription();
    const planId = currentPlan.id;

    switch (planId) {
      case 'free':
        return RETENTION_EXTENSIONS.free_extensions;
      case 'premium':
        return RETENTION_EXTENSIONS.premium_extensions;
      case 'professional':
        return RETENTION_EXTENSIONS.professional_extensions;
      case 'business':
        return RETENTION_EXTENSIONS.business_extensions;
      case 'enterprise':
        return []; // Enterprise users contact sales for custom retention
      default:
        return [];
    }
  } catch (error) {
    console.error('Error getting available extensions:', error);
    return [];
  }
};

/**
 * Get current user's active retention extensions
 * @returns {Array} Active extensions
 */
export const getActiveExtensions = () => {
  try {
    const user = getCurrentUser();
    if (!user) return [];

    const extensionsKey = `retention_extensions_${user.id}`;
    const extensions = JSON.parse(localStorage.getItem(extensionsKey) || '[]');

    // Filter out expired extensions
    const now = new Date();
    return extensions.filter(ext => {
      if (ext.expiresAt === -1) return true; // Lifetime
      return new Date(ext.expiresAt) > now;
    });
  } catch (error) {
    console.error('Error getting active extensions:', error);
    return [];
  }
};

/**
 * Calculate total retention period including extensions
 * @returns {number} Total retention days (-1 for unlimited)
 */
export const getTotalRetentionPeriod = () => {
  try {
    const currentPlan = getCurrentSubscription();
    const activeExtensions = getActiveExtensions();

    let totalDays = currentPlan.dataRetention;

    // Check for lifetime extension
    const lifetimeExtension = activeExtensions.find(ext => ext.extensionDays === -1);
    if (lifetimeExtension) return -1;

    // Add all extension days
    activeExtensions.forEach(ext => {
      if (ext.extensionDays > 0) {
        totalDays += ext.extensionDays;
      }
    });

    return totalDays;
  } catch (error) {
    console.error('Error calculating total retention:', error);
    return getCurrentSubscription().dataRetention;
  }
};

/**
 * Purchase retention extension
 * @param {string} extensionId - Extension plan ID
 * @returns {Promise<Object>} Purchase result
 */
export const purchaseRetentionExtension = async (extensionId) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const availableExtensions = getAvailableExtensions();
    const extension = availableExtensions.find(ext => ext.id === extensionId);

    if (!extension) throw new Error('Extension not found');

    // TODO: Integrate with payment gateway
    // For now, simulate purchase

    const purchaseData = {
      id: Date.now(),
      extensionId: extension.id,
      extensionDays: extension.extensionDays,
      purchasedAt: new Date().toISOString(),
      expiresAt: extension.extensionDays === -1 ? -1 :
        new Date(Date.now() + extension.extensionDays * 24 * 60 * 60 * 1000).toISOString(),
      price: extension.price,
      currency: extension.currency,
      status: 'active'
    };

    // Save to localStorage
    const extensionsKey = `retention_extensions_${user.id}`;
    const existingExtensions = JSON.parse(localStorage.getItem(extensionsKey) || '[]');
    existingExtensions.push(purchaseData);
    localStorage.setItem(extensionsKey, JSON.stringify(existingExtensions));

    return {
      success: true,
      message: `Successfully purchased ${extension.name}!`,
      extension: purchaseData,
      newTotalRetention: getTotalRetentionPeriod()
    };
  } catch (error) {
    console.error('Error purchasing extension:', error);
    return {
      success: false,
      message: 'Failed to purchase extension. Please try again.',
      error: error.message
    };
  }
};

/**
 * Get data deletion warnings based on retention period
 * @returns {Promise<Array>} Deletion warnings
 */
export const getDataDeletionWarnings = async () => {
  try {
    const totalRetention = getTotalRetentionPeriod();
    if (totalRetention === -1) return []; // Lifetime retention

    const memoryStats = await getMemoryStatistics();
    const warnings = [];
    const now = new Date();
    const warningThreshold = 7; // 7 days warning

    // Check conversations
    if (memoryStats.lastActivity) {
      const lastActivityDate = new Date(memoryStats.lastActivity);
      const daysSinceActivity = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
      const daysUntilDeletion = totalRetention - daysSinceActivity;

      if (daysUntilDeletion <= warningThreshold && daysUntilDeletion > 0) {
        warnings.push({
          type: 'deletion_warning',
          message: `Your data will be deleted in ${daysUntilDeletion} days. Consider extending your retention period.`,
          severity: 'warning',
          daysRemaining: daysUntilDeletion
        });
      } else if (daysUntilDeletion <= 0) {
        warnings.push({
          type: 'deletion_imminent',
          message: 'Your data retention period has expired. Data may be deleted soon.',
          severity: 'error',
          daysRemaining: 0
        });
      }
    }

    return warnings;
  } catch (error) {
    console.error('Error getting deletion warnings:', error);
    return [];
  }
};

/**
 * Format retention period for display
 * @param {number} days - Number of days
 * @returns {string} Formatted period
 */
export const formatRetentionPeriod = (days) => {
  if (days === -1) return 'Lifetime';
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
};

/**
 * Get retention extension recommendations
 * @returns {Promise<Object>} Recommendations
 */
export const getRetentionRecommendations = async () => {
  try {
    const memoryStats = await getMemoryStatistics();
    const currentPlan = getCurrentSubscription();
    const availableExtensions = getAvailableExtensions();

    // Analyze usage patterns
    const highUsage = (memoryStats.totalConversations || 0) > 100;
    const businessUser = currentPlan.id === 'professional' || currentPlan.id === 'enterprise';

    let recommendedExtension = null;

    if (highUsage && businessUser) {
      // Recommend longer extensions for business users
      recommendedExtension = availableExtensions.find(ext => ext.popular) || availableExtensions[0];
    } else if (highUsage) {
      // Recommend moderate extensions for high-usage personal users
      recommendedExtension = availableExtensions[0];
    }

    return {
      recommended: recommendedExtension,
      reason: highUsage ? 'Based on your high usage patterns' : 'Standard recommendation',
      allOptions: availableExtensions
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { recommended: null, reason: '', allOptions: [] };
  }
};
