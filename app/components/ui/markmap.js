// app/components/ui/markmap.js
'use client';

import React, { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { loadCSS, loadJS } from 'markmap-view';

const MarkmapChart = ({ content, className = '' }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    // Load required assets
    loadCSS();
    loadJS();
    
    if (svgRef.current && typeof window !== 'undefined') {
      // Clear any existing content
      svgRef.current.innerHTML = '';
      
      try {
        const transformer = new Transformer();
        const { root } = transformer.transform(content);
        
        const markmap = Markmap.create(svgRef.current, {
          duration: 500,
          nodeMinHeight: 16,
          paddingX: 16,
          color: (_, index) => 
            ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6366f1'][index % 5],
          style: (node) => {
            if (node.depth === 0) return { fill: '#1e293b', fontSize: '16px', fontWeight: 'bold' };
            if (node.depth === 1) return { fill: '#475569', fontSize: '14px', fontWeight: '500' };
            return { fill: '#64748b', fontSize: '12px' };
          }
        }, root);

        // Fit the content initially
        setTimeout(() => {
          markmap.fit();
        }, 100);

        // Handle window resize
        const handleResize = () => markmap.fit();
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
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
