/**
 * Stripe Configuration
 * Handles Stripe initialization and configuration
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
