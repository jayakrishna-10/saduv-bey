// app/components/AskAI.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Sparkles } from 'lucide-react';

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m AskAI, your NCE preparation assistant. Ask me anything about energy management, thermal utilities, electrical utilities, or exam strategies!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({});
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Collect context from the current page
  useEffect(() => {
    const collectContext = () => {
      const pathname = window.location.pathname;
      const newContext = {
        currentPage: pathname,
        timestamp: new Date().toISOString()
      };

      // Detect current page type and extract relevant context
      if (pathname.includes('/nce/quiz')) {
        newContext.paper = 'quiz';
        
        // Try to get current question text
        const questionElement = document.querySelector('h2');
        if (questionElement) {
          newContext.currentQuestion = questionElement.textContent?.slice(0, 200) + '...';
        }
        
        // Get current chapter/topic if available
        const chapterElement = document.querySelector('[data-chapter], .text-white\\/70');
        if (chapterElement) {
          newContext.currentChapter = chapterElement.textContent;
        }
      } 
      else if (pathname.includes('/nce/test')) {
        newContext.paper = 'test';
        newContext.additionalContext = 'User is taking a mock test';
      }
      else if (pathname.includes('/nce/notes')) {
        newContext.paper = 'study notes';
        
        // Extract chapter/book info from URL or headings
        const pathParts = pathname.split('/');
        if (pathParts.length > 3) {
          newContext.currentChapter = pathParts.slice(3).join(' > ');
        }
        
        // Get page title if available
        const titleElement = document.querySelector('h1, h2');
        if (titleElement) {
          newContext.additionalContext = `Reading: ${titleElement.textContent}`;
        }
      }
      else if (pathname.includes('/nce')) {
        newContext.paper = 'NCE homepage';
        newContext.additionalContext = 'User is on NCE preparation platform homepage';
      }

      setContext(newContext);
    };

    // Collect context on mount and when URL changes
    collectContext();
    
    // Listen for URL changes (for SPA navigation)
    const handleLocationChange = () => {
      setTimeout(collectContext, 100); // Small delay to let content load
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Also observe DOM changes to capture dynamic content
    const observer = new MutationObserver(() => {
      collectContext();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      observer.disconnect();
    };
  }, []);

  const getOfflineResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('energy audit')) {
      return "Energy auditing is the systematic process of analyzing energy consumption to identify opportunities for energy savings. Key steps include: 1) Data collection, 2) Energy flow analysis, 3) Identification of energy-saving opportunities, 4) Economic evaluation, and 5) Implementation planning.";
    }
    
    if (lowerMessage.includes('boiler') || lowerMessage.includes('thermal')) {
      return "Boiler efficiency depends on factors like combustion efficiency, heat transfer, and heat losses. Key parameters include: stack temperature, excess air, fuel quality, and maintenance practices. Regular monitoring and optimization can improve efficiency by 5-15%.";
    }
    
    if (lowerMessage.includes('motor') || lowerMessage.includes('electrical')) {
      return "Electric motor efficiency is crucial for electrical systems. Key factors: proper sizing, power factor correction, variable frequency drives (VFDs), and regular maintenance. Energy-efficient motors can reduce consumption by 2-8% compared to standard motors.";
    }
    
    if (lowerMessage.includes('power factor')) {
      return "Power factor is the ratio of real power to apparent power. Low power factor leads to higher current draw and energy losses. Correction using capacitors can improve efficiency and reduce demand charges. Target power factor: 0.95 or higher.";
    }
    
    return "I'm currently offline, but here are key NCE topics to focus on: 1) Energy Management principles, 2) Energy auditing methodology, 3) Thermal utilities (boilers, steam systems), 4) Electrical utilities (motors, lighting), 5) Economic analysis of energy projects. Try asking about specific topics when I'm back online!";
  };

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

    // If offline, provide fallback response
    if (isOffline) {
      setTimeout(() => {
        const offlineResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: getOfflineResponse(currentInput),
          timestamp: new Date(),
          isOffline: true
        };
        setMessages(prev => [...prev, offlineResponse]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Service temporarily unavailable');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Service error`);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Sorry, I\'m having trouble responding right now.';
      let shouldGoOffline = false;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Switching to offline mode for basic help.';
        shouldGoOffline = true;
      } else if (error.message.includes('timeout') || error.message.includes('408')) {
        errorMessage = 'Request timed out. Try asking a shorter question or use offline mode.';
        shouldGoOffline = true;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment before asking again.';
      } else if (error.message.includes('Service temporarily unavailable')) {
        errorMessage = 'AI service is temporarily unavailable. Switching to offline help mode.';
        shouldGoOffline = true;
      }

      if (shouldGoOffline) {
        setIsOffline(true);
        // Provide offline response for the current question
        setTimeout(() => {
          const offlineResponse = {
            id: Date.now() + 2,
            type: 'ai',
            content: getOfflineResponse(currentInput),
            timestamp: new Date(),
            isOffline: true
          };
          setMessages(prev => [...prev, offlineResponse]);
        }, 500);
      } else {
        const errorResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: errorMessage,
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } finally {
      setIsLoading(false);
    }
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

  // Context suggestions based on current page
  const getContextSuggestions = () => {
    const suggestions = [];
    
    if (context.currentPage?.includes('/quiz')) {
      suggestions.push("Explain this concept", "Why is this answer correct?", "Give me a similar example");
    } else if (context.currentPage?.includes('/test')) {
      suggestions.push("Test-taking strategies", "Time management tips", "Common mistakes to avoid");
    } else if (context.currentPage?.includes('/notes')) {
      suggestions.push("Summarize this chapter", "Key formulas to remember", "Real-world applications");
    } else {
      suggestions.push("Study plan advice", "Important NCE topics", "Exam preparation tips");
    }
    
    return suggestions;
  };

  return (
    <>
      {/* Chat Bubble Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-6 w-6" />
            
            {/* Notification dot for new users */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-2 w-2 text-yellow-900" />
            </motion.div>
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
              height: isMinimized ? '60px' : 'auto'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 max-h-[80vh] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AskAI</h3>
                  <p className="text-white/70 text-xs">
                    {isOffline ? 'Offline Mode' : 'NCE Assistant'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? 
                    <Maximize2 className="h-4 w-4 text-white/70" /> : 
                    <Minimize2 className="h-4 w-4 text-white/70" />
                  }
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-64 md:h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl text-sm ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : message.isError
                            ? 'bg-red-500/20 border border-red-400/50 text-red-200'
                            : message.isOffline
                            ? 'bg-yellow-500/20 border border-yellow-400/50 text-yellow-100'
                            : 'bg-white/10 border border-white/20 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.isOffline && (
                          <p className="text-xs mt-2 opacity-70 text-yellow-300">📱 Offline Response</p>
                        )}
                        <p className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-white/70' : 'text-white/50'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 border border-white/20 text-white p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AskAI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-white/60 text-xs mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getContextSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-xs rounded-full border border-white/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about NCE topics..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Context indicator */}
                  {context.currentPage && (
                    <p className="text-white/40 text-xs mt-2">
                      📍 Context: {context.currentPage.split('/').pop() || 'NCE Platform'}
                      {context.currentChapter && ` • ${context.currentChapter}`}
                    </p>
                  )}
                  
                  {/* Offline mode indicator */}
                  {isOffline && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-yellow-300 text-xs">⚠️ Offline mode - Basic help only</p>
                      <button
                        onClick={() => setIsOffline(false)}
                        className="text-xs px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded transition-colors"
                      >
                        Try Online
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
