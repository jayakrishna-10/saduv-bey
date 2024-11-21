
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

const MotorChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="2. ELECTRIC MOTORS" 
        level={1}
        icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >

<Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
    >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Electric motors: Types, Losses in induction motors, Motor efficiency, Factors affecting motor performance, Rewinding and motor replacement issues, Energy saving opportunities with energy-efficient motors.
        </p>
    </Section>

    <Section 
    title="2.1 Introduction" 
    level={2}
    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
    >
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Motors convert electrical energy into mechanical energy through the interaction of magnetic fields in the stator and rotor windings. Industrial electric motors are broadly classified as induction motors, direct current (DC) motors, or synchronous motors. All motor types share four operating components: stator (stationary windings), rotor (rotating windings), bearings, and frame (enclosure).
    </p>
    </Section>

    <Section 
    title="2.2 Motor Types" 
    level={2}
    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
    >
        <Section title="Induction Motors" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"/>}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The most common prime mover in industrial applications. The stator's magnetic field induces a current in the rotor, creating a second magnetic field that opposes the stator's field, causing rotation. The 3-phase squirrel cage induction motor is the most prevalent type, used to drive pumps, blowers, fans, compressors, conveyors, and production lines. It has three windings, each connected to a different phase of the power supply.
            </p>
        </Section>
        <Section title="Direct-Current Motors" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"/>}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Use direct current and are employed in specialized applications requiring high starting torque or smooth acceleration over a wide speed range.
            </p>
        </Section>
        <Section title="Synchronous Motors" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"/>}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            AC power feeds the stator, while DC feeds the rotor. The rotor's magnetic field locks onto the stator's rotating field, rotating at the same speed (synchronous speed). Unlike induction motors that operate with slip (RPM less than synchronous speed), synchronous motors have no slip.  Synchronous speed is determined by the supply frequency (f) and the number of poles (P):
            </p>
            <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Synchronous Speed (RPM) = (120 × f) / P</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The DC excitation power provides the slip energy.
            </p>
        </Section>
    </Section>

    <Section 
    title="2.3 Motor Characteristics" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
    >
        <Section title="Motor Speed" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"/>}>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Motor speed is measured in revolutions per minute (RPM). For AC motors, synchronous speed is determined by the frequency (f in Hz) and number of poles (P):</p>
            <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Synchronous Speed (RPM) = (120 × f) / P</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Actual operating speed is slightly lower than synchronous speed due to slip (S), calculated as:</p>
            <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Slip (%) = ((Synchronous Speed – Full Load Rated Speed) / Synchronous Speed) × 100</p>
        </Section>
        <Section title="Power Factor" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"/>}>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Power factor (PF) is the ratio of real power (kW) to apparent power (kVA):</p>
            <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Power Factor = Cos φ = kW / kVA</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Induction motor power factor decreases with decreasing load because magnetizing current remains relatively constant while active current decreases.</p>
        </Section>
    </Section>

```
```jsx
<Section 
    title="2.4 Motor Efficiency" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Motor efficiency (η) is the ratio of mechanical energy output to electrical energy input.  Efficiency and power factor are key attributes for efficient motor operation. Higher efficiency minimizes energy waste, and a power factor closer to unity reduces current and upstream wiring losses. Squirrel cage motors are typically more efficient than slip-ring motors, and higher-speed motors are generally more efficient than lower-speed motors. Efficiency is also influenced by motor temperature. Totally-enclosed, fan-cooled (TEFC) motors are more efficient than screen-protected, drip-proof (SPDP) motors. Efficiency usually increases with motor capacity.
    </p>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Intrinsic losses, which can only be reduced by design changes, determine motor efficiency. These losses are categorized as:
    </p>
    <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1">
            <b>Fixed Losses:</b> Independent of motor load. These include magnetic core losses (eddy current and hysteresis losses in the stator, dependent on core material, geometry, and input voltage) and friction and windage losses (from bearings and ventilation).
            </span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1">
            <b>Variable Losses:</b> Dependent on load. These comprise resistance losses (I²R losses in the stator and rotor, proportional to resistance and the square of current) and stray losses (from various sources, difficult to measure or calculate, generally proportional to the square of rotor current).
            </span>
        </li>
    </ul>
    <Section title="Field Tests for Determining Efficiency" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}>
        <p><b>No-Load Test:</b></p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Run the motor at rated voltage and frequency with no load.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Measure input power, current, voltage, and frequency.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Subtract stator I²R losses from input power to obtain the sum of friction &amp; windage (F&amp;W) and core losses.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">To separate core and F&amp;W losses, repeat the test at different voltages and plot no-load kW vs. voltage. The intercept represents F&amp;W losses.</span>
            </li>
        </ul>
        <p><b>Stator and Rotor I²R Losses:</b></p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Measure stator resistance using a bridge or volt-amp method.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Correct the measured resistance to operating temperature (typically 100-120°C) using the following formula:</span>
            </li>
        </ul>
        <p style={{ textAlign: 'center' }}>R<sub>2</sub> = R<sub>1</sub> × (235 + t<sub>2</sub>) / (235 + t<sub>1</sub>)</p>
        <p>
            Where:
            <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1">R<sub>1</sub> = Resistance at ambient temperature (t<sub>1</sub> in °C)</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <span className="flex-1">R<sub>2</sub> = Resistance at operating temperature (t<sub>2</sub> in °C)</span>
                </li>
            </ul>
        </p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Determine rotor resistance from a locked rotor test at reduced frequency.  However, calculate rotor I²R losses from measured rotor slip (S):</span>
            </li>
        </ul>
        <p style={{ textAlign: 'center' }}>Rotor I²R Losses = S × (Stator Input – Stator I²R Losses – Core Loss)</p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Measure slip accurately using a stroboscope or non-contact tachometer. Correct slip to operating temperature.</span>
            </li>
        </ul>
        <p><b>Stray Load Losses:</b></p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">Difficult to measure accurately.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">IEEE Standard 112 provides a complex method, rarely used in practice.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1">IS and IEC standards assume a fixed value of 0.5% of input power. IEEE 112 specifies values from 0.9% to 1.8% depending on motor rating (see Table 2.1 in the document).</span>
            </li>
        </ul>
    </Section>
</Section>


<Section 
    title="2.5 Motor Selection" 
    level={2}
    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    Key considerations for motor selection include:
    </p>
    <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Torque Requirements:</b> Most important factor. Consider starting torque (locked rotor torque), accelerating torque, and maximum torque (breakdown torque).</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Duty/Load Cycle:</b> Determines thermal loading. TEFC motors may have insufficient cooling at speeds below rated value.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Ambient Conditions:</b> Special motor designs are available for harsh environments (corrosive, dusty, high-temperature).</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Switching Frequency:</b> Affects motor choice. Consider automatic vs. manual control.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Impact on Electrical System:</b> Large load variations (e.g., frequent starts/stops of compressors) can cause voltage drops.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Reliability:</b> Oversizing for reliability leads to sub-optimal energy performance. Understand process parameters and plant power system to avoid oversizing.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Inventory:</b> Using standard equipment simplifies maintenance and reduces spare part inventory.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Price:</b> Less expensive motors may have lower efficiency, leading to higher lifecycle costs.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Power Drawn at 75% Loading:</b> A good indicator of energy efficiency.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Reactive Power (kVAR):</b> Important consideration.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Efficiency Tolerance:</b> Indian Standard 325 allows 15% tolerance for motors ≤50kW and 10% for motors &gt;50kW.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Efficiency Standards:</b> IS 8789 (Standard Motors) and IS 12615 (High Efficiency Motors) follow IEC 34-2, which understates losses compared to IEEE methodology. Rely on test certificates rather than labeled values.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Energy Savings Calculation:</b> kW Savings = kW Output × (1/η<sub>old</sub> – 1/η<sub>new</sub>)</span>
        </li>
    </ul>
</Section>

```
```jsx
<Section 
    title="2.6 Energy-Efficient Motors (EEM)" 
    level={2}
    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
    EEMs incorporate design improvements to reduce losses and improve efficiency compared to standard motors. Improvements include: lower-loss silicon steel, longer core, thicker wires, thinner laminations, smaller air gap, copper rotor bars, superior bearings, and smaller fan.  EEMs offer 3-7% higher efficiency, similar or better power factor, lower operating temperature, reduced noise, better acceleration, and less sensitivity to voltage fluctuations. EEMs are typically more expensive initially but offer lifecycle cost savings through reduced energy consumption.
    </p>
    <Section title="Specific Loss Reduction Strategies in EEMs:" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"/>}>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Stator and Rotor I²R Losses:</b> Use larger copper conductors to reduce resistance. Reduce magnetizing current by lowering flux density and shortening the air gap. Use copper rotor conductors and operate closer to synchronous speed.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Core Losses:</b> Use low-loss silicon steel laminations. Increase core length to reduce flux density. Use thinner laminations to reduce eddy currents.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Friction and Windage Losses:</b> Employ low-loss fan designs. Reduce fan size.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Stray Load Losses:</b> Optimize slot numbers, tooth/slot geometry, and air gap.</span>
            </li>
        </ul>
    </Section>
</Section>

<Section 
    title="2.7 Factors Affecting Energy Efficiency &amp; Minimizing Motor Losses in Operation" 
    level={2}
    icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <Section title="Power Supply Quality" level={3} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-400"/>}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Motor performance is affected by:</p>
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Voltage and Frequency Variations:</b> BIS standards specify tolerance limits (±6% for voltage, ±3% for frequency). Larger fluctuations are common and detrimental.</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <span className="flex-1"><b>Voltage Unbalance:</b> Unequal voltages across the three phases. Caused by unbalanced single-phase loads or different cable sizes. Severely impacts motor performance and life.</span>
            </li>
        </ul>
    </Section>
    <Section title="Motor Loading" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400"/>}>
        <p><b>Measuring Load:</b></p>
        <p style={{ textAlign: 'center' }}>% Loading = (Input Power (kW) at Existing Load × 100) / (Nameplate Full Load kW Rating / Nameplate Full Load Motor Efficiency)<br/>OR<br/>% Loading = (Input Power (kW) at Existing Load × 100) / (√3 × kV × I × Cos φ)</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Do not estimate loading as the ratio of currents. Do not assume power factor.</p>

        <p><b>Reducing Under-loading:</b></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Under-loading reduces efficiency and power factor and increases costs. Causes include: oversizing by manufacturers, under-utilization of equipment, using large motors for low voltage conditions, or using large motors for high starting torque. Evaluate load carefully. Consider energy-efficient motors for downsizing.</p>

        <p><b>Star-Delta Starting for Reduced Load:</b></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">For motors operating below 40% of rated capacity, switching to star mode (reconfiguring wiring at the terminal box) reduces voltage by √3, effectively downsizing the motor and improving efficiency and power factor at reduced load. However, this reduces speed and may not be suitable for speed-dependent applications. Del-Star starters are available for applications requiring high initial torque and low running torque.</p>

        <p><b>Sizing to Variable Load:</b></p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Instead of sizing based on peak load, consider the load duration curve. Select a motor with a rating slightly lower than the peak load, allowing for short periods of overload within the motor's thermal capacity. This is more efficient and cost-effective than using a larger motor that is frequently under-loaded.</p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Control strategies for variable loads significantly impact energy consumption. Traditional mechanical methods (e.g., throttle valves) are less efficient than multi-speed motors, eddy-current couplings, fluid couplings, or solid-state electronic variable speed drives (VSDs). VSDs offer the greatest potential savings for variable torque applications like centrifugal pumps and fans.</p>
    </Section>
    <Section title="Power Factor Correction" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"/>}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Capacitors connected in parallel (shunted) with the motor improve power factor.  This reduces kVA demand, I²R losses, voltage drop, and increases overall system efficiency. Maximum benefit is achieved when the capacitor is installed at the motor terminals.  However, cost and labor may limit the minimum desirable capacitor size.  Important:  PF correction only impacts the power factor upstream from the point of installation.  A capacitor at the motor terminals does not change the motor's operating PF.</p>
    </Section>
    <Section title="Maintenance" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400"/>}>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Improper maintenance increases losses and reduces reliability. Ensure adequate lubrication, clean cooling ducts, check load conditions, monitor alignment, ensure proper wiring, and control operating temperature.</p>
    </Section>
    <Section title="Rewinding Effects on Energy Efficiency" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400"/>}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Rewinding can reduce efficiency due to changes in winding design, materials, insulation, and operating temperature.  Careful rewinding can maintain or even improve efficiency. Documenting no-load losses and speed before and after rewinding helps assess the impact.</p>
    </Section>
</Section>

<Section 
    title="2.9 Speed Control of AC Induction Motors" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Traditionally DC motors were preferred for variable speed applications. However, AC motors are now preferred due to ruggedness, low maintenance, lower cost and high power to weight ratio. Variable speed can be obtained by changing the frequency.</p>
</Section>

<Section 
    title="2.10 Motor Load Survey: Methodology" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The motor load survey is a methodology used to understand the existing scenario and implement improvement options for electric motors. The process can be categorized as:</p>
    <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Sampling Criteria</b>: Selection is based on utilisation factor, representative basis and conservation potential.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Measurements</b>: Measurements of electrical parameters like volts, amperes, power factor and kW is done.</span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
            <span className="flex-1"><b>Analysis</b>: Analysis based on observations is done to improve monitoring systems.</span>
        </li>
    </ul>
</Section>
</Section>
    </div>
);
};

export default MotorChapter;