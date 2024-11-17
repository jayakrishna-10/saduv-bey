// File: app/components/ui/mermaid-chart.js
'use client';

import React, { useEffect, useRef, useState } from 'react';

const MermaidChart = ({ chart, className = '' }) => {
  const elementRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log('Chart prop received:', chart); // Debug log

    const renderChart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading mermaid...'); // Debug log
        const { default: mermaid } = await import('mermaid');
        console.log('Mermaid loaded successfully'); // Debug log

        if (!mounted) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inter',
          fontSize: 14,
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: true,
            padding: 20
          }
        });
        console.log('Mermaid initialized'); // Debug log

        if (elementRef.current) {
          elementRef.current.innerHTML = '';
          const id = `mermaid-${Date.now()}`;
          elementRef.current.id = id;

          try {
            console.log('Parsing chart...'); // Debug log
            await mermaid.parse(chart);
            console.log('Chart parsed successfully'); // Debug log
            
            console.log('Rendering chart...'); // Debug log
            await mermaid.run({
              nodes: [elementRef.current]
            });
            console.log('Chart rendered successfully'); // Debug log
          } catch (renderError) {
            console.error('Mermaid rendering error:', renderError);
            setError('Failed to render diagram. Please check syntax.');
          }
        }
      } catch (err) {
        console.error('Mermaid chart error:', err);
        if (mounted) {
          setError(err.message || 'Error loading diagram library');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      mounted = false;
    };
  }, [chart]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-md">
        <div className="animate-pulse text-gray-400">Loading diagram...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
        <p className="font-medium">Error rendering diagram:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`mermaid-wrapper ${className}`}>
      <div 
        ref={elementRef}
        className="mermaid overflow-x-auto"
      />
    </div>
  );
};

export default MermaidChart;
