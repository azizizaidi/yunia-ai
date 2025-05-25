import { useState, useEffect } from 'react';
import {
  getAvailableExtensions,
  getActiveExtensions,
  getTotalRetentionPeriod,
  purchaseRetentionExtension,
  formatRetentionPeriod,
  getRetentionRecommendations
} from '../../services/dataRetentionService';
import { getCurrentSubscriptionPlan } from '../../services/subscriptionService';

/**
 * Retention Extensions Component - Add-on data retention plans
 * Allows users to extend their data retention period beyond base plan limits
 */
const RetentionExtensions = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [availableExtensions, setAvailableExtensions] = useState([]);
  const [activeExtensions, setActiveExtensions] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [totalRetention, setTotalRetention] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    loadRetentionData();
  }, []);

  const loadRetentionData = async () => {
    try {
      setLoading(true);
      const [extensions, active, plan, total, recs] = await Promise.all([
        getAvailableExtensions(),
        getActiveExtensions(),
        getCurrentSubscriptionPlan(),
        getTotalRetentionPeriod(),
        getRetentionRecommendations()
      ]);

      setAvailableExtensions(extensions);
      setActiveExtensions(active);
      setCurrentPlan(plan);
      setTotalRetention(total);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading retention data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseExtension = async (extensionId) => {
    try {
      setPurchasing(extensionId);
      const result = await purchaseRetentionExtension(extensionId);

      if (result.success) {
        alert(result.message);
        await loadRetentionData(); // Refresh data
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error purchasing extension:', error);
      alert('Failed to purchase extension. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (availableExtensions.length === 0) {
    return null; // No extensions available
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Extend Data Retention</h3>
        <p className="text-sm text-gray-600">
          Keep your data longer with our retention extension add-ons
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-blue-900">Current Retention Period</div>
            <div className="text-sm text-blue-700">
              {currentPlan?.name} Plan: {formatRetentionPeriod(currentPlan?.dataRetention)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">
              {formatRetentionPeriod(totalRetention)}
            </div>
            <div className="text-xs text-blue-600">Total with extensions</div>
          </div>
        </div>
      </div>

      {/* Active Extensions */}
      {activeExtensions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Active Extensions</h4>
          <div className="space-y-2">
            {activeExtensions.map((extension, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div>
                  <div className="font-medium text-green-900">
                    {extension.extensionDays === -1 ? 'Lifetime Extension' : `${formatRetentionPeriod(extension.extensionDays)} Extension`}
                  </div>
                  <div className="text-xs text-green-600">
                    Purchased: {new Date(extension.purchasedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-green-700 font-medium">
                  ✓ Active
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Extension */}
      {recommendations?.recommended && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 mt-0.5">💡</div>
              <div className="flex-1">
                <div className="font-medium text-yellow-900 mb-1">Recommended for You</div>
                <div className="text-sm text-yellow-800 mb-3">
                  {recommendations.recommended.name} - {recommendations.reason}
                </div>
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => handlePurchaseExtension(recommendations.recommended.id)}
                  disabled={purchasing === recommendations.recommended.id}
                >
                  {purchasing === recommendations.recommended.id ? 'Processing...' : `Get for ${recommendations.recommended.currency}${recommendations.recommended.price}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Extensions */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Available Extensions</h4>
        <div className="grid gap-4">
          {availableExtensions.map((extension) => (
            <div
              key={extension.id}
              className={`border rounded-lg p-4 transition-all ${
                extension.popular ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900">{extension.name}</h5>
                    {extension.popular && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}
                    {extension.premium && (
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{extension.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {extension.currency}{extension.price}
                  </div>
                  <div className="text-xs text-gray-500">{extension.period}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total retention:</span> {formatRetentionPeriod(extension.totalRetention)}
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    extension.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => handlePurchaseExtension(extension.id)}
                  disabled={purchasing === extension.id}
                >
                  {purchasing === extension.id ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">Why Extend Data Retention?</h5>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Keep important conversations longer</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Maintain AI learning history</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Compliance and audit requirements</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Better long-term insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionExtensions;
