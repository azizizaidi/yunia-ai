import { useState, useEffect } from 'react';
import { useAIMemory } from '../../context/AIMemoryContext';
import useAISync from '../../hooks/useAISync';

/**
 * Demo component to showcase AI Memory and Sync functionality
 */
const MemoryDemo = () => {
  const { sharedMemory, isLoading } = useAIMemory();
  const geminiSync = useAISync('gemini');
  const rimeSync = useAISync('rime');
  
  const [activeAI, setActiveAI] = useState('gemini');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  // Update history when AI changes
  useEffect(() => {
    const currentSync = activeAI === 'gemini' ? geminiSync : rimeSync;
    setHistory(currentSync.getHistory(5));
  }, [activeAI, geminiSync, rimeSync]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const currentSync = activeAI === 'gemini' ? geminiSync : rimeSync;
    
    await currentSync.recordInteraction({
      message: message.trim(),
      type: 'user_message',
      timestamp: new Date().toISOString()
    });

    // Simulate AI response
    setTimeout(async () => {
      const response = activeAI === 'gemini' 
        ? `GeminiAI: I understand "${message}". Let me help you with that.`
        : `RimeAI: *Voice response* I heard "${message}". Processing your request.`;
        
      await currentSync.recordInteraction({
        message: response,
        type: 'ai_response',
        timestamp: new Date().toISOString()
      });
      
      // Update history
      setHistory(currentSync.getHistory(5));
    }, 1000);

    setMessage('');
  };

  const handleModeSwitch = async () => {
    const currentSync = activeAI === 'gemini' ? geminiSync : rimeSync;
    const newMode = currentSync.currentMode === 'text' ? 'voice' : 'text';
    await currentSync.switchMode(newMode);
  };

  const handleAISwitch = (newAI) => {
    setActiveAI(newAI);
  };

  const handleAddReminder = async () => {
    const currentSync = activeAI === 'gemini' ? geminiSync : rimeSync;
    await currentSync.recordReminder({
      title: 'Demo Reminder',
      time: '15:00',
      message: 'This is a test reminder from ' + activeAI,
      type: 'demo'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const currentSync = activeAI === 'gemini' ? geminiSync : rimeSync;
  const otherAI = activeAI === 'gemini' ? 'rime' : 'gemini';
  const otherSync = activeAI === 'gemini' ? rimeSync : geminiSync;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🧠 AI Memory & Sync Demo</h2>
        <p className="text-base-content/70">
          Test the synchronization between GeminiAI (Text) and RimeAI (Voice)
        </p>
      </div>

      {/* AI Selector */}
      <div className="flex justify-center gap-4">
        <button
          className={`btn ${activeAI === 'gemini' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleAISwitch('gemini')}
        >
          💬 GeminiAI (Text)
        </button>
        <button
          className={`btn ${activeAI === 'rime' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleAISwitch('rime')}
        >
          🎤 RimeAI (Voice)
        </button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-200 p-4">
          <h3 className="font-semibold mb-2">Current AI</h3>
          <p className="text-lg">{activeAI === 'gemini' ? '💬 GeminiAI' : '🎤 RimeAI'}</p>
          <p className="text-sm text-base-content/70">
            Mode: {currentSync.currentMode}
          </p>
        </div>
        
        <div className="card bg-base-200 p-4">
          <h3 className="font-semibold mb-2">Other AI Status</h3>
          <p className="text-sm">
            {otherSync.isOtherAIActive() ? '🟢 Active' : '🔴 Inactive'}
          </p>
          <p className="text-sm text-base-content/70">
            Last sync: {sharedMemory.lastSync ? 
              new Date(sharedMemory.lastSync).toLocaleTimeString() : 'Never'}
          </p>
        </div>

        <div className="card bg-base-200 p-4">
          <h3 className="font-semibold mb-2">Shared Memory</h3>
          <p className="text-sm">
            Reminders: {sharedMemory.activeReminders?.length || 0}
          </p>
          <p className="text-sm text-base-content/70">
            Mode: {sharedMemory.currentMode || 'text'}
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">
            {activeAI === 'gemini' ? '💬 Text Chat' : '🎤 Voice Interface'}
          </h3>
          
          {/* Message History */}
          <div className="bg-base-200 rounded-lg p-4 h-64 overflow-y-auto mb-4">
            {history.length === 0 ? (
              <p className="text-center text-base-content/50">No conversation history</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="mb-2 p-2 bg-base-100 rounded">
                  <div className="text-xs text-base-content/70 mb-1">
                    {new Date(item.timestamp).toLocaleTimeString()} - {item.type}
                  </div>
                  <div className="text-sm">{item.message}</div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={activeAI === 'gemini' ? 'Type your message...' : 'Speak your message...'}
              className="input input-bordered flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendMessage}
              disabled={!message.trim() || currentSync.isProcessing}
            >
              {currentSync.isProcessing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                activeAI === 'gemini' ? '💬' : '🎤'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className="btn btn-secondary"
          onClick={handleModeSwitch}
        >
          Switch to {currentSync.currentMode === 'text' ? 'Voice' : 'Text'} Mode
        </button>
        
        <button
          className="btn btn-accent"
          onClick={handleAddReminder}
        >
          Add Demo Reminder
        </button>
        
        <button
          className="btn btn-info"
          onClick={() => {
            const context = currentSync.getOtherAIContext();
            alert(JSON.stringify(context, null, 2));
          }}
        >
          Show Cross-AI Context
        </button>
      </div>

      {/* Shared Memory Display */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">🔄 Shared Memory Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Active Reminders</h4>
              {sharedMemory.activeReminders?.length ? (
                <ul className="space-y-1">
                  {sharedMemory.activeReminders.map((reminder, index) => (
                    <li key={index} className="text-sm bg-base-200 p-2 rounded">
                      {reminder.title} - {reminder.time} 
                      <span className="text-xs text-base-content/70 ml-2">
                        (by {reminder.createdBy})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-base-content/50">No active reminders</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Environment Data</h4>
              <div className="text-sm space-y-1">
                <p>Weather: {sharedMemory.weatherData?.condition || 'Unknown'}</p>
                <p>Temperature: {sharedMemory.weatherData?.temperature || 'N/A'}°C</p>
                <p>Location: {sharedMemory.currentLocation?.city || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDemo;
