"use client";

import { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-close mobile menu on desktop
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Sidebar - Responsive */}
      <Sidebar
        onToggle={handleSidebarToggle}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={handleMobileMenuClose}
        isMobile={isMobile}
      />

      {/* Main Content - Responsive */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isMobile
            ? "ml-0"
            : sidebarCollapsed
              ? "ml-16"
              : "ml-64"
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <Header
            onMobileMenuToggle={handleMobileMenuToggle}
            isMobile={isMobile}
          />
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 bg-base-100 min-h-0">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
