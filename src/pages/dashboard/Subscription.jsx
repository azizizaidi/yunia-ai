import DashboardLayout from "../../layout/DashboardLayout";
import ComingSoon from "../../components/ui/ComingSoon";

/**
 * Subscription page - Premium plan management for Yunia AI
 * @returns {JSX.Element} Subscription page component
 */
const Subscription = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Plan Subscription</h1>
          <p className="text-base-content/70">
            Manage your Yunia AI subscription and billing
          </p>
        </div>
        <ComingSoon
          title="Subscription Plans Coming Soon"
          description="Premium features and subscription management:"
          icon="credit_card"
          features={[
            { text: "Flexible subscription plans" },
            { text: "Premium AI features" },
            { text: "Advanced integrations" },
            { text: "Priority support" }
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
