import { useState } from "react";

/**
 * ChatMessage component - Displays a single chat message
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object with role, content, and timestamp
 * @returns {JSX.Element} Chat message component
 */
const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="avatar">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            {isUser ? (
              <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center">
                <span className="material-icons text-sm">person</span>
              </div>
            ) : (
              <div className="bg-secondary text-secondary-content w-full h-full flex items-center justify-center">
                <span className="material-icons text-sm">psychology</span>
              </div>
            )}
          </div>
        </div>

        {/* Message content */}
        <div className={`relative group ${isUser ? 'text-right' : ''}`}>
          <div className={`p-3 rounded-lg ${isUser ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {/* Timestamp and actions */}
          <div className={`flex items-center text-xs text-base-content/50 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTimestamp(message.timestamp)}</span>
            
            {/* Copy button - only show for assistant messages */}
            {!isUser && (
              <button 
                onClick={copyToClipboard} 
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy message"
              >
                <span className="material-icons text-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
