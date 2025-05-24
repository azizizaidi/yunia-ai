import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser, getCurrentUser } from "../../services/api";

const menu = [
  {
    category: "MAIN",
    items: [
      { label: "Chat", to: "/dashboard", icon: "chat" },
      { label: "Voice Chat", to: "/voice-chat", icon: "mic" },
      { label: "Analytics", to: "/analytics", icon: "analytics" },
    ],
  },
  {
    category: "PERSONAL",
    items: [
      { label: "Profile", to: "/profile", icon: "person" },
      { label: "Saved Chats", to: "/saved-chats", icon: "bookmark" },
      { label: "History", to: "/history", icon: "history" },
    ],
  },
  {
    category: "SYSTEM",
    items: [
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

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

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
        collapsed ? "w-20" : "w-64"
      } bg-base-200 z-40 transition-all duration-300 overflow-x-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          {!collapsed ? (
            <div className="flex items-center overflow-hidden">
              <div className="avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="material-icons">psychology</span>
                </div>
              </div>
              <div className="ml-3 truncate">
                <div className="font-bold">Yunia AI</div>
                <div className="text-xs opacity-70">Smart Assistant</div>
              </div>
            </div>
          ) : (
            <div className="avatar mx-auto">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="material-icons">psychology</span>
              </div>
            </div>
          )}

          <div
            className="tooltip tooltip-left z-[500]"
            data-tip={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <button
              onClick={toggleSidebar}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="material-icons">
                {collapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="menu menu-md flex-1 overflow-y-auto px-1">
          {menu.map((section, index) => (
            <li key={section.category} className={index > 0 ? "mt-4" : "mt-2"}>
              {!collapsed && (
                <div className="menu-title text-xs opacity-60 px-4 mt-2">
                  {section.category}
                </div>
              )}
              <ul className="menu-sub p-0">
                {section.items.map((item) => (
                  <li
                    key={item.label}
                    className={`w-full ${activeItem === item.to ? "relative" : ""}`}
                  >
                    {activeItem === item.to && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-focus rounded-r-md"></span>
                    )}
                    <Link
                      to={item.to}
                      className={`${
                        activeItem === item.to
                          ? "active bg-primary text-primary-content font-medium"
                          : ""
                      } w-full hover:bg-base-300`}
                    >
                      {collapsed ? (
                        <div className="tooltip tooltip-right z-[500]" data-tip={item.label}>
                          <span className="material-icons flex items-center justify-center">
                            {item.icon}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="material-icons">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* User + Logout */}
        <div className="border-t border-base-300 p-4">
          {!collapsed && user && (
            <div className="flex items-center mb-3 overflow-hidden">
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
          )}

          {collapsed ? (
            <div className="tooltip tooltip-right z-[500]" data-tip="Logout">
              <button
                onClick={showLogoutModal}
                className="btn btn-error btn-sm btn-circle mx-auto flex items-center justify-center"
              >
                <span className="material-icons">logout</span>
              </button>
            </div>
          ) : (
            <button onClick={showLogoutModal} className="btn btn-error btn-sm w-full">
              <span className="material-icons">logout</span>
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
