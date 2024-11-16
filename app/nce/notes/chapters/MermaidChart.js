// File: app/nce/notes/chapters/MermaidChart.js
'use client'

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inter',
});

const MermaidChart = ({ chart }) => {
  const mermaidRef = useRef();

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid text-center my-8" ref={mermaidRef}>
      {chart}
    </div>
  );
};

export default MermaidChart;
