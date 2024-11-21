
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

const PumpsAndPumpingSystemsChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="6. Pumps and Pumping Systems" 
        level={1}
        icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
        <Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            This chapter covers pumps and pumping systems, including types, performance evaluation, efficient system operation, flow control strategies, and energy conservation opportunities.
        </p>
        </Section>

        <Section 
        title="6.1 Pump Types" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Pumps are categorized based on their operating principles:
        </p>
        <List items={[
            <strong>Dynamic pumps:</strong> + "These include centrifugal pumps (the focus of this chapter) and special effect pumps.",
            <strong>Displacement pumps:</strong> + "These include rotary and reciprocating pumps."
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            While positive displacement pumps are generally more efficient, their higher maintenance costs often offset this advantage. Centrifugal pumps are the most common type due to their lower cost.
        </p>
        <h3>Centrifugal Pumps</h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            A centrifugal pump has two main parts: the impeller and the diffuser (volute). The impeller is the only moving part and is attached to a shaft driven by a motor. Water enters the impeller's center (eye), gains velocity due to the impeller's rotation, and exits with increased velocity due to centrifugal force. The diffuser captures and directs the water, converting the velocity into pressure.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The pump's developed pressure (head) is related to the impeller diameter, number of impellers, impeller eye size, and shaft speed. The pump's capacity is determined by the impeller's exit width. The motor's horsepower is determined by the head and capacity requirements.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Centrifugal pumps are not positive displacement pumps, meaning their flow rate varies with the water depth and discharge pressure. It's crucial to select a pump designed for the specific application.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Pump performance curves typically show:
        </p>
        <List items={[
            'Flow rate (horizontal axis)',
            'Head generated (vertical axis)',
            'Efficiency, power, and NPSH Required (vertical axis, plotted against flow rate)'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Hydraulic Power, Pump Shaft Power, and Electrical Input Power</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Hydraulic power (P<sub>h</sub>):</strong></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">P<sub>h</sub> = Q (m³/s) * (h<sub>d</sub> - h<sub>s</sub>) (m) * ρ (kg/m³) * g (m/s²) / 1000</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
        <List items={[
            'Q = flow rate',
            'h<sub>d</sub> = discharge head',
            'h<sub>s</sub> = suction head',
            'ρ = density of the fluid',
            'g = acceleration due to gravity'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Pump shaft power (P<sub>s</sub>):</strong></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">P<sub>s</sub> = P<sub>h</sub> / η<sub>pump</sub></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
        <List items={[
            'η<sub>pump</sub> = pump efficiency'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Electrical input power:</strong></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Electrical input power = P<sub>s</sub> / η<sub>motor</sub></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
        <List items={[
            'η<sub>motor</sub> = motor efficiency'
        ]} />

<h3>Centrifugal Pumps</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    A centrifugal pump has two main parts: the impeller and the diffuser (volute). The impeller is the only moving part and is attached to a shaft driven by a motor. Water enters the impeller's center (eye), gains velocity due to the impeller's rotation, and exits with increased velocity due to centrifugal force. The diffuser captures and directs the water, converting the velocity into pressure.
</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    The pump's developed pressure (head) is related to the impeller diameter, number of impellers, impeller eye size, and shaft speed. The pump's capacity is determined by the impeller's exit width. The motor's horsepower is determined by the head and capacity requirements.
</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Centrifugal pumps are not positive displacement pumps, meaning their flow rate varies with the water depth and discharge pressure. It's crucial to select a pump designed for the specific application.
</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Pump performance curves typically show:
</p>
<List items={[
    'Flow rate (horizontal axis)',
    'Head generated (vertical axis)',
    'Efficiency, power, and NPSH Required (vertical axis, plotted against flow rate)'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Hydraulic Power, Pump Shaft Power, and Electrical Input Power</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Hydraulic power (P<sub>h</sub>):</strong></p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">P<sub>h</sub> = Q (m³/s) * (h<sub>d</sub> - h<sub>s</sub>) (m) * ρ (kg/m³) * g (m/s²) / 1000</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
<List items={[
    'Q = flow rate',
    'h<sub>d</sub> = discharge head',
    'h<sub>s</sub> = suction head',
    'ρ = density of the fluid',
    'g = acceleration due to gravity'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Pump shaft power (P<sub>s</sub>):</strong></p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">P<sub>s</sub> = P<sub>h</sub> / η<sub>pump</sub></p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
<List items={[
    'η<sub>pump</sub> = pump efficiency'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Electrical input power:</strong></p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Electrical input power = P<sub>s</sub> / η<sub>motor</sub></p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
<List items={[
    'η<sub>motor</sub> = motor efficiency'
]} />
</Section>
<Section 
title="6.2 System Characteristics" 
level={2}
icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Pumping systems aim to transfer liquid or circulate it for heat transfer. The pressure required for flow must overcome static and friction head losses:
</p>
<List items={[
    <strong>Static head:</strong>  + "The height difference between source and destination. It's independent of flow rate.",
    <strong>Friction head (dynamic head loss):</strong> + "Losses due to friction in pipes, valves, and equipment. It's proportional to the square of the flow rate."
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Most systems have both static and friction head losses. The ratio of these influences the benefits of variable speed drives.
</p>
</Section>

<Section 
title="6.3 Pump Curves" 
level={2}
icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    The pump characteristic curve (Head-Flow curve) shows the relationship between head and flow rate. For centrifugal pumps, the head typically decreases gradually with increasing flow rate.
</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    The operating point is where the pump curve intersects the system curve. This point determines the actual flow and head the pump will deliver in the system.
</p>
</Section>

<Section 
title="6.4 Factors Affecting Pump Performance" 
level={2}
icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Oversizing a pump leads to operating at a lower efficiency point and energy waste due to throttling or bypass. Matching the pump curve to the system curve is essential for optimal performance.
</p>
</Section>

<Section 
title="6.5 Efficient Pumping System Operation" 
level={2}
icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Efficient pumping system operation involves understanding system demands, optimizing flow rates, and matching the pump to the system requirements.
</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Common inefficiencies and their solutions are summarized in Table 6.1 in the document.
</p>
</Section>

<Section 
title="Effect of Speed Variation (Affinity Laws)" 
level={2}
icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    The Affinity Laws relate pump performance (flow, head, and power) to impeller speed:
</p>
<List items={[
    'Q ∝ N (Flow rate is proportional to speed)',
    'H ∝ N² (Head is proportional to the square of speed)',
    'P ∝ N³ (Power is proportional to the cube of speed)'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
<List items={[
    'Q = flow rate',
    'H = Head',
    'P = Power',
    'N = Speed'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Efficiency is generally independent of speed.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Small speed reductions can significantly reduce power consumption. Conversely, small speed increases significantly increase power consumption and stress on pump components.</p>
</Section>

<Section 
title="Effects of impeller diameter change" 
level={2}
icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Similar relationships exist for impeller diameter (D):</p>
<List items={[
    'Q ∝ D',
    'H ∝ D²',
    'P ∝ D³'
]} />
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Impeller trimming (reducing diameter) is a method for reducing pump performance when a pump is oversized. However, it's limited to reductions of about 25% of the original diameter.</p>
</Section>

<Section 
title="Pump suction performance (NPSH)" 
level={2}
icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Net Positive Suction Head Available (NPSHA):</strong> The difference between the suction pressure and the liquid's vapor pressure, expressed as head. This is a system characteristic.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Net Positive Suction Head Required (NPSHR):</strong> The minimum NPSH needed at the pump suction to prevent cavitation. This is a pump characteristic.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cavitation occurs when the liquid pressure drops below its vapor pressure, forming vapor bubbles that can damage the impeller. To avoid cavitation, NPSHA must exceed NPSHR.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">NPSHR increases with flow rate and speed (NPSHR ∝ N²).  There's a minimum NPSHR plateau at very low speeds. NPSH is a crucial consideration in variable speed pumping.</p>
</Section>


{/* ... continued in next chunk */}

```
```jsx
<Section 
title="6.6 Flow Control Strategies" 
level={2}
icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
<h3>Pump Control by Varying Speed</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Variable Speed Drives (VSDs), particularly Variable Frequency Drives (VFDs), offer the most efficient flow control by adjusting pump speed. In friction-loss dominated systems, speed reduction proportionally reduces flow and power. However, in systems with high static head, speed reduction can cause large flow reductions and lower efficiency, potentially damaging the pump.
</p>
<h3>Pumps in Parallel Switched to Meet Demand</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Using multiple pumps in parallel allows flow control by switching pumps on/off. Flow rate is not directly proportional to the number of pumps running. Careful consideration of operating points and NPSH is crucial when running pumps in parallel.
</p>
<h3>Stop/Start Control</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Flow is controlled by switching pumps on/off based on storage levels. This is energy-efficient when intermittent flow is acceptable.  However, frequent stop/starts can increase wear on components.
</p>
<h3>Flow Control Valve</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Throttling a valve downstream of the pump creates additional friction head, reducing flow. However, this wastes energy. It can also force the pump to operate at a lower efficiency point.
</p>
<h3>Bypass Control</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    This involves running the pump at maximum capacity and bypassing excess flow back to the suction. This method is less efficient than flow control valves as there's no reduction in power consumption with reduced demand.
</p>
<h3>Fixed Flow Reduction (Impeller Trimming)</h3>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Impeller trimming involves machining the impeller diameter to reduce flow and head. This is a useful method for correcting oversized pumps, but the Affinity Laws are non-linear with respect to impeller diameter changes, making precise prediction difficult.
</p>
</Section>

<Section 
title="6.7 Energy Conservation Opportunities in Pumping Systems" 
level={2}
icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    The document lists various energy-saving opportunities in pumping systems, including proper pump sizing, using VFDs, optimizing operating points, minimizing throttling losses, and improving system design.
</p>
</Section>
    </Section>
    </div>
);
};

export default PumpsAndPumpingSystemsChapter;
