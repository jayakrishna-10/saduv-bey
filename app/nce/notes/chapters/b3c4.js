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
        HVAC and refrigeration systems transfer heat.  Refrigeration moves heat from a low temperature source to a high temperature sink using a refrigerant. Key heat transfer loops in a refrigeration system:
        </p>
        <List items={[
            <strong>Indoor air loop:</strong> + "Indoor air transfers heat to chilled water via a cooling coil.",
            <strong>Chilled water loop:</strong>  + "Chilled water returns to the chiller's evaporator.",
            <strong>Refrigerant loop:</strong> + "The compressor pumps heat from chilled water to condenser water using a refrigerant.",
            <strong>Condenser water loop:</strong> + "Water absorbs heat and is sent to the cooling tower.",
            <strong>Cooling tower loop:</strong> + "Heat is transferred from the condenser water to the outdoors via a fan."
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Air conditioning systems are categorized by application (comfort/machine) and include split systems, fan coil units, and air handling units.  Refrigeration systems are categorized by capacity (small, medium, large) and temperature range (comfort, chilled water, brine). Two main types: Vapor Compression Refrigeration (VCR) using mechanical energy, and Vapor Absorption Refrigeration (VAR) using thermal energy.
        </p>
        </Section>

        <Section 
        title="4.2 Types of Refrigeration System" 
        level={2}
        icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <h4>Vapour Compression Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        A refrigerant absorbs heat, evaporates, gets compressed, releases heat and condenses, and the cycle repeats. Stages:
        </p>
        <ol className='list-decimal ml-6'>
            <li><strong>Evaporation (1-2):</strong> Liquid refrigerant absorbs heat and evaporates.</li>
            <li><strong>Compression (2-3):</strong> Gaseous refrigerant is compressed, increasing its pressure and temperature.</li>
            <li><strong>Condensation (3-4):</strong> High-pressure gas releases heat and condenses back to liquid.</li>
            <li><strong>Expansion (4-1):</strong> High-pressure liquid expands, reducing its pressure and temperature before returning to the evaporator.</li>
        </ol>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        <strong>Alternative Refrigerants:</strong> Due to the ozone-depleting nature of CFCs, alternatives like HCFCs and HFCs are being used. While HCFCs have lower ozone depletion potential, HFCs have zero ozone depletion potential.
        </p>
        <h4>Absorption Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Uses heat to drive the cooling process. A refrigerant (water) evaporates, absorbing heat. The refrigerant vapor is absorbed by a solution (lithium bromide). Heat is applied to release the refrigerant vapor, which is then condensed and returned to the evaporator. The diluted solution is reconcentrated and the cycle continues.
        </p>

        <h4>Vapour Compression Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        A refrigerant absorbs heat, evaporates, gets compressed, releases heat and condenses, and the cycle repeats. Stages:
        </p>
        <ol className='list-decimal ml-6'>
            <li><strong>Evaporation (1-2):</strong> Liquid refrigerant absorbs heat and evaporates.</li>
            <li><strong>Compression (2-3):</strong> Gaseous refrigerant is compressed, increasing its pressure and temperature.</li>
            <li><strong>Condensation (3-4):</strong> High-pressure gas releases heat and condenses back to liquid.</li>
            <li><strong>Expansion (4-1):</strong> High-pressure liquid expands, reducing its pressure and temperature before returning to the evaporator.</li>
        </ol>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        <strong>Alternative Refrigerants:</strong> Due to the ozone-depleting nature of CFCs, alternatives like HCFCs and HFCs are being used. While HCFCs have lower ozone depletion potential, HFCs have zero ozone depletion potential.
        </p>
        <h4>Absorption Refrigeration</h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Uses heat to drive the cooling process. A refrigerant (water) evaporates, absorbing heat. The refrigerant vapor is absorbed by a solution (lithium bromide). Heat is applied to release the refrigerant vapor, which is then condensed and returned to the evaporator. The diluted solution is reconcentrated and the cycle continues.
        </p>
        </Section>


        {/* Rest of the sections will continue in the next chunks */}

    </Section>
    </div>
);
};

export default HVACRefrigerationChapter;

<Section 
        title="4.3 Common Refrigerants and Properties" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Common refrigerants include CFCs (R-11, R-12, R-21, R-22, R-502).  Their properties and performance characteristics are summarized in tables in the document.
        </p>
        </Section>

        <Section 
        title="4.4 Compressor Types and Application" 
        level={2}
        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        Compressor types:
        </p>
        <List items={[
            <strong>Centrifugal:</strong> Most efficient at near full load and large sizes. Uses an impeller and diffuser.,
            <strong>Reciprocating:</strong> Less efficient at full load but more efficient at part-load. Uses pistons.,
            <strong>Screw:</strong> Traps refrigerant in threads of a rotating screw.  Compact and suitable for higher condensing pressures.,
            <strong>Scroll:</strong> Compresses gas between two scroll-shaped vanes.  Few moving parts.
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        The document provides a comparison table of different compressor types, including their applications and features.
        </p>
        </Section>

        <Section 
        title="4.5 Selection of a Suitable Refrigeration System" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Accurate cooling load calculation is crucial for system design. Consider cooling needs, heat leaks, internal heat sources, and potential future load changes. Minimizing the load through insulation and optimal cooling temperatures is the first step towards energy efficiency.  Based on temperature requirements and load, select the appropriate system (single/multi-stage, economized compression, direct/indirect cooling) and components (refrigerant, compressor, evaporator, condenser).
        </p>
        </Section>

        <Section 
        title="4.6 Performance Assessment of Refrigeration Plants" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Tons of Refrigeration (TR):</strong> A unit of cooling capacity.  1 TR = 3024 kcal/hr heat rejected.
                    <ul className='list-disc ml-8'>
                        <li>Formula: TR = (Q * Cp * (T<sub>i</sub> - T<sub>o</sub>)) / 3024</li>
                        <li>Q: Mass flow rate of coolant (kg/hr)</li>
                        <li>C<sub>p</sub>: Specific heat of coolant (kcal/kg°C)</li>
                        <li>T<sub>i</sub>: Coolant inlet temperature (°C)</li>
                        <li>T<sub>o</sub>: Coolant outlet temperature (°C)</li>
                    </ul>
                </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Specific Power Consumption (kW/TR):</strong>  Indicates system performance. Calculated as total power input (compressor, pumps, fans) divided by cooling capacity (TR).</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Coefficient of Performance (COP):</strong> Ratio of cooling effect (kW) to compressor power input (kW).</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Theoretical COP (Carnot COP):</strong> Idealized efficiency based on evaporator (T<sub>e</sub>) and condenser (T<sub>c</sub>) temperatures:  COP<sub>Carnot</sub> = T<sub>e</sub> / (T<sub>c</sub> - T<sub>e</sub>)</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Integrated Part Load Value (IPLV):</strong> Average kW/TR at various partial loads (100%, 75%, 50%, 25%).  Provides a more realistic performance measure.</span>
            </li>
        </ul>
        </Section>

        <Section 
        title="4.7 Factors Affecting Performance & Energy Efficiency of Refrigeration Plants" 
        level={2}
        icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <List items={[
            <strong>Design of Process Heat Exchangers:</strong> Optimizing temperature difference, heat transfer area, and evaporator temperature improves efficiency.,
            <strong>Maintenance of Heat Exchanger Surfaces:</strong>  Clean surfaces, proper oil separation, and effective defrosting improve performance.,
            <strong>Multi-staging for Efficiency:</strong> Using multiple compressors with intercooling or cascaded systems improves efficiency for low-temperature applications and wide temperature ranges.,
            <strong>Matching Capacity to System Load:</strong> Optimizing compressor operation at part load improves efficiency. Methods include cylinder unloading, variable speed drives, and flow control.,
            <strong>Chilled Water Storage:</strong> Storing chilled water during off-peak hours reduces peak demand charges and utilizes lower ambient temperatures for improved COP.,
            <strong>System Design Features:</strong>  Includes optimization of cooling towers, water treatment, insulation, heat recovery, and variable air volume systems.
        ]} />
        </Section>

        <Section 
        title="4.8 Energy Saving Opportunities" 
        level={2}
        icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <List items={[
            <strong>Cold Insulation:</strong> Use appropriate insulation thickness on cold lines and vessels.,
            <strong>Building Envelope:</strong> Optimize air conditioning volumes, use false ceilings and air curtains.,
            <strong>Building Heat Loads Minimization:</strong> Employ roof cooling, efficient lighting, pre-cooling of fresh air, and variable volume air systems.,
            <strong>Process Heat Loads Minimization:</strong> Optimize flow rates, increase heat transfer area, avoid losses, and clean heat exchangers.,
            <strong>At the Refrigeration A/C Plant Area:</strong> Ensure proper maintenance, optimize chilled and cooling water flows, minimize part-load operation, and consider variable speed drives.
        ]} />
        </Section>
