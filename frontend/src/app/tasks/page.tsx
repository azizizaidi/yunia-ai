"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/ui/ComingSoon";

export default function TaskManagerPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
          <p className="text-base-content/70">
            AI-powered task management with smart prioritization and scheduling
          </p>
        </div>
        <ComingSoon
          title="Smart Task Manager Coming Soon"
          description="Our AI-powered task management system will help you stay organized and productive:"
          icon="task_alt"
          features={[
            { text: "AI-powered task prioritization" },
            { text: "Smart deadline suggestions" },
            { text: "Automatic task categorization" },
            { text: "Progress tracking & insights" }
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
