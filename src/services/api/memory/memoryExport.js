/**
 * Memory Export/Import Functions
 * Handles data export and import functionality
 */

import { getUserData, setUserData } from '../storage/storageUtils';

/**
 * Export all user memory data
 * @returns {Promise<Object>} Exported data object
 */
export const exportMemoryData = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const exportData = {
      userId: currentUser.id,
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        conversations: getUserData('conversations', []),
        reminders: getUserData('user_reminders', []),
        preferences: getUserData('preferences', {}),
        environmentalData: getUserData('environmental_data', []),
        sharedMemory: getUserData('shared_memory', {}),
        aiMemoryGemini: getUserData('ai_memory_gemini', []),
        aiMemoryRime: getUserData('ai_memory_rime', [])
      }
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting memory data:', error);
    throw error;
  }
};

/**
 * Import user memory data
 * @param {Object} importData - Data to import
 * @param {boolean} overwrite - Whether to overwrite existing data
 * @returns {Promise<boolean>} Success status
 */
export const importMemoryData = async (importData, overwrite = false) => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    if (!importData || !importData.data) {
      throw new Error('Invalid import data format');
    }

    const { data } = importData;
    let successCount = 0;
    let totalCount = 0;

    // Import each data type
    const dataTypes = [
      'conversations',
      'user_reminders',
      'preferences',
      'environmental_data',
      'shared_memory',
      'ai_memory_gemini',
      'ai_memory_rime'
    ];

    for (const dataType of dataTypes) {
      totalCount++;
      
      if (data[dataType] !== undefined) {
        let dataToImport = data[dataType];

        if (!overwrite && Array.isArray(dataToImport)) {
          // Merge with existing data for arrays
          const existingData = getUserData(dataType, []);
          dataToImport = [...existingData, ...dataToImport];
        } else if (!overwrite && typeof dataToImport === 'object') {
          // Merge with existing data for objects
          const existingData = getUserData(dataType, {});
          dataToImport = { ...existingData, ...dataToImport };
        }

        const success = setUserData(dataType, dataToImport);
        if (success) {
          successCount++;
        }
      } else {
        successCount++; // Count as success if data type doesn't exist in import
      }
    }

    return successCount === totalCount;
  } catch (error) {
    console.error('Error importing memory data:', error);
    throw error;
  }
};

/**
 * Export data as downloadable JSON file
 * @returns {Promise<string>} Data URL for download
 */
export const exportAsFile = async () => {
  try {
    const exportData = await exportMemoryData();
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    return url;
  } catch (error) {
    console.error('Error creating export file:', error);
    throw error;
  }
};

/**
 * Validate import data format
 * @param {Object} importData - Data to validate
 * @returns {Object} Validation result
 */
export const validateImportData = (importData) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Check basic structure
    if (!importData || typeof importData !== 'object') {
      result.isValid = false;
      result.errors.push('Import data must be a valid object');
      return result;
    }

    if (!importData.data || typeof importData.data !== 'object') {
      result.isValid = false;
      result.errors.push('Import data must contain a "data" object');
      return result;
    }

    // Check version compatibility
    if (importData.version && importData.version !== '1.0') {
      result.warnings.push(`Import data version (${importData.version}) may not be fully compatible`);
    }

    // Validate data types
    const { data } = importData;
    const expectedArrays = ['conversations', 'user_reminders', 'environmental_data', 'ai_memory_gemini', 'ai_memory_rime'];
    const expectedObjects = ['preferences', 'shared_memory'];

    expectedArrays.forEach(key => {
      if (data[key] !== undefined && !Array.isArray(data[key])) {
        result.errors.push(`${key} should be an array`);
        result.isValid = false;
      }
    });

    expectedObjects.forEach(key => {
      if (data[key] !== undefined && (typeof data[key] !== 'object' || Array.isArray(data[key]))) {
        result.errors.push(`${key} should be an object`);
        result.isValid = false;
      }
    });

    // Check for required fields in conversations
    if (data.conversations && Array.isArray(data.conversations)) {
      data.conversations.forEach((conv, index) => {
        if (!conv.id || !conv.timestamp) {
          result.warnings.push(`Conversation at index ${index} missing required fields (id, timestamp)`);
        }
      });
    }

    // Check for required fields in reminders
    if (data.user_reminders && Array.isArray(data.user_reminders)) {
      data.user_reminders.forEach((reminder, index) => {
        if (!reminder.id || !reminder.createdAt) {
          result.warnings.push(`Reminder at index ${index} missing required fields (id, createdAt)`);
        }
      });
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Validation error: ${error.message}`);
  }

  return result;
};
