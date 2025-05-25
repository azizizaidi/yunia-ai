/**
 * Memory Core Functions
 * Handles AI memory, shared memory, and basic memory operations
 */

import { getFromStorage, setToStorage } from '../storage';

/**
 * Save conversation memory for AI sync
 * @param {string} aiType - 'gemini' or 'rime'
 * @param {Object} memoryData - Memory data to save
 */
export const saveAIMemory = (aiType, memoryData) => {
  try {
    const { getCurrentUser } = require('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const memoryKey = `ai_memory_${aiType}_${currentUser.id}`;
    const existingMemory = getFromStorage(memoryKey, []);

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

    setToStorage(memoryKey, existingMemory);
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
    const { getCurrentUser } = require('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const memoryKey = `ai_memory_${aiType}_${currentUser.id}`;
    return getFromStorage(memoryKey, []);
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
    const { getCurrentUser } = require('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const sharedKey = `shared_memory_${currentUser.id}`;
    return getFromStorage(sharedKey, {});
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
    const { getCurrentUser } = require('../auth/authCore');
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

    setToStorage(sharedKey, updatedMemory);
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
    const { getCurrentUser } = require('../auth/authCore');
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

/**
 * Get all memory types for current user
 * @returns {Promise<Object>} All memory data
 */
export const getAllMemoryData = async () => {
  try {
    const { getCurrentUser } = await import('../auth/authCore');
    const currentUser = getCurrentUser();
    if (!currentUser) return {};

    const [geminiMemory, rimeMemory, sharedMemory] = await Promise.all([
      Promise.resolve(getAIMemory('gemini')),
      Promise.resolve(getAIMemory('rime')),
      Promise.resolve(getSharedMemory())
    ]);

    return {
      gemini: geminiMemory,
      rime: rimeMemory,
      shared: sharedMemory
    };
  } catch (error) {
    console.error('Error getting all memory data:', error);
    return {};
  }
};
