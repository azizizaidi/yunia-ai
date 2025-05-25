/**
 * Stripe Payment Service for Yunia AI
 * Handles subscription payments and billing
 */

import { loadStripe } from '@stripe/stripe-js';

// Stripe Test Publishable Key (safe to expose in frontend)
// Get from environment variable or use demo key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef';

// Initialize Stripe
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create payment session for subscription
 * @param {Object} planData - Subscription plan details
 * @param {string} planData.id - Plan ID
 * @param {string} planData.name - Plan name
 * @param {number} planData.price - Plan price
 * @param {string} planData.currency - Currency code
 * @returns {Promise<Object>} Payment session result
 */
export const createPaymentSession = async (planData) => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate the payment flow

    const stripe = await getStripe();

    // Simulate payment session creation
    const sessionData = {
      id: `cs_test_${Date.now()}`,
      url: null, // Will be handled by Stripe Elements
      planId: planData.id,
      amount: planData.price * 100, // Convert to cents
      currency: planData.currency.toLowerCase(),
      planName: planData.name
    };

    return {
      success: true,
      session: sessionData,
      stripe
    };
  } catch (error) {
    console.error('Error creating payment session:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process payment with Stripe Elements
 * @param {Object} stripe - Stripe instance
 * @param {Object} elements - Stripe Elements instance
 * @param {Object} planData - Plan information
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (stripe, elements, planData) => {
  try {
    const cardElement = elements.getElement('card');

    if (!cardElement) {
      throw new Error('Card element not found');
    }

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: 'Test User', // In real app, get from user data
        email: 'test@example.com'
      }
    });

    if (error) {
      // For test cards that should fail at the payment method creation stage
      // We'll detect them by the error message or by checking common test card patterns
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('declined') || errorMessage.includes('insufficient') ||
          errorMessage.includes('expired') || errorMessage.includes('incorrect')) {
        // This is likely a test card that should simulate a specific error
        return {
          success: false,
          error: error.message,
          paymentIntent: {
            id: `pi_test_${Date.now()}`,
            status: 'failed',
            amount: planData.price * 100,
            currency: planData.currency.toLowerCase()
          }
        };
      }

      throw new Error(error.message);
    }

    // Simulate payment confirmation
    // In real app, send paymentMethod.id to your backend
    const paymentResult = await simulatePaymentConfirmation(paymentMethod, planData);

    return paymentResult;
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Detect test card type based on card number
 * @param {string} cardNumber - The card number to check
 * @returns {Object|null} Test card info or null if not a test card
 */
const detectTestCard = (cardNumber) => {
  const allTestCards = getTestCardsByCategory();

  for (const category of Object.keys(allTestCards)) {
    const card = allTestCards[category].find(c => c.number === cardNumber);
    if (card) {
      return { ...card, category };
    }
  }

  return null;
};

/**
 * Simulate payment confirmation (for demo)
 * In production, this would be handled by your backend
 */
const simulatePaymentConfirmation = async (paymentMethod, planData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Check if this is a test card with specific behavior
  let testCard = null;

  // Try to match by last 4 digits from the payment method
  if (paymentMethod.card?.last4) {
    const allTestCards = getTestCardsByCategory();
    console.log('🔍 Detecting test card with last4:', paymentMethod.card.last4);

    for (const category of Object.keys(allTestCards)) {
      const card = allTestCards[category].find(c =>
        c.number.slice(-4) === paymentMethod.card.last4
      );
      if (card) {
        testCard = { ...card, category };
        console.log('✅ Test card detected:', testCard.description, 'Category:', category);
        break;
      }
    }

    if (!testCard) {
      console.log('❌ No test card found for last4:', paymentMethod.card.last4);
    }
  }

  // If we found a test card, simulate its specific response
  if (testCard) {
    return simulateTestCardResponse(testCard, planData);
  }

  // Default to successful payment if no test card detected
  return {
    success: true,
    paymentIntent: {
      id: `pi_test_${Date.now()}`,
      status: 'succeeded',
      amount: planData.price * 100,
      currency: planData.currency.toLowerCase()
    },
    subscription: {
      id: `sub_test_${Date.now()}`,
      planId: planData.id,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  };
};

/**
 * Get Stripe test card numbers for testing
 * @returns {Array} Array of test card objects
 */
export const getTestCards = () => [
  {
    number: '4242424242424242',
    brand: 'Visa',
    description: 'Successful payment'
  },
  {
    number: '4000000000000002',
    brand: 'Visa',
    description: 'Card declined'
  },
  {
    number: '4000000000009995',
    brand: 'Visa',
    description: 'Insufficient funds'
  },
  {
    number: '4000000000000069',
    brand: 'Visa',
    description: 'Expired card'
  }
];

/**
 * Simulate specific test card responses
 * @param {Object} testCard - Test card information
 * @param {Object} planData - Plan data
 * @returns {Object} Payment result based on test card type
 */
const simulateTestCardResponse = (testCard, planData) => {
  console.log('🎭 Simulating test card response:', testCard.description, 'Category:', testCard.category);

  const basePaymentIntent = {
    id: `pi_test_${Date.now()}`,
    amount: planData.price * 100,
    currency: planData.currency.toLowerCase()
  };

  switch (testCard.category) {
    case 'success':
      return {
        success: true,
        paymentIntent: {
          ...basePaymentIntent,
          status: 'succeeded'
        },
        subscription: {
          id: `sub_test_${Date.now()}`,
          planId: planData.id,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      };

    case 'decline':
      return {
        success: false,
        error: testCard.result,
        paymentIntent: {
          ...basePaymentIntent,
          status: 'failed'
        },
        decline_code: getDeclineCode(testCard.number)
      };

    case 'error':
      return {
        success: false,
        error: testCard.result,
        paymentIntent: {
          ...basePaymentIntent,
          status: 'failed'
        }
      };

    case 'auth':
      return {
        success: false,
        error: testCard.result,
        paymentIntent: {
          ...basePaymentIntent,
          status: 'requires_action'
        },
        requires_action: true
      };

    default:
      return {
        success: true,
        paymentIntent: {
          ...basePaymentIntent,
          status: 'succeeded'
        }
      };
  }
};

/**
 * Get decline code based on test card number
 * @param {string} cardNumber - Test card number
 * @returns {string} Decline code
 */
const getDeclineCode = (cardNumber) => {
  const declineCodes = {
    '4000000000000002': 'generic_decline',
    '4000000000009995': 'insufficient_funds',
    '4000000000000069': 'expired_card',
    '4000000000000127': 'incorrect_cvc',
    '4000000000000036': 'lost_card'
  };

  return declineCodes[cardNumber] || 'generic_decline';
};

/**
 * Get test cards organized by category for comprehensive testing
 * @returns {Object} Object with test cards grouped by scenario
 */
export const getTestCardsByCategory = () => ({
  success: [
    {
      number: '4242424242424242',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Successful payment',
      icon: '✅',
      result: 'Payment succeeds immediately'
    },
    {
      number: '5555555555554444',
      brand: 'Mastercard',
      expiry: '12/28',
      cvc: '123',
      description: 'Successful payment',
      icon: '✅',
      result: 'Payment succeeds immediately'
    },
    {
      number: '378282246310005',
      brand: 'American Express',
      expiry: '12/28',
      cvc: '1234',
      description: 'Successful payment',
      icon: '✅',
      result: 'Payment succeeds immediately'
    }
  ],
  decline: [
    {
      number: '4000000000000002',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Generic card decline',
      icon: '❌',
      result: 'Your card was declined'
    },
    {
      number: '4000000000009995',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Insufficient funds',
      icon: '💳',
      result: 'Your card has insufficient funds'
    },
    {
      number: '4000000000000069',
      brand: 'Visa',
      expiry: '12/20',
      cvc: '123',
      description: 'Expired card',
      icon: '📅',
      result: 'Your card has expired'
    },
    {
      number: '4000000000000127',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '999',
      description: 'Incorrect CVC',
      icon: '🔢',
      result: 'Your card\'s security code is incorrect'
    },
    {
      number: '4000000000000036',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Lost card',
      icon: '🚫',
      result: 'Your card has been reported as lost'
    }
  ],
  error: [
    {
      number: '4000000000000119',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Processing error',
      icon: '⚠️',
      result: 'An error occurred while processing your card'
    },
    {
      number: '4000000000000101',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: 'Processing error',
      icon: '⚠️',
      result: 'An error occurred while processing your card'
    }
  ],
  auth: [
    {
      number: '4000000000000341',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: '3D Secure authentication required',
      icon: '🔐',
      result: 'Additional authentication required'
    },
    {
      number: '4000000000003220',
      brand: 'Visa',
      expiry: '12/28',
      cvc: '123',
      description: '3D Secure authentication required',
      icon: '🔐',
      result: 'Additional authentication required'
    }
  ]
});

/**
 * Format price for display
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
export const formatPrice = (amount, currency = 'MYR') => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency === 'RM' ? 'MYR' : currency,
    minimumFractionDigits: 0
  }).format(amount / 100);
};

/**
 * Validate Stripe configuration
 * @returns {boolean} True if Stripe is properly configured
 */
export const validateStripeConfig = () => {
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === 'pk_test_51234567890abcdef') {
    console.warn('⚠️ Using demo Stripe key. Replace with your actual test key from Stripe Dashboard.');
    return false;
  }
  return true;
};

export default {
  getStripe,
  createPaymentSession,
  processPayment,
  getTestCards,
  getTestCardsByCategory,
  formatPrice,
  validateStripeConfig
};
