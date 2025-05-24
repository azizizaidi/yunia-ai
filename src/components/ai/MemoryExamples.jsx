import { useState, useEffect } from 'react';
import { useAIMemory } from '../../context/AIMemoryContext';
import useAISync from '../../hooks/useAISync';

/**
 * Comprehensive examples of AI Memory Storage functionality
 */
const MemoryExamples = () => {
  const { sharedMemory, isLoading } = useAIMemory();
  const geminiSync = useAISync('gemini');
  const rimeSync = useAISync('rime');
  
  const [selectedExample, setSelectedExample] = useState('conversation');
  const [exampleData, setExampleData] = useState({});

  // Example scenarios
  const examples = {
    conversation: {
      title: '💬 Conversation Memory',
      description: 'How AIs remember and share conversation context'
    },
    reminders: {
      title: '⏰ Reminder Sync',
      description: 'Cross-AI reminder management'
    },
    environmental: {
      title: '🌤️ Environmental Data',
      description: 'Weather, location, and traffic sharing'
    },
    preferences: {
      title: '⚙️ User Preferences',
      description: 'Personalized settings and habits'
    },
    dailyRoutine: {
      title: '📅 Daily Routine',
      description: 'Schedule and routine management'
    }
  };

  useEffect(() => {
    loadExampleData();
  }, [selectedExample]);

  const loadExampleData = () => {
    switch (selectedExample) {
      case 'conversation':
        setExampleData({
          geminiHistory: geminiSync.getHistory(3),
          rimeHistory: rimeSync.getHistory(3),
          crossContext: geminiSync.getOtherAIContext()
        });
        break;
      case 'reminders':
        setExampleData({
          activeReminders: sharedMemory.activeReminders || [],
          reminderSettings: sharedMemory.userPreferences?.reminders || {}
        });
        break;
      case 'environmental':
        setExampleData({
          weather: sharedMemory.weatherData || {},
          location: sharedMemory.currentLocation || {},
          traffic: sharedMemory.trafficData || {}
        });
        break;
      case 'preferences':
        setExampleData({
          preferences: sharedMemory.userPreferences || {},
          settings: sharedMemory.syncSettings || {}
        });
        break;
      case 'dailyRoutine':
        setExampleData({
          schedule: sharedMemory.dailySchedule || [],
          routines: sharedMemory.userPreferences?.routines || {}
        });
        break;
    }
  };

  // Example functions for each scenario
  const runConversationExample = async () => {
    // Simulate a conversation flow
    await geminiSync.recordInteraction({
      message: "What's the weather like today?",
      type: "user_question",
      context: "weather_inquiry"
    });

    setTimeout(async () => {
      await geminiSync.recordInteraction({
        message: "Based on current data, it's sunny and 28°C. Perfect for outdoor activities!",
        type: "ai_response",
        context: "weather_response"
      });

      // RimeAI gets the context and provides voice follow-up
      setTimeout(async () => {
        await rimeSync.recordInteraction({
          message: "Voice reminder: Don't forget your sunglasses for your 2 PM outdoor meeting!",
          type: "voice_reminder",
          context: "weather_based_reminder"
        });
        loadExampleData();
      }, 1000);
    }, 1000);
  };

  const runReminderExample = async () => {
    // Create reminder in GeminiAI
    await geminiSync.recordReminder({
      title: "Team Meeting",
      time: "14:00",
      type: "work",
      description: "Weekly team sync meeting",
      voiceEnabled: true,
      textEnabled: true
    });

    // RimeAI automatically gets the reminder and sets voice alert
    setTimeout(async () => {
      await rimeSync.recordInteraction({
        message: "Voice reminder set for 2 PM team meeting. I'll give you a 10-minute warning.",
        type: "voice_confirmation",
        context: "reminder_sync"
      });
      loadExampleData();
    }, 1000);
  };

  const runEnvironmentalExample = async () => {
    // Update environmental data
    await geminiSync.updateEnvironmentalData({
      weatherData: {
        temperature: 32,
        condition: "hot",
        humidity: 80,
        recommendation: "Stay hydrated"
      },
      currentLocation: {
        city: "Kuala Lumpur",
        isMoving: false,
        indoorOutdoor: "indoor"
      },
      trafficData: {
        currentRoute: "home_to_office",
        estimatedTime: 35,
        trafficLevel: "heavy"
      }
    });

    // RimeAI responds with voice briefing
    setTimeout(async () => {
      await rimeSync.recordInteraction({
        message: "Weather update: It's quite hot at 32°C. Heavy traffic on your usual route - consider leaving 10 minutes earlier.",
        type: "voice_briefing",
        context: "environmental_update"
      });
      loadExampleData();
    }, 1000);
  };

  const runPreferencesExample = async () => {
    // Update user preferences
    await geminiSync.updateContext({
      userPreferences: {
        wakeUpTime: "07:00",
        preferredMode: "voice_morning_text_work",
        notificationStyle: "gentle",
        language: "en",
        reminders: {
          workReminders: true,
          personalReminders: true,
          voiceAlerts: true,
          textNotifications: true
        },
        routines: {
          morningBriefing: true,
          eveningReview: true,
          weatherUpdates: true,
          trafficAlerts: true
        }
      }
    });

    loadExampleData();
  };

  const runDailyRoutineExample = async () => {
    // Set daily schedule
    await geminiSync.updateContext({
      dailySchedule: [
        {
          time: "07:00",
          activity: "Wake up call",
          type: "routine",
          aiResponsible: "rime",
          mode: "voice"
        },
        {
          time: "07:30",
          activity: "Morning briefing",
          type: "briefing",
          aiResponsible: "rime",
          mode: "voice"
        },
        {
          time: "08:00",
          activity: "Work mode activated",
          type: "mode_switch",
          aiResponsible: "gemini",
          mode: "text"
        },
        {
          time: "12:00",
          activity: "Lunch reminder",
          type: "reminder",
          aiResponsible: "both",
          mode: "text"
        },
        {
          time: "18:00",
          activity: "End of work day",
          type: "routine",
          aiResponsible: "rime",
          mode: "voice"
        }
      ]
    });

    loadExampleData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🧠 Memory Storage Examples</h2>
        <p className="text-base-content/70">
          Comprehensive examples of how RimeAI and GeminiAI share and sync memory
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(examples).map(([key, example]) => (
          <button
            key={key}
            className={`btn btn-sm ${selectedExample === key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedExample(key)}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Current Example Info */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h3 className="card-title justify-center">{examples[selectedExample].title}</h3>
          <p>{examples[selectedExample].description}</p>
        </div>
      </div>

      {/* Example Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Current Data */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">📊 Current Memory Data</h3>
            <div className="bg-base-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm">
                {JSON.stringify(exampleData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Panel - Actions & Results */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">🎯 Example Actions</h3>
            
            {selectedExample === 'conversation' && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
                  Simulate a conversation where user asks about weather, GeminiAI responds with data, 
                  and RimeAI provides voice follow-up reminder.
                </p>
                <button className="btn btn-primary w-full" onClick={runConversationExample}>
                  🗣️ Run Conversation Example
                </button>
                <div className="text-xs text-base-content/60">
                  <strong>Flow:</strong> User Question → GeminiAI Response → RimeAI Voice Follow-up
                </div>
              </div>
            )}

            {selectedExample === 'reminders' && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
                  Create a reminder in GeminiAI and watch how RimeAI automatically 
                  sets up voice alerts for the same reminder.
                </p>
                <button className="btn btn-primary w-full" onClick={runReminderExample}>
                  ⏰ Run Reminder Sync Example
                </button>
                <div className="text-xs text-base-content/60">
                  <strong>Flow:</strong> GeminiAI Creates Reminder → Shared Memory → RimeAI Voice Setup
                </div>
              </div>
            )}

            {selectedExample === 'environmental' && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
                  Update weather, location, and traffic data through GeminiAI and see 
                  how RimeAI uses this for voice briefings.
                </p>
                <button className="btn btn-primary w-full" onClick={runEnvironmentalExample}>
                  🌤️ Run Environmental Update
                </button>
                <div className="text-xs text-base-content/60">
                  <strong>Flow:</strong> Data Update → Shared Context → Voice Briefing
                </div>
              </div>
            )}

            {selectedExample === 'preferences' && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
                  Set user preferences that both AIs will use to personalize their responses 
                  and behavior patterns.
                </p>
                <button className="btn btn-primary w-full" onClick={runPreferencesExample}>
                  ⚙️ Update User Preferences
                </button>
                <div className="text-xs text-base-content/60">
                  <strong>Includes:</strong> Wake time, modes, notifications, language settings
                </div>
              </div>
            )}

            {selectedExample === 'dailyRoutine' && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
                  Set up a daily schedule that coordinates both AIs throughout the day, 
                  with specific responsibilities for each AI.
                </p>
                <button className="btn btn-primary w-full" onClick={runDailyRoutineExample}>
                  📅 Setup Daily Routine
                </button>
                <div className="text-xs text-base-content/60">
                  <strong>Coordination:</strong> RimeAI (Voice) + GeminiAI (Text) scheduled tasks
                </div>
              </div>
            )}

            {/* Refresh Data Button */}
            <div className="divider"></div>
            <button 
              className="btn btn-outline btn-sm w-full" 
              onClick={loadExampleData}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Memory Storage Explanation */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">💡 How Memory Storage Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🗄️ Individual AI Memory</h4>
              <p>Each AI (GeminiAI/RimeAI) has its own memory storage for conversations, interactions, and specific tasks.</p>
              <code className="text-xs">ai_memory_gemini_userId</code>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🔄 Shared Memory</h4>
              <p>Common storage for preferences, environmental data, reminders, and cross-AI coordination.</p>
              <code className="text-xs">shared_memory_userId</code>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">⚡ Real-time Sync</h4>
              <p>Changes in one AI immediately update shared memory and notify the other AI for coordinated responses.</p>
              <code className="text-xs">syncBetweenAIs()</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryExamples;
