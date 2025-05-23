import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser, getCurrentUser } from "../../services/api";

// Simple menu structure with Material Icons
const menu = [
  {
    category: "MAIN",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
      { label: "Analytics", to: "/analytics", icon: "analytics" },
    ]
  },
  {
    category: "PERSONAL",
    items: [
      { label: "Profile", to: "/profile", icon: "person" },
      { label: "Calendar", to: "/calendar", icon: "calendar_month" },
      { label: "Messages", to: "/messages", icon: "chat" },
    ]
  },
  {
    category: "SYSTEM",
    items: [
      { label: "Settings", to: "/settings", icon: "settings" },
    ]
  }
];

export default function Sidebar({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");
  const [user, setUser] = useState(null);

  // Set active menu item based on current location
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  // Get current user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    // Logout user
    logoutUser();

    // Add timestamp parameter to ensure login page is not cached
    const timestamp = new Date().getTime();

    // Redirect to login page
    navigate(`/login?t=${timestamp}`, { replace: true });

    // As an additional security measure, we can also set history state
    window.history.pushState(null, "", `/login?t=${timestamp}`);
  };

  const showLogoutModal = () => {
    document.getElementById('logout_modal_sidebar').showModal();
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Notify parent component about the change
    if (onToggle) {
      onToggle(!collapsed);
    }
  };

  return (
    <aside className={`drawer-side h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 overflow-visible fixed left-0`}>
      <div className="bg-base-200 h-full flex flex-col overflow-x-hidden">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          {!collapsed && (
            <div className="flex items-center">
              <div className="avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="material-icons">psychology</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="font-bold">Yunia AI</div>
                <div className="text-xs opacity-70">Smart Assistant</div>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="avatar mx-auto">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="material-icons">psychology</span>
              </div>
            </div>
          )}

          <div className="tooltip tooltip-left z-50" data-tip={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <button
              onClick={toggleSidebar}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="material-icons">
                {collapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="menu menu-md w-full p-0 flex-1 overflow-y-auto overflow-x-hidden">
          {menu.map((section, sectionIndex) => (
            <li key={section.category} className={sectionIndex > 0 ? 'mt-4' : 'mt-2'}>
              {/* Category Label - Only show when not collapsed */}
              {!collapsed && (
                <div className="menu-title text-xs opacity-60 px-4 mt-2">
                  {section.category}
                </div>
              )}

              {/* Menu Items */}
              <ul className="menu-sub p-0">
                {section.items.map(item => (
                  <li key={item.label} className={`w-full ${activeItem === item.to ? 'relative' : ''}`}>
                    {activeItem === item.to && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-focus rounded-r-md"></span>
                    )}
                    <Link
                      to={item.to}
                      className={`${activeItem === item.to ? 'active bg-primary text-primary-content font-medium' : ''} w-full hover:bg-base-300`}
                    >
                      {collapsed ? (
                        <div className="tooltip tooltip-right z-500" data-tip={item.label}>
                          <span className="material-icons flex items-center justify-center">
                            {item.icon}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="material-icons">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* User Profile and Logout Section */}
        <div className="border-t border-base-300 overflow-x-hidden">
          {!collapsed && user && (
            <div className="p-4">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://i.pravatar.cc/40" alt={user.name || "User"} />
                  </div>
                </div>
                <div className="ml-3 overflow-hidden max-w-[calc(100%-3rem)]">
                  <div className="font-medium truncate">{user.name || "User"}</div>
                  <div className="text-xs opacity-70 truncate">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            {collapsed ? (
              <div className="tooltip tooltip-right z-500" data-tip="Logout">
                <button
                  onClick={showLogoutModal}
                  className="btn btn-error btn-sm btn-circle mx-auto flex items-center justify-center"
                >
                  <span className="material-icons">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={showLogoutModal}
                className="btn btn-error btn-sm w-full"
              >
                <span className="material-icons">logout</span>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal_sidebar" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleLogout}
            >
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