// app/components/AskAI.js - Updated with dark mode support
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

    try {
      console.log('Sending request to /api/ask-ai with:', {
        message: currentInput,
        context: context
      });

      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: context
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Response data:', data);
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}...`);
      }

      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.error || `HTTP ${response.status}: ${data.message || 'Service error'}`);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Create detailed error message for troubleshooting
      let errorMessage = `❌ Error Details:\n`;
      errorMessage += `• Error Type: ${error.name}\n`;
      errorMessage += `• Message: ${error.message}\n`;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += `• Cause: Network/Fetch error - check internet connection\n`;
        errorMessage += `• URL: /api/ask-ai\n`;
      } else if (error.message.includes('timeout') || error.message.includes('408')) {
        errorMessage += `• Cause: Request timeout\n`;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage += `• Cause: Rate limit exceeded\n`;
      } else if (error.message.includes('non-JSON response')) {
        errorMessage += `• Cause: Server returned HTML instead of JSON\n`;
      } else {
        errorMessage += `• Cause: Unknown error\n`;
      }
      
      errorMessage += `\nFull error: ${error.toString()}`;

      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
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
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 max-h-[80vh] backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/30 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AskAI</h3>
                  <p className="text-white/70 text-xs">NCE Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded transition-colors"
                >
                  {isMinimized ? 
                    <Maximize2 className="h-4 w-4 text-white/70" /> : 
                    <Minimize2 className="h-4 w-4 text-white/70" />
                  }
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded transition-colors"
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
                            ? 'bg-red-500/20 dark:bg-red-900/30 border border-red-400/50 dark:border-red-600/50 text-red-200 dark:text-red-300'
                            : 'bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-white dark:text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed font-mono text-xs">{message.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-white/70' : 'text-white/50 dark:text-gray-400'
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
                      <div className="bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-white dark:text-gray-100 p-3 rounded-xl">
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
                    <p className="text-white/60 dark:text-gray-400 text-xs mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getContextSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 py-1 bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 text-white/80 dark:text-gray-300 text-xs rounded-full border border-white/20 dark:border-gray-700/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/20 dark:border-gray-700/30">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about NCE topics..."
                      className="flex-1 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-lg px-3 py-2 text-white dark:text-gray-100 text-sm placeholder-white/50 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
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
                    <p className="text-white/40 dark:text-gray-500 text-xs mt-2">
                      📍 Context: {context.currentPage.split('/').pop() || 'NCE Platform'}
                      {context.currentChapter && ` • ${context.currentChapter}`}
                    </p>
                  )}
                  
                  {/* Debug info */}
                  <div className="mt-2 text-white/30 dark:text-gray-600 text-xs">
                    <p>🔧 Debug Mode: All errors will be shown for troubleshooting</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
