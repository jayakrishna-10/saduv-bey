// File: app/components/ui/mermaid-chart.js
'use client';

import React, { useEffect, useRef, useState } from 'react';

const MermaidChart = ({ chart, className = '' }) => {
  const elementRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    let mounted = true;

    const initializeMermaid = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Import mermaid dynamically
        const { default: mermaid } = await import('mermaid');
        
        if (!mounted) return;

        // Initialize mermaid with specific config
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inter',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          er: {
            useMaxWidth: true
          },
          sequence: {
            useMaxWidth: true
          },
          gantt: {
            useMaxWidth: true
          }
        });

        // Generate a unique id for this render
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, chart);
        
        if (!mounted) return;
        
        // Set the SVG content
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error('Mermaid chart rendering failed:', err);
        setError('Failed to render diagram. Please check the syntax.');
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

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  // Return the component
  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-100 rounded-md w-full h-full min-h-[200px]" />
        </div>
      )}
      
      {/* Rendered diagram */}
      <div 
        ref={elementRef}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
      />
    </div>
  );
};

export default MermaidChart;
