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
    console.log('Attempting to render chart:', chart); // Debug log

    const initializeMermaid = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Importing mermaid...'); // Debug log
        const mermaid = (await import('mermaid')).default;
        console.log('Mermaid imported successfully'); // Debug log
        
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
            useMaxWidth: true
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

        console.log('Mermaid initialized with config'); // Debug log

        // Generate a unique id for this render
        const elementId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        console.log('Generated element ID:', elementId); // Debug log

        try {
          // First, check if the chart is valid
          await mermaid.parse(chart);
          console.log('Chart syntax validated successfully'); // Debug log

          // Render the diagram
          const { svg } = await mermaid.render(elementId, chart);
          console.log('Chart rendered successfully'); // Debug log
          
          if (!mounted) return;
          
          // Set the SVG content
          setSvgContent(svg);
          setError(null);
        } catch (parseError) {
          console.error('Chart parsing/rendering failed:', parseError); // Debug log
          throw parseError;
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Mermaid chart rendering failed:', err);
        setError(err.message || 'Failed to render diagram. Please check the syntax.');
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-md">
        <div className="animate-pulse text-gray-400">Loading diagram...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
        <p className="font-medium">Error rendering diagram:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Return the rendered diagram
  return (
    <div className={`mermaid-wrapper ${className}`}>
      {svgContent ? (
        <div 
          ref={elementRef}
          className="mermaid"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">
          No diagram content available
        </div>
      )}
    </div>
  );
};

export default MermaidChart;
