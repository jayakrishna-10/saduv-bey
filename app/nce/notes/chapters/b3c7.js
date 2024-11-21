
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

const CoolingTowerChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="7. COOLING TOWER" 
        level={1}
        icon={<Wind className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />} 
    >
        <Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Cooling Tower: Types and performance evaluation, Efficient system operation, Flow control strategies and energy saving opportunities, Assessment of cooling towers.
        </p>
        </Section>

        <Section 
        title="7.1 Introduction" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Cooling towers reject heat into the atmosphere, offering an inexpensive and dependable way to remove low-grade heat from cooling water. Make-up water replenishes evaporated water.  Hot water from heat exchangers goes to the cooling tower, is cooled, and returns to the exchangers or other units.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            A typical closed-loop cooling tower system involves hot water from plant heat exchangers going to the cooling tower, where it is cooled by air, and then the cold water returns to the heat exchangers. Make-up water is added to the system to replace water lost through evaporation.
        </p>
        </Section>

        <Section 
        title="Cooling Tower Types" 
        level={2}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Cooling towers are categorized into:
        </p>
        <List items={[
            <b>Natural draft:</b>, 'Use large concrete chimneys for air intake, typically for flows above 45,000 m³/hr, primarily used by utility power stations.',
            <b>Mechanical draft:</b>, 'Use fans to force or suck air through the circulated water. Water falls over fill surfaces, maximizing contact time with air to improve heat transfer. Cooling rates depend on fan diameter and speed. This type is more common and is the focus of this chapter.'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Mechanical draft towers have the following airflow arrangements:
        </p>
        <ol className="list-decimal space-y-2 sm:space-y-3 my-3 sm:my-4 ml-4 sm:ml-6">
            <li className="text-sm sm:text-base text-gray-700">Counter flow induced draft</li>
            <li className="text-sm sm:text-base text-gray-700">Counter flow forced draft</li>
            <li className="text-sm sm:text-base text-gray-700">Cross flow induced draft</li>
        </ol>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            <b>Counter flow induced draft:</b> Hot water enters at the top, air enters at the bottom and exits at the top. <b>Cross flow induced draft:</b> Hot water enters at the top and flows over the fill. Air is introduced from the side (single or double flow).
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Mechanical draft towers have capacities ranging from 10 tons (2.5 m³/hr) to several thousand tons/m³/hr. They can be factory-built or field-erected (e.g., concrete towers). Multiple cells can be combined for desired capacity.
        </p>
        </Section>

        <Section 
        title="Components of Cooling Tower" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
        >
        <List items={[
            <b>Frame and casing:</b>,'Support structure and enclosure.',
            <b>Fill:</b>, 'Maximizes water-air contact for heat transfer. Can be splash (water falls over bars) or film (water spreads over thin surfaces). Film fill is more efficient.',
            <b>Cold water basin:</b>, 'Collects cooled water at the bottom.',
            <b>Drift eliminators:</b>, 'Capture water droplets escaping with the air.',
            <b>Air inlet:</b>, 'Entry point for air.',
            <b>Louvers:</b>, 'Equalize airflow (mainly in cross-flow towers).',

            <b>Nozzles:</b>, 'Spray water to wet the fill.',
            <b>Fans:</b>, 'Axial (propeller) or centrifugal. Propeller fans are used in induced draft, and both types are used in forced draft.'
        ]} />
        </Section>
<Section 
        title="Tower Materials" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Historically made of wood, modern towers utilize various materials:</p>
        <List items={[
            'Galvanized steel',
            'Stainless steel',
            'Glass fiber',
            'Concrete',
            'Aluminum',
            'Plastics (PVC, polypropylene etc. for fill and nozzles)'
        ]} />
        </Section>

        <Section 
        title="7.2 Cooling Tower Performance" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Key performance parameters:</p>
        <List items={[
            <b>Range:</b>, <span>Difference between cooling tower water inlet and outlet temperature (T<sub>in</sub> - T<sub>out</sub>).</span>,
            <b>Approach:</b>, <span>Difference between cooling tower outlet cold water temperature and ambient wet-bulb temperature (T<sub>out</sub> - T<sub>wb</sub>). A better indicator of cooling tower performance.</span>,
            <b>Cooling tower effectiveness:</b>, 'Range / (Range + Approach), expressed as a percentage.',
            <b>Cooling capacity:</b>, 'Heat rejected (kCal/hr or TR). Calculated as: mass flow rate of water × specific heat × temperature difference (Range).',
            <b>Evaporation loss:</b>, 'Water evaporated for cooling. Approximately 1.8 m³ per 1,000,000 kCal heat rejected.  Can be estimated by:'
        ]} />
        <p style={{textAlign: 'center'}} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Evaporation Loss (m³/hr) = 0.00085 × 1.8 × circulation rate (m³/hr) × (T<sub>in</sub> - T<sub>out</sub>)</p>

        <List items={[
            <b>Cycles of concentration (COC):</b>, 'Ratio of dissolved solids in circulating water to dissolved solids in make-up water.',
            <b>Blow down loss:</b>, 'Water removed to control dissolved solids buildup. Calculated as:'
        ]} />
        <p style={{textAlign: 'center'}} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Blow Down = Evaporation Loss / (COC – 1)</p>
        <List items={[
            <b>Liquid/Gas (L/G) ratio:</b>, 'Ratio of water mass flow rate to air mass flow rate.'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Heat balance equation:</p>
        <p style={{textAlign: 'center'}} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">L(T<sub>in</sub> - T<sub>out</sub>) = G(h<sub>out</sub> – h<sub>in</sub>)</p>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Where:</p>
        <List items={[
            'L/G = liquid to gas mass flow ratio (kg/kg)',
            'T<sub>in</sub>= hot water temperature (°C)',
            'T<sub>out</sub> = cold water temperature (°C)',
            'h<sub>out</sub> = enthalpy of air-water vapor mixture at exhaust wet-bulb temperature',
            'h<sub>in</sub>= enthalpy of air-water vapor mixture at inlet wet-bulb temperature'
        ]} />

        </Section>
```
```jsx
<Section 
        title="Factors Affecting Cooling Tower Performance" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
        <Section title="Capacity" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat dissipation and circulated flow rate alone are not sufficient to determine cooling tower performance. Other factors, such as range, also play a role.</p>
        </Section>
        <Section title="Range" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Determined by the process being served, calculated as:</p>
            <p style={{textAlign: 'center'}} className="text-sm sm:text-base text-gray-700 leading-relaxed">Range °C = Heat Load in kcals/hour / Water Circulation Rate in LPH</p>
        </Section>
        <Section title="Cold Water Temperature, Wet Bulb Temperature and Approach" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Closer approach to wet bulb temperature leads to a more expensive, larger cooling tower. A 2.8°C approach is often the minimum guaranteed by manufacturers.</p>
        </Section>
        <Section title="Heat Load" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cooling tower size and cost are proportional to heat load. Accurate calculation of heat load is crucial for proper equipment sizing.</p>
        </Section>
        <Section title="Wet Bulb Temperature" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Wet bulb temperature determines the minimum achievable cold water temperature.  Recirculation of discharge vapors can increase the effective wet bulb temperature.</p>
        </Section>
        <Section title="Approach and Flow" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Increasing flow rate while maintaining the same range increases the heat load and the approach.</p>
        </Section>
        <Section title="Fill Media Effects" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Fill media influences heat exchange by affecting surface area, contact time, and turbulence. Film fill is more efficient than splash fill in terms of power consumption.</p>
        </Section>
        </Section>

        <Section 
        title="Choosing a Cooling Tower" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Counter-flow heat exchange is more effective than cross-flow. Cross-flow towers use splash fill, while counter-flow can use both film and splash fill.  Counter-flow film fill offers the lowest power consumption.</p>
        </Section>

        <Section 
        title="7.3 Efficient System Operation" 
        level={2}
        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <Section title="Cooling Water Treatment" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Essential for controlling suspended solids and algae, and for increasing Cycles of Concentration (COC) to reduce makeup water requirements.</p>
        </Section>
        <Section title="Drift Loss" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Drift eliminators minimize water loss due to drift. Modern designs can achieve drift losses as low as 0.001% - 0.003%.</p>
        </Section>
        <Section title="Cooling Tower Fans" level={3}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Fan efficiency is crucial for energy efficiency. FRP fan blades can offer significant energy savings compared to metallic blades.</p>
        </Section>
        </Section>

        <Section 
        title="7.4 Flow Control Strategies" 
        level={2}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Methods to control airflow and tower performance:</p>
        <List items={[
            'On/off fan operation',
            'Two or three-speed fan motors',
            'Automatically adjustable pitch fans',
            'Variable speed fans'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">More sophisticated control strategies lead to better energy efficiency.</p>
        </Section>

        <Section 
        title="7.5 Energy Saving Opportunities in Cooling Towers" 
        level={2}
        icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <List items={[
            'Ensure proper clearances around the tower.',
            'Optimize fan blade angle.',
            'Correct fan tip clearance and balance.',
            'Replace old nozzles with efficient ones.',
            'Use self-extinguishing PVC cellular fill.',
            'Clean nozzles regularly.',
            'Balance flow to basins.',
            'Cover basins to minimize algae.',
            'Optimize blowdown rate.',
            'Use efficient drift eliminators.',
            'Restrict flow through large loads.',
            'Segregate high heat loads.',
            'Monitor L/G ratio and CW flow rates.',
            'Monitor approach, effectiveness and cooling capacity.',
            'Consider COC improvement.',
            'Use energy-efficient FRP fan blades.',
            'Improve CW pump efficiency.',
            'Control fans based on leaving water temperature.',
            'Optimize process CW flow requirements.'
        ]} />
        </Section>

    </Section>
    </div>
);
};

export default CoolingTowerChapter;