// File: app/nce/notes/chapters/b1c1.js
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, BookOpen, AlertTriangle, LineChart, Share2, Anchor } from 'lucide-react';
import ReactFlow, { 
  Handle, 
  Position, 
  Background,
  Controls,
  MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Component
const CustomNode = ({ data }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${data.borderColor || 'border-gray-200'}`}>
      <div className="font-bold">{data.label}</div>
      {data.description && <div className="text-xs text-gray-500">{data.description}</div>}
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

// Reusable Components
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
              
              <FlowChart nodes={energyClassificationFlow.nodes} edges={energyClassificationFlow.edges} />
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
              
              <FlowChart nodes={environmentalImpactFlow.nodes} edges={environmentalImpactFlow.edges} />
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
              
              <FlowChart nodes={energySecurityFlow.nodes} edges={energySecurityFlow.edges} />
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
const nodeTypes = {
  custom: CustomNode,
};

// Chart Components
const FlowChart = ({ nodes, edges }) => {
  return (
    <div className="h-[500px] w-full border rounded-lg bg-gray-50 my-4">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

// Flow Diagrams Data
const energyClassificationFlow = {
  nodes: [
    {
      id: '1',
      type: 'custom',
      data: { label: 'Energy Sources' },
      position: { x: 250, y: 0 },
    },
    // By Source branch
    {
      id: '2',
      type: 'custom',
      data: { label: 'By Source' },
      position: { x: 50, y: 100 },
    },
    {
      id: '3',
      type: 'custom',
      data: { label: 'Primary Sources', description: 'Coal, Oil, Solar' },
      position: { x: 0, y: 200 },
    },
    {
      id: '4',
      type: 'custom',
      data: { label: 'Secondary Sources', description: 'Electricity, Petrol' },
      position: { x: 150, y: 200 },
    },
    // By Market branch
    {
      id: '5',
      type: 'custom',
      data: { label: 'By Market' },
      position: { x: 250, y: 100 },
    },
    {
      id: '6',
      type: 'custom',
      data: { label: 'Commercial', description: 'Coal, Oil, Gas' },
      position: { x: 250, y: 200 },
    },
    {
      id: '7',
      type: 'custom',
      data: { label: 'Non-Commercial', description: 'Firewood, Waste' },
      position: { x: 400, y: 200 },
    },
    // By Renewability branch
    {
      id: '8',
      type: 'custom',
      data: { label: 'By Renewability' },
      position: { x: 450, y: 100 },
    },
    {
      id: '9',
      type: 'custom',
      data: { label: 'Renewable', description: 'Solar, Wind, Hydro' },
      position: { x: 500, y: 200 },
    },
    {
      id: '10',
      type: 'custom',
      data: { label: 'Non-Renewable', description: 'Coal, Oil, Gas' },
      position: { x: 650, y: 200 },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-5', source: '1', target: '5', animated: true },
    { id: 'e1-8', source: '1', target: '8', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e5-7', source: '5', target: '7' },
    { id: 'e8-9', source: '8', target: '9' },
    { id: 'e8-10', source: '8', target: '10' },
  ],
};

const environmentalImpactFlow = {
  nodes: [
    {
      id: '1',
      type: 'custom',
      data: { 
        label: 'Energy Use',
        borderColor: 'border-red-200'
      },
      position: { x: 250, y: 0 },
    },
    {
      id: '2',
      type: 'custom',
      data: { 
        label: 'GHG Emissions',
        borderColor: 'border-orange-200'
      },
      position: { x: 250, y: 100 },
    },
    {
      id: '3',
      type: 'custom',
      data: { 
        label: 'Environmental Impact',
        borderColor: 'border-yellow-200'
      },
      position: { x: 250, y: 200 },
    },
    // Air Quality Branch
    {
      id: '4',
      type: 'custom',
      data: { label: 'Air Quality' },
      position: { x: 50, y: 300 },
    },
    {
      id: '5',
      type: 'custom',
      data: { label: 'SO2' },
      position: { x: 0, y: 400 },
    },
    {
      id: '6',
      type: 'custom',
      data: { label: 'NOx' },
      position: { x: 50, y: 400 },
    },
    {
      id: '7',
      type: 'custom',
      data: { label: 'Particulates' },
      position: { x: 100, y: 400 },
    },
    // Global Warming Branch
    {
      id: '8',
      type: 'custom',
      data: { label: 'Global Warming' },
      position: { x: 250, y: 300 },
    },
    {
      id: '9',
      type: 'custom',
      data: { label: 'CO2' },
      position: { x: 200, y: 400 },
    },
    {
      id: '10',
      type: 'custom',
      data: { label: 'Methane' },
      position: { x: 250, y: 400 },
    },
    {
      id: '11',
      type: 'custom',
      data: { label: 'Temperature Rise' },
      position: { x: 300, y: 400 },
    },
    // Acid Rain Branch
    {
      id: '12',
      type: 'custom',
      data: { label: 'Acid Rain' },
      position: { x: 450, y: 300 },
    },
    {
      id: '13',
      type: 'custom',
      data: { label: 'Water Bodies' },
      position: { x: 400, y: 400 },
    },
    {
      id: '14',
      type: 'custom',
      data: { label: 'Soil Quality' },
      position: { x: 450, y: 400 },
    },
    {
      id: '15',
      type: 'custom',
      data: { label: 'Biodiversity' },
      position: { x: 500, y: 400 },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e3-8', source: '3', target: '8' },
    { id: 'e3-12', source: '3', target: '12' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e4-6', source: '4', target: '6' },
    { id: 'e4-7', source: '4', target: '7' },
    { id: 'e8-9', source: '8', target: '9' },
    { id: 'e8-10', source: '8', target: '10' },
    { id: 'e8-11', source: '8', target: '11' },
    { id: 'e12-13', source: '12', target: '13' },
    { id: 'e12-14', source: '12', target: '14' },
    { id: 'e12-15', source: '12', target: '15' },
  ],
};

const energySecurityFlow = {
  nodes: [
    {
      id: '1',
      type: 'custom',
      data: { 
        label: 'Energy Security',
        borderColor: 'border-purple-200'
      },
      position: { x: 250, y: 0 },
    },
    // Strategic Actions
    {
      id: '2',
      type: 'custom',
      data: { 
        label: 'Strategic Actions',
        borderColor: 'border-blue-200'
      },
      position: { x: 100, y: 100 },
    },
    {
      id: '3',
      type: 'custom',
      data: { label: 'Source Diversification' },
      position: { x: 0, y: 200 },
    },
    {
      id: '4',
      type: 'custom',
      data: { label: 'Domestic Production' },
      position: { x: 100, y: 200 },
    },
    {
      id: '5',
      type: 'custom',
      data: { label: 'Efficiency Improvement' },
      position: { x: 200, y: 200 },
    },
    // Risk Mitigation
    {
      id: '6',
      type: 'custom',
      data: { 
        label: 'Risk Mitigation',
        borderColor: 'border-pink-200'
      },
      position: { x: 400, y: 100 },
    },
    {
      id: '7',
      type: 'custom',
      data: { label: 'Strategic Reserves' },
      position: { x: 300, y: 200 },
    },
    {
      id: '8',
      type: 'custom',
      data: { label: 'International Cooperation' },
      position: { x: 400, y: 200 },
    },
    {
      id: '9',
      type: 'custom',
      data: { label: 'Demand Management' },
      position: { x: 500, y: 200 },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-6', source: '1', target: '6', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-5', source: '2', target: '5' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e6-8', source: '6', target: '8' },
    { id: 'e6-9', source: '6', target: '9' },
  ],
};
