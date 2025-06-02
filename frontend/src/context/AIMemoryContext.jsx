import { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveAIMemory, 
  getAIMemory, 
  getSharedMemory, 
  updateSharedMemory,
  clearAIMemory 
} from '../services/api';

const AIMemoryContext = createContext();

/**
 * AI Memory Provider for managing memory state across RimeAI and GeminiAI
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components
 */
export const AIMemoryProvider = ({ children }) => {
  // Memory states
  const [geminiMemory, setGeminiMemory] = useState([]);
  const [rimeMemory, setRimeMemory] = useState([]);
  const [sharedMemory, setSharedMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load memory on component mount
  useEffect(() => {
    loadAllMemory();
  }, []);

  /**
   * Load all memory data from storage
   */
  const loadAllMemory = async () => {
    try {
      setIsLoading(true);
      
      const [gemini, rime, shared] = await Promise.all([
        getAIMemory('gemini'),
        getAIMemory('rime'),
        getSharedMemory()
      ]);

      setGeminiMemory(gemini);
      setRimeMemory(rime);
      setSharedMemory(shared);
    } catch (error) {
      console.error('Error loading AI memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add memory for specific AI type
   * @param {string} aiType - 'gemini' or 'rime'
   * @param {Object} memoryData - Memory data to add
   */
  const addMemory = async (aiType, memoryData) => {
    try {
      // Save to storage
      saveAIMemory(aiType, memoryData);
      
      // Update local state
      if (aiType === 'gemini') {
        const updatedMemory = await getAIMemory('gemini');
        setGeminiMemory(updatedMemory);
      } else if (aiType === 'rime') {
        const updatedMemory = await getAIMemory('rime');
        setRimeMemory(updatedMemory);
      }

      // Update shared memory with latest interaction
      const sharedUpdate = {
        lastInteraction: {
          aiType,
          timestamp: new Date().toISOString(),
          summary: memoryData.summary || memoryData.message || 'Interaction recorded'
        }
      };
      
      updateSharedMemory(sharedUpdate);
      setSharedMemory(await getSharedMemory());
      
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  /**
   * Update shared context between AIs
   * @param {Object} contextData - Context data to share
   */
  const updateContext = async (contextData) => {
    try {
      updateSharedMemory(contextData);
      setSharedMemory(await getSharedMemory());
    } catch (error) {
      console.error('Error updating context:', error);
    }
  };

  /**
   * Get conversation history for specific AI
   * @param {string} aiType - 'gemini' or 'rime'
   * @param {number} limit - Number of recent memories to get
   * @returns {Array} Array of memory objects
   */
  const getConversationHistory = (aiType, limit = 10) => {
    const memory = aiType === 'gemini' ? geminiMemory : rimeMemory;
    return memory.slice(-limit).reverse(); // Get latest first
  };

  /**
   * Get cross-AI context for sync
   * @param {string} currentAI - Current AI type requesting context
   * @returns {Object} Context object with relevant information
   */
  const getCrossAIContext = (currentAI) => {
    const otherAI = currentAI === 'gemini' ? 'rime' : 'gemini';
    const otherMemory = currentAI === 'gemini' ? rimeMemory : geminiMemory;
    
    return {
      sharedContext: sharedMemory,
      recentOtherAIActivity: otherMemory.slice(-3), // Last 3 interactions
      currentMode: sharedMemory.currentMode || 'text',
      userPreferences: sharedMemory.userPreferences || {},
      activeReminders: sharedMemory.activeReminders || [],
      currentLocation: sharedMemory.currentLocation || null,
      weatherData: sharedMemory.weatherData || null,
      trafficData: sharedMemory.trafficData || null
    };
  };

  /**
   * Clear memory for specific AI or all
   * @param {string} aiType - 'gemini', 'rime', or 'all'
   */
  const clearMemory = async (aiType = 'all') => {
    try {
      clearAIMemory(aiType);
      
      if (aiType === 'all' || aiType === 'gemini') {
        setGeminiMemory([]);
      }
      if (aiType === 'all' || aiType === 'rime') {
        setRimeMemory([]);
      }
      if (aiType === 'all') {
        setSharedMemory({});
      }
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  };

  /**
   * Sync data between AIs (for real-time updates)
   * @param {string} sourceAI - AI that initiated the sync
   * @param {Object} syncData - Data to sync
   */
  const syncBetweenAIs = async (sourceAI, syncData) => {
    try {
      const syncUpdate = {
        lastSync: new Date().toISOString(),
        syncSource: sourceAI,
        syncData: syncData
      };
      
      updateSharedMemory(syncUpdate);
      setSharedMemory(await getSharedMemory());
      
      // Trigger re-load of memory for both AIs
      await loadAllMemory();
    } catch (error) {
      console.error('Error syncing between AIs:', error);
    }
  };

  const value = {
    // State
    geminiMemory,
    rimeMemory,
    sharedMemory,
    isLoading,
    
    // Actions
    addMemory,
    updateContext,
    getConversationHistory,
    getCrossAIContext,
    clearMemory,
    syncBetweenAIs,
    loadAllMemory
  };

  return (
    <AIMemoryContext.Provider value={value}>
      {children}
    </AIMemoryContext.Provider>
  );
};

/**
 * Custom hook to use AI Memory context
 * @returns {Object} AI Memory context value
 */
export const useAIMemory = () => {
  const context = useContext(AIMemoryContext);
  if (!context) {
    throw new Error('useAIMemory must be used within an AIMemoryProvider');
  }
  return context;
};

export default AIMemoryContext;
