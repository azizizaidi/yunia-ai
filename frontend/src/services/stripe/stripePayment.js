/**
 * Stripe Payment Processing
 * Handles payment processing and confirmation
 */

import { getStripe } from './stripeConfig';
import { getTestCardsByCategory, simulateTestCardResponse } from './stripeTestCards';

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
