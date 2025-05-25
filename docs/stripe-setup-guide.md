# Stripe Payment Gateway Setup Guide

## 🚀 Quick Start (Instant Sandbox)

### 1. Get Stripe Test API Keys (No Registration Delay)

1. **Sign up at Stripe** (instant): https://dashboard.stripe.com/register
2. **Get Test Keys immediately** - No approval needed for test mode
3. **Copy your Publishable Key** (starts with `pk_test_`)

### 2. Update Configuration

**IMPORTANT: Use PUBLISHABLE KEY only (pk_test_), NOT Secret Key (sk_test_)**

Add your Stripe key to `.env` file:

```env
# Copy .env.example to .env first
cp .env.example .env

# Then edit .env and add your PUBLISHABLE key:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

**⚠️ Security Note:**
- ✅ **PUBLISHABLE KEY** (`pk_test_`) - SAFE for frontend
- ❌ **SECRET KEY** (`sk_test_`) - NEVER put in frontend!

### 3. Test Cards (Ready to Use)

Use these test card numbers in the payment form:

| Card Number | Description |
|-------------|-------------|
| `4242424242424242` | ✅ Successful payment |
| `4000000000000002` | ❌ Card declined |
| `4000000000009995` | ❌ Insufficient funds |

- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## 🎯 Features Implemented

### ✅ What Works Now:
- **Payment Modal** with Stripe Elements
- **Test Card Processing**
- **Plan Upgrade Flow**
- **Success/Error Handling**
- **Responsive Design**

### 🔄 Demo Mode:
- Uses simulated payment processing
- Updates subscription in localStorage
- Shows realistic payment flow
- No real money charged

## 🛠️ For Production

When ready for live payments:

1. **Get Live API Keys** from Stripe Dashboard
2. **Replace test keys** with live keys
3. **Set up webhook endpoints** for subscription events
4. **Add backend API** for secure payment processing
5. **Enable live mode** in Stripe Dashboard

## 💡 Benefits of Stripe

- ✅ **Instant sandbox access**
- ✅ **No registration delays**
- ✅ **Excellent documentation**
- ✅ **Works in Malaysia**
- ✅ **Strong security**
- ✅ **Easy integration**

## 🔧 Troubleshooting

### Common Issues:

1. **"Stripe not loaded"**
   - Check internet connection
   - Verify API key format

2. **Payment fails**
   - Use test card numbers above
   - Check card details format

3. **Modal not opening**
   - Check browser console for errors
   - Verify component imports

## 📞 Support

- **Stripe Docs**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing
- **Dashboard**: https://dashboard.stripe.com
