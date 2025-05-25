/**
 * Subscription Plans Configuration
 * Contains all subscription plan definitions and plan-related utilities
 */

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
    const { getCurrentUser } = require('../api');
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
 * Get recommended plan based on current usage
 * @returns {Promise<Object>} Recommended plan
 */
export const getRecommendedPlan = async () => {
  try {
    const { getMemoryStatistics } = require('../api');
    const { calculateMemoryUsage } = require('./subscriptionUtils');
    
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
 * Get plan comparison data
 * @returns {Array} Array of plans with comparison data
 */
export const getPlanComparison = () => {
  const { formatLimit } = require('./subscriptionUtils');
  
  return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
    ...plan,
    memoryLimitFormatted: `${plan.memoryLimit}MB`,
    conversationLimitFormatted: formatLimit(plan.conversationLimit),
    interactionLimitFormatted: formatLimit(plan.interactionLimit),
    reminderLimitFormatted: formatLimit(plan.reminderLimit),
    dataRetentionFormatted: `${plan.dataRetention} days`
  }));
};
