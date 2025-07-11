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

// Base components with improved mobile responsiveness
const Section = ({ title, children, level = 1, icon }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const headerStyles = {
    1: 'text-xl md:text-2xl lg:text-3xl font-bold',
    2: 'text-lg md:text-xl lg:text-2xl font-semibold',
    3: 'text-base lg:text-lg font-semibold'
  }[level] || 'text-base font-medium';

  const mobilePadding = level === 1 ? 'px-2 py-3' : 'px-2 py-2';
  const desktopPadding = level === 1 ? 'sm:px-4 sm:py-4' : 'sm:px-3 sm:py-3';
  const nestedMargin = level > 1 ? 'ml-2 sm:ml-4' : '';

  return (
    <div className={`mb-4 sm:mb-8 ${nestedMargin}`}>
      <div className={`
        relative group cursor-pointer
        ${level === 1 ? 'bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl' : ''}
        ${mobilePadding} ${desktopPadding}
      `}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full gap-2 sm:gap-3 text-left"
        >
          {icon && (
            <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
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
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>
        </button>
      </div>
      {isOpen && (
        <div className={`
          mt-3 sm:mt-4 pl-2 sm:pl-6 
          ${level === 1 ? 'border-l-2 sm:border-l-4 border-gradient-purple' : 'border-l border-gray-100'}
        `}>
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">{title}</h4>
    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const List = ({ items }) => (
  <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
        <span className="flex-1">{item}</span>
      </li>
    ))}
  </ul>
);

const Formula = ({ children }) => (
  <span className="font-mono bg-gray-50 px-1 rounded text-sm sm:text-base">{children}</span>
);

const EnergyChapter = () => {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <Section 
        title="1. ENERGY SCENARIO" 
        level={1}
        icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
      >
        <Section 
          title="Syllabus" 
          level={2}
          icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
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
          icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
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
          icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
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
          icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
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
          icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
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
          icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
            
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
                Key Statistics
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-blue-700">
                <li>• Global oil reserves estimated to last 45 years</li>
                <li>• Gas reserves estimated to last 65 years</li>
                <li>• Coal reserves expected to last over 200 years</li>
                <li>• Global primary energy consumption in 2003: 9741 Mtoe</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Continue with Part 2... */}
// Part 2: Following the initial sections from Part 1
// Covers Energy Distribution, Indian Scenario, and Energy Needs

        <Section 
          title="Energy Distribution Between Developed and Developing Countries" 
          level={2}
          icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-indigo-900 mb-2 sm:mb-3">
                  Population vs. Energy Consumption
                </h4>
                <p className="text-sm sm:text-base text-indigo-800">
                  Developing countries hold 80% of the world population but consume only
                  40% of the world's energy. This disparity highlights the energy
                  access challenges in developing nations.
                </p>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">
                  Development Correlation
                </h4>
                <p className="text-sm sm:text-base text-purple-800">
                  Developed countries have high energy consumption levels, correlating
                  with their high living standards and industrial development. This sets
                  benchmarks for energy needs in developing economies.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.6 Indian Energy Scenario" 
          level={2}
          icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Coal dominates India's energy mix, contributing 55% of primary energy 
              production. Natural gas share has increased, while oil's share shows a 
              declining trend in the primary energy mix.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Coal Supply">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Vast coal reserves (84,396 million tonnes, 8.6% of global reserves)</li>
                  <li>• Reserve/Production ratio of 230 years (global average: 192 years)</li>
                  <li>• India ranks 4th in global production</li>
                  <li>• Major source for power generation</li>
                  <li>• Quality issues affect industrial use</li>
                </ul>
              </InfoCard>

              <InfoCard title="Oil Supply">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Accounts for 36% of India's energy use</li>
                  <li>• Among world's top oil consumers</li>
                  <li>• 70% import dependence ($21 billion in 2003-04)</li>
                  <li>• Major reserves: Bombay High, Upper Assam, Cambay, Krishna-Godavari</li>
                  <li>• Transport sector is largest consumer</li>
                  <li>• Strategic reserves being developed</li>
                </ul>
              </InfoCard>

              <InfoCard title="Natural Gas Supply">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Contributes 8.9% to energy consumption</li>
                  <li>• Demand exceeds domestic supply</li>
                  <li>• Growing importance in power and fertilizer sectors</li>
                  <li>• LNG imports increasing</li>
                  <li>• Pipeline infrastructure expanding</li>
                  <li>• Emerging as cleaner fuel alternative</li>
                </ul>
              </InfoCard>

              <InfoCard title="Electrical Energy Supply">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Installed capacity: 112,581 MW (May 2004)</li>
                  <li>• Thermal power dominates (69.6%)</li>
                  <li>• Hydro contribution: 26.3%</li>
                  <li>• Nuclear share: 2.4%</li>
                  <li>• Renewable energy growing</li>
                  <li>• Significant T&D losses (around 25%)</li>
                </ul>
              </InfoCard>
            </div>

            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-orange-800 mb-2 sm:mb-3">
                Key Challenges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-orange-700">
                  <li>• Growing demand-supply gap</li>
                  <li>• High import dependence</li>
                  <li>• Infrastructure constraints</li>
                  <li>• Environmental concerns</li>
                </ul>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-orange-700">
                  <li>• Investment requirements</li>
                  <li>• Distribution inefficiencies</li>
                  <li>• Resource quality issues</li>
                  <li>• Technology limitations</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.7 Energy Needs of Growing Economy" 
          level={2}
          icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
              <p className="text-sm sm:text-base text-gray-700 space-y-2">
                <span className="block">Economic growth and energy consumption are 
                closely linked. The ratio of energy demand growth to GDP growth 
                indicates the energy intensity of the economy.</span>
                
                <span className="block">Developed countries typically maintain 
                ratios below 1 through efficiency measures, while developing 
                countries often show higher ratios due to industrialization and 
                infrastructure development needs.</span>

                <span className="block">For India, projections indicate that:
                </span>
              </p>
              <ul className="mt-3 space-y-1 text-sm sm:text-base text-gray-700">
                <li>• GDP growth of 6% requires ~9% energy growth</li>
                <li>• Power generation needs to grow at 12-13%</li>
                <li>• Infrastructure development crucial for growth</li>
                <li>• Energy efficiency improvements can moderate demand</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-2 sm:mb-3">
                Per Capita Energy Consumption
              </h4>
              <div className="space-y-2 text-sm sm:text-base text-green-700">
                <p>• India's per capita consumption significantly below global average</p>
                <p>• Current level: ~4% of USA, ~20% of world average</p>
                <p>• Expected to grow with economic development</p>
                <p>• Rural electrification to drive growth</p>
                <p>• Industrial expansion to increase demand</p>
              </div>
            </div>
          </div>
        </Section>

        {/* More sections continue in Part 3... */}
<Section 
          title="1.8 Long Term Energy Scenario for India" 
          level={2}
          icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <InfoCard title="Coal Scenario">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  Coal will remain the dominant fuel for power generation despite planned capacity 
                  addition in oil, gas, nuclear and hydro sectors. Key projections:
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base pl-4">
                  <li>• Demand increase: 2.5x by 2025</li>
                  <li>• Power sector share will rise to ~75%</li>
                  <li>• Production targets: 680 MT by 2011-12, 1060 MT by 2024-25</li>
                  <li>• Import dependence likely to increase</li>
                  <li>• Environmental challenges require clean coal technologies</li>
                  <li>• Need for significant infrastructure development</li>
                </ul>
              </div>
            </InfoCard>

            <InfoCard title="Oil Scenario">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  Petroleum product demand projections show:
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base pl-4">
                  <li>• Consumption growth: 3-4% annually</li>
                  <li>• Demand: 135 MT by 2010, 196 MT by 2025</li>
                  <li>• Domestic production plateau at 33-34 MT</li>
                  <li>• Import dependence to reach 85-90%</li>
                  <li>• Strategic reserves development crucial</li>
                  <li>• Alternative fuel strategies needed</li>
                </ul>
              </div>
            </InfoCard>

            <InfoCard title="Natural Gas Prospects">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  Gas sector developments:
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base pl-4">
                  <li>• Demand growth: 7-8% annually</li>
                  <li>• Production target: 90 MMSCMD by 2006-07</li>
                  <li>• Private sector to contribute significantly</li>
                  <li>• LNG imports to bridge demand-supply gap</li>
                  <li>• Pipeline network expansion planned</li>
                  <li>• Focus on city gas distribution</li>
                </ul>
              </div>
            </InfoCard>

            <InfoCard title="Electricity Sector">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-gray-700">
                  Power sector targets and challenges:
                </p>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base pl-4">
                  <li>• Capacity addition target: 215,804 MW by 2012</li>
                  <li>• Peak demand: 157,107 MW (2012), 300,000 MW (2025)</li>
                  <li>• Nuclear capacity target: 20,000 MW by 2020</li>
                  <li>• Hydro potential: Only 15% of 150,000 MW utilized</li>
                  <li>• Renewable energy: Target 10% of capacity</li>
                  <li>• Investment requirement: Rs. 8,00,000 crores</li>
                </ul>
              </div>
            </InfoCard>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
                Implementation Challenges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-blue-700">
                    • Massive infrastructure development needs
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Environmental sustainability
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Large investment requirements
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Land acquisition issues
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-blue-700">
                    • Technology absorption capacity
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Policy and regulatory framework
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Human resource development
                  </p>
                  <p className="text-sm sm:text-base text-blue-700">
                    • Market development
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.9 Energy Pricing in India" 
          level={2}
          icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <p className="text-sm sm:text-base text-gray-800 mb-3 sm:mb-4">
                Energy pricing in India is characterized by:
              </p>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-800">
                <li>• Political and social considerations over economic principles</li>
                <li>• Extensive cross-subsidization across sectors</li>
                <li>• Prices often below cost recovery levels</li>
                <li>• Complex subsidy mechanisms</li>
                <li>• Gradual movement towards market-based pricing</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Coal Pricing">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    • Grade-wise pricing by Coal India Ltd
                  </p>
                  <p className="text-sm sm:text-base">
                    • Price advantage vs imports
                  </p>
                  <p className="text-sm sm:text-base">
                    • Quality issues affect pricing
                  </p>
                  <p className="text-sm sm:text-base">
                    • Transport costs significant
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Oil Pricing">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    • Progressive deregulation
                  </p>
                  <p className="text-sm sm:text-base">
                    • Petrol subsidizes diesel
                  </p>
                  <p className="text-sm sm:text-base">
                    • LPG/Kerosene heavily subsidized
                  </p>
                  <p className="text-sm sm:text-base">
                    • International price linkage
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Natural Gas Pricing">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    • Administered Price Mechanism
                  </p>
                  <p className="text-sm sm:text-base">
                    • Different prices for sectors
                  </p>
                  <p className="text-sm sm:text-base">
                    • LNG prices market-linked
                  </p>
                  <p className="text-sm sm:text-base">
                    • Moving towards market pricing
                  </p>
                </div>
              </InfoCard>

              <InfoCard title="Electricity Pricing">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    • State-specific tariffs
                  </p>
                  <p className="text-sm sm:text-base">
                    • Cross-subsidization prevalent
                  </p>
                  <p className="text-sm sm:text-base">
                    • Agricultural sector subsidized
                  </p>
                  <p className="text-sm sm:text-base">
                    • Regulatory oversight increasing
                  </p>
                </div>
              </InfoCard>
            </div>

            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-orange-800 mb-2 sm:mb-3">
                Reform Initiatives
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-orange-700">
                <li>• Gradual subsidy reduction</li>
                <li>• Market-based pricing mechanisms</li>
                <li>• Independent regulatory oversight</li>
                <li>• Targeted subsidy delivery</li>
                <li>• Cost-reflective pricing goals</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Continue with Part 4... */}
<Section 
          title="1.10 Energy Sector Reforms" 
          level={2}
          icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-gray-700">
              Comprehensive reforms are being implemented across all energy sectors 
              to enhance efficiency, promote competition, and attract investment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <InfoCard title="Coal Sector Reforms">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Coal import liberalization</li>
                  <li>• Private sector mining for captive use</li>
                  <li>• Washery rejection utilization</li>
                  <li>• Technology modernization</li>
                  <li>• Commercial mining framework</li>
                  <li>• Environment management</li>
                </ul>
              </InfoCard>

              <InfoCard title="Oil and Gas Reforms">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Private investment in distribution</li>
                  <li>• New Exploration Licensing Policy</li>
                  <li>• LPG/Kerosene parallel marketing</li>
                  <li>• Pipeline infrastructure access</li>
                  <li>• Strategic reserves development</li>
                  <li>• City gas distribution networks</li>
                </ul>
              </InfoCard>

              <InfoCard title="Power Sector Reforms">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Regulatory commissions established</li>
                  <li>• Private generation permitted</li>
                  <li>• State board restructuring</li>
                  <li>• Open access implementation</li>
                  <li>• Distribution privatization</li>
                  <li>• Rural electrification focus</li>
                </ul>
              </InfoCard>
            </div>

            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">
                Electricity Act, 2003 - Comprehensive Framework
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Policy Framework</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• National Electricity Policy</li>
                    <li>• National Tariff Policy</li>
                    <li>• Rural Electrification Policy</li>
                    <li>• Integrated energy policy</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Generation</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• De-licensing of generation</li>
                    <li>• Captive generation freely permitted</li>
                    <li>• Hydro development focus</li>
                    <li>• Renewable energy promotion</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Transmission</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• National and State Grid development</li>
                    <li>• Open access implementation</li>
                    <li>• Private participation allowed</li>
                    <li>• Grid standards and compliance</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Distribution</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• Universal service obligation</li>
                    <li>• Multiple supply licensees</li>
                    <li>• Phased open access</li>
                    <li>• Consumer protection</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Regulation</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• Independent regulatory commissions</li>
                    <li>• Tariff determination powers</li>
                    <li>• Licensing and oversight</li>
                    <li>• Market development</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-purple-800">Trading & Markets</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                    <li>• Trading as distinct activity</li>
                    <li>• Power exchanges development</li>
                    <li>• Market-based pricing</li>
                    <li>• Competition promotion</li>
                  </ul>
                </div>
              </div>
            </div>

            <InfoCard title="Key Implementation Challenges">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ul className="space-y-1 text-sm sm:text-base">
                  <li>• Financial health of utilities</li>
                  <li>• Technical losses reduction</li>
                  <li>• Infrastructure development</li>
                  <li>• Regulatory capacity building</li>
                </ul>
                <ul className="space-y-1 text-sm sm:text-base">
                  <li>• Political considerations</li>
                  <li>• Workforce transition</li>
                  <li>• Investment requirements</li>
                  <li>• Technology adoption</li>
                </ul>
              </div>
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.11 Energy and Environment" 
          level={2}
          icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <p className="text-sm sm:text-base text-gray-800 mb-3">
                Energy use, particularly fossil fuel combustion, has significant 
                environmental impacts through air pollution, greenhouse gas emissions,
                and other environmental degradation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Major Environmental Concerns">
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 rounded-full bg-red-400" />
                    <span><strong>Air Pollution:</strong> SOₓ, NOₓ, particulates, 
                    and other pollutants affecting health and environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 rounded-full bg-red-400" />
                    <span><strong>GHG Emissions:</strong> CO₂, methane contributing 
                    to global warming and climate change</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 rounded-full bg-red-400" />
                    <span><strong>Land Degradation:</strong> Mining, ash disposal, 
                    and infrastructure development impacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 rounded-full bg-red-400" />
                    <span><strong>Water Issues:</strong> Thermal pollution, acid rain, 
                    and groundwater contamination</span>
                  </li>
                </ul>
              </InfoCard>

              <InfoCard title="Air Pollutants and Impacts">
                <div className="space-y-2 text-sm sm:text-base">
                  <div>
                    <span className="font-semibold">Sulphur Dioxide (SO₂):</span>
                    <ul className="pl-4 space-y-1">
                      <li>• Respiratory problems</li>
                      <li>• Acid rain formation</li>
                      <li>• Vegetation damage</li>
                      <li>• Infrastructure corrosion</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Nitrogen Oxides (NOₓ):</span>
                    <ul className="pl-4 space-y-1">
                      <li>• Respiratory irritation</li>
                      <li>• Smog formation</li>
                      <li>• Acid rain contribution</li>
                      <li>• Ground-level ozone</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Particulate Matter:</span>
                    <ul className="pl-4 space-y-1">
                      <li>• Respiratory diseases</li>
                      <li>• Cardiovascular problems</li>
                      <li>• Reduced visibility</li>
                      <li>• Surface soiling</li>
                    </ul>
                  </div>
                </div>
              </InfoCard>
            </div>

            <InfoCard title="Climate Change">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="font-semibold">Greenhouse Effect:</p>
                  <ul className="pl-4 space-y-1 text-sm sm:text-base">
                    <li>• Natural process maintaining Earth's temperature</li>
                    <li>• Enhanced by anthropogenic GHG emissions</li>
                    <li>• CO₂ concentrations rising rapidly</li>
                    <li>• Energy sector major contributor</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Impacts:</p>
                  <ul className="pl-4 space-y-1 text-sm sm:text-base">
                    <li>• Global temperature rise</li>
                    <li>• Sea level rise</li>
                    <li>• Extreme weather events</li>
                    <li>• Agricultural productivity changes</li>
                    <li>• Biodiversity loss</li>
                    <li>• Health impacts</li>
                  </ul>
                </div>
              </div>
            </InfoCard>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
                Mitigation Strategies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Technology Options</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-blue-600">
                    <li>• Clean coal technologies</li>
                    <li>• Renewable energy adoption</li>
                    <li>• Energy efficiency measures</li>
                    <li>• Carbon capture and storage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Policy Measures</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-blue-600">
                    <li>• Emission standards</li>
                    <li>• Market-based mechanisms</li>
                    <li>• International cooperation</li>
                    <li>• Research and development</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Continue with Part 5... */}
<Section 
          title="1.12 Energy Security" 
          level={2}
          icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <p className="text-sm sm:text-base text-gray-800">
                Energy security focuses on ensuring reliable and affordable energy 
                supply while reducing vulnerabilities to supply disruptions and 
                price volatility. India faces particular challenges due to high 
                import dependence and growing demand.
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Key Challenges">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• High oil import dependence (&gt;70%)</li>
                  <li>• Growing energy demand</li>
                  <li>• Infrastructure constraints</li>
                  <li>• Geopolitical uncertainties</li>
                  <li>• Price volatility exposure</li>
                  <li>• Investment requirements</li>
                </ul>
              </InfoCard>

              <InfoCard title="Vulnerability Factors">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Limited domestic resources</li>
                  <li>• Concentration of supplies</li>
                  <li>• Transportation bottlenecks</li>
                  <li>• Technical constraints</li>
                  <li>• Financial limitations</li>
                  <li>• Environmental concerns</li>
                </ul>
              </InfoCard>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Strategic Measures
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Supply Security</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                    <li>• Diversifying sources</li>
                    <li>• Strategic reserves</li>
                    <li>• Long-term contracts</li>
                    <li>• International cooperation</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Infrastructure</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                    <li>• Pipeline networks</li>
                    <li>• Storage facilities</li>
                    <li>• Port capabilities</li>
                    <li>• Grid interconnections</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Demand Management</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                    <li>• Energy efficiency</li>
                    <li>• Conservation measures</li>
                    <li>• Fuel substitution</li>
                    <li>• Emergency response</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section 
          title="1.13 Energy Conservation and its Importance" 
          level={2}
          icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <p className="text-sm sm:text-base text-gray-800 mb-4">
                Energy conservation represents the most cost-effective solution to 
                energy shortages. It encompasses both technical efficiency improvements 
                and behavioral changes in energy use patterns.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-800 mb-2">Energy Conservation</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-green-700">
                    <li>• Reducing energy consumption</li>
                    <li>• Minimizing waste</li>
                    <li>• Behavioral changes</li>
                    <li>• System optimization</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-800 mb-2">Energy Efficiency</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-green-700">
                    <li>• Technology upgrades</li>
                    <li>• Process improvements</li>
                    <li>• Equipment modernization</li>
                    <li>• Better maintenance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Benefits">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Reduced energy costs</li>
                  <li>• Lower import dependence</li>
                  <li>• Environmental protection</li>
                  <li>• Enhanced energy security</li>
                  <li>• Improved productivity</li>
                  <li>• Sustainable development</li>
                </ul>
              </InfoCard>

              <InfoCard title="Implementation Areas">
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <li>• Industrial processes</li>
                  <li>• Buildings and lighting</li>
                  <li>• Transportation systems</li>
                  <li>• Agricultural operations</li>
                  <li>• Municipal services</li>
                  <li>• Household consumption</li>
                </ul>
              </InfoCard>
            </div>

            <InfoCard title="Key Implementation Strategies">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Technical Measures</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Energy audits</li>
                    <li>• Equipment upgrades</li>
                    <li>• Process optimization</li>
                    <li>• Waste heat recovery</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Policy Measures</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Standards and labeling</li>
                    <li>• Building codes</li>
                    <li>• Financial incentives</li>
                    <li>• Awareness programs</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Management Systems</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Monitoring systems</li>
                    <li>• Training programs</li>
                    <li>• Documentation</li>
                    <li>• Performance tracking</li>
                  </ul>
                </div>
              </div>
            </InfoCard>
          </div>
        </Section>

        <Section 
          title="1.14 Energy Strategy for the Future" 
          level={2}
          icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-gray-700">
              A comprehensive energy strategy is essential for sustainable development, 
              incorporating immediate, medium-term, and long-term measures.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">
                  Immediate-term Strategy
                </h4>
                <ul className="space-y-1 text-sm sm:text-base text-blue-700">
                  <li>• Energy pricing rationalization</li>
                  <li>• Asset utilization optimization</li>
                  <li>• Distribution efficiency</li>
                  <li>• Energy audit programs</li>
                  <li>• Conservation awareness</li>
                  <li>• Technology adoption</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">
                  Medium-term Strategy
                </h4>
                <ul className="space-y-1 text-sm sm:text-base text-purple-700">
                  <li>• Demand management</li>
                  <li>• Fuel mix optimization</li>
                  <li>• Infrastructure development</li>
                  <li>• Regulatory framework</li>
                  <li>• Market mechanisms</li>
                  <li>• R&D promotion</li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-indigo-800 mb-2">
                  Long-term Strategy
                </h4>
                <ul className="space-y-1 text-sm sm:text-base text-indigo-700">
                  <li>• Renewable energy transition</li>
                  <li>• Clean technology adoption</li>
                  <li>• Energy independence</li>
                  <li>• Sustainable development</li>
                  <li>• Environmental protection</li>
                  <li>• International cooperation</li>
                </ul>
              </div>
            </div>

            <InfoCard title="Implementation Framework">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Policy Framework</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Legislative support</li>
                    <li>• Regulatory mechanisms</li>
                    <li>• Institutional framework</li>
                    <li>• Market development</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Support Mechanisms</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Financial incentives</li>
                    <li>• Technology transfer</li>
                    <li>• Capacity building</li>
                    <li>• Research support</li>
                  </ul>
                </div>
              </div>
            </InfoCard>
          </div>
        </Section>

        {/* Continue with Part 6 for Energy Conservation Act... */}
<Section 
          title="1.15 The Energy Conservation Act, 2001 and its Features" 
          level={2}
          icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <p className="text-sm sm:text-base text-gray-800 mb-4">
                The Energy Conservation Act, 2001 provides a legal framework and 
                institutional arrangement for embarking on an energy efficiency drive.
                It empowers the Central and State governments to implement the 
                provisions of the Act.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <InfoCard title="Standards and Labeling">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Key provisions include:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Mandatory energy consumption norms</li>
                    <li>• Energy efficiency labels</li>
                    <li>• Star rating systems</li>
                    <li>• Performance standards</li>
                    <li>• Testing and certification</li>
                  </ul>
                </div>
              </InfoCard>

              <InfoCard title="Designated Consumers">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Requirements for energy-intensive industries:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Energy consumption norms</li>
                    <li>• Energy managers appointment</li>
                    <li>• Energy audits</li>
                    <li>• Record maintenance</li>
                    <li>• Compliance reporting</li>
                  </ul>
                </div>
              </InfoCard>

              <InfoCard title="Certification">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Professional certification system:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Energy managers qualification</li>
                    <li>• Energy auditors accreditation</li>
                    <li>• Training programs</li>
                    <li>• Examination system</li>
                    <li>• Professional development</li>
                  </ul>
                </div>
              </InfoCard>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Institutional Framework
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Bureau of Energy Efficiency (BEE)</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                    <li>• Policy formulation</li>
                    <li>• Program implementation</li>
                    <li>• Standards development</li>
                    <li>• Training and certification</li>
                    <li>• Public awareness</li>
                    <li>• Research promotion</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">State Agencies</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-gray-700">
                    <li>• State-level implementation</li>
                    <li>• Local coordination</li>
                    <li>• Data collection</li>
                    <li>• Monitoring compliance</li>
                    <li>• Technical assistance</li>
                    <li>• Awareness programs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <InfoCard title="Energy Conservation Building Code">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Building energy efficiency guidelines:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Design standards</li>
                    <li>• Equipment specifications</li>
                    <li>• State adaptations</li>
                    <li>• Implementation mechanisms</li>
                    <li>• Compliance verification</li>
                  </ul>
                </div>
              </InfoCard>

              <InfoCard title="Central Energy Conservation Fund">
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Financial support for:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Energy efficiency projects</li>
                    <li>• Research and development</li>
                    <li>• Demonstration projects</li>
                    <li>• Public awareness</li>
                    <li>• Training programs</li>
                  </ul>
                </div>
              </InfoCard>
            </div>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
                Implementation Mechanisms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Enforcement</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-blue-600">
                    <li>• Self-regulation</li>
                    <li>• Periodic reporting</li>
                    <li>• Inspection system</li>
                    <li>• Compliance verification</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Penalties</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-blue-600">
                    <li>• Non-compliance penalties</li>
                    <li>• Administrative actions</li>
                    <li>• Appeal mechanisms</li>
                    <li>• Adjudication process</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Support</h5>
                  <ul className="space-y-1 text-sm sm:text-base text-blue-600">
                    <li>• Technical guidance</li>
                    <li>• Financial incentives</li>
                    <li>• Capacity building</li>
                    <li>• Information sharing</li>
                  </ul>
                </div>
              </div>
            </div>

            <InfoCard title="Achievement Indicators">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Direct Benefits</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Energy savings achieved</li>
                    <li>• Cost reduction realized</li>
                    <li>• Emission reduction</li>
                    <li>• Efficiency improvement</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Indirect Benefits</h5>
                  <ul className="space-y-1 text-sm sm:text-base">
                    <li>• Awareness enhancement</li>
                    <li>• Market transformation</li>
                    <li>• Technology adoption</li>
                    <li>• Capacity development</li>
                  </ul>
                </div>
              </div>
            </InfoCard>
          </div>
        </Section>
      </Section>
    </div>
  );
};

export default EnergyChapter;
