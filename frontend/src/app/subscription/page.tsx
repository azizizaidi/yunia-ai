"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
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

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [memoryStats, setMemoryStats] = useState<any>({});
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, planData: null });
  const [stripePromise] = useState(() => getStripe());
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
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

  const calculateMemoryUsage = (stats: any) => {
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

  const formatLimit = (limit: number) => {
    return limit.toLocaleString();
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleUpgradePlan = async (plan: any) => {
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

  const handlePaymentSuccess = (result: any) => {
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
      </div>
    </DashboardLayout>
  );
}
