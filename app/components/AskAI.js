import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Sparkles, Bot, User } from 'lucide-react';

export default function MinimalistAskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m your NCE preparation assistant. Ask me anything about energy management, thermal utilities, electrical utilities, or exam strategies.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `That's a great question about "${currentInput}". In the context of NCE preparation, this topic relates to energy efficiency principles. Would you like me to explain the specific concepts or provide practice questions on this topic?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestions = [
    "Explain energy audit process",
    "Key formulas for thermal efficiency",
    "Power factor calculation",
    "Study plan for NCE"
  ];

  return (
    <>
      {/* Chat Bubble Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 group"
          >
            <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative">
              <MessageCircle className="h-6 w-6" />
              
              {/* Notification pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="h-2 w-2 text-white" />
              </motion.div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ask me anything about NCE
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-300 ${
              isMinimized ? 'h-16' : 'h-[32rem]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium text-sm">AskAI</h3>
                  <p className="text-gray-500 text-xs">NCE Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {isMinimized ? 
                    <Maximize2 className="h-4 w-4 text-gray-500" /> : 
                    <Minimize2 className="h-4 w-4 text-gray-500" />
                  }
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-64 md:h-72 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.type === 'user' ? 
                            <User className="h-3 w-3" /> : 
                            <Bot className="h-3 w-3" />
                          }
                        </div>
                        
                        {/* Message */}
                        <div
                          className={`p-3 rounded-2xl text-sm leading-relaxed ${
                            message.type === 'user'
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-50 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 opacity-70 ${
                            message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Bot className="h-3 w-3 text-gray-600" />
                        </div>
                        <div className="bg-gray-50 text-gray-900 p-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-500">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-gray-500 text-xs mb-3">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs rounded-xl border border-gray-200 transition-all"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about NCE topics..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Context indicator */}
                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Context: NCE Platform
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
