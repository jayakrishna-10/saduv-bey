// app/components/AskAI.js - Improved version with better mobile UX and text visibility
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Sparkles, Expand, Shrink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

    collectContext();
    
    const handleLocationChange = () => {
      setTimeout(collectContext, 100);
    };

    window.addEventListener('popstate', handleLocationChange);
    
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

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}...`);
      }

      if (!response.ok) {
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
      let errorMessage = `❌ Sorry, I'm having trouble responding right now.\n\n`;
      
      if (error.message.includes('fetch') || error.message.includes('Network')) {
        errorMessage += `**Connection Issue**: Please check your internet connection and try again.`;
      } else if (error.message.includes('timeout') || error.message.includes('408')) {
        errorMessage += `**Timeout**: The request took too long. Please try a shorter question.`;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage += `**Rate Limit**: Too many requests. Please wait a moment before trying again.`;
      } else {
        errorMessage += `**Error**: ${error.message}`;
      }

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

  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-7 w-7" />
            
            {/* Notification dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-yellow-900" />
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
            className={`fixed z-50 backdrop-blur-xl bg-gray-900/95 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl ${
              isFullscreen 
                ? 'inset-4 max-w-none w-auto h-auto' 
                : isMobile 
                  ? 'bottom-4 left-4 right-4 max-h-[85vh]' 
                  : 'bottom-6 right-6 w-96 max-h-[80vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AskAI</h3>
                  <p className="text-gray-300 text-sm">NCE Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? 
                      <Shrink className="h-4 w-4 text-gray-300" /> : 
                      <Expand className="h-4 w-4 text-gray-300" />
                    }
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? 
                    <Maximize2 className="h-4 w-4 text-gray-300" /> : 
                    <Minimize2 className="h-4 w-4 text-gray-300" />
                  }
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4 text-gray-300" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className={`overflow-y-auto p-4 space-y-4 ${
                  isFullscreen ? 'h-full pb-24' : isMobile ? 'h-80' : 'h-96'
                }`}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : message.isError
                            ? 'bg-red-900/50 border border-red-500/50 text-red-200'
                            : 'bg-gray-800 border border-gray-600 text-gray-100'
                        }`}
                      >
                        {message.type === 'ai' ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                // Custom components for better styling
                                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-100">{children}</p>,
                                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold mb-2 text-white">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-100">{children}</li>,
                                code: ({ inline, children }) => 
                                  inline ? (
                                    <code className="bg-gray-700 px-2 py-1 rounded text-purple-300 text-sm">{children}</code>
                                  ) : (
                                    <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto text-sm">
                                      <code className="text-purple-300">{children}</code>
                                    </pre>
                                  ),
                                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-200 my-3">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="leading-relaxed">{message.content}</p>
                        )}
                        <p className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-400'
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
                      <div className="bg-gray-800 border border-gray-600 text-gray-100 p-4 rounded-2xl">
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
                  <div className="px-4 pb-3">
                    <p className="text-gray-400 text-sm mb-3">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getContextSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-full border border-gray-600 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className={`p-4 border-t border-gray-700 ${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-gray-900/95' : ''}`}>
                  <div className="flex gap-3">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about NCE topics..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-gray-100 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none min-h-[44px] max-h-32"
                      disabled={isLoading}
                      rows={1}
                      style={{ 
                        lineHeight: '1.5',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] h-[44px] flex items-center justify-center"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Context indicator */}
                  {context.currentPage && (
                    <p className="text-gray-500 text-xs mt-2">
                      📍 Context: {context.currentPage.split('/').pop() || 'NCE Platform'}
                      {context.currentChapter && ` • ${context.currentChapter}`}
                    </p>
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
