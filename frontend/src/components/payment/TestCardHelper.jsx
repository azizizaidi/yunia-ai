import { useState } from 'react';
import { getTestCards, getTestCardsByCategory } from '../../services/stripeService';

/**
 * Test Card Helper Component
 * Provides easy access to test card numbers for payment testing
 */
const TestCardHelper = ({ onCardSelect, isVisible, onToggle }) => {
  const [selectedCategory, setSelectedCategory] = useState('success');
  const cardsByCategory = getTestCardsByCategory();

  const handleCardSelect = (card) => {
    if (onCardSelect) {
      onCardSelect(card);
    }
  };

  const categories = [
    { id: 'success', name: 'Successful Payments', icon: '✅' },
    { id: 'decline', name: 'Declined Cards', icon: '❌' },
    { id: 'error', name: 'Processing Errors', icon: '⚠️' },
    { id: 'auth', name: 'Authentication Required', icon: '🔐' }
  ];

  if (!isVisible) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-blue-600 mr-2">🧪</div>
            <span className="text-sm text-blue-800 font-medium">Test Mode - Kad Olok-Olok</span>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Show test cards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-blue-600 mr-2">🧪</div>
          <span className="text-sm text-blue-800 font-medium">Test Mode - Kad Olok-Olok</span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Hide test cards
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Test Cards */}
      <div className="space-y-2">
        <p className="text-sm text-blue-700 font-medium">
          Click any card to copy details to clipboard:
        </p>
        {cardsByCategory[selectedCategory]?.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardSelect(card)}
            className="bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{card.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <code className="font-mono text-sm font-medium text-gray-900">
                      {card.number}
                    </code>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {card.brand}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Exp: {card.expiry}</div>
                <div>CVC: {card.cvc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Testing Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>Click any card</strong> to copy number to clipboard, then paste in form</li>
          <li>• <strong>Successful payments:</strong> Use cards with ✅ icon</li>
          <li>• <strong>Test failures:</strong> Use cards with ❌ icon to test error handling</li>
          <li>• <strong>3D Secure:</strong> Use 🔐 cards to test authentication flow</li>
          <li>• <strong>ZIP Code:</strong> Use any 5 digits (e.g., 12345)</li>
          <li>• <strong>Name:</strong> Use any name for testing</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => handleCardSelect(cardsByCategory.success[0])}
          className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded text-xs font-medium transition-colors"
        >
          ✅ Quick Success
        </button>
        <button
          onClick={() => handleCardSelect(cardsByCategory.decline[0])}
          className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-3 rounded text-xs font-medium transition-colors"
        >
          ❌ Quick Decline
        </button>
      </div>
    </div>
  );
};

export default TestCardHelper;
