
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

const EnergyEfficientTechnologies = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <Section 
            title="10. ENERGY EFFICIENT TECHNOLOGIES IN ELECTRICAL SYSTEMS" 
            level={1}
            icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
        >
            <Section 
                title="Syllabus" 
                level={2}
                icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This chapter covers energy-efficient technologies in electrical systems, including:</p>
                <List items={[
                    'Maximum demand controllers',
                    'Automatic power factor controllers',
                    'Energy-efficient motors',
                    'Soft starters with energy saver',
                    'Variable speed drives',
                    'Energy-efficient transformers',
                    'Electronic ballast',
                    'Occupancy sensors',
                    'Energy-efficient lighting controls',
                    'Energy-saving potential of each technology'
                ]} />
            </Section>

            <Section 
                title="10.1 Maximum Demand Controllers" 
                level={2}
                icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">High-tension (HT) consumers pay a maximum demand charge in addition to the usual charge for the number of units consumed. This charge is based on the highest power used during a specific period (e.g., 30 minutes) within the billing month. This charge can be a significant portion of the total bill.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Maximum Demand Controllers monitor power usage and turn off or reduce non-essential loads during periods of high power use to minimize the maximum demand charge.  An alarm is triggered when demand approaches a preset value. If no action is taken, the controller switches off non-essential loads in a pre-defined sequence programmed by the user and supplier. This load management system uses control contactors with audio and visual annunciations.</p>
            </Section>

            <Section 
                title="10.2 Automatic Power Factor Controllers" 
                level={2}
                icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">These controllers use relay or microprocessor logic to maintain optimal power factor. Two common types are:</p>
                <Section title="Voltage Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This method uses voltage as the control variable. Switched capacitors are installed at points where circuit voltage decreases with increasing load (typically a 4-5% drop). This method is common in substations where maintaining specific voltage is crucial.  It's independent of the load cycle. However, during light loads and low source voltage, it might lead to a leading power factor, which should be considered.</p>
                </Section>
                <Section title="KILOVAR Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Used where voltage levels are regulated, this method switches capacitors based on decreasing power factor due to changes in system loading. It helps avoid penalties for low power factor. The controller uses current and voltage inputs from the incoming feeder to determine the power factor and switch capacitors accordingly.</p>
                </Section>
                <Section title="Automatic Power Factor Control Relay" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This relay controls the power factor by switching capacitors on/off.  It has a built-in power factor transducer that measures the installation's power factor and converts it to a DC voltage.  This voltage is compared to a reference voltage (adjustable by a knob calibrated in terms of power factor) to determine when to switch capacitors.</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The relays operate with First In First Out (FIFO) or First In Last Out (FILO) switching sequences. A dead band setting prevents overcorrection and hunting (rapid cycling of capacitors). Undercurrent blocking disables the relay and switches off capacitors when the load current falls below a set value, preventing overvoltage transients.</p>

                </Section>
                <Section title="Intelligent Power Factor Controller (IPFC)" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The IPFC learns the capacitance required at each step during its first hour of operation.  It then uses this information to switch on the most appropriate capacitors, eliminating the hunting problems associated with conventional capacitor switching.</p>
                </Section>
                 <Section title="Voltage Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This method uses voltage as the control variable. Switched capacitors are installed at points where circuit voltage decreases with increasing load (typically a 4-5% drop). This method is common in substations where maintaining specific voltage is crucial.  It's independent of the load cycle. However, during light loads and low source voltage, it might lead to a leading power factor, which should be considered.</p>
                </Section>
                <Section title="KILOVAR Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Used where voltage levels are regulated, this method switches capacitors based on decreasing power factor due to changes in system loading. It helps avoid penalties for low power factor. The controller uses current and voltage inputs from the incoming feeder to determine the power factor and switch capacitors accordingly.</p>
                </Section>
                <Section title="Automatic Power Factor Control Relay" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This relay controls the power factor by switching capacitors on/off.  It has a built-in power factor transducer that measures the installation's power factor and converts it to a DC voltage.  This voltage is compared to a reference voltage (adjustable by a knob calibrated in terms of power factor) to determine when to switch capacitors.</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The relays operate with First In First Out (FIFO) or First In Last Out (FILO) switching sequences. A dead band setting prevents overcorrection and hunting (rapid cycling of capacitors). Undercurrent blocking disables the relay and switches off capacitors when the load current falls below a set value, preventing overvoltage transients.</p>

                </Section>
                <Section title="Intelligent Power Factor Controller (IPFC)" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The IPFC learns the capacitance required at each step during its first hour of operation.  It then uses this information to switch on the most appropriate capacitors, eliminating the hunting problems associated with conventional capacitor switching.</p>
                </Section>
            </Section>

            <Section 
                title="10.3 Energy Efficient Motors" 
                level={2}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Improvements in motor efficiency are achieved by reducing watts losses, which can be done through improved design, better materials, and improved manufacturing processes. Replacing a motor can be justified by energy cost savings alone, particularly for continuously running motors, high power rates, oversized motors, or motors with damaged or rewound windings.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4"><strong>REDUCED LOSSES = IMPROVED EFFICIENCY</strong></p>
                <Section title="Technical Aspects" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy-efficient motors have a longer lifespan, require less maintenance, and operate at lower temperatures, leading to longer grease life and insulation life.  They typically have a 1.15 service factor and are designed to operate at 85% of the rated load. However, they may have lower starting torque than standard motors.  Also, speed control (achieved by controlling slip) is crucial in some applications. Less slip results in higher efficiency and slightly faster speeds (around 1% faster) compared to standard motors.</p>
                </Section>
                <Section title="Technical Aspects" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy-efficient motors have a longer lifespan, require less maintenance, and operate at lower temperatures, leading to longer grease life and insulation life.  They typically have a 1.15 service factor and are designed to operate at 85% of the rated load. However, they may have lower starting torque than standard motors.  Also, speed control (achieved by controlling slip) is crucial in some applications. Less slip results in higher efficiency and slightly faster speeds (around 1% faster) compared to standard motors.</p>
                </Section>
            </Section>
<Section 
title="Syllabus" 
level={2}
icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">This chapter covers energy-efficient technologies in electrical systems, including:</p>
<List items={[
    'Maximum demand controllers',
    'Automatic power factor controllers',
    'Energy-efficient motors',
    'Soft starters with energy saver',
    'Variable speed drives',
    'Energy-efficient transformers',
    'Electronic ballast',
    'Occupancy sensors',
    'Energy-efficient lighting controls',
    'Energy-saving potential of each technology'
]} />
</Section>

<Section 
title="10.1 Maximum Demand Controllers" 
level={2}
icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">High-tension (HT) consumers pay a maximum demand charge in addition to the usual charge for the number of units consumed. This charge is based on the highest power used during a specific period (e.g., 30 minutes) within the billing month. This charge can be a significant portion of the total bill.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Maximum Demand Controllers monitor power usage and turn off or reduce non-essential loads during periods of high power use to minimize the maximum demand charge.  An alarm is triggered when demand approaches a preset value. If no action is taken, the controller switches off non-essential loads in a pre-defined sequence programmed by the user and supplier. This load management system uses control contactors with audio and visual annunciations.</p>
</Section>

<Section 
title="10.2 Automatic Power Factor Controllers" 
level={2}
icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">These controllers use relay or microprocessor logic to maintain optimal power factor. Two common types are:</p>
<Section title="Voltage Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This method uses voltage as the control variable. Switched capacitors are installed at points where circuit voltage decreases with increasing load (typically a 4-5% drop). This method is common in substations where maintaining specific voltage is crucial.  It's independent of the load cycle. However, during light loads and low source voltage, it might lead to a leading power factor, which should be considered.</p>
</Section>
<Section title="KILOVAR Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Used where voltage levels are regulated, this method switches capacitors based on decreasing power factor due to changes in system loading. It helps avoid penalties for low power factor. The controller uses current and voltage inputs from the incoming feeder to determine the power factor and switch capacitors accordingly.</p>
</Section>
<Section title="Automatic Power Factor Control Relay" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This relay controls the power factor by switching capacitors on/off.  It has a built-in power factor transducer that measures the installation's power factor and converts it to a DC voltage.  This voltage is compared to a reference voltage (adjustable by a knob calibrated in terms of power factor) to determine when to switch capacitors.</p>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The relays operate with First In First Out (FIFO) or First In Last Out (FILO) switching sequences. A dead band setting prevents overcorrection and hunting (rapid cycling of capacitors). Undercurrent blocking disables the relay and switches off capacitors when the load current falls below a set value, preventing overvoltage transients.</p>
</Section>
<Section title="Intelligent Power Factor Controller (IPFC)" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The IPFC learns the capacitance required at each step during its first hour of operation.  It then uses this information to switch on the most appropriate capacitors, eliminating the hunting problems associated with conventional capacitor switching.</p>
</Section>
</Section>

<Section 
title="10.3 Energy Efficient Motors" 
level={2}
icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Improvements in motor efficiency are achieved by reducing watts losses, which can be done through improved design, better materials, and improved manufacturing processes. Replacing a motor can be justified by energy cost savings alone, particularly for continuously running motors, high power rates, oversized motors, or motors with damaged or rewound windings.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4"><strong>REDUCED LOSSES = IMPROVED EFFICIENCY</strong></p>
<Section title="Technical Aspects" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Energy-efficient motors have a longer lifespan, require less maintenance, and operate at lower temperatures, leading to longer grease life and insulation life.  They typically have a 1.15 service factor and are designed to operate at 85% of the rated load. However, they may have lower starting torque than standard motors.  Also, speed control (achieved by controlling slip) is crucial in some applications. Less slip results in higher efficiency and slightly faster speeds (around 1% faster) compared to standard motors.</p>
</Section>
</Section>

<Section 
title="10.4 Soft Starters" 
level={2}
icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">AC induction motors develop higher torque during starting than at full speed. This can stress the mechanical transmission system and lead to premature failures. High inrush currents during starting also impact electricity costs.  While Star-Delta starting offers a partial solution, soft starters provide a more controlled approach.</p>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">Soft starters provide a controlled release of power to the motor, resulting in smooth, stepless acceleration and deceleration. This extends motor life by reducing stress on windings and bearings. Three-phase units offer controlled starting and stopping with adjustable ramp times and current limit settings.</p>
<Section title="Advantages of Soft Start:" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <List items={[
        'Less mechanical stress',
        'Improved power factor',
        'Lower maximum demand',
        'Less mechanical maintenance'
    ]} />
</Section>
</Section>

```
```javascript
<Section 
title="10.5 Variable Speed Drives" 
level={2}
icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
<Section title="Speed Control of Induction Motors" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Induction motors are preferred for variable speed applications due to their cost-effectiveness and reliability compared to DC motors. Variable speed can be achieved by changing the supply frequency.  Other methods include varying input voltage, rotor resistance, using multi-speed windings, employing Scherbius or Kramer drives, mechanical means like gears and pulleys, and eddy-current or fluid couplings.</p>
</Section>
<Section title="Variable Frequency Drive (VFD)" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">VFDs rectify standard 50 cycle AC power to DC and then synthesize it back to variable frequency AC output. They provide variable speed output with high efficiency, offering speed reduction ratios up to 9:1 and speed increase ratios up to 3:1. Modern VFDs use microprocessor control and high switching frequency IGBTs, improving cost, reliability, and diagnostics.</p>
</Section>
<Section title="Variable Torque vs. Constant Torque" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Variable torque loads (like centrifugal pumps and fans) offer greater energy savings potential than constant torque loads (like conveyors and punch presses).  This is because in variable torque applications, torque is proportional to (speed)<sup>2</sup> and power is proportional to (speed)<sup>3</sup>.  This means that halving the speed reduces power consumption to one-eighth.</p>
</Section>
<Section title="Why Variable Torque Loads Offer Greatest Energy Savings" level={3} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The Affinity Laws define the relationship between speed, flow, torque, and horsepower:</p>
    <List items={[
        'Flow ∝ speed',
        'Head ∝ (speed)2',
        'Torque ∝ (speed)2',
        'Power ∝ (speed)3'
    ]} />
</Section>
<Section title="Tighter Process Control" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">VFDs offer precise process control compared to other AC motor control methods.  They can be programmed for precise speed, stopping positions, and torque application. Modern AC VFDs rival DC drives in torque response and speed accuracy while offering better reliability and affordability.</p>
</Section>
<Section title="Extended Equipment Life and Reduced Maintenance" level={3} icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">VFDs provide smooth starting, reducing stress on the motor and mechanical components.  This leads to reduced maintenance, repair costs, and extended equipment life.</p>
</Section>
</Section>

<Section 
title="10.6 Energy Efficient Transformers" 
level={2}
icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">Conventional transformers use silicon alloyed iron cores.  Energy loss primarily occurs through core heat and vibration. High-efficiency transformers minimize these losses. Amorphous metal (metallic glass alloy) cores reduce energy loss by approximately 70% compared to silicon steel cores.  They offer higher efficiency, even at low loads (98.5% at 35% load).</p>
</Section>

<Section 
title="10.7 Electronic Ballast" 
level={2}
icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
<Section title="Role of Ballast" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">A ballast stabilizes the operation of a fluorescent lamp, which is an electric discharge lamp. Fluorescent lamps require an auxiliary circuit (the ballast) to start and maintain illumination.</p>
</Section>
<Section title="Conventional vs Electronic Ballasts" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Conventional ballasts use a mechanical switch (starter) and rely on the inductive kick to start the lamp.  This method has higher operational losses and temperature rise. Electronic ballasts use power semiconductors and operate at higher frequencies (around 25 kHz). They offer higher efficiency, lower losses, and better light quality (no stroboscopic effect).</p>
</Section>
</Section>

<Section 
title="10.8 Energy Efficient Lighting Controls" 
level={2}
icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
<Section title="Occupancy Sensors" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Occupancy sensors detect movement or noise using infrared, acoustic, ultrasonic, or microwave technology.  They switch lights on when occupancy is detected and off after a set time period when no occupancy is sensed, overriding manual switches. Time delays prevent premature light shut-off.</p>
</Section>


<Section title="Timed Based Control" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Timed-turnoff switches are cost-effective for automatic lighting control. They can be mechanical (dial timers) or electronic. Electronic timers are quieter, more rugged, and offer adjustable time intervals.</p>
</Section>
<Section title="Daylight Linked Control" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Photoelectric cells switch lighting on/off or dim lights based on available daylight. Internally mounted photoelectric dimming systems maintain constant light levels by adjusting electric light output based on daylight contribution. Time delays prevent rapid switching due to passing clouds.</p>
</Section>
<Section title="Localized Switching" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Localized switching allows occupants to control lighting in specific areas, promoting energy savings. It allows turning off lights in unoccupied areas while keeping them on in occupied areas.</p>
</Section>
</Section>


        </Section>
    </div>
);
};

export default EnergyEfficientTechnologies;