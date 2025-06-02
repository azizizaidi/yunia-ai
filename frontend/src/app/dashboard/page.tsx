"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ChatDashboard from "../../components/chat/ChatDashboard";
import UsageMonitor from "../../components/subscription/UsageMonitor";
import useAuth from "../../hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }
      if (isAdmin()) {
        router.replace("/admin/dashboard");
      }
    };

    window.addEventListener("focus", checkAuth);
    window.addEventListener("popstate", checkAuth);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("popstate", checkAuth);
      window.removeEventListener("pageshow", checkAuth);
    };
  }, [router, isAuthenticated, isAdmin]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto">
        {/* Usage Monitor - Shows subscription warnings */}
        <UsageMonitor className="mb-3 sm:mb-4" />

        {/* Chat and Voice Interface */}
        <ChatDashboard />
      </div>
    </DashboardLayout>
  );
}
