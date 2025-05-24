import { useState, useEffect } from "react";

/**
 * ChatHistory component - Displays chat history in the sidebar
 * @param {Object} props - Component props
 * @param {Function} props.onSelectChat - Callback when a chat is selected
 * @param {Function} props.onNewChat - Callback when a new chat is created
 * @returns {JSX.Element} Chat history component
 */
const ChatHistory = ({ onSelectChat, onNewChat }) => {
  // Load chat history from localStorage or use default
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatHistoryList');
    return savedHistory ? JSON.parse(savedHistory) : [
      {
        id: 1,
        title: "Welcome to Yunia AI",
        preview: "Hi, I'm Yunia AI. How can I help you today?",
        date: new Date().toISOString(),
        isActive: true,
      }
    ];
  });

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

  // Save chat history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatHistoryList', JSON.stringify(chatHistory));
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
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="btn btn-primary w-full"
        >
          <span className="material-icons mr-2">add</span>
          New chat
        </button>
      </div>

      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          <h3 className="text-xs font-medium text-base-content/60 px-2 py-1">Recent chats</h3>
          <ul className="menu menu-sm p-0">
            {chatHistory.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => handleChatSelect(chat.id)}
                  className={`flex flex-col items-start py-2 px-3 rounded-lg ${
                    chat.isActive ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium truncate">{chat.title}</span>
                    <span className="text-xs opacity-60">{formatDate(chat.date)}</span>
                  </div>
                  <span className="text-xs opacity-70 truncate w-full text-left">
                    {chat.preview}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
