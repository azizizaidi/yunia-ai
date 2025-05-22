/**
 * API service for handling all API calls
 * This file centralizes all API calls to make them easier to manage and test
 */

/**
 * Get all users from both the API and localStorage
 * @returns {Promise<Array>} Array of users
 */
export const getUsers = async () => {
  try {
    // Get users from API
    const response = await fetch("/data/user.json");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const usersFromApi = await response.json();

    // Get users from localStorage
    const usersFromLocalStorage = JSON.parse(localStorage.getItem("users") || "[]");

    // Combine both data sources
    const allUsers = [...usersFromApi, ...usersFromLocalStorage];

    // Remove duplicate users based on email
    const uniqueUsers = allUsers.filter((user, index, self) =>
      index === self.findIndex((u) => u.email === user.email)
    );

    return uniqueUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export const loginUser = async (email, password) => {
  try {
    const users = await getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }

    return null;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Promise<Object>} Newly created user
 */
export const registerUser = async (userData) => {
  try {
    // Get existing users
    const users = await getUsers();

    // Check if email is already registered
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("Email is already registered!");
    }

    // Get the latest ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Create new user
    const newUser = {
      id: newId,
      ...userData
    };

    // Add new user to the array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    return newUser;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

/**
 * Get tasks for the current user
 * @returns {Promise<Array>} Array of tasks
 */
export const getTasks = async () => {
  try {
    const response = await fetch("/data/tasks.json");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Get reminders for the current user
 * @returns {Promise<Array>} Array of reminders
 */
export const getReminders = async () => {
  try {
    const response = await fetch("/data/reminders.json");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem("user");
};

/**
 * Get the current logged in user
 * @returns {Object|null} User object if logged in, null otherwise
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};