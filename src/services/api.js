// API service for fetching data from JSON files

/**
 * Fetch user data from user.json
 * @returns {Promise<Array>} Array of user objects
 */
export const fetchUserData = async () => {
  try {
    const response = await fetch('/data/user.json');
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
};

/**
 * Fetch tasks data from tasks.json
 * @returns {Promise<Array>} Array of task objects
 */
export const fetchTasksData = async () => {
  try {
    const response = await fetch('/data/tasks.json');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks data:', error);
    return [];
  }
};

/**
 * Fetch reminders data from reminders.json
 * @returns {Promise<Array>} Array of reminder objects
 */
export const fetchRemindersData = async () => {
  try {
    const response = await fetch('/data/reminders.json');
    if (!response.ok) {
      throw new Error('Failed to fetch reminders data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reminders data:', error);
    return [];
  }
};