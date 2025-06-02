"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/ui/ComingSoon";

export default function ChatHistoryPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Chat History</h1>
          <p className="text-base-content/70">
            View and manage your conversation history with Yunia AI
          </p>
        </div>
        <ComingSoon
          title="Chat History Coming Soon"
          description="Access and manage all your conversations with Yunia AI:"
          icon="history"
          features={[
            { text: "Search through conversation history" },
            { text: "Export chat conversations" },
            { text: "Organize chats by topics" },
            { text: "Bookmark important conversations" }
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
