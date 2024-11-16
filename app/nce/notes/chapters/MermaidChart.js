// File: app/nce/notes/chapters/MermaidChart.js
'use client'

import React, { useEffect, useRef } from 'react';

const MermaidChart = ({ chart }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inter',
        });
        
        if (elementRef.current) {
          elementRef.current.innerHTML = '';
          await mermaid.render('mermaid-svg', chart, (svgCode) => {
            if (elementRef.current) {
              elementRef.current.innerHTML = svgCode;
            }
          });
        }
      } catch (error) {
        console.error('Mermaid initialization failed:', error);
      }
    };

    initializeMermaid();
  }, [chart]);

  return <div ref={elementRef} className="text-center my-8" />;
};

export default MermaidChart;
