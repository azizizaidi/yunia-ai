import { useState, useEffect } from "react";
import { getChatHistory } from "../../services/api";
import Loader from "../ui/Loader";

/**
 * ChatHistory component - Displays chat history in the sidebar
 * @param {Object} props - Component props
 * @param {Function} props.onSelectChat - Callback when a chat is selected
 * @param {Function} props.onNewChat - Callback when a new chat is created
 * @returns {JSX.Element} Chat history component
 */
const ChatHistory = ({ onSelectChat, onNewChat, isMobile }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Load chat history from API
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChatHistory();
        setChatHistory(data);
      } catch (err) {
        setError("Failed to load chat history");
        console.error("Error fetching chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistoryList', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleChatSelect = (id) => {
    // Update active state
    setChatHistory(
      chatHistory.map((chat) => ({
        ...chat,
        isActive: chat.id === id,
      }))
    );

    // Call the callback with the selected chat
    const selectedChat = chatHistory.find(chat => chat.id === id);
    if (selectedChat && onSelectChat) {
      onSelectChat(selectedChat);
    }
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New conversation",
      preview: "Start a new conversation",
      date: new Date().toISOString(),
      isActive: true,
      messages: [
        {
          id: Date.now(),
          role: "assistant",
          content: "Hi, I'm Yunia AI. How can I help you today?",
          timestamp: new Date().toISOString(),
        }
      ]
    };

    // Update chat history
    setChatHistory(
      [newChat, ...chatHistory.map(chat => ({ ...chat, isActive: false }))]
    );

    // Call the callback with the new chat
    if (onNewChat) {
      onNewChat(newChat);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className={`p-3 ${isMobile ? 'sm:p-4' : 'p-4'}`}>
        <button
          onClick={handleNewChat}
          className={`btn btn-primary w-full ${isMobile ? 'btn-sm' : ''}`}
          disabled={loading}
        >
          <span className="material-icons mr-2 text-sm">add</span>
          <span className="text-sm">New chat</span>
        </button>
      </div>

      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-2">
          <h3 className="text-xs font-medium text-base-content/60 px-2 py-1 uppercase tracking-wider">
            Recent chats
          </h3>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="px-2 py-4">
              <p className="text-xs text-error">{error}</p>
            </div>
          )}

          {/* Chat history list */}
          {!loading && !error && (
            <ul className="menu menu-sm p-0">
              {chatHistory.length === 0 ? (
                <li className="px-2 py-4">
                  <p className="text-xs text-base-content/60">No chat history yet</p>
                </li>
              ) : (
                chatHistory.map((chat) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => handleChatSelect(chat.id)}
                      className={`flex flex-col items-start py-2 px-3 rounded-lg w-full transition-colors ${
                        chat.isActive ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                      }`}
                    >
                      <div className="flex justify-between w-full min-w-0">
                        <span className="font-medium truncate flex-1 text-left text-sm">
                          {chat.title}
                        </span>
                        <span className="text-xs opacity-60 ml-2 flex-shrink-0">
                          {formatDate(chat.date)}
                        </span>
                      </div>
                      <span className="text-xs opacity-70 truncate w-full text-left mt-1">
                        {chat.preview}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
