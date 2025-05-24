import DashboardLayout from "../layout/DashboardLayout";

/**
 * Subscription page - Premium plan management for Yunia AI
 * @returns {JSX.Element} Subscription page component
 */
const Subscription = () => {
  const plans = [
    {
      name: "Free",
      price: "RM0",
      period: "forever",
      features: [
        "Basic AI Chat",
        "5 Voice Messages/day",
        "Basic Reminders",
        "Community Support"
      ],
      current: true,
      popular: false
    },
    {
      name: "Pro",
      price: "RM29",
      period: "month",
      features: [
        "Unlimited AI Chat",
        "Unlimited Voice & Video Chat",
        "Smart Habit Tracking",
        "Daily AI Briefings",
        "Calendar Integration",
        "Weather & Traffic Updates",
        "Priority Support"
      ],
      current: false,
      popular: true
    },
    {
      name: "Enterprise",
      price: "RM99",
      period: "month",
      features: [
        "Everything in Pro",
        "Advanced Analytics",
        "Custom AI Training",
        "API Access",
        "Team Collaboration",
        "24/7 Dedicated Support",
        "Custom Integrations"
      ],
      current: false,
      popular: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-base-content/70">
            Unlock the full potential of your AI Personal Assistant
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`card bg-base-100 shadow-xl ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="badge badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </div>
              )}
              
              <div className="card-body">
                <h2 className="card-title justify-center text-2xl mb-4">
                  {plan.name}
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-base-content/70">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <span className="material-icons text-success text-sm">check</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-actions justify-center">
                  {plan.current ? (
                    <button className="btn btn-outline btn-wide" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button className={`btn btn-wide ${
                      plan.popular ? 'btn-primary' : 'btn-outline'
                    }`}>
                      {plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Why Upgrade to Pro?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <span className="material-icons text-4xl text-primary">psychology</span>
              </div>
              <h3 className="font-semibold mb-2">Advanced AI</h3>
              <p className="text-sm text-base-content/70">
                Access to latest AI models and unlimited conversations
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <span className="material-icons text-4xl text-secondary">integration_instructions</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Integrations</h3>
              <p className="text-sm text-base-content/70">
                Connect with Google Calendar, weather, traffic, and more
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <span className="material-icons text-4xl text-accent">analytics</span>
              </div>
              <h3 className="font-semibold mb-2">Insights & Analytics</h3>
              <p className="text-sm text-base-content/70">
                Track your productivity and get personalized recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <span className="material-icons text-4xl text-info">support_agent</span>
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-base-content/70">
                Get help when you need it with priority customer support
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I cancel my subscription anytime?
              </div>
              <div className="collapse-content">
                <p>Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                What payment methods do you accept?
              </div>
              <div className="collapse-content">
                <p>We accept all major credit cards, PayPal, and local Malaysian payment methods including FPX and Touch 'n Go eWallet.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Is my data secure?
              </div>
              <div className="collapse-content">
                <p>Absolutely. We use enterprise-grade encryption and follow strict data protection standards. Your personal data is never shared with third parties.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
