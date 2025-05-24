# 🧠 Memory Storage Guide - RimeAI & GeminiAI Sync

## 📋 Overview

Sistem memory storage ini membolehkan RimeAI (Voice AI) dan GeminiAI (Text AI) untuk berkongsi memori, sync data, dan berkoordinasi dalam masa nyata. Sistem ini direka untuk frontend-first development dan mudah untuk migrate ke backend database kemudian.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│    GeminiAI     │    │     RimeAI      │
│  (Text Mode)    │◄──►│  (Voice Mode)   │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────┬───────────────┘
                 ▼
    ┌─────────────────────┐
    │   Shared Memory     │
    │   Context Store     │
    │  (localStorage)     │
    └─────────────────────┘
```

## 📁 File Structure

```
src/
├── services/
│   └── api.js                 # Memory storage functions
├── context/
│   └── AIMemoryContext.jsx    # Memory state management
├── hooks/
│   └── useAISync.js          # AI sync utilities
├── components/ai/
│   ├── MemoryDemo.jsx         # Interactive demo
│   ├── MemoryExamples.jsx     # Comprehensive examples
│   ├── MemoryFlowDemo.jsx     # Visual flow demo
│   └── SimpleMemoryExample.jsx # Simple examples
└── pages/
    └── MemoryExamplesPage.jsx # Main examples page
```

## 🗄️ Memory Storage Types

### 1. Individual AI Memory
```javascript
// Format: ai_memory_{aiType}_{userId}
ai_memory_gemini_1 = [
  {
    id: 1674567890123,
    timestamp: "2025-01-27T08:00:00.000Z",
    userId: 1,
    aiType: "gemini",
    type: "interaction|reminder|environmental_update",
    mode: "text|voice",
    message: "User interaction content",
    context: "additional_context_data"
  }
]
```

### 2. Shared Memory
```javascript
// Format: shared_memory_{userId}
shared_memory_1 = {
  userId: 1,
  lastUpdated: "2025-01-27T08:15:00.000Z",
  currentMode: "text|voice",
  userPreferences: {
    wakeUpTime: "07:00",
    preferredMode: "voice_morning_text_work",
    notificationStyle: "gentle",
    language: "en"
  },
  activeReminders: [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00",
      type: "meeting",
      createdBy: "gemini|rime",
      voiceEnabled: true,
      textEnabled: true
    }
  ],
  currentLocation: {
    latitude: 3.1390,
    longitude: 101.6869,
    city: "Kuala Lumpur",
    isMoving: false
  },
  weatherData: {
    temperature: 28,
    condition: "sunny",
    humidity: 65,
    lastUpdated: "2025-01-27T08:10:00.000Z"
  },
  trafficData: {
    currentRoute: "home_to_office",
    estimatedTime: 25,
    trafficLevel: "light"
  }
}
```

## 🔧 Core Functions

### Memory Storage (api.js)
```javascript
// Save AI-specific memory
saveAIMemory(aiType, memoryData)

// Get AI-specific memory
getAIMemory(aiType)

// Get shared memory
getSharedMemory()

// Update shared memory
updateSharedMemory(memoryUpdate)

// Clear memory
clearAIMemory(aiType)
```

### AI Sync Hook (useAISync.js)
```javascript
const geminiSync = useAISync('gemini');

// Record interaction
await geminiSync.recordInteraction({
  message: "Hello world",
  type: "greeting"
});

// Switch mode
await geminiSync.switchMode('voice');

// Get cross-AI context
const context = geminiSync.getOtherAIContext();

// Record reminder
await geminiSync.recordReminder({
  title: "Meeting",
  time: "14:00"
});
```

## 🎯 Usage Examples

### Example 1: Simple Conversation
```javascript
// User asks GeminiAI about weather
await geminiSync.recordInteraction({
  message: "What's the weather like?",
  type: "user_question"
});

// GeminiAI responds with weather data
await geminiSync.recordInteraction({
  message: "It's sunny, 28°C today",
  type: "ai_response"
});

// RimeAI gets context and provides voice follow-up
await rimeSync.recordInteraction({
  message: "Don't forget your sunglasses!",
  type: "voice_reminder"
});
```

### Example 2: Reminder Sync
```javascript
// Create reminder in GeminiAI
await geminiSync.recordReminder({
  title: "Team Meeting",
  time: "14:00",
  voiceEnabled: true
});

// RimeAI automatically gets the reminder
const context = rimeSync.getOtherAIContext();
// context.sharedContext.activeReminders contains the new reminder

// RimeAI confirms voice alert
await rimeSync.recordInteraction({
  message: "Voice reminder set for 2 PM meeting",
  type: "reminder_confirmation"
});
```

### Example 3: Environmental Data Sync
```javascript
// Update weather data
await geminiSync.updateEnvironmentalData({
  weatherData: {
    temperature: 32,
    condition: "hot",
    recommendation: "Stay hydrated"
  }
});

// RimeAI provides voice briefing
await rimeSync.recordInteraction({
  message: "Weather update: It's hot at 32°C. Stay hydrated!",
  type: "weather_briefing"
});
```

## 🔄 Sync Flow

### Morning Routine Flow
1. **RimeAI**: Wake-up call → Records voice interaction
2. **Shared Memory**: Updates current mode to "morning"
3. **RimeAI**: Weather briefing → Updates environmental data
4. **GeminiAI**: Gets context → Shows daily schedule
5. **Both AIs**: Have complete morning context

### Reminder Creation Flow
1. **GeminiAI**: User creates reminder → Saves to individual memory
2. **Shared Memory**: Reminder added to activeReminders
3. **RimeAI**: Gets updated context → Sets voice alert
4. **Both AIs**: Reminder active in both systems

### Mode Switching Flow
1. **Any AI**: Detects need for mode change
2. **Shared Memory**: Updates currentMode
3. **Other AI**: Gets notification of mode change
4. **Both AIs**: Adjust behavior to new mode

## 🎨 UI Components

### 1. SimpleMemoryExample
- Basic memory operations
- Easy-to-understand examples
- Real-time memory display

### 2. MemoryFlowDemo
- Visual step-by-step demonstrations
- Scenario-based examples
- Live execution logs

### 3. MemoryExamples
- Comprehensive scenarios
- Detailed memory data
- Advanced use cases

### 4. MemoryDemo
- Interactive testing
- Cross-AI communication
- Real-time sync demonstration

## 🚀 Testing

### Access Memory Examples
1. Login to application
2. Navigate to `/memory` or click "Memory Storage" in sidebar
3. Choose from 4 different example types:
   - 🎯 Simple Examples
   - 🔄 Flow Demo
   - 📚 Comprehensive
   - 🧪 Interactive Demo

### Test Scenarios
1. **Conversation Test**: Send messages and watch cross-AI responses
2. **Reminder Test**: Create reminders and see sync
3. **Mode Switch Test**: Switch between text/voice modes
4. **Environmental Test**: Update weather/location data

## 🔮 Migration to Backend

### Current (Frontend-only)
```javascript
// localStorage implementation
localStorage.setItem(`ai_memory_${aiType}_${userId}`, JSON.stringify(data));
```

### Future (Backend integration)
```javascript
// API implementation
await fetch('/api/ai-memory', {
  method: 'POST',
  body: JSON.stringify({ aiType, userId, data })
});
```

### Migration Steps
1. Replace localStorage calls with API calls in `src/services/api.js`
2. Add WebSocket for real-time sync
3. Update memory structure to match database schema
4. Add authentication headers to API calls

## 💡 Best Practices

### Memory Management
- Keep individual AI memory under 100 items
- Regular cleanup of old memories
- Efficient data structures for quick access

### Sync Optimization
- Batch updates when possible
- Use timestamps for conflict resolution
- Implement retry logic for failed syncs

### User Experience
- Show loading states during sync
- Provide feedback for memory operations
- Handle offline scenarios gracefully

## 🐛 Troubleshooting

### Common Issues
1. **Memory not syncing**: Check localStorage permissions
2. **Context not updating**: Verify useAIMemory hook usage
3. **Performance issues**: Clear old memory data

### Debug Tools
```javascript
// Check memory state
console.log('Gemini Memory:', geminiSync.getHistory());
console.log('Shared Memory:', sharedMemory);

// Clear all memory
clearAIMemory('all');
```

## 📚 References

- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**Note**: Sistem ini direka untuk development frontend. Untuk production, disarankan menggunakan backend database dengan proper authentication dan real-time sync capabilities.
