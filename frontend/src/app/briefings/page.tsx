"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DailyBriefingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Daily Briefings</h1>
          <p className="text-base-content/70">
            Get AI-generated daily briefings with weather, traffic, news, and personalized insights
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="mb-4">
              <span className="material-icons text-6xl text-primary">article</span>
            </div>
            <h2 className="card-title justify-center text-2xl mb-4">
              Daily Briefings Coming Soon
            </h2>
            <p className="text-base-content/70 mb-6">
              Your personalized AI assistant will provide daily briefings including:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-info">wb_sunny</span>
                <span>Weather & Climate Updates</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-warning">traffic</span>
                <span>Traffic & Route Planning</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">newspaper</span>
                <span>Personalized News Summary</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary">schedule</span>
                <span>Calendar & Appointments</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-secondary">psychology</span>
                <span>AI Insights & Recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-accent">notifications</span>
                <span>Important Reminders</span>
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
}
