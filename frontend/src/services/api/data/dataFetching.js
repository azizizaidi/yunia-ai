/**
 * Data Fetching Functions
 * Handles basic data fetching for tasks, reminders, notifications, etc.
 */

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
    const { getCurrentUser } = await import('../auth/authCore');
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
 * Generic API fetch function with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} API response data
 */
export const fetchApiData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Get data with caching support
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch data
 * @param {number} cacheTime - Cache time in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} Cached or fresh data
 */
export const getCachedData = async (key, fetchFunction, cacheTime = 5 * 60 * 1000) => {
  try {
    const cacheKey = `cache_${key}`;
    const timestampKey = `cache_timestamp_${key}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    const timestamp = localStorage.getItem(timestampKey);
    
    if (cachedData && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < cacheTime) {
        return JSON.parse(cachedData);
      }
    }

    // Fetch fresh data
    const freshData = await fetchFunction();
    
    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify(freshData));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    return freshData;
  } catch (error) {
    console.error(`Error getting cached data for ${key}:`, error);
    throw error;
  }
};
