
// File: app/nce/notes/chapters/b2c1.js
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

const ElectricalSystemChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="1. ELECTRICAL SYSTEM" 
        level={1}
        icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
        <Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Electrical system: Electricity billing, Electrical load management and maximum demand control, Power factor improvement and its benefit, Selection and location of capacitors, Performance assessment of PF capacitors, Distribution and transformer losses.
        </p>
        </Section>

        <Section 
        title="1.1 Introduction to Electric Power Supply Systems" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            An electric power supply system consists of generating units, transmission lines, distribution lines, substations, and energy control centers.  Generating units produce electricity. High-voltage transmission lines transport electricity over long distances. Distribution lines deliver electricity to consumers. Substations connect the different parts of the system. Energy control centers coordinate the operation of the components.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Fossil fuels (coal, oil, natural gas), nuclear energy, and hydropower are common energy sources for power generation.  Unconventional generation technologies include cogeneration, solar energy, wind generators, and waste materials.  In India, about 70% of power generation capacity is from coal-based thermal power plants.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            In a thermal power plant, coal is pulverized and burned at high temperatures (above 1300°C). The heat converts water into high-pressure steam, which drives a steam turbine. The turbine rotates a generator to produce electricity.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The overall efficiency of coal-based power plants in India ranges from 28% to 35%. The "HEAT RATE" is a measure of generation efficiency, representing the heat input (in kilo Calories or kilo Joules) required to generate one kilo Watt-hour of electrical output.
        </p>
        </Section>

        <Section 
        title="Transmission and Distribution Lines" 
        level={2}
        icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Power plants typically generate 50 Hz AC electricity at voltages between 11 kV and 33 kV. This voltage is stepped up for transmission over long distances using high voltage (HV) and extra high voltage (EHV) lines (220 kV and 400 kV). For very long distances (over 1000 km), high-voltage direct current (HVDC) transmission is sometimes used.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Sub-transmission networks operate at 132 kV, 110 kV, 66 kV, or 33 kV, while distribution networks operate at 11 kV, 6.6 kV, or 3.3 kV.  Transformers are used to step down the voltage for end-users.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Transmission and distribution losses are minimized by using high voltages, which reduces the current and therefore the I²R losses (where I is the current and R is the resistance).
        </p>
        </Section>


        <Section
          title="Cascade Efficiency"
          level={2}
          icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
           <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
           The cascade efficiency of the power system is the product of the efficiencies of each stage, from generation to end-use. Losses occur in generation, step-up, transmission, sub-transmission, distribution, and within the end-user's facility. A typical cascade efficiency from generation to a 11-33 kV industrial user is around 87%.


           </p>


        </Section>
        <Section
          title="1.2 Electricity Billing"
          level={2}
          icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
           <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
           Medium and large industrial users are often billed on a two-part tariff: one part for capacity (demand) in kVA or kW, and the other for energy consumed in kWh. Some utilities also bill for reactive energy (kVArh) and include other fixed and variable charges.


           </p>
           <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
           Maximum demand is the average power consumption over a specific time interval (e.g., 30 minutes), and the billing demand is the highest maximum demand recorded during the billing cycle. Electronic trivector meters are used for billing, and they record maximum demand, active energy (kWh), reactive energy (kVArh), and apparent energy (kVAh).


           </p>


        </Section>
        <Section
          title="1.3 Electrical Load Management and Maximum Demand Control"
          level={2}
          icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
           <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
           Load management is important for minimizing peak demands and improving system efficiency. Utilities use tariffs to encourage load management, including time-of-use tariffs and penalties for exceeding maximum demand.


           </p>
           <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
           Strategies for maximum demand control include:


           </p>
           <ol>
<li>Load Curve Generation: Plotting load demand against time to identify peak periods.</li>
<li>Rescheduling of Loads: Shifting loads to off-peak times.</li>
<li>Storage of Products/Materials: Using off-peak electricity for storage.</li>
<li>Shedding of Non-Essential Loads: Temporarily reducing non-essential loads during peak periods.</li>
<li>Operation of Captive/Diesel Generation Sets: Using on-site generation during peak periods.</li>
<li>Reactive Power Compensation: Installing capacitor banks to improve power factor and reduce maximum demand.</li>
</ol>


        </Section>

 
<Section
        title="1.4 Power Factor Improvement and Benefits"
        level={2}
        icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
      >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Power factor is the ratio of active power (kW) to apparent power (kVA).
          Inductive loads, such as motors and transformers, require reactive power
          (kVAr), which increases the apparent power and therefore reduces the
          power factor.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <b>PF = kW / kVA</b> (where PF is power factor, kW is active power,
          and kVA is apparent power)
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Capacitors can be added to the system to generate reactive power, which
          reduces the amount of reactive power drawn from the utility and
          improves the power factor.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <b>kVAr Rating = kW [tan(φ1) - tan(φ2)]</b> (where kVAr Rating is
          capacitor size, kW is average power, φ1 is the angle of the existing
          power factor, φ2 is the angle of the desired power factor.)
        </p>
      </Section>
      <Section
        title="1.5 Transformers"
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
      >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Transformers change voltage levels in AC systems. They consist of two
          or more electrically insulated coils that are magnetically linked. The
          primary coil is connected to the power source, and the secondary coil
          is connected to the load. The secondary voltage is equal to the
          primary voltage times the turns ratio.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Transformers are classified as power transformers (used in
          high-voltage transmission networks) and distribution transformers
          (used in lower-voltage distribution networks).
        </p>
      </Section>

```
```javascript
<Section
        title="1.6 System Distribution Losses"
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
      >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Distribution losses include no-load losses (core losses) and load
          losses (copper losses). Core losses are constant and occur whenever
          the transformer is energized, while copper losses vary with the
          square of the load current. Strategies for reducing losses include
          relocating transformers closer to loads, improving power factor, and
          using lower-resistance conductors.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <b>P<sub>TOTAL</sub> = P<sub>NO-LOAD</sub> + (% Load/100)² x P<sub>LOAD</sub></b>
        </p>
      </Section>
      <Section
        title="1.7 Harmonics"
        level={2}
        icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
      >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Harmonics are multiples of the fundamental frequency of the power
          system. They are caused by non-linear loads, such as electronic
          devices and arc furnaces, which distort the voltage and current
          waveforms. Harmonics can cause various problems, including
          overheating of equipment and nuisance tripping of circuit breakers.
          Total Harmonic Distortion (THD) is a measure of the amount of
          harmonics present in the system.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <b>THD<sub>current</sub> = (√∑<sup>n</sup><sub>n=2</sub> I²<sub>n</sub> / I<sub>1</sub>) x 100</b> (where I<sub>1</sub> is the fundamental current and I<sub>n</sub> is the nth harmonic current).
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <b>THD<sub>voltage</sub> = (√∑<sup>n</sup><sub>n=2</sub> V²<sub>n</sub> / V<sub>1</sub>) x 100</b> (where V<sub>1</sub> is the fundamental voltage and V<sub>n</sub> is the nth harmonic voltage).
        </p>
      </Section>
      <Section
        title="1.8 Analysis of Electrical Power Systems"
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
      >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          Analyzing electrical power systems can identify energy waste, fire
          hazards, and equipment failures. Reliability-centered maintenance can
          improve system reliability and reduce downtime.
        </p>
      </Section>
    </Section>
    </div>
  );
};

export default ElectricalSystemChapter;

