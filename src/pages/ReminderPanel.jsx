import DashboardLayout from "../layout/DashboardLayout";

/**
 * ReminderPanel page - Smart reminder management system
 * @returns {JSX.Element} Reminder panel page component
 */
const ReminderPanel = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Reminder Panel</h1>
          <p className="text-base-content/70">
            Intelligent reminder system that learns your patterns and helps you stay organized
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="mb-4">
              <span className="material-icons text-6xl text-primary">notifications</span>
            </div>
            <h2 className="card-title justify-center text-2xl mb-4">
              Smart Reminders Coming Soon
            </h2>
            <p className="text-base-content/70 mb-6">
              Our AI-powered reminder system will feature:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">smart_toy</span>
                <span>AI-Powered Smart Reminders</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-info">location_on</span>
                <span>Location-Based Alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-warning">schedule</span>
                <span>Time-Sensitive Notifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary">repeat</span>
                <span>Recurring Reminder Patterns</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-secondary">voice_chat</span>
                <span>Voice-Activated Reminders</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-accent">insights</span>
                <span>Productivity Insights</span>
              </div>
            </div>

            <div className="badge badge-primary badge-lg">
              MVP Feature - Coming Soon
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReminderPanel;
