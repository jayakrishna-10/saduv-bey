// File: app/nce/notes/chapters/MermaidChart.js
'use client'

import React, { useEffect, useRef } from 'react';

const MermaidChart = ({ chart }) => {
  const mermaidRef = useRef();

  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inter',
      });
      mermaid.default.contentLoaded();
    });
  }, []);

  return (
    <div className="mermaid text-center my-8" ref={mermaidRef}>
      {chart}
    </div>
  );
};

export default MermaidChart;
