'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

const MarkmapChart = ({ content, className = '' }) => {
  const svgRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let markmapInstance = null;

    const initializeMarkmap = async () => {
      try {
        if (!svgRef.current || !mounted) return;

        // Clear any existing content
        svgRef.current.innerHTML = '';

        // Initialize transformer
        const transformer = new Transformer();
        
        // Transform the content
        const { root } = transformer.transform(content);

        // Create markmap instance
        if (mounted) {
          markmapInstance = Markmap.create(svgRef.current, {
            duration: 500,
            nodeMinHeight: 16,
            paddingX: 16,
            autoFit: true,
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

          // Initial fit
          setTimeout(() => {
            if (markmapInstance && mounted) {
              markmapInstance.fit();
            }
          }, 100);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing markmap:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initializeMarkmap();

    // Cleanup
    return () => {
      mounted = false;
      if (markmapInstance) {
        // Cleanup markmap instance if needed
        markmapInstance = null;
      }
    };
  }, [content]);

  if (loading) {
    return (
      <div className={`h-[500px] w-full border rounded-lg bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[500px] w-full border rounded-lg bg-red-50 flex items-center justify-center ${className}`}>
        <div className="text-red-600">Error loading diagram: {error}</div>
      </div>
    );
  }

  return (
    <div className={`h-[500px] w-full border rounded-lg bg-gray-50 ${className}`}>
      <svg 
        ref={svgRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default MarkmapChart;
