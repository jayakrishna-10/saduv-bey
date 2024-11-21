
// File: app/nce/notes/chapters/b1c7.js
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

const CogenerationChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="7. COGENERATION" 
        level={1}
        icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
        <Section
            title="Syllabus"
            level={2}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Cogeneration: Definition, Need, Application, Advantages, Classification, Saving potentials
            </p>
        </Section>

        <Section
            title="7.1 Need for Cogeneration"
            level={2}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Conventional thermal power plants are inefficient, converting only about 35% of primary energy into electricity. The remaining 65% is lost as heat. Transmission and distribution losses further reduce the delivered electricity by 10-15%. Cogeneration aims to address this inefficiency.
            </p>
        </Section>

        <Section
            title="7.2 Principle of Cogeneration"
            level={2}
            icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Cogeneration, or Combined Heat and Power (CHP), is the sequential generation of two useful energy forms (typically mechanical and thermal) from a single primary energy source. The mechanical energy can drive an alternator for electricity or power rotating equipment. The thermal energy can be used directly in processes or indirectly to produce steam, hot water, hot air, or chilled water.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Cogeneration can achieve overall energy efficiencies up to 85% or more.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <b>Example:</b> A conventional system requiring 24 units of electricity (40% efficiency) and 34 units of heat (85% efficiency) needs 60 units of primary energy for electricity generation and 40 units for heat generation, totaling 100 units. A cogeneration system with 85% efficiency needs only 68 units of primary energy (24+34)/0.85) for both electricity and heat.
            </p>
        </Section>

        <Section
            title="7.3 Technical Options for Cogeneration"
            level={2}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
            <List items={[
                'Extraction/back pressure steam turbines',
                'Gas turbines with heat recovery boiler (with or without bottoming steam turbine)',
                'Reciprocating engines with heat recovery boiler'
            ]} />
            <Section
                title="7.3.1 Steam Turbine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Types of steam turbines used in cogeneration:</p>
                <List items={[
                    <b>Backpressure turbine:</b> + 'Steam expands from high to low/medium pressure, generating power. Different configurations exist for various process steam requirements.',
                    <b>Extraction-condensing turbine:</b> + 'Steam is extracted at intermediate pressure for process use, remaining steam expands further and condenses, generating power.',
                    <b>Extraction-backpressure turbine:</b> + 'Combines features of both, providing thermal energy at two different temperature levels.',
                    <b>Full-condensing turbine:</b> + 'Primarily used where process heat is used to generate additional power.'
                ]} />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Steam turbines can utilize various fuels (coal, natural gas, fuel oil, biomass) and are suitable for larger-scale applications (1 MW to hundreds of MW). Not ideal for sites with intermittent energy demand due to system inertia.</p>

            </Section>
            <Section
                title="7.3.2 Gas Turbine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Gas turbines generate electricity, and exhaust heat is recovered for heating/cooling applications. Natural gas is the most common fuel, but other fuels can be used. Typical range: fraction of MW to 100 MW.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Advantages: Greater natural gas availability, technological advancements, lower installation costs, shorter project development time, flexibility for intermittent operation.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Disadvantage: Lower heat-to-power conversion efficiency, but higher heat recovery temperature. Supplementary firing can boost thermal output if needed.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>Combined cycle cogeneration:</b> Combines gas turbine and steam turbine to increase power output. Exhaust from gas turbine generates steam to power a steam turbine.</p>
            </Section>


            <Section
                title="7.3.3 Reciprocating Engine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Internal combustion engines have high power generation efficiency. Heat is recovered from exhaust gas (high temperature) and engine jacket cooling water (low temperature).</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Suitable for smaller applications, especially where electricity demand is greater than thermal demand and low-quality heat (low-pressure steam, hot water) is sufficient.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Can use various fuels, but diesel is most common. Suitable for intermittent operation, less sensitive to ambient temperature changes compared to gas turbines.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Higher operating and maintenance costs due to wear and tear.</p>
            </Section>

            <Section
                title="7.3.1 Steam Turbine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Types of steam turbines used in cogeneration:</p>
                <List items={[
                    <b>Backpressure turbine:</b>+'Steam expands from high to low/medium pressure, generating power. Different configurations exist for various process steam requirements.',
                    <b>Extraction-condensing turbine:</b>+ 'Steam is extracted at intermediate pressure for process use, remaining steam expands further and condenses, generating power.',
                    <b>Extraction-backpressure turbine:</b> +'Combines features of both, providing thermal energy at two different temperature levels.',
                    <b>Full-condensing turbine:</b> + 'Primarily used where process heat is used to generate additional power.'

                ]} />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Steam turbines can utilize various fuels (coal, natural gas, fuel oil, biomass) and are suitable for larger-scale applications (1 MW to hundreds of MW). Not ideal for sites with intermittent energy demand due to system inertia.</p>

            </Section>
            <Section
                title="7.3.2 Gas Turbine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Gas turbines generate electricity, and exhaust heat is recovered for heating/cooling applications. Natural gas is the most common fuel, but other fuels can be used. Typical range: fraction of MW to 100 MW.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Advantages: Greater natural gas availability, technological advancements, lower installation costs, shorter project development time, flexibility for intermittent operation.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Disadvantage: Lower heat-to-power conversion efficiency, but higher heat recovery temperature. Supplementary firing can boost thermal output if needed.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>Combined cycle cogeneration:</b> Combines gas turbine and steam turbine to increase power output. Exhaust from gas turbine generates steam to power a steam turbine.</p>
            </Section>


            <Section
                title="7.3.3 Reciprocating Engine Cogeneration Systems"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Internal combustion engines have high power generation efficiency. Heat is recovered from exhaust gas (high temperature) and engine jacket cooling water (low temperature).</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Suitable for smaller applications, especially where electricity demand is greater than thermal demand and low-quality heat (low-pressure steam, hot water) is sufficient.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Can use various fuels, but diesel is most common. Suitable for intermittent operation, less sensitive to ambient temperature changes compared to gas turbines.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Higher operating and maintenance costs due to wear and tear.</p>
            </Section>
        </Section>

        <Section
            title="7.4 Classification of Cogeneration Systems"
            level={2}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Cogeneration systems are classified based on energy use sequence:
            </p>
            <List items={[
                <b>Topping cycle:</b> +'Fuel is first used for power generation, then waste heat for thermal applications (more common).',
                <b>Bottoming cycle:</b>+' Fuel first generates high-temperature thermal energy, then waste heat is used for power generation.'

            ]} />
        </Section>





<Section
    title="7.5 Factors Influencing Cogeneration Choice"
    level={2}
    icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <Section
        title="7.5.1 Base electrical load matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant sized to meet minimum electricity demand. Remaining electricity purchased from the grid. Supplemental boilers or export of excess thermal energy may be needed.</p>
    </Section>
    <Section
        title="7.5.2 Base Thermal Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant sized to meet minimum thermal demand. Supplemental boilers used during peak thermal demand. Excess electricity can be sold to the grid.</p>
    </Section>
    <Section
        title="7.5.3 Electrical Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant meets entire electricity demand of the site (stand-alone system). Auxiliary boilers used for additional thermal demand.</p>
    </Section>
    <Section
        title="7.5.4 Thermal Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant meets entire thermal demand. Electricity is purchased from the grid during peak demand. Excess electricity can be sold to the grid.</p>
    </Section>
    <Section
        title="7.5.1 Base electrical load matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant sized to meet minimum electricity demand. Remaining electricity purchased from the grid. Supplemental boilers or export of excess thermal energy may be needed.</p>
    </Section>
    <Section
        title="7.5.2 Base Thermal Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant sized to meet minimum thermal demand. Supplemental boilers used during peak thermal demand. Excess electricity can be sold to the grid.</p>
    </Section>
    <Section
        title="7.5.3 Electrical Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant meets entire electricity demand of the site (stand-alone system). Auxiliary boilers used for additional thermal demand.</p>
    </Section>
    <Section
        title="7.5.4 Thermal Load Matching:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cogeneration plant meets entire thermal demand. Electricity is purchased from the grid during peak demand. Excess electricity can be sold to the grid.</p>
    </Section>
</Section>

```
```javascript
<Section
    title="7.6 Important Technical Parameters for Cogeneration"
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <Section
        title="7.6.1 Heat-to-Power Ratio:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Ratio of thermal energy to electricity required (kWth/kWe). Important for system selection.</p>
    </Section>
    <Section
        title="7.6.2 Quality of Thermal Energy Needed:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Temperature and pressure requirements influence system choice.</p>
    </Section>
    <Section
        title="7.6.3 Load Patterns:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat and power demand patterns influence system sizing and type.</p>
    </Section>
    <Section
        title="7.6.4 Fuels Available:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Fuel availability and cost influence system choice.</p>
    </Section>
    <Section
        title="7.6.5 System Reliability:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Critical applications require modular cogeneration systems for redundancy.</p>
    </Section>
    <Section
        title="7.6.6 Grid Dependent System Versus Independent System:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Grid access influences system design.</p>
    </Section>
    <Section
        title="7.6.7 Retrofit Versus New Installation:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Existing equipment affects system design.</p>
    </Section>
    <Section
        title="7.6.8 Electricity Buy-back:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Local regulations on selling electricity back to the grid influence system design.</p>
    </Section>
    <Section
        title="7.6.9 Local Environmental Regulation:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Emission regulations can restrict fuel choices.</p>
    </Section>
</Section>

<Section
    title="7.7 Prime Movers for Cogeneration"
    level={2}
    icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
>
    <Section
        title="7.7.1 Steam Turbine:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">High-pressure steam expands, generating mechanical power. Various configurations (back pressure, extraction-condensing, etc.) exist.</p>
    </Section>
    <Section
        title="7.7.2 Gas Turbine:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Fuel combustion in pressurized chamber generates hot gas, which drives turbine. Exhaust heat can be recovered. High efficiency. Clean fuels required.</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>Turbine Efficiency:</b> Ratio of actual work output to net input energy. Standalone gas turbines have lower efficiency (35-40%) due to losses. Heat recovery improves efficiency.</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed"><b>Net Turbine Efficiency:</b> Considers energy consumed by auxiliaries like air compressor (50-60% of generated energy), leading to lower net efficiency.</p>
    </Section>
    <Section
        title="7.7.3 Reciprocating Engine Systems:"
        level={3}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Engines generate power, with heat recovered from exhaust and jacket cooling water. Limited applications due to fuel limitations and maintenance requirements.</p>
    </Section>
</Section>

<Section
    title="7.8 Typical Cogeneration Performance Parameters"
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Table 7.4 in the document provides typical performance data (heat rate, efficiencies) for different cogeneration packages.</p>
</Section>

<Section
    title="7.9 Relative Merits of Cogeneration Systems"
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Table 7.5 in the document summarizes the advantages and disadvantages of various cogeneration systems.</p>
</Section>

<Section
    title="7.10 Case Study"
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The document presents a case study comparing the economics of a gas turbine-based cogeneration system versus purchasing electricity from the grid and generating steam with a separate natural gas boiler. The cogeneration option is shown to be more economical.</p>
</Section>

</Section>
    </div>
);
};

export default CogenerationChapter;