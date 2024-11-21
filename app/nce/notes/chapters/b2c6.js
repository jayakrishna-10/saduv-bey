
// File: app/nce/notes/chapters/b1c6.js
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

const FBCBoilersChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="6. FBC BOILERS" 
        level={1}
        icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
    >
        
    <Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <List items={[
            'FBC boilers: Introduction',
            'Mechanism of fluidised bed combustion',
            'Advantages',
            'Types of FBC boilers',
            'Operational features',
            'Retrofitting FBC system to conventional boilers',
            'Saving potential'
        ]} />
        </Section>

        <Section 
        title="6.1 Introduction" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Fluidized bed combustion (FBC) is a viable alternative to traditional grate fuel firing systems for burning low-quality, high-ash, low-calorific-value coal prevalent in India. It offers advantages like compact design, fuel flexibility, higher combustion efficiency, and reduced SOx and NOx emissions. FBC boilers can burn various fuels, including agricultural wastes, and have a wide capacity range (0.5 T/hr to over 100 T/hr).
        </p>
        </Section>

        <Section 
        title="6.2 Mechanism of Fluidised Bed Combustion" 
        level={2}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            Fluidization occurs when an upward flow of air through a bed of solid particles reaches a velocity where the particles are suspended in the air stream. Increasing velocity further leads to bubble formation, turbulence, and a "bubbling fluidized bed."  Higher velocities cause particles to be blown out, requiring recirculation in a "circulating fluidized bed." Slip velocity is the difference between mean solid velocity and mean gas velocity, and a higher slip velocity improves heat transfer.  In FBC, heated sand particles ignite injected coal, maintaining a uniform temperature (840°C to 950°C) below the ash fusion temperature, preventing ash melting.  High heat transfer coefficients are due to rapid mixing and heat extraction through in-bed tubes and walls. The gas velocity is maintained between the minimum fluidisation velocity and particle entrainment velocity for stable operation. Combustion in FBC is enhanced by the "three T's": Time, Temperature, and Turbulence, with fluidization promoting turbulence and improved mixing.
        </p>
        </Section>

        <Section 
        title="6.3 Types of Fluidised Bed Combustion Boilers" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ol className="list-decimal space-y-3 ml-6 sm:ml-8">
            <li className="text-sm sm:text-base text-gray-700">Atmospheric classic Fluidised Bed Combustion System (AFBC)</li>
            <li className="text-sm sm:text-base text-gray-700">Atmospheric circulating (fast) Fluidised Bed Combustion system (CFBC)</li>
            <li className="text-sm sm:text-base text-gray-700">Pressurised Fluidised Bed Combustion System (PFBC)</li>
        </ol>
        </Section>

        <Section
            title= "6.3.1 AFBC / Bubbling Bed"
            level={3}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400"/>}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
In AFBC, crushed coal (1-10mm) is fed into a combustion chamber. Atmospheric air serves as both fluidization and combustion air, flowing through the preheated bed at 1.2 to 3.7 m/sec.  The air rate determines the fuel reaction rate. In-bed evaporator tubes extract heat. Bed depth is typically 0.9m to 1.5m with a pressure drop of about 1 inch of water per inch of bed depth. Little material leaves the bed (2-4 kg of solids recycled per ton of fuel).  Combustion gases pass through superheater, economizer, dust collectors, and air preheaters before exhaust. Operating temperature is crucial, with clinker formation above 950°C and reduced efficiency below 800°C. Optimal sulfur retention occurs at 800-850°C.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            <strong>AFBC Boiler Systems:</strong>
        </p>

        <ol className="list-decimal space-y-3 ml-6 sm:ml-8">
            <li className="text-sm sm:text-base text-gray-700">Fuel feeding system</li>
            <li className="text-sm sm:text-base text-gray-700">Air Distributor</li>
            <li className="text-sm sm:text-base text-gray-700">Bed &amp; In-bed heat transfer surface</li>
            <li className="text-sm sm:text-base text-gray-700">Ash handling system</li>
        </ol>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            <strong>1. Fuel Feeding System:</strong>
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Under Bed Pneumatic Feeding:</strong> Crushed coal (1-6mm) is pneumatically transported from a hopper.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Over-bed Feeding:</strong> Crushed coal (6-10mm) is spread over the bed surface by a screw conveyor and spreader.</span>
            </li>
        </ul>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        <strong>2. Air Distributor:</strong> Introduces fluidizing air evenly, preventing dead zones. It can use nozzles or bubble caps, and is protected by refractory lining, a static bed material layer, or water-cooled tubes.
        </p>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        <strong>3. Bed &amp; In-Bed Heat Transfer Surface:</strong>
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Bed Material:</strong> Sand, ash, crushed refractory, or limestone (~1mm). Can be shallow or deep, affecting heat transfer and pressure drop.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>In-Bed Heat Transfer Surface:</strong> Tube bundles or coils in horizontal, vertical, or inclined orientations. Heat transfer depends on bed pressure, temperature, gas velocity, particle size, exchanger design, and distributor plate design.</span>
            </li>
        </ul>


        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        <strong>4. Ash Handling System:</strong>
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Bottom Ash Removal:</strong> Continuous overflow and intermittent flow to maintain bed height and prevent defluidization.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><strong>Fly Ash Removal:</strong> Multi-stage removal using cyclones, bag filters, ESPs, or a combination. Fly ash recycling can increase efficiency.</span>
            </li>
        </ul>

        </Section>

        <Section
            title="6.3.2 Circulating Fluidised Bed Combustion (CFBC)"
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"/>}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
CFBC overcomes drawbacks of bubbling bed combustion by using crushed fuel (6-12mm) and limestone injected into the furnace.  Air (60-70% of total) fluidizes the bed at 3.7-9 m/sec, while secondary air is added above the bed. Combustion occurs at 840-900°C. Fine particles (&lt;450 microns) are elutriated with flue gas (4-6 m/sec), collected by separators, and recirculated (50-100 kg/kg fuel). No in-bed steam generation tubes are present. Heat transfer occurs in the convection section, water walls, and riser exit. Particle circulation enhances heat transfer and residence time. Key parameters are temperature, residence time, and turbulence. CFBC offers better space utilization, fuel/sorbent residence time, and staged combustion for NOx control compared to AFBC, especially for larger units (&gt;75-100 T/hr steam). CFBC has better Ca/S utilization (1.5-1 vs 3.2-1 for AFBC) and is generally more economical for larger industrial applications. However, it requires large cyclones for bed material recirculation, leading to a taller boiler design.
            </p>
        </Section>

        <Section
            title="6.3.3 Pressurised Fluid Bed Combustion"
            level={3}
            icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-400"/>}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
PFBC, used for large-scale coal burning, operates at elevated pressure (up to 16 kg/cm²).  Off-gas drives a gas turbine, and steam generated in immersed tubes drives a steam turbine. The steam turbine condensate is preheated by gas turbine exhaust. PFBC can be used in cogeneration or combined cycle power generation, increasing overall efficiency by 5-8% compared to conventional systems (See Figure 6.6).
            </p>
        </Section>

        {/* ... remaining sections */}


<Section
        title="6.4 Retrofitting of FBC Systems to Conventional Boilers"
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500"/>}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
        Retrofitting conventional stoker-fired boilers to FBC involves replacing the grate with a distributor plate, adding ash removal standpipes, incorporating in-bed tubes with forced circulation, and modifying the coal/limestone crushing system for pneumatic injection. Oil-fired boilers can also be converted, subject to a cost-benefit analysis.
        </p>
    </Section>

        <Section 
        title="6.5 Advantages of Fluidised Bed Combustion Boilers" 
        level={2}
        icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ol className="list-decimal space-y-3 ml-6 sm:ml-8">
            <li className="text-sm sm:text-base text-gray-700"><strong>High Efficiency:</strong> &gt;95% combustion efficiency, 84% overall efficiency (±2%).</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Reduction in Boiler Size:</strong> High heat transfer in a small area.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Fuel Flexibility:</strong> Burns various fuels, including low-grade coals and wastes.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Ability to Burn Low Grade Fuel:</strong> Handles high ash (up to 62%) and low calorific value fuels.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Ability to Burn Fines:</strong> Burns fines &lt;6mm effectively.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Pollution Control:</strong> Limestone/dolomite addition reduces SO2. Low combustion temperature minimizes NOx.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Low Corrosion and Erosion:</strong> Due to lower temperature, soft ash, and low particle velocity.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Easier Ash Removal – No Clinker Formation:</strong> No clinker due to lower furnace temperature (750-900°C).</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Less Excess Air – Higher CO2 in Flue Gas:</strong> Operates at 20-25% excess air, resulting in 14-15% CO2 in flue gas.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Simple Operation, Quick Start-Up:</strong> High turbulence facilitates quick start-up/shutdown.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Fast Response to Load Fluctuations:</strong> High thermal storage absorbs fuel feed fluctuations.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>No Slagging in the Furnace–No Soot Blowing:</strong> No alkali volatilization and sticky ash.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Provisions of Automatic Coal and Ash Handling System:</strong> Automated systems for easy operation.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Provision of Automatic Ignition System:</strong> Microprocessor-based control for efficient operation.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>High Reliability:</strong> No moving parts in combustion zone.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Reduced Maintenance:</strong> Infrequent overhauls.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>Quick Responses to Changing Demand:</strong> Adapts to changing heat demands quickly.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong>High Efficiency of Power Generation:</strong> Pressurized operation can drive gas turbines, improving efficiency by 4%.</li>
        </ol>
        </Section>
    </Section>
    </div>
);
};

export default FBCBoilersChapter;

