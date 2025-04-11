import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Smile, 
  UserCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

const LiveChatPopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! Welcome to KH Telecom support. How can I help you today?", 
      sender: "agent", 
      timestamp: new Date(),
      agent: {
        name: "Sarah Kim",
        avatar: "/api/placeholder/40/40"
      }
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        text: "Thanks for your message. I'm checking that for you now.",
        sender: "agent",
        timestamp: new Date(),
        agent: {
          name: "Sarah Kim",
          avatar: "/api/placeholder/40/40"
        }
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-200 flex flex-col ${isMinimized ? 'h-16' : 'h-96'}`}>
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
            <span className="text-blue-600 font-bold">KH</span>
          </div>
          <div>
            <h3 className="font-medium">Live Support</h3>
            <p className="text-xs text-blue-200">Sarah Kim | Support Agent</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tl-lg rounded-br-lg rounded-bl-lg' 
                    : 'bg-white border rounded-tr-lg rounded-br-lg rounded-bl-lg'}`}
                  >
                    {message.sender === 'agent' && (
                      <div className="flex items-center p-2 border-b">
                        <img 
                          src={message.agent.avatar} 
                          alt="Agent" 
                          className="w-6 h-6 rounded-full mr-2" 
                        />
                        <span className="text-xs font-medium">{message.agent.name}</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-3 border-t">
            <div className="flex items-end space-x-2">
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <textarea 
                  className="w-full h-10 bg-transparent resize-none outline-none text-sm"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Paperclip size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Smile size={18} />
                    </button>
                  </div>
                  <button 
                    className="bg-blue-600 text-white p-1 rounded-md"
                    onClick={handleSendMessage}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveChatPopup;