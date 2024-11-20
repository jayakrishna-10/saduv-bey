
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


const WasteHeatRecoveryChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <Section title="8. WASTE HEAT RECOVERY" level={1} icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}>
        
<Section title="Syllabus" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <List items={[
        'Waste Heat Recovery: Classification, Advantages and applications',
        'Commercially viable waste heat recovery devices',
        'Saving potential'
    ]} />
</Section>

<Section title="8.1 Introduction" level={2} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Waste heat is heat generated in a process (fuel combustion or chemical reaction) that is released into the environment even though it can be reused. The value of waste heat lies not in its quantity but its potential for reuse. Recovery strategy depends on the temperature of waste gases and the economics involved.</p>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Large amounts of hot flue gases from Boilers, Kilns, Ovens, and Furnaces offer substantial heat recovery potential, leading to significant primary fuel savings. While complete recovery is impossible, minimizing losses through appropriate measures is feasible.</p>
    <Section title="Heat Losses – Quality" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Waste heat can be rejected at various temperatures. Higher temperatures generally indicate higher quality and cost-effectiveness for recovery. A crucial aspect of waste heat recovery is identifying a use for the recovered heat, such as preheating combustion air, space heating, or pre-heating boiler feed water or process water. High-temperature recovery may employ a cascade system where high-temperature stages preheat air and low-temperature stages preheat process water or generate steam.</p>
    </Section>
    <Section title="Heat Losses – Quantity" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Knowing the recoverable heat amount and its potential use is essential. The formula for calculating recoverable heat is:</p>
        <p><code>Q = V × ρ × C<sub>p</sub> × ΔT</code></p>
        <p>Where:</p>
        <List items={[
            'Q: Heat content (kCal)',
            'V: Flowrate of the substance (m³/hr)',
            'ρ: Density of the flue gas (kg/m³)',
            'Cp: Specific heat of the substance (kCal/kg °C)',
            'ΔT: Temperature difference (°C)'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">An example is provided for heat recovery from a heat treatment furnace, illustrating how a recuperator can preheat combustion air, resulting in fuel savings (approximately 1% per 22 °C reduction in flue gas temperature).</p>
    </Section>
</Section>

<Section title="8.2 Classification and Application" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Waste heat sources are classified by quality (potential value), ranging from high-temperature flue gases and vapor streams to low-grade heat losses in cooling water and process effluents.</p>
    <Section title="High Temperature Heat Recovery" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Sources include direct fuel-fired processes like refining furnaces, cement kilns, glass melting furnaces, etc.</p>
    </Section>
    <Section title="Medium Temperature Heat Recovery" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Primarily comes from exhausts of directly fired process units, such as steam boilers, gas turbines, reciprocating engines, heat treating furnaces, drying ovens, etc.</p>
    </Section>
    <Section title="Low Temperature Heat Recovery" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Includes sources like process steam condensate, cooling water from various equipment, air compressors, pumps, etc. While extracting work is typically impractical, this heat can be useful for preheating purposes.</p>
    </Section>
</Section>

<Section title="8.3 Benefits of Waste Heat Recovery" level={2} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Benefits are categorized as direct and indirect:</p>
    <Section title="Direct Benefits" level={3}>
        <List items={[
            'Reduced utility consumption and costs',
            'Lower process costs'
        ]} />
    </Section>
    <Section title="Indirect Benefits" level={3}>
        <List items={[
            'Pollution reduction (by burning waste combustibles)',
            'Smaller equipment sizes (due to reduced fuel consumption)',
            'Lower auxiliary energy consumption (resulting from smaller equipment)'
        ]} />
    </Section>
</Section>

<Section title="8.4 Development of a Waste Heat Recovery System" level={2} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <Section title="Understanding the process" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Analyzing process flow sheets, layout diagrams, and other documentation is crucial to identify waste heat sources, potential uses, space availability, and system constraints (e.g., dew point).</p>
    </Section>
    <Section title="Economic Evaluation" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Financial analysis (investment, depreciation, payback period, rate of return) is essential for evaluating the chosen system. Consulting experts is recommended.</p>
    </Section>
</Section>

```
```jsx
<Section title="8.5 Commercial Waste Heat Recovery Devices" level={2} icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
    <Section title="Recuperators" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Facilitate heat exchange between flue gases and combustion air through metallic or ceramic walls. Different configurations exist, including metallic radiation recuperators (concentric tubes) and tube-type/convective recuperators (tubes within a shell). Hybrid designs combine radiation and convection for improved effectiveness.</p>
    </Section>
    <Section title="Ceramic Recuperator" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Overcomes temperature limitations of metal recuperators by using ceramic tubes, enabling operation at higher gas and air temperatures.</p>
    </Section>
    <Section title="Regenerator" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Used for large capacities, particularly in glass and steel melting furnaces. Heat is alternately stored and released from a regenerative material. Cycle time, brick thickness, and material properties are important design considerations.</p>
    </Section>
    <Section title="Heat Wheels" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Rotating porous disks transfer sensible heat between hot and cold gas streams. Rotary regenerators are a variation using a cylindrical matrix.</p>
    </Section>
    <Section title="Heat Pipe" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Highly efficient heat transfer devices with no moving parts. Utilize a sealed container, capillary wick, and working fluid to transfer heat through evaporation and condensation.</p>
    </Section>
    <Section title="Economiser" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Uses waste heat from flue gases to preheat boiler feed water, reducing fuel consumption.</p>
    </Section>
    <Section title="Shell and Tube Heat Exchanger" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Used when waste heat in a liquid or vapor heats another liquid. The higher-pressure fluid flows through the tubes, and the lower-pressure fluid flows through the shell.</p>
    </Section>
    <Section title="Plate heat exchanger" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Uses a series of parallel plates to transfer heat between hot and cold fluids. Corrugated plates enhance heat transfer. Counter-current flow arrangements are common.</p>
    </Section>
    <Section title="Run Around Coil Exchanger" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Similar to heat pipes, but uses an intermediate heat transfer fluid circulated between two coils placed in hot and cold streams. Useful when fluids are located far apart.</p>
    </Section>
    <Section title="Waste Heat Boilers" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Water tube boilers where hot exhaust gases vaporize water in tubes. Finned tubes increase heat transfer area. Auxiliary burners or after-burners can supplement waste heat if needed.</p>
    </Section>
    <Section title="Heat Pumps:" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Reverse the direction of spontaneous energy flow, allowing the use of low-grade heat. Operate on the vapor compression cycle.</p>
    </Section>
    <Section title="Thermocompressor :" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Compresses low-pressure steam using high-pressure steam, enabling its reuse as medium-pressure steam. Effective for recovering latent heat.</p>
    </Section>
    <Section title="Direct Contact Heat Exchanger :" level={3}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Uses direct contact between steam and cold water (or another miscible fluid) to transfer heat. Often used in deaerators of steam generation stations.</p>
    </Section>
</Section>

<Section title="QUESTIONS" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">A set of questions is provided to test understanding of the concepts covered.</p>
</Section>

<Section title="REFERENCES" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">References for further reading are provided.</p>
</Section>
</Section>
    </div>
);
};

export default WasteHeatRecoveryChapter;