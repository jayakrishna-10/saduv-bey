// app/components/ui/markmap.js
'use client';

import React, { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import 'markmap-view/style/view.min.css';

const MarkmapChart = ({ content, className = '' }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    if (svgRef.current) {
      // Clear any existing content
      svgRef.current.innerHTML = '';
      
      const transformer = new Transformer();
      const { root } = transformer.transform(content);
      
      Markmap.create(svgRef.current, {
        embedGlobalStyle: false,
        duration: 500,
        nodeMinHeight: 16,
        tooltipOptions: { placement: 'top' },
        color: (_, index) => 
          ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6366f1'][index % 5],
      }, root);
    }
  }, [content]);

  return (
    <div className={`h-[500px] w-full border rounded-lg bg-gray-50 my-4 ${className}`}>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MarkmapChart;
