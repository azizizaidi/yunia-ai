/**
 * User Statistics Functions
 * Handles user statistics and analytics
 */

/**
 * Get user statistics for admin dashboard
 * @returns {Promise<Object>} User statistics object
 */
export const getUserStats = async () => {
  try {
    const { getUsers } = await import('./userCore');
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
 * Get user activity statistics
 * @param {number} userId - User ID (optional, uses current user if not provided)
 * @returns {Promise<Object>} User activity statistics
 */
export const getUserActivityStats = async (userId = null) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const user = userId ? { id: userId } : getCurrentUser();
    if (!user) return {};

    // Get user's activity data from localStorage
    const profileKey = `profile_${user.id}`;
    const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
    
    const conversationsKey = `conversations_${user.id}`;
    const conversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
    
    const remindersKey = `user_reminders_${user.id}`;
    const reminders = JSON.parse(localStorage.getItem(remindersKey) || '[]');

    // Calculate statistics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentConversations = conversations.filter(conv => 
      new Date(conv.timestamp) > oneWeekAgo
    );

    const recentReminders = reminders.filter(reminder => 
      new Date(reminder.createdAt) > oneWeekAgo
    );

    return {
      totalConversations: conversations.length,
      recentConversations: recentConversations.length,
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.status === 'active').length,
      completedReminders: reminders.filter(r => r.status === 'completed').length,
      recentReminders: recentReminders.length,
      profileStats: profile.stats || {},
      joinDate: profile.joinDate || null,
      lastActive: profile.lastActive || null
    };
  } catch (error) {
    console.error("Error getting user activity stats:", error);
    return {};
  }
};

/**
 * Get user engagement metrics
 * @returns {Promise<Object>} User engagement metrics
 */
export const getUserEngagementMetrics = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const activityStats = await getUserActivityStats();
    const now = new Date();
    const joinDate = activityStats.joinDate ? new Date(activityStats.joinDate) : now;
    const daysSinceJoin = Math.max(1, Math.ceil((now - joinDate) / (1000 * 60 * 60 * 24)));

    return {
      conversationsPerDay: (activityStats.totalConversations / daysSinceJoin).toFixed(2),
      remindersPerDay: (activityStats.totalReminders / daysSinceJoin).toFixed(2),
      completionRate: activityStats.totalReminders > 0 
        ? ((activityStats.completedReminders / activityStats.totalReminders) * 100).toFixed(1)
        : 0,
      engagementScore: calculateEngagementScore(activityStats),
      daysSinceJoin
    };
  } catch (error) {
    console.error("Error getting user engagement metrics:", error);
    return {};
  }
};

/**
 * Calculate user engagement score
 * @param {Object} stats - User activity statistics
 * @returns {number} Engagement score (0-100)
 */
const calculateEngagementScore = (stats) => {
  try {
    let score = 0;

    // Conversations contribute 40% to engagement
    if (stats.totalConversations > 0) {
      score += Math.min(40, stats.totalConversations * 2);
    }

    // Reminders contribute 30% to engagement
    if (stats.totalReminders > 0) {
      score += Math.min(30, stats.totalReminders * 3);
    }

    // Completion rate contributes 20% to engagement
    if (stats.totalReminders > 0) {
      const completionRate = (stats.completedReminders / stats.totalReminders) * 100;
      score += (completionRate * 0.2);
    }

    // Recent activity contributes 10% to engagement
    if (stats.recentConversations > 0 || stats.recentReminders > 0) {
      score += Math.min(10, (stats.recentConversations + stats.recentReminders) * 2);
    }

    return Math.min(100, Math.round(score));
  } catch (error) {
    console.error("Error calculating engagement score:", error);
    return 0;
  }
};
