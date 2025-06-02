import { useState, useEffect } from "react";
import { getReminders } from "../../services/api";
import Loader from "../ui/Loader";

/**
 * ReminderList component for displaying a list of reminders
 * @returns {JSX.Element} ReminderList component
 */
const ReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const data = await getReminders();
        setReminders(data);
        setError(null);
      } catch (err) {
        setError("Failed to load reminders. Please try again later.");
        console.error("Error fetching reminders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (reminders.length === 0) {
    return <div className="text-gray-500">No reminders available.</div>;
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Reminders</h3>
      <ul className="space-y-2">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="p-3 bg-white rounded shadow">
            <div className="flex justify-between">
              <span className="font-medium">{reminder.title}</span>
              <span className="text-sm text-blue-600">{reminder.time}</span>
            </div>
            {reminder.note && (
              <p className="text-sm text-gray-600 mt-1">{reminder.note}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
