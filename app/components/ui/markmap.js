'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

// Prevent browser sync issues
const isBrowser = typeof window !== 'undefined';

const MarkmapChart = ({ content, className = '' }) => {
  const svgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markmapRef = useRef(null);

  useEffect(() => {
    if (!isBrowser) return;

    const renderChart = async () => {
      try {
        if (!svgRef.current) return;

        // Clear previous content
        svgRef.current.innerHTML = '';
        
        const transformer = new Transformer();
        const { root } = transformer.transform(content);

        // Destroy previous instance if exists
        if (markmapRef.current) {
          markmapRef.current = null;
        }

        const mm = Markmap.create(svgRef.current, {
          embedGlobalStyle: false,
          duration: 500,
          maxWidth: 800,
          nodeMinHeight: 16,
          paddingX: 16,
          autoFit: true,
          initialExpandLevel: 2,
          color: (_, index) => 
            ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6366f1'][index % 5],
          style: (node) => {
            const styles = {
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            };
            if (node.depth === 0) return { ...styles, fontSize: '16px', fontWeight: 'bold' };
            if (node.depth === 1) return { ...styles, fontSize: '14px', fontWeight: '500' };
            return { ...styles, fontSize: '12px' };
          }
        }, root);

        markmapRef.current = mm;

        // Ensure proper sizing and fit
        const resizeObserver = new ResizeObserver(() => {
          if (markmapRef.current) {
            markmapRef.current.fit();
          }
        });

        resizeObserver.observe(svgRef.current.parentElement);

        // Initial fit after a short delay to ensure proper rendering
        setTimeout(() => {
          if (markmapRef.current) {
            markmapRef.current.fit();
          }
          setIsLoading(false);
        }, 100);

        return () => {
          resizeObserver.disconnect();
          if (markmapRef.current) {
            markmapRef.current = null;
          }
        };
      } catch (err) {
        console.error('Error rendering markmap:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    renderChart();
  }, [content]);

  if (isLoading) {
    return (
      <div className={`h-[500px] w-full border rounded-lg bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[500px] w-full border rounded-lg bg-red-50 flex flex-col items-center justify-center ${className}`}>
        <p className="text-red-600 font-medium mb-2">Failed to load chart</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`h-[500px] w-full border rounded-lg bg-gray-50 overflow-hidden ${className}`}>
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ 
          minWidth: '100%',
          minHeight: '100%',
        }}
      />
    </div>
  );
};

export default MarkmapChart;
