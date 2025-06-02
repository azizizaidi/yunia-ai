/**
 * Stripe Test Cards
 * Contains test card definitions and simulation logic
 */

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
 * Detect test card type based on card number
 * @param {string} cardNumber - The card number to check
 * @returns {Object|null} Test card info or null if not a test card
 */
export const detectTestCard = (cardNumber) => {
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
 * Get decline code based on test card number
 * @param {string} cardNumber - Test card number
 * @returns {string} Decline code
 */
export const getDeclineCode = (cardNumber) => {
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
 * Simulate specific test card responses
 * @param {Object} testCard - Test card information
 * @param {Object} planData - Plan data
 * @returns {Object} Payment result based on test card type
 */
export const simulateTestCardResponse = (testCard, planData) => {
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
