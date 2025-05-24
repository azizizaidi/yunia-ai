import { useState, useEffect } from 'react';
import { useAIMemory } from '../../context/AIMemoryContext';
import useAISync from '../../hooks/useAISync';

/**
 * Simple, easy-to-understand memory storage example
 */
const SimpleMemoryExample = () => {
  const { sharedMemory } = useAIMemory();
  const geminiSync = useAISync('gemini');
  const rimeSync = useAISync('rime');
  
  const [userInput, setUserInput] = useState('');
  const [memoryView, setMemoryView] = useState('simple');

  // Simple memory data for display
  const [simpleMemory, setSimpleMemory] = useState({
    conversations: [],
    reminders: [],
    preferences: {},
    lastActivity: null
  });

  useEffect(() => {
    updateSimpleMemory();
  }, [sharedMemory]);

  const updateSimpleMemory = () => {
    setSimpleMemory({
      conversations: [
        ...geminiSync.getHistory(3).map(item => ({ ...item, source: 'GeminiAI' })),
        ...rimeSync.getHistory(3).map(item => ({ ...item, source: 'RimeAI' }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
      reminders: sharedMemory.activeReminders || [],
      preferences: sharedMemory.userPreferences || {},
      lastActivity: sharedMemory.lastInteraction || null
    });
  };

  // Example 1: Simple conversation
  const handleSimpleChat = async () => {
    if (!userInput.trim()) return;

    // User message to GeminiAI
    await geminiSync.recordInteraction({
      message: userInput,
      type: 'user_message',
      context: 'simple_chat'
    });

    // GeminiAI response
    setTimeout(async () => {
      const response = `I understand you said: "${userInput}". How can I help you with that?`;
      await geminiSync.recordInteraction({
        message: response,
        type: 'ai_response',
        context: 'simple_chat'
      });

      // RimeAI gets the context and may respond
      if (userInput.toLowerCase().includes('voice') || userInput.toLowerCase().includes('speak')) {
        setTimeout(async () => {
          await rimeSync.recordInteraction({
            message: `I can help with voice features! Let me know what you need.`,
            type: 'voice_response',
            context: 'voice_assistance'
          });
          updateSimpleMemory();
        }, 1000);
      } else {
        updateSimpleMemory();
      }
    }, 1000);

    setUserInput('');
  };

  // Example 2: Set a reminder
  const handleSetReminder = async () => {
    const reminderText = prompt('What would you like to be reminded about?');
    const reminderTime = prompt('What time? (e.g., 14:30)');
    
    if (reminderText && reminderTime) {
      // GeminiAI creates the reminder
      await geminiSync.recordReminder({
        title: reminderText,
        time: reminderTime,
        type: 'user_created',
        description: `Reminder set via simple example`
      });

      // RimeAI acknowledges
      setTimeout(async () => {
        await rimeSync.recordInteraction({
          message: `Voice reminder set for ${reminderTime}: ${reminderText}`,
          type: 'reminder_confirmation',
          context: 'reminder_sync'
        });
        updateSimpleMemory();
      }, 500);
    }
  };

  // Example 3: Update preferences
  const handleUpdatePreferences = async () => {
    const newPrefs = {
      favoriteTime: '09:00',
      preferredMode: 'mixed',
      notificationStyle: 'friendly',
      lastUpdated: new Date().toISOString()
    };

    await geminiSync.updateContext({
      userPreferences: {
        ...sharedMemory.userPreferences,
        ...newPrefs
      }
    });

    updateSimpleMemory();
  };

  // Example 4: Environmental update
  const handleEnvironmentalUpdate = async () => {
    const weatherData = {
      temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 30) + 60 // 60-90%
    };

    await geminiSync.updateEnvironmentalData({
      weatherData,
      currentLocation: {
        city: 'Kuala Lumpur',
        isMoving: false
      }
    });

    // RimeAI provides voice update
    setTimeout(async () => {
      await rimeSync.recordInteraction({
        message: `Weather update: ${weatherData.condition}, ${weatherData.temperature}°C`,
        type: 'weather_briefing',
        context: 'environmental_update'
      });
      updateSimpleMemory();
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎯 Simple Memory Examples</h2>
        <p className="text-base-content/70">
          Easy-to-understand examples of how AI memory works
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <button
          className={`btn btn-sm ${memoryView === 'simple' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMemoryView('simple')}
        >
          📋 Simple View
        </button>
        <button
          className={`btn btn-sm ${memoryView === 'detailed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMemoryView('detailed')}
        >
          🔍 Detailed View
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="card-body p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💬 Chat Example</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-sm w-full"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSimpleChat()}
              />
              <button
                className="btn btn-blue btn-sm w-full"
                onClick={handleSimpleChat}
                disabled={!userInput.trim()}
              >
                Send to GeminiAI
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="card-body p-4">
            <h3 className="font-semibold text-green-800 mb-2">⏰ Reminder Example</h3>
            <p className="text-sm text-green-700 mb-2">
              Create a reminder that both AIs will remember
            </p>
            <button
              className="btn btn-green btn-sm w-full"
              onClick={handleSetReminder}
            >
              Set Reminder
            </button>
          </div>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <div className="card-body p-4">
            <h3 className="font-semibold text-purple-800 mb-2">⚙️ Preferences Example</h3>
            <p className="text-sm text-purple-700 mb-2">
              Update settings that both AIs will use
            </p>
            <button
              className="btn btn-purple btn-sm w-full"
              onClick={handleUpdatePreferences}
            >
              Update Preferences
            </button>
          </div>
        </div>

        <div className="card bg-orange-50 border border-orange-200">
          <div className="card-body p-4">
            <h3 className="font-semibold text-orange-800 mb-2">🌤️ Weather Example</h3>
            <p className="text-sm text-orange-700 mb-2">
              Update environmental data for both AIs
            </p>
            <button
              className="btn btn-orange btn-sm w-full"
              onClick={handleEnvironmentalUpdate}
            >
              Update Weather
            </button>
          </div>
        </div>
      </div>

      {/* Memory Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Current Memory */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">🧠 Current Memory</h3>
            
            {memoryView === 'simple' ? (
              <div className="space-y-4">
                {/* Recent Conversations */}
                <div>
                  <h4 className="font-semibold mb-2">💬 Recent Conversations</h4>
                  {simpleMemory.conversations.length === 0 ? (
                    <p className="text-sm text-base-content/50">No conversations yet</p>
                  ) : (
                    <div className="space-y-2">
                      {simpleMemory.conversations.slice(0, 3).map((conv, index) => (
                        <div key={index} className="bg-base-200 p-2 rounded text-sm">
                          <div className="font-medium">{conv.source}</div>
                          <div className="text-base-content/70">{conv.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Reminders */}
                <div>
                  <h4 className="font-semibold mb-2">⏰ Active Reminders</h4>
                  {simpleMemory.reminders.length === 0 ? (
                    <p className="text-sm text-base-content/50">No reminders set</p>
                  ) : (
                    <div className="space-y-1">
                      {simpleMemory.reminders.map((reminder, index) => (
                        <div key={index} className="bg-base-200 p-2 rounded text-sm">
                          <strong>{reminder.time}</strong> - {reminder.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Preferences */}
                <div>
                  <h4 className="font-semibold mb-2">⚙️ Preferences</h4>
                  {Object.keys(simpleMemory.preferences).length === 0 ? (
                    <p className="text-sm text-base-content/50">No preferences set</p>
                  ) : (
                    <div className="text-sm space-y-1">
                      {Object.entries(simpleMemory.preferences).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-base-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs">
                  {JSON.stringify(simpleMemory, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - How It Works */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">❓ How Memory Works</h3>
            
            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800">1. Individual Memory</h4>
                <p className="text-blue-700">
                  Each AI (GeminiAI & RimeAI) has its own memory for conversations and tasks.
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800">2. Shared Memory</h4>
                <p className="text-green-700">
                  Common storage for reminders, preferences, and environmental data.
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800">3. Real-time Sync</h4>
                <p className="text-purple-700">
                  When one AI updates memory, the other AI immediately knows about it.
                </p>
              </div>

              <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800">4. Cross-AI Context</h4>
                <p className="text-orange-700">
                  AIs can see what the other AI is doing and respond accordingly.
                </p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="text-center">
              <h4 className="font-semibold mb-2">🔄 Memory Flow</h4>
              <div className="text-xs space-y-1">
                <div>User Action → AI Memory → Shared Memory</div>
                <div>↓</div>
                <div>Other AI Gets Context → Responds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-4">
          <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>GeminiAI: {geminiSync.currentMode} mode</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>RimeAI: {rimeSync.currentMode} mode</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span>Shared: {Object.keys(sharedMemory).length} items</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <span>Last sync: {sharedMemory.lastSync ? 
                new Date(sharedMemory.lastSync).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMemoryExample;
