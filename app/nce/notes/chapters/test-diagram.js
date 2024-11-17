// File: app/nce/notes/chapters/test-diagram.js
'use client';

import React from 'react';
import MermaidChart from '@/components/ui/mermaid-chart';

export default function TestDiagram() {
  const simpleDiagram = `
    graph TD
    A[Start] --> B[Process]
    B --> C[End]
  `;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Test Mermaid Diagram</h2>
      <MermaidChart chart={simpleDiagram} />
    </div>
  );
}
