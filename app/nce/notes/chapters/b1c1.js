'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, BookOpen, AlertTriangle, LineChart, Share2 } from 'lucide-react';
import MarkmapChart from '@/components/ui/markmap';

// Markmap content definitions
const energyClassificationContent = `# Energy Sources
## By Source
### Primary Sources
- Coal
- Oil
- Solar
### Secondary Sources
- Electricity
- Petrol

## By Market
### Commercial
- Coal
- Oil
- Gas
### Non-Commercial
- Firewood
- Waste

## By Renewability
### Renewable
- Solar
- Wind
- Hydro
### Non-Renewable
- Coal
- Oil
- Gas`;

const environmentalImpactContent = `# Energy Use
## GHG Emissions
### Environmental Impact
#### Air Quality
- SO₂
- NOₓ
- Particulates
#### Global Warming
- CO₂
- Methane
- Temperature Rise
#### Acid Rain
- Water Bodies
- Soil Quality
- Biodiversity`;

const energySecurityContent = `# Energy Security
## Strategic Actions
- Source Diversification
- Domestic Production
- Efficiency Improvement

## Risk Mitigation
- Strategic Reserves
- International Cooperation
- Demand Management`;

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

const FormulaCard = ({ formula, description, units }) => (
  <div className="bg-gray-50 rounded-md p-4 mb-4 border-l-4 border-blue-500">
    <div className="text-lg mb-2">{formula}</div>
    {description && <p className="text-gray-600 mb-2">{description}</p>}
    {units && <p className="text-sm text-gray-500">Units: {units}</p>}
  </div>
);

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
        </div>
      </CollapsibleSection>

      {/* Main Content Sections */}
      <CollapsibleSection title="Energy Classification" icon={<Share2 className="w-5 h-5" />}>
        <div className="space-y-4">
          <NoteCard type="info">
            <ul className="list-disc list-inside space-y-2">
              <li>Primary vs Secondary: Source-based classification</li>
              <li>Commercial vs Non-commercial: Market availability based</li>
              <li>Renewable vs Non-renewable: Replenishment capability based</li>
            </ul>
          </NoteCard>
          <MarkmapChart content={energyClassificationContent} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Environmental Impact" icon={<AlertTriangle className="w-5 h-5" />}>
        <div className="space-y-4">
          <NoteCard type="warning" title="Critical Concerns">
            <ul className="list-disc list-inside space-y-2">
              <li>Air quality degradation from emissions</li>
              <li>Global warming and climate change</li>
              <li>Acidification of water bodies</li>
            </ul>
          </NoteCard>
          <MarkmapChart content={environmentalImpactContent} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Energy Security" icon={<LineChart className="w-5 h-5" />}>
        <div className="space-y-4">
          <NoteCard type="success" title="Key Strategies">
            <ul className="list-disc list-inside space-y-2">
              <li>Source diversification for stability</li>
              <li>Strategic reserves management</li>
              <li>International cooperation importance</li>
            </ul>
          </NoteCard>
          <MarkmapChart content={energySecurityContent} />
        </div>
      </CollapsibleSection>

      {/* Additional Information */}
      <CollapsibleSection title="Key Formulas & Notes" icon={<BookOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <FormulaCard 
            formula="Energy Intensity = Energy Consumption / GDP"
            description="Measures energy efficiency of economy"
          />
          <FormulaCard 
            formula="R/P Ratio = Reserves / Annual Production"
            description="Estimates remaining years of resource availability"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ChapterSummary;
