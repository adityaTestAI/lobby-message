import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Message } from '../../types';
import { Button } from '../ui/Button';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
        {!isCurrentUser && (
          <div className="flex items-center mb-1">
            {message.sender.photoURL && (
              <img 
                src={message.sender.photoURL} 
                alt={message.sender.name}
                className="w-4 h-4 rounded-full mr-2"
              />
            )}
            <span className="text-xs font-medium text-gray-600">{message.sender.name}</span>
          </div>
        )}
        
        <div className="break-words">{message.content}</div>
        
        <div className="flex items-center justify-between mt-2 space-x-2">
          <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          <button
            onClick={handleCopy}
            className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};