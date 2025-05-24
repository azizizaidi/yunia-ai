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
    const response = await fetch("/data/notifications.json");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Return empty array instead of hardcoded data
    return [];
  }
};

/**
 * Get user statistics for admin dashboard
 * @returns {Promise<Object>} User statistics object
 */
export const getUserStats = async () => {
  try {
    const users = await getUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.role === 'user').length;
    const adminUsers = users.filter(user => user.role === 'admin').length;

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      lastUpdated: null
    };
  }
};

/**
 * Get system settings for admin dashboard
 * @returns {Promise<Object>} System settings object
 */
export const getSystemSettings = async () => {
  try {
    const response = await fetch("/data/system-settings.json");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return {
      lastUpdated: null,
      version: "1.0.0",
      status: "unknown"
    };
  }
};

/**
 * Get chat history for the current user
 * @returns {Promise<Array>} Array of chat history
 */
export const getChatHistory = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Try to get from localStorage first
    const savedHistory = localStorage.getItem('chatHistoryList');
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }

    // If no saved history, try to fetch from API
    const response = await fetch("/data/chat-history.json");
    if (response.ok) {
      const data = await response.json();
      // Filter by current user if data has userId field
      return data.filter ? data.filter(chat => chat.userId === currentUser.id) : data;
    }

    // Return default welcome chat if no data found
    return [
      {
        id: 1,
        title: "Welcome to Yunia AI",
        preview: "Hi, I'm Yunia AI. How can I help you today?",
        date: new Date().toISOString(),
        isActive: true,
        userId: currentUser.id
      }
    ];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

/**
 * Get user profile data including avatar
 * @returns {Promise<Object>} User profile object
 */
export const getUserProfile = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return null;
    }

    // Try to get extended profile data from API
    const response = await fetch("/data/user-profiles.json");
    if (response.ok) {
      const profiles = await response.json();
      const userProfile = profiles.find(profile => profile.userId === currentUser.id);

      if (userProfile) {
        return {
          ...currentUser,
          ...userProfile
        };
      }
    }

    // Return current user with default avatar if no extended profile found
    return {
      ...currentUser,
      avatar: `https://i.pravatar.cc/32?u=${currentUser.email}`,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return getCurrentUser();
  }
};

// ===== MEMORY STORAGE FUNCTIONS =====

/**
 * Save conversation memory for AI sync
 * @param {string} aiType - 'gemini' or 'rime'
 * @param {Object} memoryData - Memory data to save
 */
export const saveAIMemory = (aiType, memoryData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const memoryKey = `ai_memory_${aiType}_${currentUser.id}`;
    const existingMemory = JSON.parse(localStorage.getItem(memoryKey) || '[]');

    const newMemory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      aiType,
      ...memoryData
    };

    existingMemory.push(newMemory);

    // Keep only last 100 memories to prevent storage overflow
    if (existingMemory.length > 100) {
      existingMemory.splice(0, existingMemory.length - 100);
    }

    localStorage.setItem(memoryKey, JSON.stringify(existingMemory));
  } catch (error) {
    console.error('Error saving AI memory:', error);
  }
};

/**
 * Get AI memory for specific AI type
 * @param {string} aiType - 'gemini' or 'rime'
 * @returns {Array} Array of memory objects
 */
export const getAIMemory = (aiType) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const memoryKey = `ai_memory_${aiType}_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(memoryKey) || '[]');
  } catch (error) {
    console.error('Error getting AI memory:', error);
    return [];
  }
};

/**
 * Get shared memory between both AIs
 * @returns {Object} Shared memory object
 */
export const getSharedMemory = () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const sharedKey = `shared_memory_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(sharedKey) || '{}');
  } catch (error) {
    console.error('Error getting shared memory:', error);
    return {};
  }
};

/**
 * Update shared memory between both AIs
 * @param {Object} memoryUpdate - Memory data to update
 */
export const updateSharedMemory = (memoryUpdate) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const sharedKey = `shared_memory_${currentUser.id}`;
    const existingMemory = getSharedMemory();

    const updatedMemory = {
      // Default Yunia AI settings
      aiName: 'Yunia',
      aiPersonality: 'friendly, helpful, and intelligent',
      preferredGreeting: 'Hi! I\'m Yunia, your personal AI assistant.',
      ...existingMemory,
      ...memoryUpdate,
      lastUpdated: new Date().toISOString(),
      userId: currentUser.id
    };

    localStorage.setItem(sharedKey, JSON.stringify(updatedMemory));
  } catch (error) {
    console.error('Error updating shared memory:', error);
  }
};

/**
 * Clear AI memory for specific type or all
 * @param {string} aiType - 'gemini', 'rime', or 'all'
 */
export const clearAIMemory = (aiType = 'all') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (aiType === 'all') {
      localStorage.removeItem(`ai_memory_gemini_${currentUser.id}`);
      localStorage.removeItem(`ai_memory_rime_${currentUser.id}`);
      localStorage.removeItem(`shared_memory_${currentUser.id}`);
    } else {
      localStorage.removeItem(`ai_memory_${aiType}_${currentUser.id}`);
    }
  } catch (error) {
    console.error('Error clearing AI memory:', error);
  }
};

// ===== REAL MEMORY MANAGEMENT FUNCTIONS =====

/**
 * Save conversation to memory with real data persistence
 * @param {Object} conversation - Conversation data
 * @returns {Promise<Object>} Saved conversation object
 */
export const saveConversation = async (conversation) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const conversationData = {
      id: Date.now(),
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      ...conversation
    };

    // Save to localStorage
    const conversationsKey = `conversations_${currentUser.id}`;
    const existingConversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
    existingConversations.push(conversationData);

    // Keep only last 50 conversations
    if (existingConversations.length > 50) {
      existingConversations.splice(0, existingConversations.length - 50);
    }

    localStorage.setItem(conversationsKey, JSON.stringify(existingConversations));

    // Also save to AI memory for sync
    saveAIMemory(conversation.aiType || 'gemini', {
      type: 'conversation',
      conversationId: conversationData.id,
      ...conversation
    });

    return conversationData;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for current user
 * @returns {Promise<Array>} Array of conversations
 */
export const getConversations = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const conversationsKey = `conversations_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(conversationsKey) || '[]');
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

/**
 * Save user preference to memory
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 * @returns {Promise<void>}
 */
export const saveUserPreference = async (key, value) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const preferencesKey = `preferences_${currentUser.id}`;
    const existingPreferences = JSON.parse(localStorage.getItem(preferencesKey) || '{}');

    existingPreferences[key] = value;
    existingPreferences.lastUpdated = new Date().toISOString();

    localStorage.setItem(preferencesKey, JSON.stringify(existingPreferences));

    // Update shared memory
    updateSharedMemory({
      userPreferences: existingPreferences
    });
  } catch (error) {
    console.error('Error saving user preference:', error);
    throw error;
  }
};

/**
 * Get user preferences
 * @returns {Promise<Object>} User preferences object
 */
export const getUserPreferences = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const preferencesKey = `preferences_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(preferencesKey) || '{}');
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

/**
 * Save reminder to memory
 * @param {Object} reminder - Reminder data
 * @returns {Promise<Object>} Saved reminder object
 */
export const saveReminder = async (reminder) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const reminderData = {
      id: Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...reminder
    };

    // Save to localStorage
    const remindersKey = `user_reminders_${currentUser.id}`;
    const existingReminders = JSON.parse(localStorage.getItem(remindersKey) || '[]');
    existingReminders.push(reminderData);

    localStorage.setItem(remindersKey, JSON.stringify(existingReminders));

    // Update shared memory
    const sharedMemory = getSharedMemory();
    const activeReminders = sharedMemory.activeReminders || [];
    activeReminders.push(reminderData);

    updateSharedMemory({
      activeReminders: activeReminders
    });

    return reminderData;
  } catch (error) {
    console.error('Error saving reminder:', error);
    throw error;
  }
};

/**
 * Get user reminders
 * @returns {Promise<Array>} Array of reminders
 */
export const getUserReminders = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const remindersKey = `user_reminders_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(remindersKey) || '[]');
  } catch (error) {
    console.error('Error getting user reminders:', error);
    return [];
  }
};

/**
 * Update reminder status
 * @param {number} reminderId - Reminder ID
 * @param {string} status - New status ('active', 'completed', 'cancelled')
 * @returns {Promise<void>}
 */
export const updateReminderStatus = async (reminderId, status) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const remindersKey = `user_reminders_${currentUser.id}`;
    const reminders = JSON.parse(localStorage.getItem(remindersKey) || '[]');

    const reminderIndex = reminders.findIndex(r => r.id === reminderId);
    if (reminderIndex !== -1) {
      reminders[reminderIndex].status = status;
      reminders[reminderIndex].updatedAt = new Date().toISOString();

      localStorage.setItem(remindersKey, JSON.stringify(reminders));

      // Update shared memory
      const activeReminders = reminders.filter(r => r.status === 'active');
      updateSharedMemory({
        activeReminders: activeReminders
      });
    }
  } catch (error) {
    console.error('Error updating reminder status:', error);
    throw error;
  }
};

/**
 * Save environmental data (weather, location, traffic)
 * @param {Object} environmentalData - Environmental data
 * @returns {Promise<void>}
 */
export const saveEnvironmentalData = async (environmentalData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const envData = {
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      ...environmentalData
    };

    // Save to localStorage
    const envKey = `environmental_data_${currentUser.id}`;
    const existingData = JSON.parse(localStorage.getItem(envKey) || '[]');
    existingData.push(envData);

    // Keep only last 24 hours of data
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentData = existingData.filter(data => new Date(data.timestamp) > oneDayAgo);

    localStorage.setItem(envKey, JSON.stringify(recentData));

    // Update shared memory with latest data
    updateSharedMemory({
      weatherData: environmentalData.weather || null,
      locationData: environmentalData.location || null,
      trafficData: environmentalData.traffic || null,
      lastEnvironmentalUpdate: envData.timestamp
    });
  } catch (error) {
    console.error('Error saving environmental data:', error);
    throw error;
  }
};

/**
 * Get environmental data history
 * @returns {Promise<Array>} Array of environmental data
 */
export const getEnvironmentalData = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const envKey = `environmental_data_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(envKey) || '[]');
  } catch (error) {
    console.error('Error getting environmental data:', error);
    return [];
  }
};

/**
 * Get memory statistics for current user
 * @returns {Promise<Object>} Memory statistics
 */
export const getMemoryStatistics = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const [conversations, reminders, preferences, envData, geminiMemory, rimeMemory] = await Promise.all([
      getConversations(),
      getUserReminders(),
      getUserPreferences(),
      getEnvironmentalData(),
      Promise.resolve(getAIMemory('gemini')),
      Promise.resolve(getAIMemory('rime'))
    ]);

    return {
      totalConversations: conversations.length,
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.status === 'active').length,
      completedReminders: reminders.filter(r => r.status === 'completed').length,
      totalPreferences: Object.keys(preferences).length,
      environmentalDataPoints: envData.length,
      geminiMemoryItems: geminiMemory.length,
      rimeMemoryItems: rimeMemory.length,
      totalMemoryItems: geminiMemory.length + rimeMemory.length,
      lastActivity: Math.max(
        conversations.length > 0 ? new Date(conversations[conversations.length - 1].timestamp).getTime() : 0,
        reminders.length > 0 ? new Date(reminders[reminders.length - 1].createdAt).getTime() : 0
      )
    };
  } catch (error) {
    console.error('Error getting memory statistics:', error);
    return {};
  }
};

/**
 * Export all user memory data
 * @returns {Promise<Object>} Complete memory export
 */
export const exportMemoryData = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const [conversations, reminders, preferences, envData, geminiMemory, rimeMemory, sharedMemory] = await Promise.all([
      getConversations(),
      getUserReminders(),
      getUserPreferences(),
      getEnvironmentalData(),
      Promise.resolve(getAIMemory('gemini')),
      Promise.resolve(getAIMemory('rime')),
      Promise.resolve(getSharedMemory())
    ]);

    return {
      exportDate: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      data: {
        conversations,
        reminders,
        preferences,
        environmentalData: envData,
        aiMemory: {
          gemini: geminiMemory,
          rime: rimeMemory
        },
        sharedMemory
      }
    };
  } catch (error) {
    console.error('Error exporting memory data:', error);
    throw error;
  }
};

/**
 * Clear all user memory data
 * @returns {Promise<void>}
 */
export const clearAllUserMemory = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    // Clear all localStorage data for user
    const keysToRemove = [
      `conversations_${currentUser.id}`,
      `user_reminders_${currentUser.id}`,
      `preferences_${currentUser.id}`,
      `environmental_data_${currentUser.id}`,
      `ai_memory_gemini_${currentUser.id}`,
      `ai_memory_rime_${currentUser.id}`,
      `shared_memory_${currentUser.id}`
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Initialize fresh shared memory
    updateSharedMemory({
      aiName: 'Yunia',
      aiPersonality: 'friendly, helpful, and intelligent',
      preferredGreeting: 'Hi! I\'m Yunia, your personal AI assistant.',
      clearedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing all user memory:', error);
    throw error;
  }
};