
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


const MaterialEnergyBalance = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section title="Material and Energy Balance Summary" level={1} icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}>
        


<Section title="4. MATERIAL AND ENERGY BALANCE" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <p>Material and energy balances describe the conservation of mass and energy within a process. Material balances track the quantity of materials, while energy balances track the quantity of energy. These balances are essential for process control, yield optimization, and energy efficiency improvements.</p>
</Section>
<Section title="4.1 Basic Principles" level={2} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
    <p>The fundamental principle is that for a system with no accumulation, input equals output. This applies to both batch and continuous operations.</p>
    <p>A unit operation can be represented as a box, with mass and energy entering and leaving. The mass and energy entering must equal the mass and energy leaving (plus any stored mass or energy).</p>
    <p><strong>Mass Balance:</strong></p>
    <p>Mass In = Mass Out + Mass Stored<br />Raw Materials = Products + Wastes + Stored Materials</p>
    <p>∑M<sub>R</sub> = ∑M<sub>P</sub> + ∑M<sub>W</sub> + ∑M<sub>S</sub></p>
    <p>(where ∑ (sigma) denotes the sum of all terms).</p>
    <p><strong>Energy Balance:</strong></p>
    <p>Energy In = Energy Out + Energy Stored</p>
    <p>∑E<sub>R</sub> = ∑E<sub>P</sub> + ∑E<sub>W</sub> + ∑E<sub>L</sub> + ∑E<sub>S</sub></p>
    <p>Where:</p>
    <ul>
        <li>∑E<sub>R</sub>: Total Energy Entering</li>
        <li>∑E<sub>P</sub>: Total Energy Leaving with Products</li>
        <li>∑E<sub>W</sub>: Total Energy Leaving with Waste Materials</li>
        <li>∑E<sub>L</sub>: Total Energy Lost to Surroundings</li>
        <li>∑E<sub>S</sub>: Total Energy Stored</li>
    </ul>
</Section>
<Section title="4.2 The Sankey Diagram and its Use" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
    <p>A Sankey diagram visually represents energy flows within a system. The width of the arrows represents the magnitude of the energy flow, making it easy to identify areas for improvement.</p>
</Section>
<Section title="4.3 Material Balances" level={2} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
    <p>Material balances can be performed on total mass, dry solids, or individual components. The basis for the calculation can be a specific mass of input material or a time period (e.g., per hour).</p>
    <p><strong>Concentrations:</strong></p>
    <ul>
        <li>Weight/weight (w/w): weight of solute / total weight of solution</li>
        <li>Weight/volume (w/v): weight of solute / total volume of solution</li>
        <li>Molar concentration (M): kg moles of solute / m³ of solution</li>
        <li>Mole fraction: moles of solute / total moles of all species</li>
    </ul>
    <p><strong>Ideal Gas Law:</strong> PV = nRT</p>
    <p>Where:</p>
    <ul>
        <li>P: Pressure</li>
        <li>V: Volume</li>
        <li>n: Number of moles</li>
        <li>R: Gas constant (0.08206 m³ atm / mole K)</li>
        <li>T: Absolute temperature</li>
    </ul>
</Section>
<Section title="4.4 Energy Balances" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />}>
    <p>Energy balances consider various forms of energy, including heat, kinetic, chemical, and potential energy. In many applications, one form of energy dominates, simplifying the balance.</p>
    <p><strong>Heat Balances:</strong></p>
    <p>Enthalpy (H) is conserved in heat balances. Changes in enthalpy are due to sensible heat (temperature changes) and latent heat (phase changes).</p>
    <p>Sensible heat change: m × c × ΔT</p>
    <p>Where:</p>
    <ul>
        <li>m: Mass</li>
        <li>c: Specific heat</li>
        <li>ΔT: Change in temperature</li>
    </ul>
    <p>Latent heat change: m × L</p>
    <p>Where:</p>
    <ul>
        <li>m: Mass</li>
        <li>L: Latent heat</li>
    </ul>
</Section>
<Section title="4.5 Method for Preparing Process Flow Chart" level={2} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
    <p>Process flow charts are diagrams that depict the flow of materials and energy through a process, including raw materials, intermediates, products, waste streams, and energy inputs/outputs. These charts help visualize the process and identify areas for potential improvement. They are created by sequentially representing the process steps from raw materials to finished products, including relevant process parameters and flow rates.</p>
</Section>
<Section title="4.6 Facility as an Energy System" level={2} icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
    <p>A facility can be viewed as an energy system with various subsystems for generating, distributing, and utilizing energy. These subsystems include electrical systems, fuel-based systems (e.g., boilers), cooling systems, and compressed air systems. Analyzing these systems helps understand energy flows and identify opportunities for improvement.</p>
</Section>
<Section title="4.7 How to Carryout Material and Energy (M&E) Balance?" level={2} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}>
    <p>Material and energy balances are important tools for identifying losses, monitoring improvements, and evaluating cost-benefits in manufacturing processes. These balances quantify resource use and waste generation, highlighting areas for efficiency improvement. Guidelines for creating these balances include considering the entire system, choosing discrete subsystems, using a process flow diagram, including recycle streams within the analysis, selecting appropriate measurement units, considering batch sizes, including start-up and cleaning operations, calculating gas volumes at standard conditions, accounting for shutdown losses, highlighting part-load inefficiencies, and indicating energy quality for each stream. These balances should be developed at overall, section-wise, and equipment-wise levels for comprehensive analysis.</p>
</Section>
</Section>
</div>
);
};

export default MaterialEnergyBalance;
