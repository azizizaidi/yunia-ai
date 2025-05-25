export * from './stripe/stripeConfig';
export * from './stripe/stripePayment';
export * from './stripe/stripeTestCards';
export * from './stripe/stripeUtils';


// Default export for backward compatibility
import { getStripe } from './stripe/stripeConfig';
import { createPaymentSession, processPayment } from './stripe/stripePayment';
import { getTestCards, getTestCardsByCategory } from './stripe/stripeTestCards';
import { formatPrice } from './stripe/stripeUtils';
import { validateStripeConfig } from './stripe/stripeConfig';

export default {
  getStripe,
  createPaymentSession,
  processPayment,
  getTestCards,
  getTestCardsByCategory,
  formatPrice,
  validateStripeConfig
};
