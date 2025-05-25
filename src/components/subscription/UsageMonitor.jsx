import { useState, useEffect } from 'react';
import { checkUsageLimits, getCurrentSubscription } from '../../services/subscriptionService';

/**
 * Usage Monitor Component - Displays subscription usage warnings and limits
 * Shows real-time usage status and warnings when approaching limits
 */
const UsageMonitor = ({ className = '' }) => {
  const [usageStatus, setUsageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    loadUsageStatus();

    // Check usage every 5 minutes
    const interval = setInterval(loadUsageStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadUsageStatus = async () => {
    try {
      setLoading(true);
      const [status, plan] = await Promise.all([
        checkUsageLimits(),
        getCurrentSubscription()
      ]);

      setUsageStatus(status);
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error loading usage status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertClass = (severity) => {
    switch (severity) {
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading || !usageStatus) {
    return (
      <div className={`skeleton h-20 w-full ${className}`}></div>
    );
  }

  // Don't show anything if within limits and no warnings
  if (usageStatus.withinLimits && usageStatus.warnings.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {usageStatus.warnings.map((warning, index) => (
        <div key={index} className={`alert ${getAlertClass(warning.severity)}`}>
          <span className="material-icons">{getAlertIcon(warning.severity)}</span>
          <div className="flex-1">
            <div className="font-medium">{warning.message}</div>
            {warning.type === 'memory_limit_warning' && usageStatus.usage.memory && (
              <div className="text-sm mt-1">
                Using {usageStatus.usage.memory.used}MB of {usageStatus.usage.memory.limit}MB
                ({usageStatus.usage.memory.percentage.toFixed(1)}%)
              </div>
            )}
          </div>
          <div className="flex-none">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => window.location.href = '/dashboard/subscription'}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      ))}

      {/* Usage Summary for Current Plan */}
      {currentPlan && (
        <div className="card bg-base-100 shadow-sm border">
          <div className="card-body p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Current Plan: {currentPlan.name}</h4>
              <div className="badge badge-primary">{currentPlan.currency}{currentPlan.price}/{currentPlan.period}</div>
            </div>

            <div className="space-y-3">
              {/* Memory Usage */}
              {usageStatus.usage.memory && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Storage</span>
                    <span>{usageStatus.usage.memory.used}MB / {usageStatus.usage.memory.limit}MB</span>
                  </div>
                  <progress
                    className={`progress progress-sm w-full ${
                      usageStatus.usage.memory.percentage > 80 ? 'progress-error' :
                      usageStatus.usage.memory.percentage > 60 ? 'progress-warning' :
                      'progress-primary'
                    }`}
                    value={usageStatus.usage.memory.percentage}
                    max="100"
                  ></progress>
                </div>
              )}

              {/* Conversations Usage */}
              {usageStatus.usage.conversations && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conversations</span>
                    <span>{usageStatus.usage.conversations.used} / {usageStatus.usage.conversations.limit}</span>
                  </div>
                  <progress
                    className={`progress progress-sm w-full ${
                      usageStatus.usage.conversations.percentage > 80 ? 'progress-error' :
                      usageStatus.usage.conversations.percentage > 60 ? 'progress-warning' :
                      'progress-secondary'
                    }`}
                    value={usageStatus.usage.conversations.percentage}
                    max="100"
                  ></progress>
                </div>
              )}

              {/* Reminders Usage */}
              {usageStatus.usage.reminders && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Active Reminders</span>
                    <span>{usageStatus.usage.reminders.used} / {usageStatus.usage.reminders.limit}</span>
                  </div>
                  <progress
                    className={`progress progress-sm w-full ${
                      usageStatus.usage.reminders.percentage > 80 ? 'progress-error' :
                      usageStatus.usage.reminders.percentage > 60 ? 'progress-warning' :
                      'progress-accent'
                    }`}
                    value={usageStatus.usage.reminders.percentage}
                    max="100"
                  ></progress>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <button
                className="btn btn-sm btn-outline flex-1"
                onClick={() => window.location.href = '/dashboard/memory-manager'}
              >
                Manage Data
              </button>
              <button
                className="btn btn-sm btn-primary flex-1"
                onClick={() => window.location.href = '/dashboard/subscription'}
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageMonitor;
