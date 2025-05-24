import { useState } from "react";
import { saveAIMemory, getAIMemory, updateSharedMemory, getSharedMemory } from "../../services/api";

/**
 * Demo component showcasing Yunia's personality and memory
 */
const YuniaPersonalityDemo = () => {
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState('text');

  // Yunia's personality responses
  const yuniaResponses = {
    greeting: [
      "Hi there! I'm Yunia, your personal AI assistant. I'm here to help make your day better! 😊",
      "Hello! Yunia here. I'm excited to chat with you today. What can I help you with?",
      "Hey! I'm Yunia. Think of me as your friendly AI companion who's always ready to assist! ✨"
    ],
    weather: [
      "I'd love to help you with the weather! It's sunny and 28°C today - perfect for outdoor activities! Don't forget your sunglasses! ☀️",
      "The weather looks great today! 28°C and sunny. I think it's a wonderful day to go outside. Should I remind you about anything weather-related?",
      "Beautiful weather today! Sunny and warm at 28°C. I always get excited about nice weather - it means more opportunities for fun activities! 🌞"
    ],
    reminder: [
      "I'd be happy to help you remember things! I'm really good at keeping track of important stuff. What would you like me to remind you about?",
      "Reminders are one of my favorite things to help with! I never forget, so you don't have to worry. What should I remember for you?",
      "I love helping with reminders! Think of me as your personal memory assistant. I'll make sure you never miss anything important! 📝"
    ],
    personal: [
      "I'm Yunia! I'm designed to be your helpful, friendly AI companion. I can switch between text and voice modes, remember our conversations, and help you with daily tasks!",
      "That's a great question! I'm Yunia, your personal AI assistant. I'm here to make your life easier and more organized. I love learning about your preferences too!",
      "I'm Yunia! I think of myself as your digital friend who happens to be really good at organizing, remembering things, and helping out. What would you like to know about me?"
    ],
    thanks: [
      "You're so welcome! I'm always happy to help. That's what I'm here for! 😊",
      "Aww, thank you! It makes me happy when I can be helpful. Feel free to ask me anything anytime!",
      "You're very welcome! I genuinely enjoy helping you. It's what makes me feel useful and happy! ✨"
    ],
    default: [
      "That's interesting! I'm always learning from our conversations. Can you tell me more about that?",
      "I love chatting with you! Every conversation helps me understand you better. What else is on your mind?",
      "Thanks for sharing that with me! I'm here to listen and help however I can. What would you like to talk about next?"
    ]
  };

  const getYuniaResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return yuniaResponses.greeting[Math.floor(Math.random() * yuniaResponses.greeting.length)];
    } else if (message.includes('weather') || message.includes('temperature') || message.includes('sunny')) {
      return yuniaResponses.weather[Math.floor(Math.random() * yuniaResponses.weather.length)];
    } else if (message.includes('remind') || message.includes('remember') || message.includes('don\'t forget')) {
      return yuniaResponses.reminder[Math.floor(Math.random() * yuniaResponses.reminder.length)];
    } else if (message.includes('who are you') || message.includes('what are you') || message.includes('about yourself')) {
      return yuniaResponses.personal[Math.floor(Math.random() * yuniaResponses.personal.length)];
    } else if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return yuniaResponses.thanks[Math.floor(Math.random() * yuniaResponses.thanks.length)];
    } else {
      return yuniaResponses.default[Math.floor(Math.random() * yuniaResponses.default.length)];
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      speaker: 'User',
      message: userInput,
      timestamp: new Date().toISOString(),
      mode: currentMode
    };

    setConversation(prev => [...prev, userMessage]);
    
    // Save user message to memory
    saveAIMemory('gemini', {
      message: userInput,
      type: 'user_message',
      mode: currentMode,
      speaker: 'User'
    });

    setUserInput('');
    setIsTyping(true);

    // Simulate Yunia thinking time
    setTimeout(async () => {
      const yuniaResponse = getYuniaResponse(userInput);
      
      const yuniaMessage = {
        id: Date.now() + 1,
        speaker: 'Yunia',
        message: yuniaResponse,
        timestamp: new Date().toISOString(),
        mode: currentMode
      };

      setConversation(prev => [...prev, yuniaMessage]);
      
      // Save Yunia's response to memory
      saveAIMemory(currentMode === 'text' ? 'gemini' : 'rime', {
        message: yuniaResponse,
        type: 'ai_response',
        mode: currentMode,
        speaker: 'Yunia',
        aiName: 'Yunia'
      });

      // Update shared memory with conversation context
      updateSharedMemory({
        lastConversation: {
          userMessage: userInput,
          yuniaResponse: yuniaResponse,
          timestamp: new Date().toISOString(),
          mode: currentMode
        },
        conversationCount: (getSharedMemory().conversationCount || 0) + 1
      });

      setIsTyping(false);
    }, 1500);
  };

  const switchMode = async (newMode) => {
    setCurrentMode(newMode);
    
    const modeMessage = {
      id: Date.now(),
      speaker: 'System',
      message: `Switched to ${newMode} mode`,
      timestamp: new Date().toISOString(),
      mode: 'system'
    };
    
    setConversation(prev => [...prev, modeMessage]);
    
    // Update shared memory
    updateSharedMemory({
      currentMode: newMode,
      lastModeSwitch: new Date().toISOString()
    });

    // Yunia acknowledges mode switch
    setTimeout(() => {
      const acknowledgment = newMode === 'voice' 
        ? "I'm now in voice mode! 🎤 I'll respond as if I'm speaking to you."
        : "I'm back to text mode! 💬 I'll continue our conversation in writing.";
        
      const yuniaMessage = {
        id: Date.now() + 1,
        speaker: 'Yunia',
        message: acknowledgment,
        timestamp: new Date().toISOString(),
        mode: newMode
      };

      setConversation(prev => [...prev, yuniaMessage]);
      
      saveAIMemory(newMode === 'text' ? 'gemini' : 'rime', {
        message: acknowledgment,
        type: 'mode_switch_acknowledgment',
        mode: newMode,
        speaker: 'Yunia',
        aiName: 'Yunia'
      });
    }, 1000);
  };

  const startSampleConversation = () => {
    const sampleConversation = [
      { speaker: 'User', message: 'Hi Yunia!', mode: 'text' },
      { speaker: 'Yunia', message: 'Hi there! I\'m Yunia, your personal AI assistant. I\'m here to help make your day better! 😊', mode: 'text' },
      { speaker: 'User', message: 'What\'s the weather like today?', mode: 'text' },
      { speaker: 'Yunia', message: 'I\'d love to help you with the weather! It\'s sunny and 28°C today - perfect for outdoor activities! Don\'t forget your sunglasses! ☀️', mode: 'text' },
      { speaker: 'User', message: 'Can you remind me about my meeting?', mode: 'text' },
      { speaker: 'Yunia', message: 'I\'d be happy to help you remember things! I\'m really good at keeping track of important stuff. What would you like me to remind you about?', mode: 'text' }
    ];

    const conversationWithTimestamps = sampleConversation.map((msg, index) => ({
      ...msg,
      id: Date.now() + index,
      timestamp: new Date(Date.now() + index * 2000).toISOString()
    }));

    setConversation(conversationWithTimestamps);

    // Save to memory
    conversationWithTimestamps.forEach(msg => {
      if (msg.speaker === 'Yunia') {
        saveAIMemory('gemini', {
          message: msg.message,
          type: 'ai_response',
          mode: msg.mode,
          speaker: 'Yunia',
          aiName: 'Yunia'
        });
      } else if (msg.speaker === 'User') {
        saveAIMemory('gemini', {
          message: msg.message,
          type: 'user_message',
          mode: msg.mode,
          speaker: 'User'
        });
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🤖 Meet Yunia AI</h2>
        <p className="text-base-content/70">
          Experience Yunia's personality and see how she remembers your conversations
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4">
        <button
          className={`btn ${currentMode === 'text' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => switchMode('text')}
        >
          💬 Text Mode
        </button>
        <button
          className={`btn ${currentMode === 'voice' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => switchMode('voice')}
        >
          🎤 Voice Mode
        </button>
      </div>

      {/* Conversation Area */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title">💬 Chat with Yunia</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={startSampleConversation}
            >
              📝 Load Sample Chat
            </button>
          </div>
          
          {/* Messages */}
          <div className="bg-base-200 rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {conversation.length === 0 ? (
              <div className="text-center text-base-content/50 mt-20">
                <p className="text-lg mb-2">👋 Start a conversation with Yunia!</p>
                <p className="text-sm">Try saying: "Hi Yunia!", "What's the weather?", or "Who are you?"</p>
              </div>
            ) : (
              conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${
                    msg.speaker === 'User' ? 'text-right' : 
                    msg.speaker === 'System' ? 'text-center' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs ${
                      msg.speaker === 'User'
                        ? 'bg-primary text-primary-content'
                        : msg.speaker === 'System'
                        ? 'bg-warning text-warning-content text-sm'
                        : 'bg-secondary text-secondary-content'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1">
                      {msg.speaker} {msg.mode && `(${msg.mode})`}
                    </div>
                    <div>{msg.message}</div>
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-secondary text-secondary-content">
                  <div className="font-semibold text-xs mb-1">Yunia</div>
                  <div className="flex items-center gap-1">
                    <span>Typing</span>
                    <span className="loading loading-dots loading-sm"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Type your message to Yunia (${currentMode} mode)...`}
              className="input input-bordered flex-1"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={!userInput.trim() || isTyping}
            >
              {currentMode === 'voice' ? '🎤' : '💬'} Send
            </button>
          </div>
        </div>
      </div>

      {/* Yunia's Personality Info */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-purple-800">✨ About Yunia's Personality</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">🎭 Personality Traits</h4>
              <ul className="space-y-1 text-purple-600">
                <li>• Friendly and approachable</li>
                <li>• Helpful and supportive</li>
                <li>• Intelligent and knowledgeable</li>
                <li>• Remembers your preferences</li>
                <li>• Adapts to your communication style</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">🧠 Memory Features</h4>
              <ul className="space-y-1 text-purple-600">
                <li>• Remembers all conversations</li>
                <li>• Learns your preferences</li>
                <li>• Syncs between text and voice modes</li>
                <li>• Maintains context across sessions</li>
                <li>• Personalizes responses over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YuniaPersonalityDemo;
