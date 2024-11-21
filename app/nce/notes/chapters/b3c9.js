// File: app/nce/notes/chapters/b1c9.js
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


const DGSetSystemChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="9. DG SET SYSTEM" 
                level={1}
                icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Diesel Generating system: Factors affecting selection, Energy performance assessment of diesel conservation avenues
                    </p>
                </Section>

                <Section 
                    title="9.1 Introduction" 
                    level={2}
                    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        A diesel engine is the prime mover that drives an alternator to produce electrical energy. It works on the principle of compression ignition (CI).  Air is drawn into the cylinder and compressed to a high ratio (14:1 to 25:1), heating it to 700-900°C.  Fuel is then injected, igniting spontaneously due to the high temperature. DG sets can be classified as two-stroke or four-stroke, with the four-stroke cycle being more common.
                    </p>
                    <h3>Four Stroke - Diesel Engine</h3>
                    <p>The four strokes are:</p>
                    <ol>
                        <li><b>Induction stroke:</b> Inlet valve open, descending piston draws in fresh air.</li>
                        <li><b>Compression stroke:</b> Valves closed, air compressed to up to 25 bar.</li>
                        <li><b>Ignition and power stroke:</b> Fuel injected (starting at the end of the compression stroke) while valves are closed, igniting spontaneously and forcing the piston down.</li>
                        <li><b>Exhaust stroke:</b> Exhaust valve open, rising piston expels spent gases.</li>
                    </ol>
                    <p>Multi-cylinder engines provide smoother operation due to staggered cranks.</p>
                    <h3>DG Set as a System</h3>
                    <p>A DG set is a system comprising:</p>
                    <ol>
                        <li>Diesel engine and accessories</li>
                        <li>AC generator</li>
                        <li>Control systems and switchgear</li>
                        <li>Foundation and powerhouse civil works</li>
                        <li>Connected load (heating, motors, lighting, etc.)</li>
                    </ol>
                    <p>Component selection and operation at optimal efficiency are crucial for energy conservation.</p>
                    <h3>Four Stroke - Diesel Engine</h3>
                    <p>The four strokes are:</p>
                    <ol>
                        <li><b>Induction stroke:</b> Inlet valve open, descending piston draws in fresh air.</li>
                        <li><b>Compression stroke:</b> Valves closed, air compressed to up to 25 bar.</li>
                        <li><b>Ignition and power stroke:</b> Fuel injected (starting at the end of the compression stroke) while valves are closed, igniting spontaneously and forcing the piston down.</li>
                        <li><b>Exhaust stroke:</b> Exhaust valve open, rising piston expels spent gases.</li>
                    </ol>
                    <p>Multi-cylinder engines provide smoother operation due to staggered cranks.</p>
                    <h3>DG Set as a System</h3>
                    <p>A DG set is a system comprising:</p>
                    <ol>
                        <li>Diesel engine and accessories</li>
                        <li>AC generator</li>
                        <li>Control systems and switchgear</li>
                        <li>Foundation and powerhouse civil works</li>
                        <li>Connected load (heating, motors, lighting, etc.)</li>
                    </ol>
                    <p>Component selection and operation at optimal efficiency are crucial for energy conservation.</p>
                </Section>

                <Section
                    title="Selection Considerations"
                    level={2}
                    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
                 >
                    <h3>Power</h3>
                    <p>Engine power rating should be 10-20% higher than maximum load to prevent overloading during motor starting or lighting system switching.</p>
                    <h3>Speed</h3>
                    <p>Engine speed (RPM) affects fuel efficiency.  Diesel engines typically operate at lower speeds (1300-3000 RPM).  Optimum speed maximizes fuel efficiency and minimizes engine deposits. Matching engine speed to load requirements is crucial, sometimes requiring gearboxes or belt systems.</p>
                    <p>Other selection factors include cooling system, environmental conditions, fuel quality, speed governing, maintenance, control system, starting equipment, drive type, ambient temperature, altitude, and humidity.</p>
                    <h3>Diesel Generator Captive Power Plants</h3>
                    <p>Diesel engine power plants are common in small-scale captive power systems due to their high efficiency compared to gas turbines and small steam turbines. They are ideal for low captive power applications with minimal process steam requirements.  Diesel engines can use various fuels, from light distillates to residual fuel oils. Common sizes are between 4 and 15 MW. Low-speed diesel engines are more cost-effective for continuous operation.</p>
                    <h3>Advantages of Diesel Power Plants:</h3>
                    <ul>
                        <li>Low installation cost</li>
                        <li>Short delivery and installation periods</li>
                        <li>High efficiency (43-45%)</li>
                        <li>Efficient performance under part loads</li>
                        <li>Fuel flexibility (low sulfur heavy stock, heavy fuel oil)</li>
                        <li>Minimal cooling water requirements</li>
                        <li>Air-cooled heat exchanger option</li>
                        <li>Short start-up time</li>
                    </ul>
                    <h3>Diesel Engine Power Plant Developments:</h3>
                    <p>Specific fuel consumption has decreased from 220 g/kWh in the 1970s to around 160 g/kWh currently. Slow-speed diesel engines have a flat fuel consumption curve (50-100% load), comparing favorably to other prime movers. High-efficiency turbochargers and exhaust gas-driven turbine generators further improve efficiency. Diesel engines can burn poorer quality fuels than gas turbines. Slow-speed dual-fuel engines with high-pressure gas injection offer similar efficiency to regular fuel oil engines.</p>
                    <h3>Power</h3>
                    <p>Engine power rating should be 10-20% higher than maximum load to prevent overloading during motor starting or lighting system switching.</p>
                    <h3>Speed</h3>
                    <p>Engine speed (RPM) affects fuel efficiency.  Diesel engines typically operate at lower speeds (1300-3000 RPM).  Optimum speed maximizes fuel efficiency and minimizes engine deposits. Matching engine speed to load requirements is crucial, sometimes requiring gearboxes or belt systems.</p>
                    <p>Other selection factors include cooling system, environmental conditions, fuel quality, speed governing, maintenance, control system, starting equipment, drive type, ambient temperature, altitude, and humidity.</p>
                    <h3>Diesel Generator Captive Power Plants</h3>
                    <p>Diesel engine power plants are common in small-scale captive power systems due to their high efficiency compared to gas turbines and small steam turbines. They are ideal for low captive power applications with minimal process steam requirements.  Diesel engines can use various fuels, from light distillates to residual fuel oils. Common sizes are between 4 and 15 MW. Low-speed diesel engines are more cost-effective for continuous operation.</p>
                    <h3>Advantages of Diesel Power Plants:</h3>
                    <ul>
                        <li>Low installation cost</li>
                        <li>Short delivery and installation periods</li>
                        <li>High efficiency (43-45%)</li>
                        <li>Efficient performance under part loads</li>
                        <li>Fuel flexibility (low sulfur heavy stock, heavy fuel oil)</li>
                        <li>Minimal cooling water requirements</li>
                        <li>Air-cooled heat exchanger option</li>
                        <li>Short start-up time</li>
                    </ul>
                    <h3>Diesel Engine Power Plant Developments:</h3>
                    <p>Specific fuel consumption has decreased from 220 g/kWh in the 1970s to around 160 g/kWh currently. Slow-speed diesel engines have a flat fuel consumption curve (50-100% load), comparing favorably to other prime movers. High-efficiency turbochargers and exhaust gas-driven turbine generators further improve efficiency. Diesel engines can burn poorer quality fuels than gas turbines. Slow-speed dual-fuel engines with high-pressure gas injection offer similar efficiency to regular fuel oil engines.</p>
                </Section>

<Section 
    title="9.2 Selection and Installation Factors" 
    level={2}
    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
    <h3>Sizing of a Genset</h3>
    <p>For 100% standby, the DG set capacity should equal the total connected load after applying the diversity factor.</p>
    <p><b>Example:</b></p>
    <ul>
        <li>Connected Load = 650 kW</li>
        <li>Diversity Factor = 0.54</li>
        <li>Max. Demand = 650 kW * 0.54 = 350 kW</li>
        <li>% Loading = 70%</li>
        <li>Set rating = 350 kW / 0.7 = 500 kW</li>
        <li>At 0.8 PF, rating = 625 kVA</li>
    </ul>
    <p>For existing installations, log current, voltage, and power factor (kWh/kVAh) at the main bus-bar every half-hour for 2-3 days during normal operation (non-essential loads off). This provides the realistic current for essential equipment and helps determine the DG set rating.</p>
    <p><b>For existing installations:</b></p>
    <ul>
        <li>kVA = √3 * V * I</li>
        <li>kVA Rating = kVA / Load Factor</li>
        <li>Load Factor = Average kVA / Maximum kVA</li>
    </ul>
    <p>Where:</p>
    <ul>
        <li>V = Voltage</li>
        <li>I = Current</li>
    </ul>
    <p>For new installations, sum the full load currents of all proposed loads, and apply a diversity factor based on the industry and process to estimate the DG set capacity.</p>
    <h3>High Speed Engine or Slow/Medium Speed Engine</h3>
    <p>High-speed engines are typically 1500 RPM.  Slow-speed engines are generally imported and have higher capacities.</p>
    <h3>Capacity Combinations</h3>
    <p>One large DG set is generally more economical than multiple smaller sets in parallel. Parallel operation offers advantages like using only the required power, increased operational flexibility (one set can be stopped), and 100% standby capability for one set during low demand. </p>
    <h3>Air Cooling Vs. Water Cooling</h3>
    <p>Water-cooled sets are generally preferred for larger capacities to prevent overheating during summer. Air-cooled sets require proper cross ventilation for effective cooling. Water-cooled sets, with proper maintenance, perform equally well.</p>
    <h3>Safety Features</h3>
    <p>Short circuit, overload, and earth fault protection are recommended.  High temperature and low lube oil pressure cut-outs should be included. Reverse power relays are essential for parallel operation to prevent backfeeding.</p>
    <h3>Parallel Operation with Grid</h3>
    <p>Consult with electricity authorities. Some utilities prohibit paralleling due to operational risks with the grid (infinite bus).  However, necessary protections (reverse power relay, voltage and frequency relays) should be in place.</p>
    <h3>Maximum Single Load on DG Set</h3>
    <p>Starting current for squirrel cage induction motors can be up to six times the rated current for a few seconds with DOL starters.  It should not exceed 200% of the alternator's full load capacity.  Larger motors can be started using star-delta or auto-transformer starters (up to 75% of the kVA rating).
    </p>
    <h3>Unbalanced Load Effects</h3>
    <p>Balanced load is recommended to prevent alternator heating and unbalanced output voltages. The maximum unbalanced load between phases should not exceed 10% of the generator capacity.</p>
    <h3>Neutral Earthing</h3>
    <p>Two independent earth connections (body and neutral) are required for safety and leakage protection.</p>
    <h3>Site Condition Effects on Performance Derating</h3>
    <p>Altitude, intake air temperature, and cooling water temperature affect diesel engine output. Refer to provided tables for derating factors.</p>
    <h3>Sizing of a Genset</h3>
    <p>For 100% standby, the DG set capacity should equal the total connected load after applying the diversity factor.</p>
    <p><b>Example:</b></p>
    <ul>
        <li>Connected Load = 650 kW</li>
        <li>Diversity Factor = 0.54</li>
        <li>Max. Demand = 650 kW * 0.54 = 350 kW</li>
        <li>% Loading = 70%</li>
        <li>Set rating = 350 kW / 0.7 = 500 kW</li>
        <li>At 0.8 PF, rating = 625 kVA</li>
    </ul>
    <p>For existing installations, log current, voltage, and power factor (kWh/kVAh) at the main bus-bar every half-hour for 2-3 days during normal operation (non-essential loads off). This provides the realistic current for essential equipment and helps determine the DG set rating.</p>
    <p><b>For existing installations:</b></p>
    <ul>
        <li>kVA = √3 * V * I</li>
        <li>kVA Rating = kVA / Load Factor</li>
        <li>Load Factor = Average kVA / Maximum kVA</li>
    </ul>
    <p>Where:</p>
    <ul>
        <li>V = Voltage</li>
        <li>I = Current</li>
    </ul>
    <p>For new installations, sum the full load currents of all proposed loads, and apply a diversity factor based on the industry and process to estimate the DG set capacity.</p>
    <h3>High Speed Engine or Slow/Medium Speed Engine</h3>
    <p>High-speed engines are typically 1500 RPM.  Slow-speed engines are generally imported and have higher capacities.</p>
    <h3>Capacity Combinations</h3>
    <p>One large DG set is generally more economical than multiple smaller sets in parallel. Parallel operation offers advantages like using only the required power, increased operational flexibility (one set can be stopped), and 100% standby capability for one set during low demand. </p>
    <h3>Air Cooling Vs. Water Cooling</h3>
    <p>Water-cooled sets are generally preferred for larger capacities to prevent overheating during summer. Air-cooled sets require proper cross ventilation for effective cooling. Water-cooled sets, with proper maintenance, perform equally well.</p>
    <h3>Safety Features</h3>
    <p>Short circuit, overload, and earth fault protection are recommended.  High temperature and low lube oil pressure cut-outs should be included. Reverse power relays are essential for parallel operation to prevent backfeeding.</p>
    <h3>Parallel Operation with Grid</h3>
    <p>Consult with electricity authorities. Some utilities prohibit paralleling due to operational risks with the grid (infinite bus).  However, necessary protections (reverse power relay, voltage and frequency relays) should be in place.</p>
    <h3>Maximum Single Load on DG Set</h3>
    <p>Starting current for squirrel cage induction motors can be up to six times the rated current for a few seconds with DOL starters.  It should not exceed 200% of the alternator's full load capacity.  Larger motors can be started using star-delta or auto-transformer starters (up to 75% of the kVA rating).
    </p>
    <h3>Unbalanced Load Effects</h3>
    <p>Balanced load is recommended to prevent alternator heating and unbalanced output voltages. The maximum unbalanced load between phases should not exceed 10% of the generator capacity.</p>
    <h3>Neutral Earthing</h3>
    <p>Two independent earth connections (body and neutral) are required for safety and leakage protection.</p>
    <h3>Site Condition Effects on Performance Derating</h3>
    <p>Altitude, intake air temperature, and cooling water temperature affect diesel engine output. Refer to provided tables for derating factors.</p>
</Section>

<Section 
    title="9.3 Operational Factors" 
    level={2}
    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
>
    <h3>Load Pattern &amp; DG Set Capacity</h3>
    <p>Assess average load by logging current at the main switchboard.  Overloads on a DG set are more significant than on grid power. Diesel engines are designed for 10% overload for 1 hour every 12 hours, and AC generators for 50% overload for 15 seconds. Select DG sets to stay within these limits. Steady loads are ideal for optimal performance. Maintain engine loading (kW or BHP) above 50% and aim for high efficiency. Manufacturers provide curves for % Engine Loading vs. fuel consumption (g/BHP) and optimal loading points. Alternators achieve highest efficiency around 70% loading and above.</p>
    <h3>Sequencing of Loads</h3>
    <p>DG sets have limits in handling transient loads (kW on engine and kVA on generator).  Start with the highest transient kVA load, followed by others in descending order.  This optimizes sizing and transient load handling.</p>
    <h3>Load Pattern</h3>
    <p>Varying loads may require parallel operation of DG sets to maintain optimal efficiency and accommodate load increases. This allows sets to operate near optimal points for fuel efficiency and adds flexibility.</p>
    <h3>Load Characteristics</h3>
    <h4>Power Factor</h4>
    <p>Load power factor affects DG set efficiency. Lower power factor requires higher excitation currents and increases losses. Oversizing generators for low power factor is inefficient and costly. Power factor correction capacitors are a more economical solution.</p>
    <h4>Unbalanced Load</h4>
    <p>Unbalanced loads cause alternator heating and unbalanced output voltages, leading to losses in connected motors. Balance loads as much as possible. Consider single-phase generators for predominantly single-phase loads.</p>
    <h4>Transient Loading</h4>
    <p>Transient loads may require specially designed generators to minimize voltage dips. This might necessitate a non-standard engine/generator combination to avoid oversizing the prime mover.</p>
    <h4>Special Loads</h4>
    <p>Special loads (rectifier/thyristor, welding, furnace) require consultation with manufacturers.  Voltage-sensitive loads might necessitate a dedicated DG motor-driven generator set for high purity power.</p>
    <h4>Power Factor</h4>
    <p>Load power factor affects DG set efficiency. Lower power factor requires higher excitation currents and increases losses. Oversizing generators for low power factor is inefficient and costly. Power factor correction capacitors are a more economical solution.</p>
    <h4>Unbalanced Load</h4>
    <p>Unbalanced loads cause alternator heating and unbalanced output voltages, leading to losses in connected motors. Balance loads as much as possible. Consider single-phase generators for predominantly single-phase loads.</p>
    <h4>Transient Loading</h4>
    <p>Transient loads may require specially designed generators to minimize voltage dips. This might necessitate a non-standard engine/generator combination to avoid oversizing the prime mover.</p>
    <h4>Special Loads</h4>
    <p>Special loads (rectifier/thyristor, welding, furnace) require consultation with manufacturers.  Voltage-sensitive loads might necessitate a dedicated DG motor-driven generator set for high purity power.</p>
    <h3>Waste Heat Recovery in DG Sets</h3>
    <p>Stack losses through flue gases (350-550°C) are a major area for efficiency improvement. Waste Heat Recovery (WHR) potential can be assessed as follows:</p>
    <p><b>Potential WHR = (kWh Output/Hour) × (8 kg Gases / kWh Output) × 0.25 kcal/kg°C × (t<sub>g</sub> – 180°C)</b></p>
    <p>Where:</p>
    <ul>
        <li>t<sub>g</sub> = Gas temperature after turbocharger (minimum 180°C to prevent corrosion)</li>
        <li>0.25 kcal/kg°C = Specific heat of flue gases</li>
    </ul>
    <p>Realisable potential depends on factors like DG set loading, exhaust gas temperature, hours of operation, and back pressure on the DG set. Consistent loading above 60% is recommended for stable flue gas parameters.  Excessive back pressure (above 250-300 mmWC) from WHR unit should be avoided. Convective systems with adequate heat transfer area are more reliable.</p>
    <h3>Load Pattern &amp; DG Set Capacity</h3>
    <p>Assess average load by logging current at the main switchboard.  Overloads on a DG set are more significant than on grid power. Diesel engines are designed for 10% overload for 1 hour every 12 hours, and AC generators for 50% overload for 15 seconds. Select DG sets to stay within these limits. Steady loads are ideal for optimal performance. Maintain engine loading (kW or BHP) above 50% and aim for high efficiency. Manufacturers provide curves for % Engine Loading vs. fuel consumption (g/BHP) and optimal loading points. Alternators achieve highest efficiency around 70% loading and above.</p>
    <h3>Sequencing of Loads</h3>
    <p>DG sets have limits in handling transient loads (kW on engine and kVA on generator).  Start with the highest transient kVA load, followed by others in descending order.  This optimizes sizing and transient load handling.</p>
    <h3>Load Pattern</h3>
    <p>Varying loads may require parallel operation of DG sets to maintain optimal efficiency and accommodate load increases. This allows sets to operate near optimal points for fuel efficiency and adds flexibility.</p>
    <h3>Load Characteristics</h3>
    <h4>Power Factor</h4>
    <p>Load power factor affects DG set efficiency. Lower power factor requires higher excitation currents and increases losses. Oversizing generators for low power factor is inefficient and costly. Power factor correction capacitors are a more economical solution.</p>
    <h4>Unbalanced Load</h4>
    <p>Unbalanced loads cause alternator heating and unbalanced output voltages, leading to losses in connected motors. Balance loads as much as possible. Consider single-phase generators for predominantly single-phase loads.</p>
    <h4>Transient Loading</h4>
    <p>Transient loads may require specially designed generators to minimize voltage dips. This might necessitate a non-standard engine/generator combination to avoid oversizing the prime mover.</p>
    <h4>Special Loads</h4>
    <p>Special loads (rectifier/thyristor, welding, furnace) require consultation with manufacturers.  Voltage-sensitive loads might necessitate a dedicated DG motor-driven generator set for high purity power.</p>
    <h4>Power Factor</h4>
    <p>Load power factor affects DG set efficiency. Lower power factor requires higher excitation currents and increases losses. Oversizing generators for low power factor is inefficient and costly. Power factor correction capacitors are a more economical solution.</p>
    <h4>Unbalanced Load</h4>
    <p>Unbalanced loads cause alternator heating and unbalanced output voltages, leading to losses in connected motors. Balance loads as much as possible. Consider single-phase generators for predominantly single-phase loads.</p>
    <h4>Transient Loading</h4>
    <p>Transient loads may require specially designed generators to minimize voltage dips. This might necessitate a non-standard engine/generator combination to avoid oversizing the prime mover.</p>
    <h4>Special Loads</h4>
    <p>Special loads (rectifier/thyristor, welding, furnace) require consultation with manufacturers.  Voltage-sensitive loads might necessitate a dedicated DG motor-driven generator set for high purity power.</p>
    <h3>Waste Heat Recovery in DG Sets</h3>
    <p>Stack losses through flue gases (350-550°C) are a major area for efficiency improvement. Waste Heat Recovery (WHR) potential can be assessed as follows:</p>
    <p><b>Potential WHR = (kWh Output/Hour) × (8 kg Gases / kWh Output) × 0.25 kcal/kg°C × (t<sub>g</sub> – 180°C)</b></p>
    <p>Where:</p>
    <ul>
        <li>t<sub>g</sub> = Gas temperature after turbocharger (minimum 180°C to prevent corrosion)</li>
        <li>0.25 kcal/kg°C = Specific heat of flue gases</li>
    </ul>
    <p>Realisable potential depends on factors like DG set loading, exhaust gas temperature, hours of operation, and back pressure on the DG set. Consistent loading above 60% is recommended for stable flue gas parameters.  Excessive back pressure (above 250-300 mmWC) from WHR unit should be avoided. Convective systems with adequate heat transfer area are more reliable.</p>
</Section>


<Section 
    title="9.4 Energy Performance Assessment of DG Sets" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <p>Follow these steps:</p>
    <ol>
        <li>Ensure instrument reliability.</li>
        <li>Gather plant specifications.</li>
        <li>Conduct a 2-hour trial at steady load, logging data every 15 minutes (fuel consumption, electrical parameters, temperatures, pressures).</li>
        <li>Refer to fuel oil analysis data.</li>
        <li>Analyze data for average loading, specific power generation, turbocharger and charge air cooler performance, load distribution among cylinders, and housekeeping issues.</li>
    </ol>
</Section>
<Section 
    title="9.5 Energy Saving Measures for DG Sets" 
    level={2}
    icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
>
    <ul>
        <li>Maintain steady load, provide clean, cold intake air.</li>
        <li>Improve air filtration.</li>
        <li>Follow fuel oil storage and handling guidelines.</li>
        <li>Consider fuel additives.</li>
        <li>Calibrate fuel injection pumps.</li>
        <li>Follow maintenance checklists.</li>
        <li>Avoid load fluctuations, phase imbalances, and harmonic loads.</li>
        <li>Consider waste heat recovery for base load operation.</li>
        <li>Consider partial biomass gas usage.</li>
        <li>Consider parallel operation for improved loading.</li>
        <li>Conduct regular performance monitoring and maintenance planning.</li>
    </ul>
</Section>
</Section>
        </div>
    );
};

export default DGSetSystemChapter;
