import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment, getTestCards } from '../../services/stripeService';
import { upgradeSubscription } from '../../services/subscriptionService';

/**
 * Payment Form Component
 */
const PaymentForm = ({ planData, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const result = await processPayment(stripe, elements, planData);

      if (result.success) {
        // Save subscription data to localStorage
        const paymentData = {
          paymentMethod: 'card',
          transactionId: result.paymentIntent?.id || `txn_${Date.now()}`,
          cardLast4: result.paymentMethod?.card?.last4 || '****'
        };

        const subscriptionResult = await upgradeSubscription(planData.id, paymentData);

        if (subscriptionResult.success) {
          onSuccess({
            ...result,
            subscription: subscriptionResult.subscription,
            billingRecord: subscriptionResult.billingRecord
          });
        } else {
          onError(subscriptionResult.message);
        }
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Plan Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{planData.name} Plan</span>
          <span className="font-bold text-gray-900">
            {planData.currency}{planData.price}/{planData.period}
          </span>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Test Cards Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-blue-600 mr-2">ℹ️</div>
            <span className="text-sm text-blue-800 font-medium">Test Mode</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTestCards(!showTestCards)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showTestCards ? 'Hide' : 'Show'} test cards
          </button>
        </div>

        {showTestCards && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-blue-700">Use these test card numbers:</p>
            {getTestCards().slice(0, 2).map((card, index) => (
              <div key={index} className="text-xs bg-white rounded p-2 border border-blue-200">
                <code className="font-mono">{card.number}</code>
                <span className="ml-2 text-blue-600">- {card.description}</span>
              </div>
            ))}
            <p className="text-xs text-blue-600">
              Use any future date for expiry and any 3-digit CVC
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${planData.currency}${planData.price}`
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * Payment Modal Component
 */
const PaymentModal = ({ isOpen, onClose, planData, stripePromise, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentSuccess = (result) => {
    setPaymentStatus('success');
    setTimeout(() => {
      onPaymentSuccess(result);
      onClose();
      setPaymentStatus(null);
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    console.error('Payment error:', error);
    setTimeout(() => {
      setPaymentStatus(null);
    }, 3000);
  };

  const handleClose = () => {
    if (paymentStatus !== 'success') {
      onClose();
      setPaymentStatus(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Upgrade to {planData?.name}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={paymentStatus === 'success'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✅</div>
                <div>
                  <h3 className="font-medium text-green-800">Payment Successful!</h3>
                  <p className="text-sm text-green-700">Your subscription has been upgraded.</p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 mr-3">❌</div>
                <div>
                  <h3 className="font-medium text-red-800">Payment Failed</h3>
                  <p className="text-sm text-red-700">Please check your card details and try again.</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {paymentStatus !== 'success' && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                planData={planData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handleClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
