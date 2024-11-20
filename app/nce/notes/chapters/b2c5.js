
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

const InsulationAndRefractoriesChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="Insulation and Refractories" 
        level={1}
        icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />} 
    >
        
        <Section title="5.1 Purpose of Insulation" level={2} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Thermal insulation, with its low thermal conductivity, prevents heat loss or gain in buildings and manufacturing. It's primarily for economic reasons but also provides accurate temperature control, personnel protection, prevents corrosion from condensation, and absorbs vibrations.</p>
        </Section>
        <Section title="5.2 Types and Application" level={2} icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Insulation is categorized based on temperature range:</p>
            <List items={[
                <strong>Low Temperature (up to 90°C):</strong> + ' Used in refrigerators, water systems, and tanks. Materials include cork, wood, 85% magnesia, mineral fibers, polyurethane, and expanded polystyrene.',
                <strong>Medium Temperature (90-325°C):</strong> + '  Used in low-temperature heating equipment, steam lines. Materials include 85% magnesia, asbestos, calcium silicate, and mineral fibers.',
                <strong>High Temperature (325°C and above):</strong> + ' Used in superheated steam systems, ovens, and furnaces. Materials include asbestos, calcium silicate, mineral fiber, mica, vermiculite, fireclay/silica-based insulation, and ceramic fiber.'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Insulation can be organic (hydrocarbon-based, like thermocol and PUF) or inorganic (siliceous/aluminous/calcium-based, like mineral wool and calcium silicate).</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Common Insulating Materials:</strong></p>
            <List items={[
                <strong>Calcium Silicate:</strong> + ' High service temperature and compressive strength (40°C to 950°C).',
                <strong>Glass Mineral Wool:</strong> + ' Flexible, rigid, and preformed shapes (-10°C to 500°C).',
                <strong>Thermocol:</strong> + ' Cold insulation for piping and cold storage.',
                <strong>Expanded Nitrile Rubber:</strong> + ' Flexible, closed-cell vapor barrier for refrigeration and HVAC.',
                <strong>Rock Mineral Wool:</strong> + ' Various forms, thermal and acoustic insulation, fire retardant.'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Moulded Insulation:</strong> Pre-shaped sections for pipes, vessels, etc., offer easy application and replacement.</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Thermal Conductivity:</strong> Heat loss per unit area, thickness, and temperature difference (W-m/°C). It increases with temperature and is specified at the mean temperature of the insulation material.</p>
        </Section>
        <Section title="5.3 Calculation of Insulation Thickness" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The basic model considers a pipe with outer radius <em>r<sub>1</sub></em> and insulation outer radius <em>r<sub>2</sub></em>. Heat loss (H) is calculated as:</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>H = h × A × (T<sub>h</sub> - T<sub>a</sub>)</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
            <List items={[
                <em>h</em> + ' = Heat transfer coefficient (W/m²-K)',
                <em>A</em> + ' = Surface area (m²)',
                <em>T<sub>h</sub></em> + ' = Hot surface temperature (°C) (or cold surface temperature for cold fluids)',
                <em>T<sub>a</sub></em> + ' = Ambient temperature (°C)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Heat Transfer Coefficient (<em>h</em>) for pipes:</strong></p>
            <List items={[
                <strong>Horizontal:</strong> + <em>&nbsp;h</em> + ' = (A + 0.005(T<sub>h</sub> - T<sub>a</sub>)) × 10 W/m²-K',
                <strong>Vertical:</strong> + <em>&nbsp;h</em> + ' = (B + 0.009(T<sub>h</sub> - T<sub>a</sub>)) × 10 W/m²-K'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">(Coefficients A and B depend on the surface material and are provided in tables).</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Mean Temperature (T<sub>m</sub>):</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>T<sub>m</sub> = (T<sub>h</sub> + T<sub>s</sub>) / 2</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
            <List items={[
                <em>T<sub>s</sub></em> + ' = Insulation surface temperature (°C)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Thermal Resistances:</strong></p>
            <List items={[
                <strong>Surface:</strong> + ' R<sub>s</sub> = 1/<em>h</em> (°C-m²/W)',
                <strong>Insulation:</strong> + ' R<sub>l</sub> = <em>t<sub>k</sub></em>/<em>k</em> (°C-m²/W)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
            <List items={[
                <em>t<sub>k</sub></em> + ' = Insulation thickness (mm)',
                <em>k</em> + ' = Thermal conductivity of insulation at T<sub>m</sub> (W/m-°C)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Heat Flow:</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>H = (T<sub>h</sub> - T<sub>a</sub>) / (R<sub>l</sub> + R<sub>s</sub>) = (T<sub>s</sub> - T<sub>a</sub>) / R<sub>s</sub></strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Equivalent Thickness (for pipes):</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Et<sub>k</sub> = (r<sub>1</sub> + t<sub>k</sub>) × ln((r<sub>1</sub> + t<sub>k</sub>) / r<sub>1</sub>)</strong></p>
        </Section>
        <Section title="5.4 Economic Thickness of Insulation (ETI)" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">ETI is the insulation thickness that minimizes the total cost (insulation cost + cost of energy loss). Increasing thickness beyond ETI yields diminishing returns.</p>
        </Section>
        <Section title="5.5 Simplified Formula for Heat Loss Calculation (up to 200°C)" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>S = [10 + (T<sub>s</sub> - T<sub>a</sub>)/20] × (T<sub>s</sub> - T<sub>a</sub>)</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
            <List items={[
                <em>S</em> + ' = Surface heat loss (kcal/hr-m²)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Total Heat Loss (H<sub>s</sub>) = S × A</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Equivalent Fuel Loss (H<sub>f</sub>):</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>H<sub>f</sub> (kg/year) = (H<sub>s</sub> × Yearly hours of operation) / (GCV × η)</strong></p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where:</p>
            <List items={[
                <em>GCV</em> + ' = Gross Calorific Value of fuel (kcal/kg)',
                <em>η</em> + ' = Boiler efficiency (%)'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Annual Heat Loss Cost (Rs.) = H<sub>f</sub> × Fuel cost (Rs./kg)</strong></p>
        </Section>
        <Section title="5.6 Refractories" level={2} icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Refractories withstand abrasive/corrosive materials at high temperatures. Their key properties include high-temperature resistance, resistance to thermal shock, and compatibility with the working environment.</p>
        </Section>
        <Section title="5.7 Properties of Refractories" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
            <List items={[
                <strong>Melting Point:</strong> + ' Temperature at which the refractory deforms under its own weight.',
                <strong>Size and Shape:</strong> + ' Important for structural stability.',
                <strong>Bulk Density:</strong> + ' Material present in a given volume; higher density implies higher volume stability and heat capacity.',
                <strong>Porosity:</strong> + ' Volume of open pores; lower porosity is generally preferred for slag resistance.',
                <strong>Cold Crushing Strength:</strong> + ' Ability to withstand load at room temperature.',
                <strong>Pyrometric Cone Equivalent (PCE):</strong> + ' Temperature at which a refractory deforms under its own weight.',
                <strong>Refractoriness Under Load (RUL):</strong> + ' Temperature at which bricks collapse under load in service conditions.',
                <strong>Creep at High Temperature:</strong> + ' Time-dependent deformation under stress.',
                <strong>Volume Stability:</strong> + ' Resistance to expansion/shrinkage at high temperatures.',
                <strong>Reversible Thermal Expansion:</strong> + ' Expansion and contraction due to heating and cooling.',
                <strong>Thermal Conductivity:</strong> + ' Ability to transfer heat.'
            ]} />
        </Section>
        <Section title="5.8 Classification of Refractories" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Refractories are classified based on:</p>
            <List items={[
                <strong>Chemical Composition:</strong> + ' Acidic (e.g., silica), Basic (e.g., magnesite), Neutral (e.g., alumina).',
                <strong>End Use:</strong> + ' Blast furnace, ladle, etc.',
                <strong>Method of Manufacture:</strong> + ' Dry press, fused cast, hand-molded, formed, unformed (monolithics).'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Mineral-based refractories are further categorized by chemical composition (percentage of SiO<sub>2</sub> and Al<sub>2</sub>O<sub>3</sub>).</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><strong>Types of Monolithic Refractories:</strong></p>
            <List items={[
                'Castables',
                'Mouldables',
                'Ramming mixtures'
            ]} />
        </Section>
        <Section title="5.9 Typical Refractories in Industrial Use" level={2} icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Different refractories are used based on the specific application and temperature requirements (e.g., fireclay, high alumina, silica, magnesite, chromite, zirconia).</p>
        </Section>
        <Section title="5.10 Selection of Refractories" level={2} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Refractory selection depends on various factors, including area of application, working temperature, abrasion/impact, structural load, thermal stress, chemical compatibility, heat transfer needs, and cost.</p>
        </Section>
        <Section title="5.11 Heat Losses from Furnace Walls" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat loss from furnace walls depends on emissivity, conductivity, thickness, and operating schedule (continuous or intermittent). Insulation and thicker walls reduce heat loss. Insulating bricks are more effective than simply increasing wall thickness.</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">In summary, heat loss from walls depends on:</p>
            <List items={[
                'Inside and outside temperatures',
                'Outside air velocity',
                'Wall configuration',
                'Emissivity, thickness, and conductivity of walls'
            ]} />
        </Section>
        <Section title="High Emissivity Coatings" level={2} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">High emissivity coatings increase the ability of a material to absorb and radiate heat, leading to improved heat transfer, uniform heating, and longer refractory life.  These coatings are beneficial in high-temperature applications and can reduce fuel consumption in intermittent furnaces.</p>
        </Section>
    </Section>
    </div>
);
};

export default InsulationAndRefractoriesChapter;