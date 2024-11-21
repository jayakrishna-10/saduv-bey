
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

const CompressedAirSystem = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="Compressed Air System Summary" 
        level={1}
        icon={<Wind className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
          
<Section title="3. Compressed Air System" level={2} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <Section title="3.1 Introduction" level={3} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
        <p>Air compressors are major electricity consumers in Indian industries, used for various processes, pneumatic tools, and instrumentation. However, only 10-30% of the energy reaches the end-use, with 70-90% lost as heat or through friction, misuse, and noise.</p>
    </Section>
    <Section title="3.2 Compressor Types" level={3} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
        <p>Compressors are classified into:</p>
        <ul>
            <li><b>Positive Displacement:</b> Increase pressure by reducing gas volume. Further classified into:
                <ul>
                    <li>Reciprocating</li>
                    <li>Rotary</li>
                </ul>
            </li>
            <li><b>Dynamic:</b> Increase air velocity, which is converted to pressure. Primarily centrifugal compressors, further classified into:
                <ul>
                    <li>Radial</li>
                    <li>Axial</li>
                </ul>
            </li>
        </ul>
    </Section>
    <Section title="3.3 Compressor Performance" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
        <p><b>Capacity:</b> Measured as Free Air Delivery (FAD), which is the full rated volume flow of compressed gas at the compressor inlet conditions. FAD is referenced to air at atmospheric conditions at a specific location.</p>
        <p><b>Compressor Efficiency Definitions:</b></p>
        <ul>
            <li><b>Volumetric Efficiency:</b>
                <p>
                    Volumetric Efficiency = (Free air delivered (m³/min)) / (Compressor displacement (m³/min)) * 100 <br/>
                    Compressor Displacement = (π * D² * L * S * x * n) / 4
                </p>
                <p>
                    Where:
                    <ul>
                        <li>D = Cylinder bore (m)</li>
                        <li>L = Cylinder stroke (m)</li>
                        <li>S = Compressor speed (rpm)</li>
                        <li>x = 1 for single-acting cylinders, 2 for double-acting cylinders</li>
                        <li>n = Number of cylinders</li>
                    </ul>
                </p>
            </li>
            <li><b>Isothermal Efficiency:</b>
                <p>
                    Isothermal Efficiency = Isothermal Power / Actual measured input power<br/>
                    Isothermal Power (kW) = (P<sub>1</sub> * Q<sub>1</sub> * log<sub>e</sub>(r)) / 36.7
                </p>
                <p>
                    Where:
                    <ul>
                        <li>P<sub>1</sub> = Absolute intake pressure (kg/cm²)</li>
                        <li>P<sub>2</sub> = Absolute delivery pressure (kg/cm²)</li>
                        <li>Q<sub>1</sub> = Free air delivered (m³/hr)</li>
                        <li>r = Pressure ratio (P<sub>2</sub>/P<sub>1</sub>)</li>
                    </ul>
                </p>
                <p>Isothermal efficiency is generally lower than adiabatic efficiency as it doesn't account for friction losses.</p>
            </li>
            <li><b>Adiabatic Efficiency</b>:  Not explicitly defined in the provided text but mentioned as an alternative efficiency measure, typically higher than isothermal efficiency.</li>
            <li><b>Mechanical Efficiency</b>: Not explicitly defined in the provided text but mentioned as an alternative efficiency measure.</li>
        </ul>
        <p><b>Specific Power Consumption:</b> A practical measure for comparison is specific power consumption (kW/volume flow rate). </p>
    </Section>
    <Section title="3.4 Compressed Air System Components" level={3} icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
        <ul>
            <li><b>Intake Air Filters:</b> Prevent dust.</li>
            <li><b>Inter-stage Coolers:</b> Reduce air temperature between compressor stages.</li>
            <li><b>After Coolers:</b> Remove moisture by cooling the air.</li>
            <li><b>Air Dryers:</b> Remove remaining moisture using adsorbents or refrigeration.</li>
            <li><b>Moisture Drain Traps:</b> Remove moisture from the system.</li>
            <li><b>Receivers:</b> Store air and smoothen pulsating output.</li>
            <li><b>Piping Network, Filters, Regulators, and Lubricators:</b> Distribute, clean, regulate, and lubricate the compressed air.</li>
        </ul>
    </Section>
    <Section title="3.5 Efficient Operation of Compressed Air Systems" level={3} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
        <p><b>Location of Compressors:</b> Cool, clean, and dry intake air improves efficiency.  Every 4°C rise in intake air temperature increases energy consumption by ~1%.</p>
        <p><b>Dust-Free Air Intake:</b> Dust causes wear and malfunction.  Every 250 mm WC pressure drop across the filter increases power consumption by ~2%.</p>
        <p><b>Dry Air Intake:</b> High humidity leads to moisture problems. Locate compressors away from humid areas.</p>
        <p><b>Elevation:</b> Higher altitudes reduce volumetric efficiency, requiring more power.</p>
        <p><b>Cooling Water Circuit:</b> Effective cooling is crucial. Inadequate cooling increases power consumption and can lead to scaling.</p>
        <p><b>Efficacy of Inter and After Coolers:</b> Intercoolers reduce power consumption in multi-stage compressors by cooling air between stages. Aftercoolers remove moisture.</p>
        <p><b>Pressure Settings:</b> Lowering delivery pressure saves energy (6-10% reduction per 1 bar decrease).</p>
        <p><b>Compressor Modulation by Optimum Pressure Settings:</b> Multiple compressors should be operated strategically to minimize energy use. The smallest/most efficient compressor should modulate.</p>
        <p><b>Segregating Low and High-Pressure Air Requirements:</b> Separate systems for different pressure needs can be more efficient than using pressure-reducing valves.</p>
        <p><b>Minimum Pressure Drop in Air Lines:</b> Proper pipe sizing and component selection are crucial.  A drop of 0.3 bar in the main header and 0.5 bar in the distribution system is generally acceptable.</p>
        <p><b>Blowers in Place of Compressed Air System:</b> Use blowers for low-pressure applications.</p>
        <p><b>Capacity Control of Compressors:</b> Several methods are available:
            <ul>
                <li>Automatic On/Off Control</li>
                <li>Load and Unload</li>
                <li>Multi-step Control</li>
                <li>Throttling Control (for centrifugal compressors)</li>
                <li>Speed Control (for centrifugal compressors, preferred for &gt;40% load)</li>
            </ul>
        </p>
        <p><b>Avoiding Misuse of Compressed Air:</b> Replace compressed air with alternatives like blowers, electric motors, or gravity-based systems where possible.</p>
        <p><b>Avoiding Air Leaks and Energy Wastage:</b> Leaks are a major source of wasted energy. Regularly check for and repair leaks.</p>
        <p><b>Leak Quantification:</b></p>
        <p>
            % leakage = (T / (T+t)) * 100<br/>
            Leakage quantity (m³/min), q = (T / (T+t)) * Q
        </p>
        <p>
            Where: <br/>
            Q = Compressor capacity (m³/min) <br/>
            T = Time on load (minutes) <br/>
            t = Time on unload (minutes)
        </p>
    </Section>
    <Section title="3.6 Compressor Capacity Assessment" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
        <p>Aging and inefficiencies can reduce FAD. Regular assessment is needed. The ideal method is a nozzle test. A simplified shop floor method involves measuring the time taken to fill a known volume to a specific pressure.</p>
        <p>
            Actual Free Air Discharge = ((P<sub>2</sub> - P<sub>1</sub>) * V) / (P<sub>0</sub> * T) Nm³/Minute
        </p>
        <p>
            Where: <br/>
            P<sub>2</sub> = Final pressure after filling (kg/cm²a)<br/>
            P<sub>1</sub> = Initial pressure after bleeding (kg/cm²a) <br/>
            P<sub>0</sub> = Atmospheric pressure (kg/cm²a) <br/>
            V = Storage volume (m³) including receiver, aftercooler, and piping <br/>
            T = Time taken to build up pressure to P<sub>2</sub> (minutes)

        </p>
        <p>If the compressed air temperature (t<sub>2</sub>°C) is higher than ambient temperature (t<sub>1</sub>°C), correct FAD by multiplying with (273 + t<sub>1</sub>) / (273 + t<sub>2</sub>).
        </p>
    </Section>
    <Section title="3.7 Checklist for Energy Efficiency in Compressed Air System" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}>
        <p>Summarizes best practices mentioned throughout the document.</p>
    </Section>
</Section>

</Section>

    </div>
);
};


export default CompressedAirSystem;