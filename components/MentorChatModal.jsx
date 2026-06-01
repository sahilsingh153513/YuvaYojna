'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  Video, 
  Mail, 
  Globe,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import TranslatedText from '@/app/language/page';

const MentorChatModal = ({ mentor, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample initial messages
  const initialMessages = [
    {
      id: 1,
      text: `Hi! I'm ${mentor?.firstName} ${mentor?.lastName}. I'm excited to help you with your career journey. What would you like to know?`,
      sender: 'mentor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setMessages(initialMessages);
    }
  }, [isOpen, mentor]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Simulate mentor typing and response
      setIsTyping(true);
      setTimeout(() => {
        const mentorResponse = {
          id: Date.now() + 1,
          text: "That's a great question! Let me help you with that. Could you tell me more about your current situation?",
          sender: 'mentor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, mentorResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !mentor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                 style={{ backgroundColor: '#16A34A' }}>
              {mentor.firstName[0]}{mentor.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>
                {mentor.firstName} {mentor.lastName}
              </h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {mentor.position} at {mentor.company}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(`tel:${mentor.phone}`)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Call"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(`tel:${mentor.phone}`)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(`mailto:${mentor.email}`)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            {mentor.linkedin && (
              <button
                onClick={() => window.open(mentor.linkedin, '_blank')}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Globe className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
                style={{
                  backgroundColor: message.sender === 'user' ? '#16A34A' : '#F3F4F6'
                }}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs ml-2">Typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              style={{ backgroundColor: 'white', color: '#000000' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#16A34A' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChatModal;


