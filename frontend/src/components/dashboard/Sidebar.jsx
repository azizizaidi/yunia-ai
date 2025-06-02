import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser, getCurrentUser, getUserProfile } from "../../services/api";

const menu = [
  {
    category: "Main",
    items: [
      { label: "AI Chat", to: "/dashboard", icon: "chat" },
      { label: "Chat History", to: "/chat-history", icon: "history" },
    ],
  },
  {
    category: "Tools",
    items: [
      { label: "Habit Tracker", to: "/habits", icon: "track_changes" },
      { label: "Daily Briefings", to: "/briefings", icon: "article" },
      { label: "Reminders", to: "/reminders", icon: "notifications" },
      { label: "Task Manager", to: "/tasks", icon: "task_alt" },
      { label: "Schedule", to: "/schedule", icon: "schedule" },
      { label: "Memory Manager", to: "/memory", icon: "memory" },
    ],
  },
  {
    category: "Data",
    items: [
      { label: "Calendar", to: "/calendar", icon: "calendar_today" },
      { label: "Weather", to: "/weather", icon: "cloud" },
      { label: "Location", to: "/location", icon: "location_on" },
      { label: "Analytics", to: "/analytics", icon: "analytics" },
    ],
  },
  {
    category: "Settings",
    items: [
      { label: "Profile", to: "/profile", icon: "person" },
      { label: "Subscription", to: "/subscription", icon: "star" },
      { label: "Settings", to: "/settings", icon: "settings" },
      { label: "Help", to: "/help", icon: "help" },
    ],
  },
];

export default function Sidebar({ onToggle, mobileMenuOpen, onMobileMenuClose, isMobile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      // Update user profile when it changes
      setUserProfile(event.detail.profile);
      setUser(event.detail.user);
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    const timestamp = new Date().getTime();
    router.push(`/login?t=${timestamp}`);
  };

  const showLogoutModal = () => {
    document.getElementById("logout_modal_sidebar").showModal();
  };

  const toggleSidebar = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (onToggle) onToggle(nextState);
  };

  // Handle mobile menu item click
  const handleMobileMenuItemClick = () => {
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out
        ${isMobile
          ? mobileMenuOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full"
          : collapsed
            ? "w-16"
            : "w-64 translate-x-0"
        }
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {/* Always show full logo on mobile, respect collapsed state on desktop */}
          {isMobile || !collapsed ? (
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-white text-lg">psychology</span>
              </div>
              <div className="ml-3 min-w-0">
                <div className="font-semibold text-gray-900 truncate">Yunia AI</div>
                <div className="text-xs text-gray-500 truncate">Personal Assistant</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="material-icons text-white text-lg">psychology</span>
            </div>
          )}

          {/* Toggle button - hide on mobile */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="material-icons text-gray-600 text-lg">
                {collapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menu.map((section, index) => (
            <div key={section.category} className="mb-4">
              {/* Always show section headers on mobile, respect collapsed state on desktop */}
              {(isMobile || !collapsed) && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {section.category}
                  </h3>
                </div>
              )}

              <div className="px-2">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.to}
                    onClick={handleMobileMenuItemClick}
                    className={`
                      flex items-center w-full px-3 py-2 mb-1 rounded-lg transition-all duration-200
                      ${collapsed && !isMobile ? "justify-center" : ""}
                      ${
                        activeItem === item.to
                          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {collapsed && !isMobile ? (
                      <div className="tooltip tooltip-right" data-tip={item.label}>
                        <span className="material-icons text-lg">
                          {item.icon}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="material-icons text-lg mr-3 flex-shrink-0">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User + Logout */}
        <div className="border-t border-gray-200 p-4">
          {/* Always show full user info on mobile, respect collapsed state on desktop */}
          {(isMobile || !collapsed) && user && (
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={user.avatar || userProfile?.avatar || `https://i.pravatar.cc/32?u=${user.email}`}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
          )}

          {/* Collapsed state for desktop only */}
          {collapsed && !isMobile ? (
            <div className="flex flex-col items-center space-y-2">
              {user && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user.avatar || userProfile?.avatar || `https://i.pravatar.cc/32?u=${user.email}`}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="tooltip tooltip-right" data-tip="Logout">
                <button
                  onClick={showLogoutModal}
                  className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <span className="material-icons text-lg">logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Full logout button for mobile and expanded desktop */
            <button
              onClick={showLogoutModal}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="material-icons text-lg mr-3 flex-shrink-0">logout</span>
              <span className="truncate">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <dialog id="logout_modal_sidebar" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </aside>
  );
}
