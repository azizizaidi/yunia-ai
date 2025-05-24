import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import { sendMessageToGemini } from "../../services/geminiApi";

/**
 * ChatInterface component - Main chat interface with message history and input
 * @param {Object} props - Component props
 * @param {Array} props.initialMessages - Initial messages to display
 * @returns {JSX.Element} Chat interface component
 */
const ChatInterface = forwardRef(({ initialMessages = [] }, ref) => {
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

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    clearChat,
    setMessages
  }));

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-lg">
      {/* Chat header with clear button */}
      <div className="flex justify-between items-center p-3 border-b border-base-300">
        <h2 className="text-lg font-semibold">Chat with Yunia AI</h2>
        <button
          onClick={clearChat}
          className="btn btn-sm btn-ghost"
          aria-label="Clear chat history"
        >
          <span className="material-icons text-sm mr-1">delete</span>
          Clear chat
        </button>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-base-200 max-w-3xl">
            <div className="loading loading-dots loading-sm text-primary"></div>
            <span className="text-sm text-base-content/70">Yunia is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-base-300 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Message Yunia AI..."
              className="textarea textarea-bordered w-full pr-10 min-h-[60px] max-h-[200px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              className="absolute bottom-3 right-3 btn btn-circle btn-sm btn-primary"
              disabled={!inputMessage.trim() || isLoading}
            >
              <span className="material-icons text-primary-content">send</span>
            </button>
          </div>
          <VoiceInput
            onTranscript={handleVoiceInput}
            onSubmit={handleSubmit}
          />
        </form>
        <div className="text-xs text-base-content/50 mt-2 text-center">
          <p>Yunia AI can make mistakes. Consider checking important information.</p>
      
        </div>
      </div>
    </div>
  );
});

export default ChatInterface;
