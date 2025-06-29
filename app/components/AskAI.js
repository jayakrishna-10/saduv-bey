// app/components/AskAI.js - Lightning-fast version
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2, Sparkles, Expand, Shrink } from 'lucide-react';

// Lazy load heavy dependencies
const loadMarkdown = () => import('react-markdown');
const loadMath = () => Promise.all([
  import('remark-math'),
  import('rehype-katex')
]);

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({});
  const [markdownComponents, setMarkdownComponents] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const contextTimeoutRef = useRef(null);

  // Initialize with welcome message only when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: 'Hi! I\'m AskAI, your NCE preparation assistant. Ask me anything about energy management, thermal utilities, electrical utilities, or exam strategies!',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll (lightweight)
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Lightweight context collection with debouncing
  const collectContext = useCallback(() => {
    if (contextTimeoutRef.current) {
      clearTimeout(contextTimeoutRef.current);
    }
    
    contextTimeoutRef.current = setTimeout(() => {
      const pathname = window.location.pathname;
      const newContext = { currentPage: pathname };

      // Minimal context extraction
      if (pathname.includes('/quiz')) {
        newContext.section = 'quiz';
        const questionEl = document.querySelector('h2');
        if (questionEl) newContext.currentQuestion = questionEl.textContent?.slice(0, 100);
      } else if (pathname.includes('/test')) {
        newContext.section = 'test';
      } else if (pathname.includes('/notes')) {
        newContext.section = 'notes';
      } else if (pathname.includes('/nce')) {
        newContext.section = 'nce';
      }

      setContext(newContext);
    }, 100);
  }, []);

  useEffect(() => {
    if (isOpen) {
      collectContext();
    }
    return () => {
      if (contextTimeoutRef.current) {
        clearTimeout(contextTimeoutRef.current);
      }
    };
  }, [isOpen, collectContext]);

  // Load markdown components only when first AI message with formatting is received
  const loadMarkdownComponents = useCallback(async () => {
    if (markdownComponents) return markdownComponents;

    try {
      const [{ default: ReactMarkdown }, [{ default: remarkMath }, { default: rehypeKatex }]] = await Promise.all([
        loadMarkdown(),
        loadMath()
      ]);

      const components = {
        ReactMarkdown,
        remarkMath,
        rehypeKatex,
        markdownProps: {
          components: {
            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-gray-100">{children}</p>,
            h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-bold mb-2 text-white">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-gray-100">{children}</li>,
            code: ({ inline, children }) => 
              inline ? (
                <code className="bg-gray-700 px-2 py-1 rounded text-purple-300 text-sm">{children}</code>
              ) : (
                <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto text-sm my-2">
                  <code className="text-purple-300">{children}</code>
                </pre>
              ),
            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
            em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
          }
        }
      };

      setMarkdownComponents(components);
      return components;
    } catch (error) {
      console.error('Failed to load markdown components:', error);
      return null;
    }
  }, [markdownComponents]);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          context: context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        needsMarkdown: data.response.includes('*') || data.response.includes('#') || data.response.includes('`')
      };

      setMessages(prev => [...prev, aiMessage]);

      // Preload markdown if needed
      if (aiMessage.needsMarkdown && !markdownComponents) {
        loadMarkdownComponents();
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `❌ ${error.message.includes('fetch') ? 'Connection error. Please check your internet.' : error.message}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  const getQuickSuggestions = useCallback(() => {
    if (context.section === 'quiz') {
      return ["Explain this concept", "Why is this correct?", "Give me an example"];
    } else if (context.section === 'test') {
      return ["Test strategies", "Time management", "Common mistakes"];
    } else if (context.section === 'notes') {
      return ["Summarize this", "Key formulas", "Applications"];
    }
    return ["Study tips", "Important topics", "Exam strategies"];
  }, [context.section]);

  // Simple text renderer for fast display
  const SimpleTextRenderer = ({ content }) => (
    <div className="leading-relaxed text-gray-100 whitespace-pre-wrap">{content}</div>
  );

  // Enhanced markdown renderer (lazy loaded)
  const MarkdownRenderer = ({ content, onLoad }) => {
    const [isReady, setIsReady] = useState(false);
    const [components, setComponents] = useState(null);

    useEffect(() => {
      if (markdownComponents) {
        setComponents(markdownComponents);
        setIsReady(true);
        onLoad?.();
      } else {
        loadMarkdownComponents().then((comp) => {
          if (comp) {
            setComponents(comp);
            setIsReady(true);
            onLoad?.();
          }
        });
      }
    }, [onLoad]);

    if (!isReady || !components) {
      return <SimpleTextRenderer content={content} />;
    }

    const { ReactMarkdown, remarkMath, rehypeKatex, markdownProps } = components;

    return (
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          {...markdownProps}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Floating Bubble - Pure CSS Animation */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <MessageCircle className="h-7 w-7" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-3 w-3 text-yellow-900" />
          </div>
        </div>
      )}

      {/* Chat Window - Optimized Rendering */}
      {isOpen && (
        <div 
          className={`fixed z-50 bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
            isFullscreen 
              ? 'inset-4' 
              : isMobile 
                ? 'bottom-4 left-4 right-4 max-h-[85vh]' 
                : 'bottom-6 right-6 w-96 max-h-[80vh]'
          } ${isMinimized ? 'h-16' : ''}`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
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
                >
                  {isFullscreen ? <Shrink className="h-4 w-4 text-gray-300" /> : <Expand className="h-4 w-4 text-gray-300" />}
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4 text-gray-300" /> : <Minimize2 className="h-4 w-4 text-gray-300" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
                  <div
                    key={message.id}
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
                        message.needsMarkdown && !message.isError ? (
                          <MarkdownRenderer content={message.content} />
                        ) : (
                          <SimpleTextRenderer content={message.content} />
                        )
                      ) : (
                        <SimpleTextRenderer content={message.content} />
                      )}
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-600 text-gray-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-3">
                  <p className="text-gray-400 text-sm mb-3">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {getQuickSuggestions().map((suggestion, index) => (
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
                    style={{ fontSize: '16px' }} // Prevent iOS zoom
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] h-[44px] flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
                
                {context.currentPage && (
                  <p className="text-gray-500 text-xs mt-2">
                    📍 {context.currentPage.split('/').pop() || 'NCE Platform'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
