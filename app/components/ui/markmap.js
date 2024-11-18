// app/components/ui/markmap.js
'use client';

import React, { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

// Add inline styles instead of importing CSS
const markmapStyles = `
.markmap-node {
  cursor: pointer;
}

.markmap-node-circle {
  fill: #fff;
  stroke-width: 1.5px;
}

.markmap-node-text {
  fill: currentColor;
  font-size: 14px;
}

.markmap-link {
  fill: none;
}
`;

const MarkmapChart = ({ content, className = '' }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    if (svgRef.current && typeof window !== 'undefined') {
      // Clear any existing content
      svgRef.current.innerHTML = '';
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = markmapStyles;
      document.head.appendChild(style);
      
      try {
        const transformer = new Transformer();
        const { root } = transformer.transform(content);
        
        const markmap = Markmap.create(svgRef.current, {
          embedGlobalStyle: false,
          duration: 500,
          nodeMinHeight: 16,
          paddingX: 16,
          color: (_, index) => 
            ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6366f1'][index % 5],
        }, root);

        // Clean up
        return () => {
          document.head.removeChild(style);
        };
      } catch (error) {
        console.error('Error creating markmap:', error);
      }
    }
  }, [content]);

  return (
    <div className={`h-[500px] w-full border rounded-lg bg-gray-50 my-4 ${className}`}>
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      />
    </div>
  );
};

export default MarkmapChart;
