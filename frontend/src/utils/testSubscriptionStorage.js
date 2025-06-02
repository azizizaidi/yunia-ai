/**
 * Test utility for subscription data storage
 * This file can be used to test the subscription storage functionality
 */

import {
  getSubscriptionData,
  saveSubscriptionData,
  upgradeSubscription,
  addBillingRecord,
  updateUsageTracking,
  cancelSubscription,
  reactivateSubscription,
  getBillingHistory,
  getCurrentSubscription
} from '../services/subscriptionService';

/**
 * Test subscription data storage functionality
 * Run this in browser console to test the storage system
 */
export const testSubscriptionStorage = () => {
  console.log('🧪 Testing Subscription Data Storage...');

  const testUserId = 1; // Test with user ID 1

  try {
    // Test 1: Get initial subscription data
    console.log('\n📋 Test 1: Getting initial subscription data');
    const initialData = getSubscriptionData(testUserId);
    console.log('Initial subscription data:', initialData);

    // Test 2: Update usage tracking
    console.log('\n📊 Test 2: Updating usage tracking');
    const usageUpdate = {
      memory: { used: 25, limit: 50 },
      conversations: { used: 15, limit: 100 },
      interactions: { used: 150, limit: 500 },
      reminders: { used: 5, limit: 20 }
    };
    const usageResult = updateUsageTracking(testUserId, usageUpdate);
    console.log('Usage tracking update result:', usageResult);

    // Test 3: Add a billing record
    console.log('\n💳 Test 3: Adding billing record');
    const billingRecord = {
      planId: 'free',
      planName: 'Free Plan',
      amount: 0,
      currency: 'RM',
      status: 'active',
      paymentMethod: 'system',
      transactionId: `test_${Date.now()}`,
      description: 'Test billing record'
    };
    const billingResult = addBillingRecord(testUserId, billingRecord);
    console.log('Billing record add result:', billingResult);

    // Test 4: Get billing history
    console.log('\n📜 Test 4: Getting billing history');
    const history = getBillingHistory(testUserId);
    console.log('Billing history:', history);

    // Test 5: Get current subscription
    console.log('\n🔍 Test 5: Getting current subscription');
    const currentSub = getCurrentSubscription(testUserId);
    console.log('Current subscription:', currentSub);

    // Test 6: Simulate upgrade to premium
    console.log('\n⬆️ Test 6: Simulating upgrade to premium');
    upgradeSubscription('premium', {
      paymentMethod: 'test_card',
      transactionId: `test_upgrade_${Date.now()}`,
      cardLast4: '4242'
    }).then(upgradeResult => {
      console.log('Upgrade result:', upgradeResult);

      // Test 7: Get updated subscription after upgrade
      console.log('\n🔄 Test 7: Getting subscription after upgrade');
      const updatedSub = getCurrentSubscription(testUserId);
      console.log('Updated subscription:', updatedSub);

      // Test 8: Test cancellation
      console.log('\n❌ Test 8: Testing subscription cancellation');
      cancelSubscription(testUserId, 'Testing cancellation functionality').then(cancelResult => {
        console.log('Cancellation result:', cancelResult);

        // Test 9: Test reactivation
        console.log('\n✅ Test 9: Testing subscription reactivation');
        reactivateSubscription(testUserId).then(reactivateResult => {
          console.log('Reactivation result:', reactivateResult);

          console.log('\n🎉 All subscription storage tests completed!');
          console.log('Check localStorage to see stored data:');
          console.log('- subscription_1: Subscription data');
          console.log('- user: Updated user data with subscription');
        });
      });
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

/**
 * Clear all subscription test data
 */
export const clearSubscriptionTestData = () => {
  console.log('🧹 Clearing subscription test data...');

  try {
    localStorage.removeItem('subscription_1');
    console.log('✅ Subscription test data cleared');
  } catch (error) {
    console.error('❌ Failed to clear test data:', error);
  }
};

/**
 * Display current subscription storage state
 */
export const displaySubscriptionStorage = () => {
  console.log('📊 Current Subscription Storage State:');

  try {
    const subscriptionData = localStorage.getItem('subscription_1');
    if (subscriptionData) {
      console.log('Subscription Data:', JSON.parse(subscriptionData));
    } else {
      console.log('No subscription data found');
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('User Data:', JSON.parse(userData));
    } else {
      console.log('No user data found');
    }
  } catch (error) {
    console.error('❌ Failed to display storage state:', error);
  }
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testSubscriptionStorage = testSubscriptionStorage;
  window.clearSubscriptionTestData = clearSubscriptionTestData;
  window.displaySubscriptionStorage = displaySubscriptionStorage;

  // Auto-attach functions when script loads
  console.log('🧪 Subscription Storage Test Functions Available:');
  console.log('- testSubscriptionStorage() - Run all tests');
  console.log('- displaySubscriptionStorage() - View current storage state');
  console.log('- clearSubscriptionTestData() - Clear test data');
}
