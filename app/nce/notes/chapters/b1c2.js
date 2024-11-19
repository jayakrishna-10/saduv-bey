
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


const EnergyFormsChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <Section 
            title="2. BASICS OF ENERGY AND ITS VARIOUS FORMS" 
            level={1}
            icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
        >
            <Section 
                title="Syllabus" 
                level={2}
                icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Basics of Energy and its various forms: Electricity basics - DC &amp; AC currents, Electricity tariff, Load management and Maximum demand control, Power factor. Thermal basics - Fuels, Thermal energy contents of fuel, Temperature &amp; Pressure, Heat capacity, Sensible and Latent heat, Evaporation, Condensation, Steam, Moist air and Humidity &amp; Heat transfer, Units and conversion.
                </p>
            </Section>

            <Section 
                title="2.1 Definition" 
                level={2}
                icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Energy is the ability to do work, which is the transfer of energy from one form to another. Energy can manifest as heat (thermal), light (radiant), mechanical, electrical, chemical, and nuclear energy.
                </p>
            </Section>

            <Section 
                title="2.2 Various Forms of Energy" 
                level={2}
                icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Energy exists as stored (potential) energy or working (kinetic) energy.
                </p>
                <Section
                    title="2.2.1 Potential Energy"
                    level={3}
                    icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Potential energy is stored energy and the energy of position (gravitational).</p>
                    <List items={[
                        <b>Chemical Energy:</b>, 'Energy stored in the bonds of atoms and molecules (e.g., biomass, petroleum, natural gas).',
                        <b>Nuclear Energy:</b>, 'Energy stored in the nucleus of an atom.',
                        <b>Stored Mechanical Energy:</b>, 'Energy stored in objects by applying a force (e.g., compressed springs).',
                        <b>Gravitational Energy:</b>, 'Energy of place or position (e.g., water in a reservoir).'
                    ]} />
                </Section>
                <Section
                    title="2.2.2 Kinetic Energy"
                    level={3}
                    icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Kinetic energy is energy in motion.</p>
                    <List items={[
                        <b>Radiant Energy:</b>, 'Electromagnetic energy that travels in transverse waves (e.g., light, x-rays).',
                        <b>Thermal Energy:</b>, 'Internal energy in substances due to vibration and movement of atoms and molecules.',
                        <b>Motion:</b>, 'Movement of objects (e.g., wind, hydropower).',
                        <b>Sound:</b>, 'Movement of energy through substances in longitudinal waves.',
                        <b>Electrical Energy:</b>, 'Movement of electrons (e.g., lightning, electricity).'
                    ]} />
                </Section>
                <Section
                    title="2.2.3 Energy Conversion"
                    level={3}
                    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy can be transformed from one type to another. Multiple conversion stages reduce overall efficiency.</p>
                </Section>
                <Section
                    title="2.2.4 Grades of Energy"
                    level={3}
                    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />}
                >
                <List items={[
                        <b>High-Grade Energy:</b>, 'Concentrated energy (e.g., electrical, chemical) capable of doing significant work.',
                        <b>Low-Grade Energy:</b>, 'Dissipated energy (e.g., heat) which is less capable of performing work.'
                    ]} />
                </Section>

            <Section 
                title="2.3 Electrical Energy Basics" 
                level={2}
                icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
            >
                <Section
                    title="Directional (Direct) Current (DC)"
                    level={3}
                    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Non-varying, unidirectional electric current.</p>
                </Section>
                <Section
                    title="Alternating Current (AC)"
                    level={3}
                    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Current that reverses direction periodically.</p>
                </Section>
                <Section
                    title="Ampere (A)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Unit of electric current.</p>
                </Section>
                <Section
                    title="Voltage (V)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Unit of electric potential.</p>
                </Section>
                <Section
                    title="Resistance"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Resistance = Voltage / Current</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Unit: ohm (Ω)</p>
                </Section>
                <Section
                    title="Ohm's Law"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Current is directly proportional to voltage, given constant temperature and conditions.</p>
                </Section>
                <Section
                    title="Frequency"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Rate of alternating current changes. Unit: hertz (Hz)</p>
                </Section>
                <Section
                    title="Kilovolt Ampere (kVA)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Apparent power (product of kilovolts and amperes).</p>
                    <List items={[
                        'Single-phase: Apparent power (kVA) = (Voltage × Amperes) / 1000',
                        'Three-phase: Apparent power (kVA) = (√3 × Voltage × Amperes) / 1000'
                    ]} />
                </Section>
                <Section
                    title="kVAr (Reactive Power)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Portion of apparent power that doesn't do work, required for magnetic equipment.</p>
                </Section>
                <Section
                    title="Kilowatt (kW) (Active Power)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Work-producing part of apparent power.</p>
                    <List items={[
                        'Single-phase: Power (kW) = (Voltage × Amperes × Power factor) / 1000',
                        'Three-phase: Power (kW) = (1.732 × Voltage × Amperes × Power factor) / 1000'
                    ]} />
                </Section>
                <Section
                    title="Power Factor"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Ratio of active power (kW) to apparent power (kVA).</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Power Factor (Cosφ) = kW / kVA = kW / √(kW² + kVAr²)</p>
                </Section>
                <Section
                    title="Kilowatt-hour (kWh)"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy consumed by 1000 Watts in one hour.</p>
                </Section>
                <Section
                    title="Electricity Tariff"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Based on energy used (kWh) and peak demand (kVA).</p>
                </Section>
                <Section
                    title="Contract Demand"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Amount of power a customer demands from the utility.</p>
                </Section>
                <Section
                    title="Maximum Demand"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Highest average kVA recorded during a demand interval (typically 30 minutes).</p>
                </Section>
                <Section
                    title="Prediction of Load"
                    level={3}
                    
                >
                    <List items={[
                        <b>Connected Load:</b>, 'Nameplate rating of installed apparatus.',
                        <b>Demand Factor:</b>, 'Ratio of maximum demand to connected load.',
                        <b>Load Factor:</b>, 'Ratio of average load to maximum load.  Also, energy consumed during a period divided by the energy that would have been used if maximum load was maintained.  For a day (24 hours), load factor = (Energy consumed during 24 hours) / (Maximum load recorded × 24 hours)'
                    ]} />
                </Section>
                <Section
                    title="PF Measurement"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Power factor can be measured directly using a power analyzer or calculated using kWh/kVAh from a billing meter.</p>
                </Section>
                <Section
                    title="Time of Day (TOD) Tariff"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Utilities encourage users to draw more power during off-peak hours and less during peak hours by offering lower tariffs during off-peak times.</p>
                </Section>
            </Section>
            <Section 
                title="2.4 Thermal Energy Basics" 
                level={2}
                icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
            >
                <Section
                    title="Temperature and Pressure"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Measures of a substance's physical state and related to energy content.</p>
                </Section>
                <Section
                    title="Temperature"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Degree of hotness or coldness. Conversion formulas between Fahrenheit (°F) and Celsius (°C):</p>
                    <List items={[
                        '°C = (°F - 32) × 5/9',
                        '°F = (°C × 9/5) + 32'
                    ]} />
                </Section>
                <Section
                    title="Pressure"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Force per unit area. Increased pressure indicates increased stored energy.</p>
                </Section>
                <Section
                    title="Heat"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">A form of energy. Unit: Calorie (amount of heat needed to raise temperature of 1g of water by 1°C) or Joule (1 Calorie = 4.187 J)</p>
                </Section>
                <Section
                    title="Specific Heat"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat required to raise the temperature of 1kg of a substance by 1°C.</p>
                </Section>
                <Section
                    title="Sensible Heat"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat added or removed that results in a temperature change.</p>
                </Section>
                <Section
                    title="Quantity of Heat"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Q = m × Cp × Δt</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Where: Q = quantity of heat, m = mass, Cp = specific heat, Δt = change in temperature</p>
                </Section>
                <Section
                    title="Phase Change"
                    level={3}
                    
                >
                    <List items={[
                        <b>Fusion:</b>, 'Change from solid to liquid.',
                        <b>Vaporization:</b>, 'Change from liquid to gas.'
                    ]} />
                </Section>
                <Section
                    title="Latent Heat of Fusion"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat required to convert 1kg of solid to liquid without temperature change. For ice: L = 336000 J/kg</p>
                </Section>
                <Section
                    title="Latent Heat of Vaporization"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat required to convert 1kg of liquid to vapor without temperature change. For water: L = 2260000 J/kg</p>
                </Section>
                <Section
                    title="Latent Heat"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Change in heat content during a change of state without temperature change.</p>
                </Section>
                <Section
                    title="Super Heat"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heating vapor above its boiling point at a given pressure.</p>
                </Section>
                <Section
                    title="Humidity"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Moisture content of air.</p>
                </Section>
                <Section
                    title="Specific Humidity"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Weight of water vapor per kg of dry air.</p>
                </Section>
                <Section
                    title="Humidity Factor"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">kg of water per kg of dry air (kg/kg).</p>
                </Section>
                <Section
                    title="Relative Humidity (RH)"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Degree of saturation of air at a given dry-bulb temperature. Expressed as a percentage of the actual water content divided by the moisture content of fully saturated air at the same temperature.</p>
                </Section>
                <Section
                    title="Dew Point"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Temperature at which water vapor begins to condense.</p>
                </Section>
                <Section
                    title="Dry-bulb Temperature"
                    level={3}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Sensible heat content of air-water vapor mixture.</p>
                </Section>
                <Section
                    title="Wet-bulb Temperature"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Total heat content (enthalpy) of air-water vapor mixture.</p>
                </Section>
                <Section
                    title="Dew Point Temperature"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Measure of latent heat content, determined by moisture content.</p>
                </Section>
                <Section
                    title="Fuel Density"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Mass of fuel per unit volume.</p>
                </Section>
                <Section
                    title="Specific Gravity of Fuel"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Density of fuel relative to water (density of water = 1).</p>
                </Section>
                <Section
                    title="Viscosity"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Measure of a fluid's resistance to flow. Decreases with increasing temperature.</p>
                </Section>
                <Section
                    title="Calorific Value"
                    level={3}
                    
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy content of organic matter, measured using a bomb calorimeter. Expressed as Gross Calorific Value (GCV) or Net Calorific Value (NCV). Difference between GCV and NCV is the heat of vaporization of the moisture in the fuel.</p>
                </Section>
                <Section
                    title="Heat Transfer"
                    level={3}
                   
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Heat always transfers from higher to lower temperature. Rate measured in Joules/second, kcal/hr, or Btu/hr.</p>
                    <List items={[
                        <b>Conduction:</b>, 'Energy transfer in solids.',
                        <b>Convection:</b>, 'Energy transfer in fluids (natural or forced).',
                        <b>Radiation:</b>, 'Energy transfer by electromagnetic waves.'
                    ]} />
                </Section>

            </Section>

            <Section 
                title="2.5 Units and Conversions" 
                level={2}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Provides various energy and power unit conversions.</p>
            </Section>
        </Section>
    </div>
);
};

export default EnergyFormsChapter;
