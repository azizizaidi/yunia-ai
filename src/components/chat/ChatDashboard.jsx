import { useState, useRef } from "react";
import ChatInterface from "./ChatInterface";
import ChatHistory from "./ChatHistory";

/**
 * ChatDashboard component - Main container for chat functionality
 * @returns {JSX.Element} Chat dashboard component
 */
const ChatDashboard = () => {
  const [showHistory, setShowHistory] = useState(true);
  const [currentMessages, setCurrentMessages] = useState([]);
  const chatInterfaceRef = useRef(null);

  // Handle selecting a chat from history
  const handleSelectChat = (chat) => {
    if (chat.messages) {
      setCurrentMessages(chat.messages);
    }

    // On mobile, hide the history after selection
    if (window.innerWidth < 768) {
      setShowHistory(false);
    }
  };

  // Handle creating a new chat
  const handleNewChat = (chat) => {
    if (chat.messages) {
      setCurrentMessages(chat.messages);
    }

    // On mobile, hide the history after creating new chat
    if (window.innerWidth < 768) {
      setShowHistory(false);
    }

    // Clear the chat interface if we have a ref to it
    if (chatInterfaceRef.current && chatInterfaceRef.current.clearChat) {
      chatInterfaceRef.current.clearChat();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-base-100 rounded-lg shadow-lg overflow-hidden">
      {/* Chat history sidebar - collapsible on mobile */}
      <div className={`w-80 border-r border-base-300 bg-base-100 transition-all duration-300 ${
        showHistory ? "block" : "hidden md:block"
      }`}>
        <ChatHistory
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main chat interface */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile toggle for chat history */}
        <button
          className="md:hidden absolute top-2 left-2 z-10 btn btn-sm btn-circle btn-ghost"
          onClick={() => setShowHistory(!showHistory)}
        >
          <span className="material-icons">
            {showHistory ? "close" : "menu"}
          </span>
        </button>

        <ChatInterface
          ref={chatInterfaceRef}
          initialMessages={currentMessages}
        />
      </div>
    </div>
  );
};

export default ChatDashboard;
