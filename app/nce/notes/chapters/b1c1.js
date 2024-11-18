// File: app/nce/notes/chapters/b1c1.js
'use client';
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Book, 
  Zap, 
  Sun, 
  Wind, 
  Flame,
  Globe,
  BarChart2,
  Battery,
  Shield,
  Leaf,
  Settings,
  File
} from 'lucide-react';


// Beautiful section component that preserves content hierarchy
const Section = ({ title, children, level = 1, icon }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const headerStyles = {
    1: 'text-2xl md:text-3xl font-bold',
    2: 'text-xl md:text-2xl font-semibold',
    3: 'text-lg font-semibold'
  }[level] || 'text-base font-medium';

  return (
    <div className={`mb-8 ${level > 1 ? 'ml-4' : ''}`}>
      <div className={`
        relative group cursor-pointer
        ${level === 1 ? 'bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4' : ''}
      `}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full gap-3 text-left"
        >
          {icon && (
            <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
              {icon}
            </div>
          )}
          <span className={`
            ${headerStyles}
            ${level === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-800'}
          `}>
            {title}
          </span>
          <div className="ml-auto">
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>
      </div>
      {isOpen && (
        <div className={`
          mt-4 pl-6 
          ${level === 1 ? 'border-l-4 border-gradient-purple' : 'border-l-2 border-gray-100'}
        `}>
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Beautiful card component for key points
const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
    <div className="text-gray-700 leading-relaxed">{children}</div>
  </div>
);

// Beautiful list component
const List = ({ items }) => (
  <ul className="space-y-3 my-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-3 text-gray-700">
        <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
        <span className="flex-1">{item}</span>
      </li>
    ))}
  </ul>
);

// Chemical formula component
const Formula = ({ children }) => (
  <span className="font-mono bg-gray-50 px-1 rounded">{children}</span>
);

const EnergyChapter = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-gray-50 min-h-screen">
      <Section 
        title="1. ENERGY SCENARIO" 
        level={1}
        icon={<Zap className="w-6 h-6 text-blue-500" />}
      >
        <Section 
          title="Syllabus" 
          level={2}
          icon={<Book className="w-5 h-5 text-purple-500" />}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              This section covers the following topics related to the energy scenario:
              Commercial and Non-Commercial Energy, Primary Energy Resources,
              Commercial Energy Production, Final Energy Consumption, Energy Needs of
              Growing Economy, Long Term Energy Scenario, Energy Pricing, Energy
              Sector Reforms, Energy and Environment (Air Pollution, Climate Change,
              Energy Security), Energy Conservation and its Importance, Energy
              Strategy for the Future, and the Energy Conservation Act-2001.
            </p>
          </div>
        </Section>

        <Section 
          title="1.1 Introduction" 
          level={2}
          icon={<Sun className="w-5 h-5 text-yellow-500" />}
        >
          <p className="text-gray-700 leading-relaxed mb-4">
            Energy is crucial for economic development, especially in developing
            countries with ever-increasing needs. Energy is classified based on
            these criteria:
          </p>
          <List items={[
            'Primary and Secondary energy',
            'Commercial and Non-commercial energy',
            'Renewable and Non-Renewable energy'
          ]} />
        </Section>

        <Section 
          title="1.2 Primary and Secondary Energy" 
          level={2}
          icon={<Battery className="w-5 h-5 text-green-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="Primary Energy Sources">
              Found or stored in nature (e.g., coal, oil, natural gas, biomass,
              nuclear energy, geothermal energy).
            </InfoCard>
            <InfoCard title="Secondary Energy Sources">
              Derived from primary sources (e.g., electricity, steam). Primary sources
              are often converted into secondary sources in industrial utilities.
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.3 Commercial and Non-Commercial Energy" 
          level={2}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="Commercial Energy">
              Available in the market at a price (e.g., electricity, coal, oil).
              It drives development in modern societies.
            </InfoCard>
            <InfoCard title="Non-Commercial Energy">
              Not market-based and is typically gathered (e.g., firewood,
              agricultural waste, solar, wind, animal power).
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.4 Renewable and Non-Renewable Energy" 
          level={2}
          icon={<Wind className="w-5 h-5 text-blue-500" />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="Renewable Energy">
              Comes from inexhaustible sources (e.g., wind, solar, geothermal,
              tidal, hydro). They are generally non-polluting.
            </InfoCard>
            <InfoCard title="Non-Renewable Energy">
              Finite resources like fossil fuels (coal, oil, gas).
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.5 Global Primary Energy Reserves" 
          level={2}
          icon={<Globe className="w-5 h-5 text-green-500" />}
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Coal">
                Proven reserves estimated at 984,453 million tonnes (end of 2003).
                USA, Russia, and China hold the largest shares.
              </InfoCard>
              <InfoCard title="Oil">
                Proven reserves estimated at 1147 billion barrels (end of 2003).
                Saudi Arabia has the largest share. 1 barrel ≈ 160 liters.
              </InfoCard>
              <InfoCard title="Gas">
                Proven reserves estimated at 176 trillion cubic meters (end of 2003).
                Russia has the largest share.
              </InfoCard>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-2">Key Statistics</h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Global oil reserves estimated to last 45 years</li>
                <li>• Gas reserves estimated to last 65 years</li>
                <li>• Coal reserves expected to last over 200 years</li>
                <li>• Global primary energy consumption in 2003: 9741 Mtoe</li>
              </ul>
            </div>
          </div>
        </Section>


        <Section 
          title="Energy Distribution Between Developed and Developing Countries" 
          level={2}
          icon={<Globe className="w-5 h-5 text-indigo-500" />}
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-indigo-900 mb-3">Population vs. Energy Consumption</h4>
                <p className="text-indigo-800">
                  Developing countries hold 80% of the world population but consume only
                  40% of the world's energy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-3">Development Correlation</h4>
                <p className="text-purple-800">
                  Developed countries have high energy consumption levels, correlating
                  with their high living standards.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.6 Indian Energy Scenario" 
          level={2}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        >
          <p className="text-gray-700 mb-6">
            Coal dominates India's energy mix (55% of primary energy production).
            Natural gas share increased, while oil share decreased over recent years.
          </p>

          <div className="space-y-6">
            <InfoCard title="Coal Supply">
              <ul className="space-y-2">
                <li>• Vast coal reserves (84,396 million tonnes, or 8.6% of global reserves)</li>
                <li>• Reserve/Production rates may last 230 years (global average: 192 years)</li>
                <li>• India is the 4th largest producer</li>
              </ul>
            </InfoCard>

            <InfoCard title="Oil Supply">
              <ul className="space-y-2">
                <li>• Accounts for 36% of India's energy use</li>
                <li>• Among top oil consumers</li>
                <li>• Heavily reliant on imports (70% of needs, costing ~$21 billion in 2003-04)</li>
                <li>• Major reserves: Bombay High, Upper Assam, Cambay, Krishna-Godavari basins</li>
                <li>• Transport sector is largest consumer</li>
              </ul>
            </InfoCard>

            <InfoCard title="Natural Gas Supply">
              <ul className="space-y-2">
                <li>• Accounts for 8.9% of energy use</li>
                <li>• Current demand exceeds domestic supply</li>
                <li>• Imports necessary to meet demand</li>
                <li>• Growing demand expected</li>
              </ul>
            </InfoCard>

            <InfoCard title="Electrical Energy Supply">
              <ul className="space-y-2">
                <li>• Installed power capacity: 112,581 MW (May 2004)</li>
                <li>• Major contribution from thermal power plants</li>
                <li>• Followed by hydro and nuclear power</li>
              </ul>
            </InfoCard>

            <InfoCard title="Nuclear Power Supply">
              <ul className="space-y-2">
                <li>• Contributes 2.4% of electricity generated</li>
                <li>• Additional plants planned</li>
              </ul>
            </InfoCard>

            <InfoCard title="Hydro Power Supply">
              <ul className="space-y-2">
                <li>• Only 15% of vast hydropower potential harnessed</li>
                <li>• Exploitable potential: 84,000 MW at 60% load factor</li>
              </ul>
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.7 Energy Needs of Growing Economy" 
          level={2}
          icon={<BarChart2 className="w-5 h-5 text-green-500" />}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <p className="text-gray-700">
              Economic growth requires energy. The ratio of energy demand to GDP
              indicates energy dependence. Developed countries maintain lower ratios
              (less than 1) through efficiency measures, while developing countries
              have higher ratios. India's energy demand is projected to increase
              significantly.
            </p>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Per Capita Energy Consumption</h4>
              <p className="text-green-700">
                India's per capita energy consumption is low compared to developed
                countries and the world average. It is expected to grow with economic
                growth.
              </p>
            </div>
          </div>
        </Section>


        <Section 
          title="1.8 Long Term Energy Scenario for India" 
          level={2}
          icon={<BarChart2 className="w-5 h-5 text-blue-500" />}
        >
          <div className="space-y-6">
            <InfoCard title="Coal">
              <div className="space-y-3">
                <p className="text-gray-700">
                  Coal is expected to remain the dominant fuel for power, despite planned
                  oil and gas plants. Significant capacity increase is needed to meet
                  growing demand. Import dependence will likely increase.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Oil">
              <div className="space-y-3">
                <p className="text-gray-700">
                  Demand for petroleum products is projected to increase. Domestic
                  production is not expected to keep pace, leading to increased import
                  reliance.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Natural Gas">
              <div className="space-y-3">
                <p className="text-gray-700">
                  Domestic natural gas production is expected to increase, largely due to
                  private sector contributions.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Electricity">
              <div className="space-y-3">
                <p className="text-gray-700">
                  India faces a significant peak demand shortage and energy deficit. A
                  target of 215,804 MW power generation capacity by 2012 has been set,
                  requiring substantial capacity addition. Nuclear power capacity is
                  targeted to reach 20,000 MW by 2020.
                </p>
              </div>
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.9 Energy Pricing in India" 
          level={2}
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
        >
          <div className="space-y-6">
            <div className="bg-yellow-50 rounded-xl p-6">
              <p className="text-gray-800 mb-4">
                Energy prices in India are often influenced by political and social
                factors and don't reflect true costs. Cross-subsidies are common (e.g.,
                petrol subsidizes diesel, kerosene, and LPG; industrial and commercial
                electricity users subsidize agricultural and domestic users).
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard title="Coal">
                <p className="text-gray-700">
                  Coal India Ltd sets grade-wise basic prices. Despite favorable prices
                  compared to imports, industries continue to import due to higher
                  quality.
                </p>
              </InfoCard>

              <InfoCard title="Oil">
                <p className="text-gray-700">
                  Reforms linked domestic diesel prices to international prices. LPG and
                  kerosene remain heavily subsidized.
                </p>
              </InfoCard>

              <InfoCard title="Natural Gas">
                <p className="text-gray-700">
                  Government regulated pricing creates distortions in the market.
                </p>
              </InfoCard>

              <InfoCard title="Electricity">
                <p className="text-gray-700">
                  Tariff structures vary across states and consumer segments. There's no
                  automatic tariff adjustment mechanism, and political considerations
                  influence tariff changes.
                </p>
              </InfoCard>
            </div>
          </div>
        </Section>

        <Section 
          title="1.10 Energy Sector Reforms" 
          level={2}
          icon={<Settings className="w-5 h-5 text-purple-500" />}
        >
          <div className="space-y-6">
            <p className="text-gray-700">
              Reforms aim to increase efficiency and competition. Key reforms include:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Coal">
                <p className="text-gray-700">
                  Allowed coal imports, private sector coal extraction for captive use,
                  and further reforms aimed at increasing competition and technology.
                </p>
              </InfoCard>

              <InfoCard title="Oil and Natural Gas">
                <p className="text-gray-700">
                  Private investment allowed in LPG, kerosene, lubricants, and refining.
                  New Exploration Licensing Policy (NELP) promotes investment in
                  exploration and production.
                </p>
              </InfoCard>

              <InfoCard title="Electricity">
                <p className="text-gray-700">
                  Establishment of regulatory commissions, private investment in
                  generation, unbundling of state electricity boards, and plans for a
                  unified national grid.
                </p>
              </InfoCard>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Electricity Act, 2003 - Key Features</h4>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">National Electricity Policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Rural electrification focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">License-free generation and distribution in rural areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Delicensed generation (except hydro)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Government-owned transmission utilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Private licensees in transmission and distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Open access in transmission and phased open access in distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Distribution companies can generate, and generation companies can distribute</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Mandatory State Electricity Regulatory Commissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Recognition of trading as a distinct activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Mandatory metering</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  <span className="text-purple-900">Appellate Tribunal for dispute resolution</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>


        <Section 
          title="1.11 Energy and Environment" 
          level={2}
          icon={<Leaf className="w-5 h-5 text-green-500" />}
        >
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-gray-800">
                Energy use, especially fossil fuel combustion, leads to air pollution
                with pollutants like SO₂, NOₓ, CO, CFCs, and particulate matter.
                These pollutants cause acid rain, ozone formation, respiratory issues,
                and other environmental and health problems. Vehicular emissions are a
                major source of pollution.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Air Pollutants</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Sulphur dioxide (SO₂):</span>
                      <span className="text-gray-700"> Acid rain, vegetation damage.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Nitrogen oxides (NOₓ):</span>
                      <span className="text-gray-700"> Respiratory irritant, ozone formation, acid rain.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Particulate matter (PM₁₀, PM₂.₅):</span>
                      <span className="text-gray-700"> Respiratory and cardiovascular problems.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Carbon monoxide (CO):</span>
                      <span className="text-gray-700"> Toxic gas, reduces oxygen-carrying capacity of blood.</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Ozone (O₃):</span>
                      <span className="text-gray-700"> Respiratory irritant, damages materials.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Hydrocarbons (VOCs, PAHs):</span>
                      <span className="text-gray-700"> Ozone formation, some are carcinogenic.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                    <div>
                      <span className="font-semibold">Heavy metals and Lead:</span>
                      <span className="text-gray-700"> Toxic, neurological damage (lead).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <InfoCard title="Climatic Change">
              <p className="text-gray-700 mb-4">
                Human activities, primarily fossil fuel combustion, increase greenhouse
                gas (GHG) concentrations, leading to global warming.
              </p>
            </InfoCard>

            <InfoCard title="Greenhouse Effect and the Carbon Cycle">
              <p className="text-gray-700 mb-4">
                GHGs trap infrared radiation, warming the earth. Increased GHG emissions
                from human activity are disrupting the natural carbon cycle.
              </p>
            </InfoCard>

            <div className="bg-red-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-red-900 mb-4">Future Effects of Climate Change</h4>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Severe storms and flooding</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Food shortages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Dwindling freshwater supply</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Loss of biodiversity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Increased diseases</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
                  <span className="text-red-900">Increased societal stress</span>
                </li>
              </ul>
            </div>

            <InfoCard title="Acid Rain">
              <p className="text-gray-700">
                SOₓ and NOₓ emissions react with water vapor to form acid rain,
                which damages ecosystems and infrastructure.
              </p>
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.12 Energy Security" 
          level={2}
          icon={<Shield className="w-5 h-5 text-blue-500" />}
        >
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-gray-800">
                Energy security aims to reduce reliance on imported energy. India faces
                a growing energy supply shortfall and increasing import dependence,
                making it vulnerable to price shocks and supply disruptions.
              </p>
            </div>

            <InfoCard title="Strategies for Enhancing Energy Security">
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Building stockpiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Diversifying supply sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Increasing fuel switching capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Demand restraint</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Developing renewables</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                  <span className="text-gray-700">Improving energy efficiency</span>
                </li>
              </ul>
            </InfoCard>
          </div>
        </Section>


        <Section 
          title="1.13 Energy Conservation and its Importance" 
          level={2}
          icon={<Leaf className="w-5 h-5 text-green-500" />}
        >
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-gray-800 mb-4">
                Fossil fuel reserves are depleting. <span className="font-semibold">Energy conservation</span> refers 
                to reducing energy consumption. <span className="font-semibold">Energy efficiency</span> is using less 
                energy for the same task.
              </p>
              <p className="text-gray-800">
                Energy efficiency contributes to energy conservation and is the simplest 
                and most attainable solution to address energy challenges.
              </p>
            </div>
          </div>
        </Section>

        <Section 
          title="1.14 Energy Strategy for the Future" 
          level={2}
          icon={<BarChart2 className="w-5 h-5 text-indigo-500" />}
        >
          <div className="space-y-6">
            <p className="text-gray-700 mb-4">
              Strategies are categorized as immediate, medium, and long term.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Immediate-term</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                    <span className="text-blue-900">Rationalize energy pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                    <span className="text-blue-900">Optimize asset utilization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                    <span className="text-blue-900">Improve efficiency in production and distribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                    <span className="text-blue-900">Promote R&D and technology transfer</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-3">Medium-term</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                    <span className="text-purple-900">Demand management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                    <span className="text-purple-900">Conservation measures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                    <span className="text-purple-900">Optimal fuel mix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                    <span className="text-purple-900">Transition to renewable energy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6">
                <h4 className="font-semibold text-indigo-900 mb-3">Long-term</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Efficient energy generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Improved energy infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Enhanced energy efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Deregulation and privatization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Competitive energy pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                    <span className="text-indigo-900">Attract foreign investment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.15 The Energy Conservation Act, 2001 and its Features" 
          level={2}
          icon={<File className="w-5 h-5 text-teal-500" />}
        >
          <div className="space-y-6">
            <div className="bg-teal-50 rounded-xl p-6">
              <p className="text-gray-800">
                The Act provides a legal framework for energy efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard title="Standards and Labeling (S&L)">
                <p className="text-gray-700">
                  Ensures energy-efficient equipment availability.
                </p>
              </InfoCard>

              <InfoCard title="Designated Consumers">
                <p className="text-gray-700">
                  Large energy consumers are required to undergo audits, appoint energy
                  managers, and comply with norms.
                </p>
              </InfoCard>

              <InfoCard title="Certification and Accreditation">
                <p className="text-gray-700">
                  Develops qualified energy managers and auditors.
                </p>
              </InfoCard>

              <InfoCard title="Energy Conservation Building Codes (ECBC)">
                <p className="text-gray-700">
                  BEE develops guidelines for energy-efficient buildings. States can
                  modify them based on local conditions.
                </p>
              </InfoCard>

              <InfoCard title="Central Energy Conservation Fund">
                <p className="text-gray-700">
                  Supports energy efficiency projects, R&D, and consumer awareness.
                </p>
              </InfoCard>

              <InfoCard title="Bureau of Energy Efficiency (BEE)">
                <p className="text-gray-700">
                  Implements policy programs and coordinates energy conservation
                  activities.
                </p>
              </InfoCard>

              <InfoCard title="Enforcement through Self-Regulation">
                <p className="text-gray-700">
                  Accredited Energy Auditors certify energy consumption norms.
                  Manufacturer declared values are checked in labs.
                </p>
              </InfoCard>

              <InfoCard title="Penalties and Adjudication">
                <p className="text-gray-700">
                  Penalties for non-compliance. Adjudicating authority is the State
                  Electricity Regulatory Commission.
                </p>
              </InfoCard>
            </div>
          </div>
        </Section>
      </Section>
    </div>
  );
};

export default EnergyChapter;
