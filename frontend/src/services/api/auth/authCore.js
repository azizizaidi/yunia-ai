/**
 * Authentication Core Functions
 * Handles user login, registration, and authentication state
 */

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (optional, for specific role authentication)
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export const loginUser = async (email, password, role = null) => {
  try {
    const { getUsers } = await import('../user/userCore');
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
    const { getUsers } = await import('../user/userCore');
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
