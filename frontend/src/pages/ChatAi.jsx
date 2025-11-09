import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';

const ChatAi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.message, isAi: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Sorry, there was an error processing your request.', isAi: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1
            className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <span className="text-blue-300">Cordi AI</span> Assistant
          </h1>

          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => navigate('/signin')}
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-100 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Hamburger menu for mobile */}
          <div className="sm:hidden relative">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <XMarkIcon className="h-8 w-8 text-white" />
              ) : (
                <Bars3Icon className="h-8 w-8 text-white" />
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg flex flex-col divide-y divide-gray-200">
                <button
                  onClick={() => { navigate('/signin'); setMenuOpen(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate('/signup'); setMenuOpen(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <svg
              className="w-16 h-16 mb-2 sm:mb-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg sm:text-xl font-medium">Start a conversation</p>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base">Ask me anything!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isAi={message.isAi} />
          ))
        )}

        {isLoading && (
          <div className="flex items-center justify-center space-x-2 p-2 sm:p-4">
            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full"></div>
            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full delay-100"></div>
            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full delay-200"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-none p-3 sm:p-6 bg-gradient-to-r from-blue-900 to-blue-800 border-t border-blue-700 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto w-full">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[50px] w-full rounded-2xl border-2 border-blue-300 bg-white px-4 sm:px-6 py-3 text-base text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200 pr-14 sm:pr-16"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <PaperAirplaneIcon className="h-6 w-6 rotate-90 sm:h-6 sm:w-6" />
            </button>
          </div>
          <p className="text-xs text-gray-200 text-center mt-1 sm:mt-2">
            Press Enter to send your message
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatAi;
