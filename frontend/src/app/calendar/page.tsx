"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/ui/ComingSoon";

export default function GoogleCalendarPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Google Calendar</h1>
          <p className="text-base-content/70">
            Seamless integration with your Google Calendar for smart scheduling
          </p>
        </div>
        <ComingSoon
          title="Google Calendar Integration Coming Soon"
          description="Connect your Google Calendar for enhanced productivity features:"
          icon="calendar_today"
          features={[
            { text: "Two-way calendar sync" },
            { text: "AI meeting scheduling" },
            { text: "Smart conflict detection" },
            { text: "Automated reminders" }
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
