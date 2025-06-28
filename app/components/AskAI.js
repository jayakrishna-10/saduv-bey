// app/components/AskAI.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Sparkles, RotateCcw } from 'lucide-react';

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({});
  const [previousContext, setPreviousContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  const getWelcomeMessage = () => ({
    id: Date.now(),
    type: 'ai',
    content: 'Hi! I\'m AskAI, your NCE preparation assistant. Ask me anything about energy management, thermal utilities, electrical utilities, or exam strategies!',
    timestamp: new Date()
  });

  // Initialize messages
  useEffect(() => {
    setMessages([getWelcomeMessage()]);
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Collect context from the current page and reset chat on question change
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
        
        // Try to get current question text (more specific selector for quiz questions)
        const questionElement = document.querySelector('h2') || document.querySelector('.text-lg.font-bold, .text-xl.font-bold');
        if (questionElement) {
          newContext.currentQuestion = questionElement.textContent?.slice(0, 100); // Shorter identifier
          newContext.questionId = questionElement.textContent?.slice(0, 50); // Unique identifier
        }
        
        // Get current chapter/topic if available
        const chapterElement = document.querySelector('.text-white\\/70, .text-white\\/60');
        if (chapterElement) {
          newContext.currentChapter = chapterElement.textContent;
        }
      } 
      else if (pathname.includes('/nce/test')) {
        newContext.paper = 'test';
        
        // Get current question for test interface
        const questionElement = document.querySelector('h2') || document.querySelector('.text-lg.font-bold, .text-xl.font-bold');
        if (questionElement) {
          newContext.questionId = questionElement.textContent?.slice(0, 50);
        }
        
        // Get question number from test interface
        const questionNumberElement = document.querySelector('[class*="Q"], .px-3.py-1.bg-white');
        if (questionNumberElement) {
          newContext.questionNumber = questionNumberElement.textContent;
        }
        
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

      // Check if we've moved to a new question and should reset chat
      const shouldResetChat = (
        (newContext.questionId && previousContext.questionId && newContext.questionId !== previousContext.questionId) ||
        (newContext.questionNumber && previousContext.questionNumber && newContext.questionNumber !== previousContext.questionNumber) ||
        (newContext.currentPage !== previousContext.currentPage && newContext.paper !== previousContext.paper)
      );

      if (shouldResetChat && Object.keys(previousContext).length > 0) {
        console.log('🔄 Resetting chat - moved to new question/page');
        setMessages([getWelcomeMessage()]);
      }

      setPreviousContext(context);
      setContext(newContext);
    };

    // Collect context on mount and when URL changes
    collectContext();
    
    // Listen for URL changes (for SPA navigation)
    const handleLocationChange = () => {
      setTimeout(collectContext, 100); // Small delay to let content load
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Also observe DOM changes to capture dynamic content (with debouncing)
    let debounceTimer;
    const debouncedCollectContext = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(collectContext, 300);
    };

    const observer = new MutationObserver(debouncedCollectContext);
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      observer.disconnect();
      clearTimeout(debounceTimer);
    };
  }, [context, previousContext]);

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

  // Manual chat reset function
  const resetChat = () => {
    setMessages([getWelcomeMessage()]);
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
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 max-h-[80vh] backdrop-blur-md bg-gray-900/95 border border-white/30 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-purple-600/30 to-pink-600/30">
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
                  onClick={resetChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Reset Chat"
                >
                  <RotateCcw className="h-4 w-4 text-white/70" />
                </button>
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
                <div className="h-64 md:h-80 overflow-y-auto p-4 space-y-4 bg-gray-800/50">
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
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : message.isError
                            ? 'bg-red-900/80 border border-red-500/50 text-red-100 backdrop-blur-sm'
                            : 'bg-gray-700/90 border border-gray-600/50 text-gray-100 backdrop-blur-sm shadow-lg'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-300'
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
                      <div className="bg-gray-700/90 border border-gray-600/50 text-gray-100 p-3 rounded-xl backdrop-blur-sm shadow-lg">
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
                  <div className="px-4 pb-2 bg-gray-800/30">
                    <p className="text-gray-300 text-xs mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getContextSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 py-1 bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 text-xs rounded-full border border-gray-600/50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/20 bg-gray-800/30">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about NCE topics..."
                      className="flex-1 bg-gray-700/80 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
                    <p className="text-gray-400 text-xs mt-2">
                      📍 Context: {context.currentPage.split('/').pop() || 'NCE Platform'}
                      {context.currentChapter && ` • ${context.currentChapter}`}
                    </p>
                  )}
                  
                  {/* Auto-reset info */}
                  <div className="mt-2 text-gray-400 text-xs">
                    <p>💡 Chat resets automatically when you move to a new question</p>
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
