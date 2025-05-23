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
    <div className="drawer lg:drawer-open relative">
      <input id="drawer-sidebar" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex flex-col transition-all duration-300">

        <Header />
        <main className="flex-1 p-6 bg-base-100">{children}</main>
        <Footer />
      </div>
      <Sidebar onToggle={handleSidebarToggle} />
    </div>
  );
}