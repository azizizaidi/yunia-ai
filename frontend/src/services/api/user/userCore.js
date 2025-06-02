/**
 * User Core Functions
 * Handles basic user data management
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
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserById = async (userId) => {
  try {
    const users = await getUsers();
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserByEmail = async (email) => {
  try {
    const users = await getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

/**
 * Update user data
 * @param {number} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = async (userId, updateData) => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // If this is the current user, update the user session
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem("user", JSON.stringify(users[userIndex]));
    }

    return users[userIndex];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
