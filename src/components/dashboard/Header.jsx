import { useState, useEffect } from "react";
import { getNotifications, getCurrentUser, getUserProfile } from "../../services/api";

export default function Header() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        const profile = await getUserProfile();
        setUser(currentUser);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUserProfile(event.detail.profile);
      setUser(event.detail.user);
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return "assignment";
      case "calendar":
        return "event";
      case "payment":
        return "payment";
      case "alert":
        return "warning";
      case "message":
        return "message";
      default:
        return "notifications";
    }
  };

  // Function to get the appropriate color based on notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case "task":
        return "badge-primary";
      case "calendar":
        return "badge-secondary";
      case "payment":
        return "badge-success";
      case "alert":
        return "badge-warning";
      case "message":
        return "badge-info";
      default:
        return "badge-info";
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="navbar bg-base-100 shadow-md z-20">
      <div className="flex-none lg:hidden">
        <label htmlFor="drawer-sidebar" className="btn btn-square btn-ghost drawer-button">
          <span className="material-icons">menu</span>
        </label>
      </div>
      <div className="flex-1">
        <span className="text-lg font-semibold">Yunia AI Dashboard</span>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <span className="material-icons">notifications</span>
              {unreadCount > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">{unreadCount}</span>
              )}
            </div>
          </div>
          <div tabIndex={0} className="mt-3 z-[1] card dropdown-content w-80 bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <span className="font-bold text-lg">
                {loading ? "Loading..." : `${notifications.length} Notifications`}
              </span>
              {loading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                </div>
              ) : (
                <>
                  <ul className="menu menu-sm p-0 pt-2">
                    {notifications.length === 0 ? (
                      <li className="text-base-content/60 p-2">No notifications available</li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.id}>
                          <a className="py-2">
                            <span className={`badge ${getNotificationColor(n.type)} badge-sm p-2 mr-2`}>
                              <span className="material-icons text-xs">
                                {getNotificationIcon(n.type)}
                              </span>
                            </span>
                            <span className={n.read ? "opacity-60" : "font-medium"}>{n.msg}</span>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="card-actions mt-2">
                    <button className="btn btn-primary btn-sm w-full">View all notifications</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={user?.avatar || userProfile?.avatar || "https://i.pravatar.cc/40"}
                alt={user?.name || "user"}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}