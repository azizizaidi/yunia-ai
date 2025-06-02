import { useState, useEffect } from "react";
import { getNotifications } from "../../services/api";
import Loader from "../ui/Loader";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setError(null);
      } catch (err) {
        setError("Failed to load notifications. Please try again later.");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-lg p-6">
        <div className="font-bold text-lg mb-2">Notifications</div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-lg p-6">
        <div className="font-bold text-lg mb-2">Notifications</div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg p-6">
        <div className="font-bold text-lg mb-2">Notifications</div>
        <div className="text-gray-500">No notifications available.</div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <div className="font-bold text-lg mb-2">Notifications</div>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2">
              <span className={`badge ${getNotificationColor(n.type)} badge-sm p-3`}>
                <span className="material-icons text-sm">
                  {getNotificationIcon(n.type)}
                </span>
              </span>
              <span className={n.read ? "text-gray-500" : "font-medium"}>{n.msg}</span>
            </div>
            <div className="text-xs text-gray-400 ml-6">{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
