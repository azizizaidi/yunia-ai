import { useState, useEffect, useCallback } from 'react';
import { useAIMemory } from '../context/AIMemoryContext';

/**
 * Custom hook for AI synchronization between RimeAI and GeminiAI
 * @param {string} aiType - 'gemini' or 'rime'
 * @returns {Object} AI sync utilities and state
 */
const useAISync = (aiType) => {
  const {
    addMemory,
    updateContext,
    getConversationHistory,
    getCrossAIContext,
    syncBetweenAIs,
    sharedMemory
  } = useAIMemory();

  const [currentMode, setCurrentMode] = useState('text'); // 'text' or 'voice'
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Update mode when shared memory changes
  useEffect(() => {
    if (sharedMemory.currentMode) {
      setCurrentMode(sharedMemory.currentMode);
    }
    if (sharedMemory.lastSync) {
      setLastSyncTime(new Date(sharedMemory.lastSync));
    }
  }, [sharedMemory]);

  /**
   * Record interaction and sync with other AI
   * @param {Object} interaction - Interaction data
   */
  const recordInteraction = useCallback(async (interaction) => {
    try {
      setIsProcessing(true);
      
      // Add memory for current AI
      await addMemory(aiType, {
        type: 'interaction',
        mode: currentMode,
        ...interaction
      });

      // Sync with other AI
      await syncBetweenAIs(aiType, {
        type: 'interaction_sync',
        interaction,
        mode: currentMode
      });

    } catch (error) {
      console.error('Error recording interaction:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [aiType, currentMode, addMemory, syncBetweenAIs]);

  /**
   * Switch between text and voice modes
   * @param {string} newMode - 'text' or 'voice'
   */
  const switchMode = useCallback(async (newMode) => {
    try {
      setCurrentMode(newMode);
      
      // Update shared context
      await updateContext({
        currentMode: newMode,
        modeChangedBy: aiType,
        modeChangedAt: new Date().toISOString()
      });

      // Record mode change
      await recordInteraction({
        message: `Switched to ${newMode} mode`,
        type: 'mode_change',
        newMode
      });

    } catch (error) {
      console.error('Error switching mode:', error);
    }
  }, [aiType, updateContext, recordInteraction]);

  /**
   * Get context from other AI for informed responses
   * @returns {Object} Cross-AI context
   */
  const getOtherAIContext = useCallback(() => {
    return getCrossAIContext(aiType);
  }, [aiType, getCrossAIContext]);

  /**
   * Record reminder for cross-AI sync
   * @param {Object} reminder - Reminder data
   */
  const recordReminder = useCallback(async (reminder) => {
    try {
      // Add to memory
      await addMemory(aiType, {
        type: 'reminder',
        ...reminder
      });

      // Update shared reminders
      const currentReminders = sharedMemory.activeReminders || [];
      const updatedReminders = [...currentReminders, {
        id: Date.now(),
        createdBy: aiType,
        createdAt: new Date().toISOString(),
        ...reminder
      }];

      await updateContext({
        activeReminders: updatedReminders
      });

    } catch (error) {
      console.error('Error recording reminder:', error);
    }
  }, [aiType, addMemory, updateContext, sharedMemory.activeReminders]);

  /**
   * Update environmental data (weather, traffic, location)
   * @param {Object} envData - Environmental data
   */
  const updateEnvironmentalData = useCallback(async (envData) => {
    try {
      // Record in memory
      await addMemory(aiType, {
        type: 'environmental_update',
        ...envData
      });

      // Update shared context
      await updateContext({
        ...envData,
        lastEnvironmentalUpdate: new Date().toISOString(),
        updatedBy: aiType
      });

    } catch (error) {
      console.error('Error updating environmental data:', error);
    }
  }, [aiType, addMemory, updateContext]);

  /**
   * Get conversation history with context
   * @param {number} limit - Number of messages to retrieve
   * @returns {Array} Conversation history
   */
  const getHistory = useCallback((limit = 10) => {
    return getConversationHistory(aiType, limit);
  }, [aiType, getConversationHistory]);

  /**
   * Check if other AI is active
   * @returns {boolean} True if other AI has recent activity
   */
  const isOtherAIActive = useCallback(() => {
    const otherAIContext = getCrossAIContext(aiType);
    if (!otherAIContext.recentOtherAIActivity.length) return false;
    
    const lastActivity = otherAIContext.recentOtherAIActivity[0];
    const lastActivityTime = new Date(lastActivity.timestamp);
    const now = new Date();
    
    // Consider active if last activity was within 5 minutes
    return (now - lastActivityTime) < 5 * 60 * 1000;
  }, [aiType, getCrossAIContext]);

  /**
   * Get appropriate response mode based on context
   * @returns {string} Recommended response mode
   */
  const getRecommendedMode = useCallback(() => {
    const context = getCrossAIContext(aiType);
    
    // If user is driving or in motion, prefer voice
    if (context.currentLocation?.isMoving) {
      return 'voice';
    }
    
    // If it's quiet hours, prefer text
    const hour = new Date().getHours();
    if (hour < 7 || hour > 22) {
      return 'text';
    }
    
    // Default to current mode
    return currentMode;
  }, [aiType, currentMode, getCrossAIContext]);

  return {
    // State
    currentMode,
    isProcessing,
    lastSyncTime,
    
    // Actions
    recordInteraction,
    switchMode,
    recordReminder,
    updateEnvironmentalData,
    
    // Getters
    getOtherAIContext,
    getHistory,
    isOtherAIActive,
    getRecommendedMode,
    
    // Utilities
    isGeminiMode: aiType === 'gemini',
    isRimeMode: aiType === 'rime',
    isTextMode: currentMode === 'text',
    isVoiceMode: currentMode === 'voice'
  };
};

export default useAISync;
