/**
 * User Profile Functions
 * Handles user profile management, avatar, password changes, etc.
 */

/**
 * Get user profile data including avatar
 * @returns {Promise<Object>} User profile object
 */
export const getUserProfile = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return null;
    }

    // First, try to get profile data from localStorage
    const profileKey = `profile_${currentUser.id}`;
    const localProfile = localStorage.getItem(profileKey);

    if (localProfile) {
      const parsedProfile = JSON.parse(localProfile);

      // Merge current user data with profile data, prioritizing user avatar if it exists
      const mergedProfile = {
        ...parsedProfile,
        ...currentUser, // This ensures currentUser data takes priority
        stats: parsedProfile.stats || {
          totalChats: 0,
          totalTasks: 0,
          completedTasks: 0
        }
      };

      return mergedProfile;
    }

    // If no local profile, try to get from API and save to localStorage
    try {
      const response = await fetch("/data/user-profiles.json");
      if (response.ok) {
        const profiles = await response.json();
        const userProfile = profiles.find(profile => profile.userId === currentUser.id);

        if (userProfile) {
          // Save to localStorage for future use, but prioritize current user data
          const mergedProfile = {
            ...userProfile,
            ...currentUser
          };
          localStorage.setItem(profileKey, JSON.stringify(mergedProfile));
          return mergedProfile;
        }
      }
    } catch (apiError) {
      console.warn("Could not fetch profile from API:", apiError);
    }

    // Create default profile only if user doesn't have an avatar
    const defaultProfile = {
      userId: currentUser.id,
      avatar: currentUser.avatar || `https://i.pravatar.cc/96?u=${currentUser.email}`,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      stats: {
        totalChats: 0,
        totalTasks: 0,
        completedTasks: 0
      }
    };

    // Merge with current user data, prioritizing current user
    const finalProfile = {
      ...defaultProfile,
      ...currentUser
    };

    localStorage.setItem(profileKey, JSON.stringify(finalProfile));

    return finalProfile;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user data in localStorage - MAIN USER OBJECT
    const updatedUser = {
      ...currentUser,
      ...profileData,
      lastActive: new Date().toISOString()
    };

    // Update the main user key (this is what getCurrentUser() reads from)
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Also save extended profile data
    const profileKey = `profile_${currentUser.id}`;
    const existingProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');
    const updatedProfile = {
      ...existingProfile,
      userId: currentUser.id,
      ...profileData,
      lastActive: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

    // Dispatch custom event to notify components of profile update
    window.dispatchEvent(new CustomEvent('userProfileUpdated', {
      detail: { user: updatedUser, profile: updatedProfile }
    }));

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would verify the current password
    // For demo purposes, we'll just simulate success
    if (currentPassword !== currentUser.password) {
      throw new Error("Current password is incorrect");
    }

    // Update password in localStorage
    const updatedUser = {
      ...currentUser,
      password: newPassword,
      lastActive: new Date().toISOString()
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Update user profile stats (chats, tasks, etc.)
 * @param {Object} statsUpdate - Stats to update
 * @returns {Promise<Object>} Updated stats
 */
export const updateUserStats = async (statsUpdate) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const profileKey = `profile_${currentUser.id}`;
    const existingProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');

    const updatedStats = {
      ...existingProfile.stats,
      ...statsUpdate
    };

    const updatedProfile = {
      ...existingProfile,
      stats: updatedStats,
      lastActive: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));

    return updatedStats;
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};

/**
 * Get all profile data from localStorage
 * @returns {Object} Complete profile data
 */
export const getCompleteProfileData = () => {
  try {
    const { getCurrentUser } = require('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const profileKey = `profile_${currentUser.id}`;
    const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

    return {
      user: currentUser,
      profile: profile,
      preferences: JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`) || '{}'),
      sharedMemory: JSON.parse(localStorage.getItem(`shared_memory_${currentUser.id}`) || '{}')
    };
  } catch (error) {
    console.error("Error getting complete profile data:", error);
    return null;
  }
};
