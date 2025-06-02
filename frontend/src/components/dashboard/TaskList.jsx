import { useState, useEffect } from "react";
import { getTasks } from "../../services/api";
import Loader from "../ui/Loader";

/**
 * TaskList component for displaying a list of tasks
 * @returns {JSX.Element} TaskList component
 */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-gray-500">No tasks available.</div>;
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-2">Task List</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 bg-white rounded shadow">
            <div className="flex justify-between">
              <span className="font-medium">{task.title}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                task.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {task.status}
              </span>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
