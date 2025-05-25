/**
 * Stripe Utilities
 * Contains utility functions for Stripe operations
 */

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
