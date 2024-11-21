// File: app/nce/notes/chapters/b1c4.js
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

const HVACRefrigerationChapter = () => {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <Section 
        title="4. HVAC AND REFRIGERATION SYSTEM" 
        level={1}
        icon={<Wind className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
      >
        <Section 
          title="Syllabus" 
          level={2}
          icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Covers vapor compression and absorption refrigeration cycles, refrigerants, coefficient of performance, capacity, factors affecting system performance, and energy saving opportunities.
          </p>
        </Section>


        



        <Section 
          title="4.1 Introduction" 
          level={2}
          icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            HVAC and refrigeration systems transfer heat. Refrigeration moves heat from a low temperature source to a high temperature sink using a refrigerant. Key heat transfer loops in a refrigeration system:
          </p>
          <List items={[
            <span><strong>Indoor air loop:</strong> Indoor air transfers heat to chilled water via a cooling coil.</span>,
            <span><strong>Chilled water loop:</strong> Chilled water returns to the chiller's evaporator.</span>,
            <span><strong>Refrigerant loop:</strong> The compressor pumps heat from chilled water to condenser water using a refrigerant.</span>,
            <span><strong>Condenser water loop:</strong> Water absorbs heat and is sent to the cooling tower.</span>,
            <span><strong>Cooling tower loop:</strong> Heat is transferred from the condenser water to the outdoors via a fan.</span>
          ]} />
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Air conditioning systems are categorized by application (comfort/machine) and include split systems, fan coil units, and air handling units. Refrigeration systems are categorized by capacity (small, medium, large) and temperature range (comfort, chilled water, brine). Two main types: Vapor Compression Refrigeration (VCR) using mechanical energy, and Vapor Absorption Refrigeration (VAR) using thermal energy.
          </p>
        </Section>
        <Section 
        title="4.2 Types of Refrigeration System" 
        level={2}
        icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
      >
        <h4 className="text-lg font-semibold mb-3">Vapour Compression Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          A refrigerant absorbs heat, evaporates, gets compressed, releases heat and condenses, and the cycle repeats. Stages:
        </p>
        <ol className="list-decimal ml-6 space-y-2 mt-3 mb-4">
          <li><strong>Evaporation (1-2):</strong> Liquid refrigerant absorbs heat and evaporates.</li>
          <li><strong>Compression (2-3):</strong> Gaseous refrigerant is compressed, increasing its pressure and temperature.</li>
          <li><strong>Condensation (3-4):</strong> High-pressure gas releases heat and condenses back to liquid.</li>
          <li><strong>Expansion (4-1):</strong> High-pressure liquid expands, reducing its pressure and temperature before returning to the evaporator.</li>
        </ol>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
          <strong>Alternative Refrigerants:</strong> Due to the ozone-depleting nature of CFCs, alternatives like HCFCs and HFCs are being used. While HCFCs have lower ozone depletion potential, HFCs have zero ozone depletion potential.
        </p>
        <h4 className="text-lg font-semibold mb-3">Absorption Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Uses heat to drive the cooling process. A refrigerant (water) evaporates, absorbing heat. The refrigerant vapor is absorbed by a solution (lithium bromide). Heat is applied to release the refrigerant vapor, which is then condensed and returned to the evaporator. The diluted solution is reconcentrated and the cycle continues.
        </p>
      </Section>
      <Section 
          title="4.3 Common Refrigerants and Properties" 
          level={2}
          icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Common refrigerants include CFCs (R-11, R-12, R-21, R-22, R-502). Their properties and performance characteristics are summarized below:
          </p>
          <List items={[
            <span><strong>R-11:</strong> Used in large capacity water chillers, low pressure refrigerant.</span>,
            <span><strong>R-12:</strong> Medium pressure refrigerant, used in domestic refrigerators and small AC units.</span>,
            <span><strong>R-22:</strong> High pressure refrigerant, commonly used in air conditioning systems.</span>,
            <span><strong>R-502:</strong> Blend of R-22 and R-115, used in low temperature commercial refrigeration.</span>
          ]} />
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4">
            Key properties considered include normal boiling point, critical temperature, latent heat of vaporization, and compression ratio requirements.
          </p>
        </Section>

        <Section 
          title="4.4 Compressor Types and Application" 
          level={2}
          icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Compressor types and their characteristics:
          </p>
          <List items={[
            <span><strong>Centrifugal:</strong> Most efficient at near full load and large sizes. Uses an impeller and diffuser. Best for water chillers above 100 TR capacity.</span>,
            <span><strong>Reciprocating:</strong> Less efficient at full load but more efficient at part-load. Uses pistons. Common in small to medium capacity systems.</span>,
            <span><strong>Screw:</strong> Traps refrigerant in threads of a rotating screw. Compact and suitable for higher condensing pressures. Good for medium to large systems.</span>,
            <span><strong>Scroll:</strong> Compresses gas between two scroll-shaped vanes. Few moving parts. Highly efficient in small to medium capacity applications.</span>
          ]} />
          <InfoCard title="Selection Factors">
            <List items={[
              "Cooling capacity requirements",
              "Operating temperature range",
              "Part-load efficiency needs",
              "Space constraints",
              "Maintenance considerations",
              "Initial and operating costs"
            ]} />
          </InfoCard>
        </Section>
        <Section 
          title="4.5 Selection of a Suitable Refrigeration System" 
          level={2}
          icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Accurate cooling load calculation is crucial for system design. Consider the following factors:
          </p>
          <List items={[
            <span><strong>Cooling Load Analysis:</strong> Calculate heat gains from building envelope, occupants, equipment, and process loads.</span>,
            <span><strong>Temperature Requirements:</strong> Consider both comfort cooling (20-25°C) and process cooling needs (varying ranges).</span>,
            <span><strong>Load Pattern:</strong> Analyze daily and seasonal variations in cooling demand.</span>,
            <span><strong>Future Requirements:</strong> Account for potential expansion and load growth.</span>,
            <span><strong>Economic Considerations:</strong> Evaluate initial cost, operating cost, and maintenance requirements.</span>
          ]} />
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-3">System Selection Process:</h4>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Calculate peak and average cooling loads</li>
              <li>Determine required temperature levels</li>
              <li>Evaluate available utilities (electricity, steam, hot water)</li>
              <li>Compare different system types:
                <ul className="list-disc ml-6 mt-2">
                  <li>Single-stage vs. multi-stage compression</li>
                  <li>Direct vs. indirect cooling</li>
                  <li>Air-cooled vs. water-cooled condensing</li>
                  <li>Vapor compression vs. absorption systems</li>
                </ul>
              </li>
              <li>Select appropriate capacity control method</li>
              <li>Consider environmental impact and regulations</li>
            </ol>
          </div>
        </Section>

        <Section 
          title="4.6 Performance Assessment of Refrigeration Plants" 
          level={2}
          icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="flex-1">
                <strong>Tons of Refrigeration (TR):</strong> A unit of cooling capacity. 1 TR = 3024 kcal/hr heat rejected.
                <ul className="list-disc ml-8 mt-2 space-y-1">
                  <li>Formula: TR = (Q × C<sub>p</sub> × (T<sub>i</sub> - T<sub>o</sub>)) / 3024</li>
                  <li>Q: Mass flow rate of coolant (kg/hr)</li>
                  <li>C<sub>p</sub>: Specific heat of coolant (kcal/kg°C)</li>
                  <li>T<sub>i</sub>: Coolant inlet temperature (°C)</li>
                  <li>T<sub>o</sub>: Coolant outlet temperature (°C)</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="flex-1">
                <strong>Specific Power Consumption (kW/TR):</strong> Indicates system performance. Calculated as total power input (compressor, pumps, fans) divided by cooling capacity (TR).
                <ul className="list-disc ml-8 mt-2 space-y-1">
                  <li>Typical values: 0.8 to 1.2 kW/TR for central AC</li>
                  <li>0.6 to 0.9 kW/TR for industrial refrigeration</li>
                  <li>Factors affecting: Compressor efficiency, condenser/evaporator performance, auxiliary power</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="flex-1">
                <strong>Coefficient of Performance (COP):</strong> Ratio of cooling effect (kW) to compressor power input (kW).
                <ul className="list-disc ml-8 mt-2 space-y-1">
                  <li>COP = Cooling Effect / Power Input</li>
                  <li>Higher COP indicates better efficiency</li>
                  <li>Affected by operating temperatures, system design, and maintenance</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="flex-1">
                <strong>Theoretical COP (Carnot COP):</strong> Idealized efficiency based on evaporator (T<sub>e</sub>) and condenser (T<sub>c</sub>) temperatures:
                <ul className="list-disc ml-8 mt-2 space-y-1">
                  <li>COP<sub>Carnot</sub> = T<sub>e</sub> / (T<sub>c</sub> - T<sub>e</sub>)</li>
                  <li>Temperatures in Kelvin (K)</li>
                  <li>Actual COP is 40-50% of Carnot COP</li>
                </ul>
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <span className="flex-1">
                <strong>Integrated Part Load Value (IPLV):</strong> Average kW/TR at various partial loads:
                <ul className="list-disc ml-8 mt-2 space-y-1">
                  <li>Weighted average of performance at 100%, 75%, 50%, and 25% loads</li>
                  <li>IPLV = (0.01A + 0.42B + 0.45C + 0.12D)</li>
                  <li>A, B, C, D are kW/TR at 100%, 75%, 50%, 25% loads respectively</li>
                  <li>Provides more realistic performance measure for varying loads</li>
                </ul>
              </span>
            </li>
          </ul>
        </Section>

        <Section 
          title="4.7 Factors Affecting Performance & Energy Efficiency of Refrigeration Plants" 
          level={2}
          icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <List items={[
            <span><strong>Design of Process Heat Exchangers:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Optimize temperature difference between refrigerant and medium</li>
                <li>Maximize heat transfer area within economic constraints</li>
                <li>Select appropriate evaporator temperature and superheat</li>
                <li>Consider pressure drops and flow distribution</li>
              </ul>
            </span>,
            <span><strong>Maintenance of Heat Exchanger Surfaces:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Regular cleaning of surfaces to maintain heat transfer</li>
                <li>Proper oil separation and return in refrigeration systems</li>
                <li>Effective defrosting for low-temperature applications</li>
                <li>Prevention of scale formation in water-cooled systems</li>
              </ul>
            </span>,
            <span><strong>Multi-staging for Efficiency:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Use of multiple compressors with intercooling</li>
                <li>Cascaded systems for wide temperature ranges</li>
                <li>Economizer circuits for improved efficiency</li>
                <li>Optimization of intermediate pressures</li>
              </ul>
            </span>,
            <span><strong>Matching Capacity to System Load:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Cylinder unloading in reciprocating compressors</li>
                <li>Variable speed drives for capacity control</li>
                <li>Slide valve control in screw compressors</li>
                <li>Multiple compressor sequencing</li>
              </ul>
            </span>,
            <span><strong>Chilled Water Storage:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Load shifting to off-peak hours</li>
                <li>Reduced peak demand charges</li>
                <li>Improved system efficiency during night operation</li>
                <li>Better capacity utilization</li>
              </ul>
            </span>,
            <span><strong>System Design Features:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Optimization of cooling tower performance</li>
                <li>Proper water treatment and maintenance</li>
                <li>Adequate insulation of cold surfaces</li>
                <li>Heat recovery where applicable</li>
                <li>Variable air volume systems</li>
              </ul>
            </span>
          ]} />
        </Section>

        <Section 
          title="4.8 Energy Saving Opportunities" 
          level={2}
          icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
          <List items={[
            <span><strong>Cold Insulation:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Use appropriate insulation thickness on cold lines</li>
                <li>Regular inspection and maintenance of insulation</li>
                <li>Vapor barriers to prevent condensation</li>
                <li>Protection from mechanical damage</li>
              </ul>
            </span>,
            <span><strong>Building Envelope:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Optimize air conditioning volumes</li>
                <li>Use false ceilings and air curtains</li>
                <li>Minimize infiltration through doors and windows</li>
                <li>Solar control films and shading devices</li>
              </ul>
            </span>,
            <span><strong>Building Heat Loads Minimization:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Employ roof cooling and reflective coatings</li>
                <li>Use efficient lighting systems</li>
                <li>Pre-cooling of fresh air using heat exchangers</li>
                <li>Variable volume air systems based on occupancy</li>
              </ul>
            </span>,
            <span><strong>Process Heat Loads Minimization:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Optimize flow rates and temperatures</li>
                <li>Increase heat transfer area where feasible</li>
                <li>Avoid unnecessary cooling and reheating</li>
                <li>Regular cleaning of heat exchangers</li>
              </ul>
            </span>,
            <span><strong>At the Refrigeration A/C Plant Area:</strong>
              <ul className="list-disc ml-8 mt-2 space-y-1">
                <li>Ensure proper maintenance schedules</li>
                <li>Optimize chilled and cooling water flows</li>
                <li>Minimize part-load operation through proper sequencing</li>
                <li>Consider variable speed drives for pumps and fans</li>
                <li>Monitor and maintain proper refrigerant charge</li>
              </ul>
            </span>
          ]} />
        </Section>
      </Section>
    </div>
  );
};

export default HVACRefrigerationChapter;
