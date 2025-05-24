import DashboardLayout from "../layout/DashboardLayout";

/**
 * HabitTracker page - Track daily habits and routines
 * @returns {JSX.Element} Habit tracker page component
 */
const HabitTracker = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
          <p className="text-base-content/70">
            Track your daily habits and build better routines with AI insights
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="mb-4">
              <span className="material-icons text-6xl text-primary">track_changes</span>
            </div>
            <h2 className="card-title justify-center text-2xl mb-4">
              Habit Tracker Coming Soon
            </h2>
            <p className="text-base-content/70 mb-6">
              We're building an intelligent habit tracking system that will help you:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">check_circle</span>
                <span>Track daily habits automatically</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">check_circle</span>
                <span>Get AI-powered insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">check_circle</span>
                <span>Build streaks and momentum</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">check_circle</span>
                <span>Receive smart reminders</span>
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

export default HabitTracker;
