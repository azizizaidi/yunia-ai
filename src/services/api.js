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
    let usersFromApi = [];

    try {
      // Get users from API
      const response = await fetch("/data/user.json");
      if (response.ok) {
        usersFromApi = await response.json();
      } else {
        console.warn(`API warning: ${response.status}. Using empty array for API users.`);
      }
    } catch (apiError) {
      console.warn("Could not fetch users from API:", apiError);
      // Continue with empty array for API users
    }

    // Get users from localStorage
    let usersFromLocalStorage = [];
    try {
      usersFromLocalStorage = JSON.parse(localStorage.getItem("users") || "[]");
    } catch (localStorageError) {
      console.warn("Could not get users from localStorage:", localStorageError);
      // Continue with empty array for localStorage users
    }

    // Combine both data sources
    const allUsers = [...usersFromApi, ...usersFromLocalStorage];

    // Remove duplicate users based on email
    const uniqueUsers = allUsers.filter((user, index, self) =>
      index === self.findIndex((u) => u.email === user.email)
    );

    return uniqueUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (optional, for specific role authentication)
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export const loginUser = async (email, password, role = null) => {
  try {
    const users = await getUsers();
    let user = users.find(
      (u) => u.email === email && u.password === password
    );

    // If role is specified, check if user has that role
    if (user && role && user.role !== role) {
      return null;
    }

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
    let newId = 1;
    try {
      if (users.length > 0) {
        const validIds = users.filter(u => u.id).map(u => u.id);
        newId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
      }
    } catch (idError) {
      console.error("Error calculating new ID:", idError);
      // Fallback to a simple ID generation
      newId = Date.now();
    }

    // Create new user with role "user" by default
    const newUser = {
      id: newId,
      role: "user", // Set default role to "user"
      ...userData
    };

    // Add new user to the array
    users.push(newUser);

    // Save to localStorage
    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (storageError) {
      console.error("Error saving to localStorage:", storageError);
      // If we can't save to localStorage, at least return the user
      // so the registration appears successful
    }

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

/**
 * Get notifications for the current user
 * @returns {Promise<Array>} Array of notifications
 */
export const getNotifications = async () => {
  try {
    // In a real app, this would fetch from an API endpoint
    // For now, we'll return mock data
    const mockNotifications = [
      {
        id: 1,
        type: "task",
        msg: "You have a new task.",
        time: "5 minutes ago",
        read: false
      },
      {
        id: 2,
        type: "calendar",
        msg: "Coaching session at 3PM today.",
        time: "1 hour ago",
        read: false
      },
      {
        id: 3,
        type: "payment",
        msg: "Subscription payment successful.",
        time: "2 days ago",
        read: true
      },
    ];

    return mockNotifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};