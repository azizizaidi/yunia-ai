import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import Footer from "../components/dashboard/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <>
      {/* Sidebar tetap di kiri */}
      <Sidebar onToggle={handleSidebarToggle} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 bg-base-100 overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
