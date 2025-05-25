import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getMemoryStatistics, getCurrentUser } from "../../services/api";
import {
  getSubscriptionData,
  getCurrentSubscription,
  getBillingHistory,
  cancelSubscription,
  reactivateSubscription,
  updateUsageTracking,
  upgradeSubscription
} from "../../services/subscriptionService";
import Loader from "../../components/ui/Loader";
import RetentionExtensions from "../../components/subscription/RetentionExtensions";
import PaymentModal from "../../components/payment/PaymentModal";
import { getStripe } from "../../services/stripeService";
// Import test utilities for development
import "../../utils/testSubscriptionStorage";

/**
 * Subscription page - Memory-based pricing plans for Yunia AI
 * @returns {JSX.Element} Subscription page component
 */
const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [memoryStats, setMemoryStats] = useState({});
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, planData: null });
  const [stripePromise] = useState(() => getStripe());
  const [billingHistory, setBillingHistory] = useState([]);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Subscription plans with memory-based pricing
  const plans = [
    {
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
      ],
      popular: false,
      color: 'btn-outline'
    },
    {
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
      ],
      popular: true,
      color: 'btn-primary'
    },
    {
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
      ],
      popular: false,
      color: 'btn-secondary'
    },
    {
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
      ],
      popular: false,
      color: 'btn-secondary'
    },
    {
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
        'SLA Guarantees'
      ],
      popular: false,
      color: 'btn-accent'
    }
  ];

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;

      // Load memory statistics
      const stats = await getMemoryStatistics();
      setMemoryStats(stats);

      // Calculate approximate memory usage (simplified calculation)
      const approximateUsage = calculateMemoryUsage(stats);
      setMemoryUsage(approximateUsage);

      // Load current subscription data
      const subscription = getCurrentSubscription(user.id);
      setCurrentSubscription(subscription);

      // Load billing history
      const history = getBillingHistory(user.id);
      setBillingHistory(history);

      // Update usage tracking in subscription data
      if (subscription) {
        updateUsageTracking(user.id, {
          memory: {
            used: approximateUsage,
            limit: subscription.plan?.memoryLimit || 50
          }
        });
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMemoryUsage = (stats) => {
    // Simplified memory calculation (in MB)
    const conversationSize = (stats.totalConversations || 0) * 0.5; // ~0.5MB per conversation
    const memorySize = (stats.totalMemoryItems || 0) * 0.1; // ~0.1MB per memory item
    const reminderSize = (stats.totalReminders || 0) * 0.05; // ~0.05MB per reminder

    return Math.round((conversationSize + memorySize + reminderSize) * 100) / 100;
  };

  const getCurrentPlanData = () => {
    const planId = currentSubscription?.planId || 'free';
    return plans.find(plan => plan.id === planId) || plans[0];
  };

  const getUsagePercentage = () => {
    const currentPlanData = getCurrentPlanData();
    return Math.min((memoryUsage / currentPlanData.memoryLimit) * 100, 100);
  };

  const formatLimit = (limit) => {
    return limit.toLocaleString();
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleUpgradePlan = async (plan) => {
    if (plan.price === 0) {
      // Handle free plan switch
      setCancelling(true);
      try {
        const result = await upgradeSubscription('free');
        if (result.success) {
          alert('Switched to Free plan successfully!');
          loadSubscriptionData(); // Reload to show updated status
        } else {
          alert(result.message || 'Failed to switch to Free plan. Please try again.');
        }
      } catch (error) {
        console.error('Error switching to free plan:', error);
        alert('Failed to switch to Free plan. Please try again.');
      } finally {
        setCancelling(false);
      }
    } else {
      // Open payment modal for paid plans
      setPaymentModal({
        isOpen: true,
        planData: plan
      });
    }
  };

  const handlePaymentSuccess = (result) => {
    // Reload subscription data to reflect changes
    loadSubscriptionData();

    alert(`Successfully upgraded to ${paymentModal.planData.name} plan!`);
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    const reason = prompt('Please tell us why you\'re cancelling (optional):');
    if (reason === null) return; // User clicked cancel

    setCancelling(true);
    try {
      const result = await cancelSubscription(currentSubscription.userId, reason);
      if (result.success) {
        alert(result.message);
        loadSubscriptionData(); // Reload to show updated status
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!currentSubscription) return;

    setCancelling(true);
    try {
      const result = await reactivateSubscription(currentSubscription.userId);
      if (result.success) {
        alert(result.message);
        loadSubscriptionData(); // Reload to show updated status
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to reactivate subscription. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, planData: null });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your AI assistant needs. All plans include core features with different usage limits.
          </p>
        </div>

        {/* Current Usage Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Current Usage</h2>
            <div className="text-sm text-gray-500">
              Plan: <span className="font-medium text-gray-900">{getCurrentPlanData().name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{memoryUsage}MB</div>
              <div className="text-sm text-gray-500">Storage Used</div>
              <div className="text-xs text-gray-400">of {getCurrentPlanData().memoryLimit}MB</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{memoryStats.totalConversations || 0}</div>
              <div className="text-sm text-gray-500">Conversations</div>
              <div className="text-xs text-gray-400">of {formatLimit(getCurrentPlanData().conversationLimit)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{memoryStats.totalMemoryItems || 0}</div>
              <div className="text-sm text-gray-500">AI Interactions</div>
              <div className="text-xs text-gray-400">this month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{memoryStats.activeReminders || 0}</div>
              <div className="text-sm text-gray-500">Active Reminders</div>
              <div className="text-xs text-gray-400">of {formatLimit(getCurrentPlanData().reminderLimit)}</div>
            </div>
          </div>

          {/* Usage Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Storage Usage</span>
              <span className="text-sm text-gray-500">{getUsagePercentage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  getUsagePercentage() > 80 ? 'bg-red-500' :
                  getUsagePercentage() > 60 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
              ></div>
            </div>
            {getUsagePercentage() > 80 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="text-yellow-600 mr-2">⚠️</div>
                  <span className="text-sm text-yellow-800">You're approaching your storage limit. Consider upgrading your plan.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regular Pricing Plans */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 max-w-6xl mx-auto">
          {plans.filter(plan => plan.id !== 'enterprise').map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg w-full max-w-sm ${
                plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              } ${currentSubscription?.planId === plan.id ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {currentSubscription?.planId === plan.id && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  {plan.contactSales ? (
                    <div className="text-2xl font-bold text-gray-900">Contact Sales</div>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                    </>
                  )}
                </div>

                {/* Plan Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium text-gray-900">
                      {plan.contactSales ? plan.memoryLimit : `${plan.memoryLimit}MB`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Conversations</span>
                    <span className="font-medium text-gray-900">
                      {plan.contactSales ? plan.conversationLimit : formatLimit(plan.conversationLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Monthly Interactions</span>
                    <span className="font-medium text-gray-900">
                      {plan.contactSales ? plan.interactionLimit : formatLimit(plan.interactionLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Active Reminders</span>
                    <span className="font-medium text-gray-900">
                      {plan.contactSales ? plan.reminderLimit : formatLimit(plan.reminderLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Data Retention</span>
                    <span className="font-medium text-gray-900">
                      {plan.contactSales ? plan.dataRetention : `${plan.dataRetention} days`}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {currentSubscription?.planId === plan.id ? (
                    <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                      ✓ Current Plan
                    </button>
                  ) : plan.contactSales ? (
                    <button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        // TODO: Implement contact sales form or redirect
                        window.open('mailto:sales@yunia.ai?subject=Enterprise Plan Inquiry', '_blank');
                      }}
                    >
                      Contact Sales
                    </button>
                  ) : (
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      onClick={() => handleUpgradePlan(plan)}
                      disabled={cancelling && plan.price === 0}
                    >
                      {cancelling && plan.price === 0
                        ? 'Switching...'
                        : plan.price === 0
                          ? 'Switch to Free'
                          : 'Upgrade Plan'
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Plan - Full Width */}
        {(() => {
          const enterprisePlan = plans.find(plan => plan.id === 'enterprise');
          if (!enterprisePlan) return null;

          return (
            <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 mb-12 text-white max-w-6xl mx-auto">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-purple-700 bg-opacity-50 rounded-full px-4 py-2 mb-4">
                    <span className="text-sm font-medium">Enterprise Solution</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">{enterprisePlan.name}</h3>
                  <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                    Tailored solutions for large organizations with custom requirements and dedicated support
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Features */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Enterprise Features</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {enterprisePlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-purple-900" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-purple-100">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Solutions */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Custom Solutions</h4>
                    <div className="space-y-4">
                      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4">
                        <div className="font-medium mb-2">🏢 Multi-tenant Architecture</div>
                        <div className="text-sm text-purple-200">Separate environments for different departments or subsidiaries</div>
                      </div>
                      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4">
                        <div className="font-medium mb-2">🔒 Advanced Security</div>
                        <div className="text-sm text-purple-200">SOC 2 compliance, custom encryption, and audit trails</div>
                      </div>
                      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4">
                        <div className="font-medium mb-2">⚡ Performance SLA</div>
                        <div className="text-sm text-purple-200">99.9% uptime guarantee with dedicated infrastructure</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-2xl font-bold mb-2">Custom Pricing</div>
                    <div className="text-purple-200">Tailored to your organization's specific needs and scale</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      className="bg-white text-purple-900 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                      onClick={() => {
                        window.open('mailto:sales@yunia.ai?subject=Enterprise Plan Inquiry&body=Hi, I am interested in learning more about Yunia AI Enterprise solutions for my organization.', '_blank');
                      }}
                    >
                      Contact Sales Team
                    </button>
                    <button
                      className="border border-purple-300 text-purple-100 hover:bg-purple-800 px-8 py-3 rounded-lg font-semibold transition-colors"
                      onClick={() => {
                        window.open('https://calendly.com/yunia-ai/enterprise-demo', '_blank');
                      }}
                    >
                      Schedule Demo
                    </button>
                  </div>

                  <div className="mt-4 text-sm text-purple-300">
                    Typical enterprise contracts start from RM2,000/month
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Data Retention Extensions */}
        <RetentionExtensions className="mb-12" />

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How Pricing Works</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">Conversations:</span> Each chat session with Yunia (approximately 0.5MB each)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">AI Memory:</span> Learning data and context (approximately 0.1MB per interaction)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">Reminders:</span> Tasks and schedule data (approximately 0.05MB each)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-900">Environmental Data:</span> Weather, location, and traffic information
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Privacy</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>All data encrypted at rest and in transit</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>GDPR compliant data handling</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>Regular automated backups</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>Data export available anytime</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>Complete data deletion on request</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        {currentSubscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Management</h3>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowBillingHistory(!showBillingHistory)}
              >
                {showBillingHistory ? 'Hide' : 'Show'} Billing History
              </button>
            </div>

            {/* Current Subscription Status */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Plan:</span>
                  <span className="font-medium text-gray-900">{currentSubscription.plan?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    currentSubscription.isActive ? 'text-green-600' :
                    currentSubscription.isCancelled ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {currentSubscription.status === 'active' ? 'Active' :
                     currentSubscription.status === 'cancelled' ? 'Cancelled' : 'Unknown'}
                  </span>
                </div>
                {currentSubscription.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {currentSubscription.isCancelled ? 'Access Until:' : 'Next Billing:'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(currentSubscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentSubscription.daysUntilExpiry !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span className="font-medium text-gray-900">{currentSubscription.daysUntilExpiry}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Renew:</span>
                  <span className={`font-medium ${currentSubscription.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                    {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {currentSubscription.cancellationDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled On:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(currentSubscription.cancellationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {currentSubscription.cancellationReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {currentSubscription.cancellationReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {currentSubscription.isCancelled ? (
                <button
                  className="btn btn-primary"
                  onClick={handleReactivateSubscription}
                  disabled={cancelling}
                >
                  {cancelling ? 'Processing...' : 'Reactivate Subscription'}
                </button>
              ) : currentSubscription.planId !== 'free' && (
                <button
                  className="btn btn-error btn-outline"
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                >
                  {cancelling ? 'Processing...' : 'Cancel Subscription'}
                </button>
              )}
            </div>

            {/* Billing History */}
            {showBillingHistory && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Billing History</h4>
                {billingHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-600">Date</th>
                          <th className="text-left py-2 text-gray-600">Description</th>
                          <th className="text-left py-2 text-gray-600">Amount</th>
                          <th className="text-left py-2 text-gray-600">Status</th>
                          <th className="text-left py-2 text-gray-600">Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.slice(0, 10).map((record) => (
                          <tr key={record.id} className="border-b border-gray-100">
                            <td className="py-2 text-gray-900">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 text-gray-900">{record.description}</td>
                            <td className="py-2 text-gray-900">
                              {record.amount > 0 ? `${record.currency}${record.amount}` : '-'}
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.status === 'paid' ? 'bg-green-100 text-green-800' :
                                record.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                record.status === 'reactivated' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600 font-mono text-xs">
                              {record.transactionId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No billing history available
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                question: "What happens when I reach my storage limit?",
                answer: "You'll receive notifications when approaching your limit. Older data may be archived, and new interactions may be limited until you upgrade or clear some data."
              },
              {
                question: "Can I export my data before downgrading?",
                answer: "Yes! You can export all your data anytime from the Memory Manager. We recommend exporting before downgrading to avoid data loss."
              },
              {
                question: "How is memory usage calculated?",
                answer: "Memory usage includes conversations, AI learning data, reminders, preferences, and environmental data. Each type has different storage requirements based on content complexity."
              },
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners."
              },
              {
                question: "Is there a free trial for premium plans?",
                answer: "Yes! You can try any premium plan for 7 days free. No credit card required for the trial period."
              },
              {
                question: "What are data retention extensions?",
                answer: "Data retention extensions allow you to keep your data longer than your base plan allows. For example, FREE users can extend from 30 days to several months with add-on purchases."
              },
              {
                question: "Do retention extensions expire?",
                answer: "Most extensions are one-time purchases that extend your retention period permanently. However, some extensions may have specific terms - check the extension details before purchasing."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-4 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          planData={paymentModal.planData}
          stripePromise={stripePromise}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
