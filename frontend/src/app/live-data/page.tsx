"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/ui/ComingSoon";

export default function LiveDataPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Live Data</h1>
          <p className="text-base-content/70">
            Real-time data monitoring and insights for your daily life
          </p>
        </div>
        <ComingSoon
          title="Live Data Dashboard Coming Soon"
          description="Monitor real-time data that matters to you:"
          icon="sensors"
          features={[
            { text: "Real-time weather updates" },
            { text: "Traffic & transportation data" },
            { text: "News & market updates" },
            { text: "Personal metrics tracking" }
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
