// File: app/nce/notes/chapters/b1c1.js
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Settings, BookOpen, AlertTriangle, LineChart, Share2, Anchor } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import mermaid with no SSR
const Mermaid = dynamic(() => import('./MermaidChart'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-md"></div>
});

// Component definitions
const CollapsibleSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-6 py-4 bg-white">{children}</div>}
    </div>
  );
};

const FormulaCard = ({ formula, description, units }) => (
  <div className="bg-gray-50 rounded-md p-4 mb-4 border-l-4 border-blue-500">
    <div className="text-lg mb-2">{formula}</div>
    {description && <p className="text-gray-600 mb-2">{description}</p>}
    {units && <p className="text-sm text-gray-500">Units: {units}</p>}
  </div>
);

const NoteCard = ({ type = 'info', title, children }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-500',
    warning: 'bg-amber-50 border-amber-500',
    success: 'bg-green-50 border-green-500'
  };
  return (
    <div className={`${styles[type]} border-l-4 rounded-md p-4 mb-4`}>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      {children}
    </div>
  );
};

const ChapterSummary = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inter',
    });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Energy Scenario</h1>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
            Chapter 1
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
            Energy Management and Conservation
          </span>
        </div>
      </div>

      {/* Quick Reference Section */}
      <CollapsibleSection title="Quick Reference" icon={<Settings className="w-5 h-5" />}>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Chapter Essence</h3>
          <p className="text-gray-700">
            Comprehensive overview of energy classification systems, global and Indian energy scenarios,
            energy security challenges, environmental impacts, and the Energy Conservation Act 2001 framework.
          </p>

          <h3 className="text-xl font-semibold">Key Takeaways</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Energy resources classification systems and their importance</li>
            <li>India&apos;s energy security challenges and import dependencies</li>
            <li>Energy efficiency as key strategy for sustainable development</li>
            <li>Climate change and environmental impact concerns</li>
            <li>Energy Conservation Act 2001&apos;s legal framework</li>
          </ul>

          <h3 className="text-xl font-semibold">Critical Formulas</h3>
          <div className="space-y-4">
            <FormulaCard 
              formula="Energy Intensity = Energy Consumption / GDP"
              description="Measures energy efficiency of economy"
            />
            <FormulaCard 
              formula="R/P Ratio = Reserves / Annual Production"
              description="Estimates remaining years of resource availability"
            />
            <FormulaCard 
              formula="GDP Growth of 6% → ~9% Energy Demand (India)"
              description="Relationship between economic and energy growth"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Main Summary Section */}
      <CollapsibleSection title="Main Summary" icon={<BookOpen className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Energy Classification Systems</h3>
            <div className="space-y-4">
              <NoteCard type="info">
                <ul className="list-disc list-inside space-y-2">
                  <li>Primary vs Secondary: Source-based classification</li>
                  <li>Commercial vs Non-commercial: Market availability based</li>
                  <li>Renewable vs Non-renewable: Replenishment capability based</li>
                </ul>
              </NoteCard>
              
              <div className="mermaid text-center">
                {`flowchart TD
                  A[Energy Sources] --> B[By Source]
                  A --> C[By Market]
                  A --> D[By Renewability]
                  
                  B --> B1[Primary Sources]
                  B --> B2[Secondary Sources]
                  
                  B1 --> B1a[Coal, Oil, Gas]
                  B1 --> B1b[Solar, Wind]
                  
                  B2 --> B2a[Electricity]
                  B2 --> B2b[Petrol, Steam]
                  
                  C --> C1[Commercial]
                  C --> C2[Non-Commercial]
                  
                  C1 --> C1a[Coal, Oil]
                  C1 --> C1b[Natural Gas]
                  
                  C2 --> C2a[Firewood]
                  C2 --> C2b[Animal Waste]
                  
                  D --> D1[Renewable]
                  D --> D2[Non-Renewable]
                  
                  D1 --> D1a[Solar, Wind]
                  D1 --> D1b[Hydro]
                  
                  D2 --> D2a[Coal, Oil]
                  D2 --> D2b[Natural Gas]`}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Global Energy Scenario</h3>
            <div className="space-y-4">
              <NoteCard type="warning" title="Resource Availability">
                <ul className="list-disc list-inside space-y-2">
                  <li>Oil reserves: ~45 years remaining</li>
                  <li>Gas reserves: ~65 years remaining</li>
                  <li>Coal reserves: ~200 years remaining</li>
                </ul>
              </NoteCard>
              
              <Mermaid chart={`gantt
                    title Global Resource Timeline
                    dateFormat YYYY
                    axisFormat %Y
                    
                    section Oil
                    Reserves           : 2024, 2069
                    
                    section Gas
                    Reserves           : 2024, 2089
                    
                    section Coal
                    Reserves           : 2024, 2224`} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Indian Energy Scenario</h3>
            <NoteCard type="info" title="Key Statistics">
              <ul className="list-disc list-inside space-y-2">
                <li>Coal: 55% of primary energy</li>
                <li>Oil imports: 70% of consumption</li>
                <li>Power deficit: ~14% peak demand</li>
                <li>Natural gas: 8.9% of energy consumption</li>
              </ul>
            </NoteCard>
          </div>
        </div>
      </CollapsibleSection>

      {/* Parameter Dependencies Section */}
      <CollapsibleSection title="Parameter Dependencies" icon={<Share2 className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Economic Growth</h3>
            <NoteCard type="info">
              <ul className="list-disc list-inside space-y-2">
                <li>Direct influences: Energy demand, infrastructure development</li>
                <li>Inverse relationships: Energy intensity with efficiency improvements</li>
                <li>Critical thresholds: GDP growth {'>'}8% requires significant infrastructure</li>
              </ul>
            </NoteCard>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Environmental Impact</h3>
            <div className="space-y-4">
              <NoteCard type="warning">
                <ul className="list-disc list-inside space-y-2">
                  <li>Direct influences: GHG emissions, air pollution</li>
                  <li>Inverse relationships: Clean energy adoption vs pollution</li>
                  <li>Critical thresholds: 2°C global temperature rise limit</li>
                </ul>
              </NoteCard>
              
              <Mermaid chart={`flowchart LR
                  Energy[Energy Use] --> Emissions[GHG Emissions]
                  Emissions --> Impact[Environmental Impact]
                  
                  Impact --> A[Air Quality]
                  Impact --> B[Global Warming]
                  Impact --> C[Acid Rain]
                  
                  A --> A1[SO2]
                  A --> A2[NOx]
                  A --> A3[Particulates]
                  
                  B --> B1[CO2]
                  B --> B2[Methane]
                  B --> B3[Temperature Rise]
                  
                  C --> C1[Water Bodies]
                  C --> C2[Soil Quality]
                  C --> C3[Biodiversity]
                  
                  style Energy fill:#f66,stroke:#333
                  style Emissions fill:#f96,stroke:#333
                  style Impact fill:#f69,stroke:#333`} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Problem-Solving Approaches Section */}
      <CollapsibleSection title="Problem-Solving Approaches" icon={<LineChart className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Energy Security Enhancement</h3>
            <div className="space-y-4">
              <NoteCard type="success">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Diversification of energy sources</li>
                  <li>Increasing domestic production</li>
                  <li>Energy efficiency improvements</li>
                  <li>Building strategic reserves</li>
                  <li>International cooperation</li>
                </ol>
              </NoteCard>
              
              <Mermaid chart={`flowchart TD
                  Security[Energy Security] --> Strategy[Strategic Actions]
                  Security --> Risk[Risk Mitigation]
                  
                  Strategy --> S1[Source Diversification]
                  Strategy --> S2[Domestic Production]
                  Strategy --> S3[Efficiency Improvement]
                  
                  Risk --> R1[Strategic Reserves]
                  Risk --> R2[International Cooperation]
                  Risk --> R3[Demand Management]
                  
                  style Security fill:#f9f,stroke:#333
                  style Strategy fill:#bbf,stroke:#333
                  style Risk fill:#fbf,stroke:#333`} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Energy Conservation Implementation</h3>
            <NoteCard type="success">
              <ol className="list-decimal list-inside space-y-2">
                <li>Identification of energy-intensive sectors</li>
                <li>Energy audit and assessment</li>
                <li>Implementation of efficiency measures</li>
                <li>Monitoring and verification</li>
                <li>Continuous improvement</li>
              </ol>
            </NoteCard>
          </div>
        </div>
      </CollapsibleSection>

      {/* Important Notes & Pitfalls Section */}
      <CollapsibleSection title="Important Notes & Pitfalls" icon={<AlertTriangle className="w-5 h-5" />}>
        <div className="space-y-4">
          <NoteCard type="warning" title="Common Misconceptions">
            <ul className="list-disc list-inside space-y-2">
              <li>Energy conservation equals reduced comfort/productivity</li>
              <li>Renewable energy can immediately replace fossil fuels</li>
              <li>Energy efficiency always has long payback periods</li>
            </ul>
          </NoteCard>

          <NoteCard type="info" title="Critical Assumptions">
            <ul className="list-disc list-inside space-y-2">
              <li>Energy demand grows with GDP</li>
              <li>Technology improvements enhance efficiency</li>
              <li>International energy prices remain volatile</li>
            </ul>
          </NoteCard>

          <NoteCard type="warning" title="Special Considerations">
            <ul className="list-disc list-inside space-y-2">
              <li>Regional variations in energy availability</li>
              <li>Sector-specific energy needs</li>
              <li>Social and economic impacts</li>
              <li>Infrastructure development requirements</li>
            </ul>
          </NoteCard>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ChapterSummary;
