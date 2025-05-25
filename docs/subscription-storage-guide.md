# Subscription Data Storage Guide

## Overview

Yunia AI now implements comprehensive subscription data storage in localStorage, providing a complete subscription management system with billing history, usage tracking, and subscription lifecycle management.

## Storage Structure

### 1. Subscription Data
**Key:** `subscription_{userId}`

```javascript
{
  userId: 1,
  planId: "premium",
  status: "active", // active, cancelled, expired
  startDate: "2025-01-27T10:00:00.000Z",
  endDate: "2025-02-27T10:00:00.000Z",
  autoRenew: true,
  cancellationDate: null,
  cancellationReason: null,
  billingHistory: [
    {
      id: 1737975600000,
      date: "2025-01-27T10:00:00.000Z",
      planId: "premium",
      planName: "Premium",
      amount: 19,
      currency: "RM",
      status: "paid",
      paymentMethod: "card",
      transactionId: "txn_1737975600000",
      description: "Subscription to Premium plan"
    }
  ],
  paymentMethods: [
    {
      id: 1737975600000,
      type: "card",
      last4: "4242",
      brand: "visa",
      addedDate: "2025-01-27T10:00:00.000Z",
      isDefault: true
    }
  ],
  usageTracking: {
    memory: { used: 25, limit: 500 },
    conversations: { used: 15, limit: 1000 },
    interactions: { used: 150, limit: 5000 },
    reminders: { used: 5, limit: 100 }
  },
  extensions: [],
  lastUpdated: "2025-01-27T10:00:00.000Z"
}
```

### 2. User Data Update
**Key:** `user`

The user object is updated to include the current subscription plan ID:

```javascript
{
  id: 1,
  name: "User Name",
  email: "user@example.com",
  role: "user",
  subscription: "premium" // Updated when subscription changes
}
```

## Key Functions

### Core Storage Functions

#### `getSubscriptionData(userId)`
- Retrieves subscription data from localStorage
- Returns default free subscription if no data exists
- Handles errors gracefully

#### `saveSubscriptionData(subscriptionData)`
- Saves subscription data to localStorage
- Automatically updates `lastUpdated` timestamp
- Returns success/failure status

#### `getCurrentSubscription(userId)`
- Gets current subscription with enhanced details
- Includes plan information and status flags
- Calculates days until expiry

### Subscription Management

#### `upgradeSubscription(planId, paymentData)`
- Upgrades user to specified plan
- Creates billing record
- Updates usage limits
- Saves payment information

#### `cancelSubscription(userId, reason)`
- Cancels subscription at end of billing period
- Records cancellation reason
- Maintains access until expiry
- Creates cancellation billing record

#### `reactivateSubscription(userId)`
- Reactivates cancelled subscription
- Re-enables auto-renewal
- Creates reactivation billing record

### Billing & Usage

#### `addBillingRecord(userId, billingRecord)`
- Adds new billing record to history
- Maintains last 24 months of history
- Auto-generates record ID and timestamp

#### `updateUsageTracking(userId, usageUpdate)`
- Updates current usage statistics
- Tracks memory, conversations, interactions, reminders
- Used for plan limit enforcement

#### `getBillingHistory(userId)`
- Retrieves complete billing history
- Returns chronologically ordered records
- Includes all transaction types

### Payment Methods

#### `addPaymentMethod(userId, paymentMethod)`
- Adds new payment method
- Sets as default if first method
- Stores card details securely

#### `removePaymentMethod(userId, paymentMethodId)`
- Removes payment method
- Auto-assigns new default if needed
- Maintains payment method history

## Usage Examples

### Basic Subscription Check
```javascript
import { getCurrentSubscription } from '../services/subscriptionService';

const user = getCurrentUser();
const subscription = getCurrentSubscription(user.id);

if (subscription?.isActive) {
  console.log(`User has active ${subscription.plan.name} plan`);
}
```

### Upgrade Subscription
```javascript
import { upgradeSubscription } from '../services/subscriptionService';

const paymentData = {
  paymentMethod: 'card',
  transactionId: 'txn_123456',
  cardLast4: '4242'
};

const result = await upgradeSubscription('premium', paymentData);
if (result.success) {
  console.log('Upgrade successful!');
}
```

### Track Usage
```javascript
import { updateUsageTracking } from '../services/subscriptionService';

const usageUpdate = {
  memory: { used: 150, limit: 500 },
  conversations: { used: 25, limit: 1000 }
};

updateUsageTracking(user.id, usageUpdate);
```

### Check Billing History
```javascript
import { getBillingHistory } from '../services/subscriptionService';

const history = getBillingHistory(user.id);
console.log(`User has ${history.length} billing records`);
```

## Testing

Use the test utility to verify subscription storage:

```javascript
// In browser console
testSubscriptionStorage(); // Run all tests
displaySubscriptionStorage(); // View current state
clearSubscriptionTestData(); // Clean up test data
```

## Integration Points

### 1. Subscription Page
- Displays current subscription status
- Shows billing history
- Handles plan upgrades
- Manages cancellation/reactivation

### 2. Payment Modal
- Processes payments
- Updates subscription data
- Records billing information

### 3. Usage Monitor
- Tracks real-time usage
- Warns about limits
- Suggests upgrades

### 4. Memory Manager
- Integrates with usage tracking
- Respects plan limits
- Provides upgrade prompts

## Security Considerations

1. **No Sensitive Data**: Payment details are minimal (last4 digits only)
2. **Local Storage Only**: All data stored locally, not transmitted
3. **User-Specific**: Each user's data isolated by user ID
4. **Graceful Degradation**: System works even if storage fails

## Future Enhancements

1. **Backend Integration**: Replace localStorage with API calls
2. **Real Payment Processing**: Integrate with actual payment gateways
3. **Advanced Analytics**: Usage patterns and recommendations
4. **Team Management**: Multi-user subscription handling
5. **Automated Billing**: Recurring payment processing
