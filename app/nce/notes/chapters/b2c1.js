
// File: app/nce/notes/chapters/b1c2.js
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

const FuelsAndCombustionChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="1. FUELS AND COMBUSTION" 
        level={1}
        icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
    >
        
<Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Introduction to Fuels, Properties of Fuel oil, Coal and Gas, Storage, handling and preparation of fuels, Principles of Combustion, Combustion of Oil, Coal, and Gas
        </p>
    </Section>

    <Section 
        title="1.1 Introduction to Fuels" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Different types of fuels (liquid, solid, gaseous) are used for firing in boilers and furnaces. The choice of fuel depends on factors like availability, storage, handling, pollution, and cost. Fuel properties are crucial for selecting the right fuel and using it efficiently.  Laboratory tests determine these properties.
        </p>
    </Section>

    <Section 
        title="1.2 Properties of Liquid Fuels" 
        level={2}
        icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        Liquid fuels like furnace oil and LSHS (Low Sulphur Heavy Stock) are commonly used in industries. Key properties are:
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Density:</b> Mass of fuel per unit volume at 15°C. Measured using a hydrometer.  Unit: kg/m³. Important for quantity calculations and ignition quality assessment.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Specific Gravity:</b> Ratio of the weight of a given volume of oil to the weight of the same volume of water at a given temperature. Used in calculations involving weights and volumes.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Viscosity:</b> Internal resistance to flow. Decreases with increasing temperature. Measured in Stokes/Centistokes (or Engler, Saybolt, Redwood). Important for storage, handling, and atomization. Higher viscosity requires pre-heating.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Flash Point:</b> Lowest temperature at which fuel vapor momentarily flashes when an open flame is passed over it. Flash point for furnace oil: 66°C.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Pour Point:</b> Lowest temperature at which fuel will pour or flow. Indicates the lowest pumpable temperature.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Specific Heat:</b> Amount of heat (kCal) needed to raise the temperature of 1 kg of oil by 1°C. Unit: kCal/kg°C.  Determines the energy required for heating.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Calorific Value:</b> Heat produced during combustion.
                    <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
                        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <span className="flex-1"><b>Gross Calorific Value (GCV):</b> Assumes all water vapor produced is condensed.</span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <span className="flex-1"><b>Net Calorific Value (NCV):</b>  Assumes water vapor escapes uncondensed. Fuels should be compared based on NCV.</span>
                        </li>
                    </ul>
                </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Sulphur:</b> Source-dependent. Can cause corrosion due to sulphuric acid formation. Typical range for furnace oil: 2-4%.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Ash Content:</b> Inorganic material in fuel. Can cause fouling and corrosion. Negligible in distillate fuels. Typical range in residual fuels: 0.03-0.07%.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Carbon Residue:</b> Tendency to deposit solid residue on hot surfaces. Can affect burners and nozzles.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Water Content:</b> Can damage furnace surfaces and affect combustion. Normally very low (max 1%).</span>
            </li>
        </ul>
    </Section>

    <Section 
        title="Storage of Fuel Oil" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Store in tanks, not barrels. Size for at least 10 days of consumption. Use bund walls to contain spills. Regular cleaning is important.  Remove contaminants using strainers of varying mesh sizes at different points in the supply system.
        </p>
    </Section>

    <Section 
        title="Pumping" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
    >
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Heavy fuel oils: Positive displacement pumps (gear or diaphragm).</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Light fuels: Centrifugal or turbine pumps.</span>
            </li>
        </ul>
    </Section>

    <Section 
        title="Storage and Pumping Temperature" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Viscosity increases with decreasing temperature. Preheating is often necessary for pumping.  Two methods:
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Bulk heating (steam coils in insulated tank).</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Outflow heating (heat exchanger).</span>
            </li>
        </ul>
        Thermostatic control prevents overheating.
        </p>
    </Section>

    <Section 
        title="1.3 Properties of Coal" 
        level={2}
        icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
    >
        <Section
            title="Coal Classification"
            level={3}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Three main types: anthracite, bituminous, lignite. Also classified as semi-anthracite, semi-bituminous, sub-bituminous. Anthracite: oldest, high carbon, low volatile. Lignite: youngest, high volatile, high moisture. Indian industry mainly uses bituminous and sub-bituminous.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Indian coal grading is based on calorific value (kCal/kg).
            </p>
        </Section>
        <Section 
            title="Analysis of Coal" 
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1"><b>Ultimate analysis:</b> Determines all elements (C, H, O, N, S, etc.). Done in a lab.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1"><b>Proximate analysis:</b> Determines fixed carbon, volatile matter, moisture, and ash. Simpler method.</span>
                </li>
            </ul>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Details on measuring moisture, volatile matter, and carbon/ash are described using crucible-based heating and weighing methods. Proximate analysis gives the percentage of fixed carbon, volatiles, ash, and moisture. Fixed carbon contributes significantly to heating value.  High volatile matter helps ignition. Ash content impacts furnace design and pollution control.</p>
        </Section>

    </Section>


    <Section
        title="Significance of Proximate Analysis Parameters"
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
    >
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Fixed carbon:</b> Solid fuel remaining after volatile matter removal. Mostly carbon. Estimates heating value.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Volatile matter:</b> Gases released during heating (methane, hydrocarbons, etc.). Influences flame length, ignition, furnace design, and secondary air requirements.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Ash:</b> Non-combustible impurity. Impacts handling, combustion efficiency, and clinker formation.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Moisture:</b> Reduces heat content and increases handling costs. Can aid in binding fines and radiation heat transfer.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Sulphur:</b> Affects clinker/slagging, corrosion, and flue gas temperature.</span>
            </li>
        </ul>
    </Section>

    <Section 
        title="Ultimate Analysis" 
        level={2}
        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Determines elemental composition (C, H, O, S, etc.). Used to calculate air requirements, combustion gas volume, flame temperature, and flue duct design.
        </p>
    </Section>
```
```jsx
<Section 
        title="Storage, Handling, and Preparation of Coal" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Storage leads to inventory costs, space issues, quality deterioration, and fire hazards. Losses can occur due to oxidation, wind, and carpet loss (fines and dust). Minimize losses by:
        <ol className="ml-5 list-decimal">
            <li>Preparing a hard ground for storage.</li>
            <li>Constructing concrete/brick storage bays.</li>
        </ol>
        Minimize handling to reduce fines and segregation. Coal preparation (sizing, conditioning, blending) is crucial for good combustion.
        </p>
        <Section 
            title="Sizing of Coal" 
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Ensures even burning, reduces ash losses, and improves combustion efficiency. Coal is crushed using rotary breakers, roll crushers, or hammer mills.  Screening separates fines before crushing to save energy. Magnetic separators remove iron pieces.</p>
        </Section>
        <Section 
            title="Conditioning of Coal" 
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Water is added to coal to reduce segregation of fines. Water helps fines stick to larger lumps, improving combustion.  Ensure uniform wetting.</p>
        </Section>
        <Section 
            title="Blending of Coal" 
            level={3}
            icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Blending coals with different size distributions and qualities helps achieve uniform fuel feed and optimal fines content (around 25%).</p>
        </Section>
    </Section>

    <Section 
        title="1.4 Properties of Gaseous Fuels" 
        level={2}
        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Common gaseous fuels: LPG, natural gas, producer gas, blast furnace gas, coke oven gas. Calorific value is expressed in kCal/Nm³ (at 20°C and 760 mm Hg). Net calorific value is more relevant as most appliances don't utilize the heat of vaporization.
        </p>
        <Section 
            title="LPG" 
            level={3}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Mixture of propane and butane (mostly), with small amounts of propylene, butylene, and other hydrocarbons.  Gaseous at atmospheric pressure, stored and transported as liquids. LPG vapor is denser than air. Requires odorization for leak detection.  Needs good ventilation during storage.</p>
        </Section>
        <Section 
            title="Natural Gas" 
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Primarily methane (around 95%), with small amounts of ethane, propane, butane, etc. High calorific value. No storage facilities required. Mixes easily with air, burns cleanly (no smoke or soot). Lighter than air, disperses easily upon leakage.</p>
        </Section>
    </Section>

    <Section 
        title="1.5 Properties of Agro Residues" 
        level={2}
        icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Increasing use of agro-residues like rice husk, coconut shells, etc. Proximate and ultimate analysis provide information on their composition and heating value.</p>
    </Section>

    <Section 
        title="1.6 Combustion" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
    >
        <Section 
            title="Principle of Combustion" 
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Rapid oxidation of fuel producing heat and/or light. Requires adequate oxygen.  Oxygen (20.9% of air) is crucial. Nitrogen (79% of air) acts as a diluent, reducing combustion efficiency and forming NOx. Complete combustion produces CO2, H2O, and SO2, releasing heat. Incomplete combustion forms CO (or smoke) and less heat.</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>The 3 T's of Combustion:</b>
            <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1"><b>Temperature:</b> High enough for ignition and sustained burning.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1"><b>Turbulence:</b> Proper mixing of fuel and oxygen.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1"><b>Time:</b> Sufficient for complete combustion.</span>
                </li>
            </ul>
            </p>
        </Section>
    </Section>

    <Section 
        title="1.7 Combustion of Oil" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
    >
        <Section 
            title="Heating Oil to Correct Viscosity" 
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Preheating is necessary for atomization.  Target viscosity at the burner tip for furnace oil: 100 Redwood seconds<sup>-1</sup> (achieved at around 105°C).</p>
        </Section>
        <Section 
            title="Stoichiometric Combustion" 
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Theoretical air required for complete combustion, based on the elemental composition of the fuel. Ideal mixing and combustion are assumed. For 1 kg of typical fuel oil (86% C, 12% H, 2% S), stoichiometric air is 14.1 kg.</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>Rules for oil combustion:</b>
            <ol className="ml-5 list-decimal">
                <li>Complete atomization.</li>
                <li>Thorough air-fuel mixing.</li>
                <li>Sufficient air (but limit excess air to 15%).</li>
                <li>Maintain burner condition.</li>
            </ol>
            </p>
        </Section>
        <Section 
            title="Calculation of Stoichiometric Air" 
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Uses the chemical reactions of combustion and the composition of the fuel to calculate the theoretical air requirement.</p>
        </Section>
        <Section 
            title="Optimizing Excess Air and Combustion" 
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Perfect mixing is practically impossible, so excess air is needed. Too much excess air leads to heat loss through stack gases. Too little air leads to incomplete combustion and smoke. Optimal excess air levels exist for each fuel.</p>
        </Section>
        <Section 
            title="Control of Air and Analysis of Flue Gas" 
            level={3}
            icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Chemical analysis of flue gases (CO2 or O2 measurement) is used to control excess air. Optimal levels for fuel oil: 14-15% CO2 or 2-3% O2.</p>
        </Section>
        <Section 
            title="Oil Firing Burners" 
            level={3}
            icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Atomize fuel into small droplets for better mixing with air.  Primary air: atomization. Secondary air: complete combustion. Turbulence is essential for proper mixing. Turndown ratio (ratio of maximum to minimum fuel input) is an important burner characteristic.</p>
        </Section>

    </Section>

    <Section 
        title="1.8 Combustion of Coal" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
    >
        <Section 
            title="Features of Coal Combustion" 
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">1 kg of coal requires approximately 7-8 kg of air (stoichiometric air).  Excess air is always needed in practice. The amount depends on the firing method (hand-fired &gt; stoker-fired &gt; fluidized bed &gt; pulverized fuel). Clinker formation (hard slag) can occur due to low ash fusion temperature.</p>
        </Section>
    </Section>

    <Section 
        title="1.9 Combustion of Gas" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
    >
        <Section 
            title="Combustion Characteristics of Natural Gas" 
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Stoichiometric air-to-fuel ratio (by volume) is around 9.5:1 to 10:1. Natural gas is mostly methane (CH4). Combustion reaction: CH4 + 2O2 → CO2 + 2H2O.</p>
        </Section>
        <Section 
            title="Low- and High-Pressure Gas Burners" 
            level={3}
            icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Low-pressure burners: Multi-jet type, using gas at less than 0.15 kg/cm² (2 psi). High-pressure gas mixers use a venturi to entrain air and deliver a premixed air-fuel mixture to the burner. Excess air levels for natural gas are typically around 5%.</p>
        </Section>
    </Section>

    <Section 
        title="1.10 Draft System" 
        level={2}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Removes combustion products.
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Natural Draft:</b> Chimney alone creates the draft.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Mechanical Draft:</b> Uses fans (forced draft, induced draft, balanced draft). </span>
            </li>
        </ul>
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Balanced draft:</b> Forced draft fan pushes air into the furnace, induced draft fan draws out flue gases.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Induced draft:</b> Fan draws out flue gases, creating negative pressure in the furnace.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Forced draft:</b> Fan pushes air into the furnace, forcing combustion products out.</span>
            </li>
        </ul>
    </Section>


<Section 
        title="1.11 Combustion Controls" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Regulate fuel and air supply to achieve efficient and safe operation. Types:
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>On/Off control:</b>  Simple, for small boilers.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>High/Low/Off control:</b> Two firing rates, for medium-sized boilers.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Modulating control:</b> Varies firing rate continuously, for optimal efficiency.</span>
            </li>
        </ul>
        </p>
    </Section>
    </Section>
    </div>
);
};

export default FuelsAndCombustionChapter;
