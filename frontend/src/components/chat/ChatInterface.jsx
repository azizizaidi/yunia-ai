import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import { sendMessageToGemini } from "../../services/geminiApi";
import { saveConversation, saveAIMemory } from "../../services/api";

/**
 * ChatInterface component - Main chat interface with message history and input
 * @param {Object} props - Component props
 * @param {Array} props.initialMessages - Initial messages to display
 * @returns {JSX.Element} Chat interface component
 */
const ChatInterface = forwardRef(({ initialMessages = [], isMobile }, ref) => {
  // Use initialMessages if provided, otherwise load from localStorage or use default
  const [messages, setMessages] = useState(() => {
    if (initialMessages && initialMessages.length > 0) {
      return initialMessages;
    }

    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: 1,
        role: "assistant",
        content: "Hi, I'm Yunia AI. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ];
  });

  // Update messages when initialMessages changes
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change and save to localStorage
  useEffect(() => {
    scrollToBottom();

    // Save messages to localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-save conversation to memory when conversation reaches certain length
  useEffect(() => {
    const autoSaveConversation = async () => {
      // Auto-save more frequently - every 2 messages after initial message
      if (messages.length >= 3 && messages.length % 2 === 1) { // Every 2 messages (odd numbers)
        try {
          const conversationSummary = generateConversationSummary(messages);
          const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
          const lastAIMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0];

          await saveConversation({
            title: conversationSummary.title,
            content: conversationSummary.summary,
            summary: conversationSummary.keyPoints,
            aiType: 'gemini',
            type: 'auto_saved',
            messageCount: messages.length,
            lastUserMessage: lastUserMessage?.content || '',
            lastAIMessage: lastAIMessage?.content || ''
          });

          // Also save to AI memory for learning
          await saveAIMemory('gemini', {
            type: 'conversation_summary',
            summary: conversationSummary.summary,
            keyPoints: conversationSummary.keyPoints,
            messageCount: messages.length,
            conversationContext: conversationSummary.context
          });

          console.log('Conversation auto-saved to memory:', conversationSummary.title);

        } catch (error) {
          console.error('Error auto-saving conversation:', error);
        }
      }
    };

    autoSaveConversation();
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Immediately save user message to AI memory
    try {
      await saveAIMemory('gemini', {
        type: 'user_message',
        message: userMessage.content,
        timestamp: userMessage.timestamp,
        messageId: userMessage.id
      });
    } catch (error) {
      console.error('Error saving user message to memory:', error);
    }

    // Call the Gemini API for a response
    try {
      // Get all messages for context (or just the last few if there are many)
      const messageHistory = messages.slice(-10); // Last 10 messages for context

      // Add the new user message
      const updatedHistory = [...messageHistory, userMessage];

      // Call the API
      const aiResponse = await sendMessageToGemini(updatedHistory);

      // Add the AI response to the chat
      setMessages((prev) => [...prev, aiResponse]);

      // Immediately save AI response to memory
      try {
        await saveAIMemory('gemini', {
          type: 'ai_response',
          message: aiResponse.content,
          timestamp: aiResponse.timestamp,
          messageId: aiResponse.id,
          aiName: 'Yunia'
        });
      } catch (error) {
        console.error('Error saving AI response to memory:', error);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add an error message
      const errorResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (transcript) => {
    setInputMessage(transcript);
  };

  const clearChat = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to clear the chat history? This cannot be undone.")) {
      // Reset to initial message
      const initialMessage = {
        id: Date.now(),
        role: "assistant",
        content: "Chat history cleared. How can I help you today?",
        timestamp: new Date().toISOString(),
      };

      setMessages([initialMessage]);
      // Clear localStorage
      localStorage.removeItem('chatMessages');
    }
  };

  // Generate conversation summary for auto-save
  const generateConversationSummary = (messages) => {
    const userMessages = messages.filter(m => m.role === 'user');
    const aiMessages = messages.filter(m => m.role === 'assistant');

    // Extract key topics from user messages
    const recentUserMessages = userMessages.slice(-3);
    const topics = recentUserMessages.map(m => {
      const words = m.content.toLowerCase().split(' ');
      return words.filter(word => word.length > 4).slice(0, 2);
    }).flat();

    const uniqueTopics = [...new Set(topics)];
    const mainTopic = uniqueTopics[0] || 'general';

    return {
      title: `Chat about ${mainTopic}`,
      summary: `Conversation covering ${uniqueTopics.slice(0, 3).join(', ')} with ${messages.length} messages exchanged.`,
      keyPoints: recentUserMessages.map(m => m.content.substring(0, 100)).join(' | '),
      context: {
        totalMessages: messages.length,
        userQuestions: userMessages.length,
        aiResponses: aiMessages.length,
        topics: uniqueTopics.slice(0, 5)
      }
    };
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    clearChat,
    setMessages
  }));

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-lg">
      {/* Chat header with clear button */}
      <div className={`flex justify-between items-center border-b border-base-300 ${
        isMobile ? 'p-2 pl-12' : 'p-3'
      }`}>
        <h2 className={`font-semibold truncate ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          Chat with Yunia AI
        </h2>
        <button
          onClick={clearChat}
          className={`btn btn-ghost ${isMobile ? 'btn-xs' : 'btn-sm'}`}
          aria-label="Clear chat history"
        >
          <span className="material-icons text-sm mr-1">delete</span>
          {!isMobile && <span>Clear chat</span>}
        </button>
      </div>

      {/* Chat messages area */}
      <div className={`flex-1 overflow-y-auto ${
        isMobile ? 'p-2 space-y-2' : 'p-4 space-y-4'
      }`}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} isMobile={isMobile} />
        ))}
        {isLoading && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg bg-base-200 ${
            isMobile ? 'max-w-full' : 'max-w-3xl'
          }`}>
            <div className="loading loading-dots loading-sm text-primary"></div>
            <span className="text-sm text-base-content/70">Yunia is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={`border-t border-base-300 ${isMobile ? 'p-2' : 'p-4'}`}>
        <form onSubmit={handleSubmit} className={`flex items-end ${
          isMobile ? 'space-x-1' : 'space-x-2'
        }`}>
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Message Yunia AI..."
              className={`textarea textarea-bordered w-full pr-10 resize-none ${
                isMobile
                  ? 'min-h-[50px] max-h-[120px] text-sm'
                  : 'min-h-[60px] max-h-[200px]'
              }`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`absolute bottom-3 right-3 btn btn-circle btn-primary ${
                isMobile ? 'btn-xs' : 'btn-sm'
              }`}
              disabled={!inputMessage.trim() || isLoading}
            >
              <span className="material-icons text-primary-content text-sm">send</span>
            </button>
          </div>
          <VoiceInput
            onTranscript={handleVoiceInput}
            onSubmit={handleSubmit}
            isMobile={isMobile}
          />
        </form>
        <div className={`text-xs text-base-content/50 mt-2 text-center ${
          isMobile ? 'px-1' : ''
        }`}>
          <p>Yunia AI can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
});

export default ChatInterface;
