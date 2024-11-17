// File: app/components/ui/mermaid-chart.js
'use client';

import React, { useEffect, useRef, useState } from 'react';

const MermaidChart = ({ chart, className = '' }) => {
  const elementRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeMermaid = async () => {
      try {
        setIsLoading(true);
        
        // Dynamic import with specific configuration
        const mermaid = (await import('mermaid')).default;
        
        if (!mounted) return;

        // Configure mermaid with minimal setup
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inter',
          // Disable features that might cause issues
          mindmap: {
            useMaxWidth: true,
          },
          // Use simple renderer for flowcharts
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          // Sequence diagram configuration
          sequence: {
            useMaxWidth: true,
            showSequenceNumbers: false,
          },
          // Gantt chart configuration
          gantt: {
            useMaxWidth: true,
          }
        });

        if (elementRef.current) {
          elementRef.current.innerHTML = '';
          
          // Force async rendering
          await new Promise(resolve => setTimeout(resolve, 0));
          
          const { svg } = await mermaid.render('mermaid-svg', chart);
          
          if (!mounted) return;
          
          elementRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Mermaid chart rendering failed:', err);
        setError(err.message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeMermaid();

    return () => {
      mounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
        Failed to render diagram. Please check the syntax.
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-100 rounded-md w-full h-full min-h-[200px]" />
        </div>
      )}
      <div 
        ref={elementRef}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default MermaidChart;
