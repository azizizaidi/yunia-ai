import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

export default function Sidebar({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

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

  const handleLogout = () => {
    logoutUser();
    const timestamp = new Date().getTime();
    navigate(`/login?t=${timestamp}`, { replace: true });
    window.history.pushState(null, "", `/login?t=${timestamp}`);
  };

  const showLogoutModal = () => {
    document.getElementById("logout_modal_sidebar").showModal();
  };

  const toggleSidebar = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-gray-200 z-40 transition-all duration-300`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-lg">psychology</span>
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Yunia AI</div>
                <div className="text-xs text-gray-500">Personal Assistant</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="material-icons text-white text-lg">psychology</span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-100"
          >
            <span className="material-icons text-gray-500">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menu.map((section, index) => (
            <div key={section.category} className="mb-4">
              {!collapsed && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    {section.category}
                  </h3>
                </div>
              )}

              <div className="px-2">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`
                      flex items-center w-full px-3 py-2 mb-1 rounded-lg transition-colors
                      ${collapsed ? "justify-center" : ""}
                      ${
                        activeItem === item.to
                          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {collapsed ? (
                      <div className="tooltip tooltip-right" data-tip={item.label}>
                        <span className="material-icons text-lg">
                          {item.icon}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="material-icons text-lg mr-3">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">
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
          {!collapsed && user && (
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={userProfile?.avatar || `https://i.pravatar.cc/32?u=${user.email}`}
                  alt={user.name || "User"}
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
          )}

          {collapsed ? (
            <div className="flex flex-col items-center space-y-2">
              {user && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={userProfile?.avatar || `https://i.pravatar.cc/32?u=${user.email}`}
                    alt={user.name || "User"}
                  />
                </div>
              )}
              <div className="tooltip tooltip-right" data-tip="Logout">
                <button
                  onClick={showLogoutModal}
                  className="p-1 rounded hover:bg-red-50 text-red-600"
                >
                  <span className="material-icons text-lg">logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={showLogoutModal}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <span className="material-icons text-lg mr-3">logout</span>
              <span>Logout</span>
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
