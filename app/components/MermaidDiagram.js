// app/components/MermaidDiagram.js
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Maximize2, Code } from 'lucide-react';

// Lazy import mermaid - only loads when component is used
let mermaid = null;

const MermaidDiagram = ({ content, caption, id = null }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate unique ID for each diagram
  const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    let isMounted = true;

    const loadMermaidAndRender = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Lazy load mermaid library
        if (!mermaid) {
          const mermaidModule = await import('mermaid');
          mermaid = mermaidModule.default;
          
          // Configure mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#8B5CF6',
              primaryTextColor: '#FFFFFF',
              primaryBorderColor: '#A855F7',
              lineColor: '#E5E7EB',
              secondaryColor: '#1F2937',
              tertiaryColor: '#374151',
              background: '#111827',
              mainBkg: '#1F2937',
              secondBkg: '#374151',
              tertiaryBkg: '#4B5563'
            },
            fontFamily: 'Inter, system-ui, sans-serif',
            flowchart: {
              htmlLabels: true,
              curve: 'basis',
              useMaxWidth: true,
              padding: 20
            },
            sequence: {
              diagramMarginX: 20,
              diagramMarginY: 20,
              actorMargin: 50,
              width: 150,
              height: 65,
              boxMargin: 10,
              boxTextMargin: 5,
              noteMargin: 10,
              messageMargin: 35,
              mirrorActors: true,
              bottomMarginAdj: 1,
              useMaxWidth: true,
              rightAngles: false,
              showSequenceNumbers: false
            },
            gantt: {
              useMaxWidth: true,
              leftPadding: 75,
              rightPadding: 20,
              gridLineStartPadding: 35,
              fontSize: 11,
              fontFamily: 'Inter, system-ui, sans-serif'
            }
          });
          
          setIsLibraryLoaded(true);
        }

        if (!isMounted) return;

        // Validate and sanitize content
        if (!content || typeof content !== 'string') {
          throw new Error('Invalid diagram content');
        }

        // Basic security: remove potentially harmful content
        const sanitizedContent = content
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');

        // Clear previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Validate mermaid syntax
        const isValid = await mermaid.parse(sanitizedContent);
        if (!isValid && isMounted) {
          throw new Error('Invalid Mermaid syntax');
        }

        if (!isMounted) return;

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, sanitizedContent);
        
        if (containerRef.current && isMounted) {
          containerRef.current.innerHTML = svg;
          
          // Make diagram responsive
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.backgroundColor = 'transparent';
            
            // Add click handlers for fullscreen
            svgElement.style.cursor = 'pointer';
            svgElement.addEventListener('click', () => setIsFullscreen(true));
          }
        }

      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to render diagram');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMermaidAndRender();

    return () => {
      isMounted = false;
    };
  }, [content, diagramId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
              <div className="text-blue-300 font-semibold mb-2">
                {!isLibraryLoaded ? 'Loading diagram engine...' : 'Rendering diagram...'}
              </div>
              <div className="text-blue-200 text-sm">
                {!isLibraryLoaded ? 'First time load may take a moment' : 'Processing Mermaid syntax...'}
              </div>
            </div>
          </div>
        </div>
        {caption && (
          <p className="text-white/70 text-sm text-center italic">{caption}</p>
        )}
      </div>
    );
  }

  // Error state with fallback to code view
  if (error) {
    return (
      <div className="space-y-3">
        <div className="bg-red-500/10 rounded-xl p-6 border border-red-400/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-300 font-semibold">Diagram Error</span>
            <button
              onClick={() => setShowCode(!showCode)}
              className="ml-auto p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title="View source code"
            >
              <Code className="h-4 w-4 text-red-300" />
            </button>
          </div>
          
          <p className="text-red-200 text-sm mb-4">{error}</p>
          
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-900 rounded-lg p-4 border border-red-400/20">
                  <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{content}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4 text-red-200 text-xs">
            Click the code icon above to view the diagram source.
          </div>
        </div>
        {caption && (
          <p className="text-white/70 text-sm text-center italic">{caption}</p>
        )}
      </div>
    );
  }

  // Success state - rendered diagram
  return (
    <>
      <div className="space-y-3">
        <div className="bg-blue-500/10 rounded-xl border border-blue-400/30 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-blue-300 font-semibold text-sm">Interactive Diagram</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="View source code"
              >
                <Code className="h-4 w-4 text-blue-300" />
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="h-4 w-4 text-blue-300" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div 
              ref={containerRef}
              className="mermaid-container flex justify-center items-center min-h-[200px]"
            />
            
            <div className="mt-4 text-blue-200 text-xs text-center">
              Click diagram to view fullscreen • Hover for details
            </div>
          </div>
          
          {/* Source code toggle */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-blue-400/20"
              >
                <div className="p-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-blue-300 text-sm font-medium mb-2">Source Code:</div>
                    <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                      <code>{content}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {caption && (
          <p className="text-white/70 text-sm text-center italic">{caption}</p>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl border border-blue-400/30 max-w-6xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                <h3 className="text-blue-300 font-semibold">Diagram - Fullscreen View</h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <AlertCircle className="h-5 w-5 text-blue-300 rotate-45" />
                </button>
              </div>
              
              <div className="p-8">
                <div 
                  className="mermaid-container flex justify-center items-center"
                  dangerouslySetInnerHTML={{ __html: containerRef.current?.innerHTML || '' }}
                />
                
                {caption && (
                  <p className="text-white/70 text-center mt-6 italic">{caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MermaidDiagram;
