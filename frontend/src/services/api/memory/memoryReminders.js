/**
 * Memory Reminders Functions
 * Handles reminder management and storage
 */

import { getUserData, setUserData, appendToStorageArray, updateStorageArrayItem, removeStorageArrayItem } from '../storage/storageUtils';

/**
 * Save reminder to memory
 * @param {Object} reminder - Reminder data
 * @returns {Promise<Object>} Saved reminder object
 */
export const saveReminder = async (reminder) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const reminderData = {
      id: Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...reminder
    };

    const success = appendToStorageArray('user_reminders', reminderData, 200);
    
    if (success) {
      return reminderData;
    } else {
      throw new Error('Failed to save reminder');
    }
  } catch (error) {
    console.error('Error saving reminder:', error);
    throw error;
  }
};

/**
 * Get all reminders for current user
 * @returns {Promise<Array>} Array of reminders
 */
export const getReminders = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return getUserData('user_reminders', []);
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

/**
 * Update reminder status
 * @param {number} reminderId - Reminder ID
 * @param {string} status - New status ('active', 'completed', 'cancelled')
 * @returns {Promise<boolean>} Success status
 */
export const updateReminderStatus = async (reminderId, status) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (status === 'completed') {
      updateData.completedAt = new Date().toISOString();
    }

    return updateStorageArrayItem('user_reminders', reminderId, updateData);
  } catch (error) {
    console.error('Error updating reminder status:', error);
    return false;
  }
};

/**
 * Delete reminder
 * @param {number} reminderId - Reminder ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteReminder = async (reminderId) => {
  try {
    return removeStorageArrayItem('user_reminders', reminderId);
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};
