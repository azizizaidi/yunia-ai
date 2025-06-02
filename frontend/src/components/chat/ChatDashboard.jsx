import { useState, useRef, useEffect } from "react";
import ChatInterface from "./ChatInterface";
import ChatHistory from "./ChatHistory";

/**
 * ChatDashboard component - Main container for chat functionality
 * @returns {JSX.Element} Chat dashboard component
 */
const ChatDashboard = () => {
  const [showHistory, setShowHistory] = useState(true);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const chatInterfaceRef = useRef(null);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-hide history on mobile by default
      if (mobile) {
        setShowHistory(false);
      } else {
        setShowHistory(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle selecting a chat from history
  const handleSelectChat = (chat) => {
    if (chat.messages) {
      setCurrentMessages(chat.messages);
    }

    // On mobile, hide the history after selection
    if (isMobile) {
      setShowHistory(false);
    }
  };

  // Handle creating a new chat
  const handleNewChat = (chat) => {
    if (chat.messages) {
      setCurrentMessages(chat.messages);
    }

    // On mobile, hide the history after creating new chat
    if (isMobile) {
      setShowHistory(false);
    }

    // Clear the chat interface if we have a ref to it
    if (chatInterfaceRef.current && chatInterfaceRef.current.clearChat) {
      chatInterfaceRef.current.clearChat();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] bg-base-100 rounded-lg shadow-lg overflow-hidden">
      {/* Chat history sidebar - responsive */}
      <div className={`
        transition-all duration-300 ease-in-out border-base-300 bg-base-100
        ${isMobile
          ? showHistory
            ? "w-full h-2/5 border-b block"
            : "w-0 h-0 hidden"
          : "w-80 h-full border-r block"
        }
      `}>
        <ChatHistory
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          isMobile={isMobile}
        />
      </div>

      {/* Main chat interface */}
      <div className="flex-1 flex flex-col relative min-h-0">
        {/* Mobile toggle for chat history */}
        {isMobile && (
          <button
            className="absolute top-2 left-2 z-10 btn btn-sm btn-circle btn-ghost bg-base-100 shadow-md"
            onClick={() => setShowHistory(!showHistory)}
            aria-label={showHistory ? "Hide chat history" : "Show chat history"}
          >
            <span className="material-icons text-sm">
              {showHistory ? "close" : "history"}
            </span>
          </button>
        )}

        <ChatInterface
          ref={chatInterfaceRef}
          initialMessages={currentMessages}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ChatDashboard;
