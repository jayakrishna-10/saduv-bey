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
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title} section`}
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

const SteamChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="3. STEAM SYSTEM" 
                level={1}
                icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Properties of steam, assessment of steam distribution losses, steam leakages, 
                        steam trapping, condensate and flash steam recovery system, identifying 
                        opportunities for energy savings.
                    </p>
                </Section>
                <Section 
                    title="3.1 Introduction" 
                    level={2}
                    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Steam is a popular and useful mode of energy conveyance due to its:
                    </p>
                    <List items={[
                        'High specific and latent heat',
                        'High heat transfer coefficient',
                        'Ease of control and distribution',
                        'Low cost and inert nature'
                    ]} />
                </Section>

                <Section 
                    title="3.2 Properties of Steam" 
                    level={2}
                    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Water exists in solid, liquid, and gaseous forms (ice, water, and steam). 
                        Adding heat to water increases its temperature until the saturation point is reached. 
                        Further heating causes evaporation into steam at a constant temperature. 
                        This evaporation requires a substantial amount of energy. Conversely, 
                        when steam releases this energy, it condenses back into water at the same temperature.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                        Liquid Enthalpy (Sensible Heat)
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Liquid enthalpy (h<sub>f</sub>) is the heat energy in water at its boiling point, 
                        measured in kCal/kg.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                        Enthalpy of Evaporation (Latent Heat)
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Enthalpy of evaporation (h<sub>fg</sub>) is the heat energy required to convert 
                        water at its boiling point into steam at the same temperature, measured in kCal/kg.
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4">
                        The boiling/saturation temperature of water increases with pressure. As steam 
                        pressure increases, the usable heat energy (enthalpy of evaporation) decreases. 
                        Total heat of dry saturated steam (h<sub>g</sub>) is the sum of liquid enthalpy 
                        and enthalpy of evaporation:
                    </p>

                    <p className="text-sm sm:text-base font-mono bg-gray-50 px-3 py-2 rounded my-4">
                        h<sub>g</sub> = h<sub>f</sub> + h<sub>fg</sub>
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        For steam containing moisture, the total heat is calculated using the dryness fraction (x):
                    </p>

                    <p className="text-sm sm:text-base font-mono bg-gray-50 px-3 py-2 rounded my-4">
                        h = h<sub>f</sub> + x * h<sub>fg</sub>
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Superheat is the addition of heat to dry saturated steam without a pressure increase. 
                        Degrees of superheat refers to the temperature difference between superheated steam 
                        and saturated steam at the same pressure.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                        The Steam Phase Diagram
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        The steam phase diagram graphically represents the relationship between enthalpy 
                        and temperature at various pressures. It shows the regions of solid, liquid, vapor, 
                        and the two-phase region where liquid and vapor coexist. The critical point marks 
                        the highest temperature where liquid can exist. Above the critical point, only gas 
                        can exist.
                    </p>
                </Section>
                <Section
                    title="3.3 Steam Distribution"
                    level={2}
                    icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Efficient steam distribution is crucial for delivering the right quality, pressure, 
                        and quantity of steam to the end-user. Key considerations include:
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                        The Working Pressure
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Distribution pressure is limited by the boiler's safe working pressure, 
                        the plant's minimum pressure requirement, and frictional resistance within 
                        the pipework. Pressure losses due to condensation in the distribution system 
                        must also be considered during system design.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                        Features of Steam Piping
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Proper layout and sizing of steam pipes are essential for efficient distribution. 
                        Minimize pipe length and provide adequate condensate drainage with steam traps. 
                        Pipes should have a fall of at least 12.5 mm per 3 meters in the flow direction. 
                        Expansion loops are necessary to accommodate thermal expansion. Automatic air 
                        vents should be installed at dead ends.
                    </p>
                </Section>

                <Section
                    title="3.4 Steam Pipe Sizing and Design"
                    level={2}
                    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Pipe sizing significantly impacts the efficiency of a steam system. 
                        Proper sizing minimizes pressure drop, a crucial factor in steam distribution. 
                        Recommended velocities for different steam types are:
                    </p>

                    <List items={[
                        "Superheated: 50-70 m/sec",
                        "Saturated: 30-40 m/sec",
                        "Wet or Exhaust: 20-30 m/sec"
                    ]} />

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-6 mb-3">
                        Pressure drop in steam pipes is calculated using the following equation:
                    </p>

                    <p className="text-sm sm:text-base font-mono bg-gray-50 px-3 py-2 rounded my-4">
                        h<sub>f</sub> = (4 * f * L * u²) / (2 * g * D)
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">Where:</p>

                    <List items={[
                        "h<sub>f</sub> = Head loss due to friction (m)",
                        "f = Friction factor (dimensionless)",
                        "L = Length of pipe (m)",
                        "u = Flow velocity (m/s)",
                        "g = Gravitational constant (9.81 m/s²)",
                        "D = Pipe diameter (m)"
                    ]} />

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4">
                        Head loss is proportional to the square of velocity (u²). The friction 
                        factor (f) is affected by the Reynolds number and the reciprocal of 
                        velocity squared.
                    </p>
                </Section>
                <Section 
                    title="3.5 Proper Selection, Operation and Maintenance of Steam Traps" 
                    level={2}
                    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Steam traps are essential for removing condensate, air, and non-condensable 
                        gases from steam systems. This ensures efficient heating and prevents equipment 
                        damage. Their key functions are:
                    </p>
                    <List items={[
                        'Discharge condensate promptly',
                        'Prevent steam loss',
                        'Discharge air and other incondensible gases'
                    ]} />
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-6 mb-4">
                        Types of steam traps:
                    </p>
                    <List items={[
                        <span><b>Thermostatic:</b> Operate based on temperature differences between steam and condensate</span>,
                        <span><b>Mechanical:</b> Operate based on density differences between steam and condensate (e.g., ball float, inverted bucket)</span>,
                        <span><b>Thermodynamic:</b> Operate based on the dynamic effect of flash steam</span>
                    ]} />
                </Section>

                <Section 
                    title="3.6 Performance Assessment Methods for Steam Traps" 
                    level={2}
                    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                        Assessing steam trap performance involves checking if it's working correctly, 
                        and if not, whether it's failed open or closed.
                    </p>
                    <List items={[
                        <>
                            <b>Open failures</b> waste steam and energy, increasing boiler costs and potentially reducing heating capacity
                        </>,
                        <>
                            <b>Closed failures</b> don't waste resources but reduce heating capacity and may damage equipment
                        </>
                    ]} />
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-6 mb-4">Testing methods:</p>
                    <List items={[
                        <>
                            <b>Visual:</b> Observing discharge through open discharge, sight glasses, sight checks, test tees, or three-way valves
                        </>,
                        <>
                            <b>Sound:</b> Using ultrasonic detectors, stethoscopes, or simple listening devices
                        </>,
                        <>
                            <b>Temperature:</b> Using infrared guns, surface pyrometers, temperature tapes, or crayons
                        </>
                    ]} />
                </Section>

                <Section 
                    title="3.7 Energy Saving Opportunities" 
                    level={2}
                    icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <ol className="list-decimal space-y-4 sm:space-y-6 my-4 sm:my-6 pl-5">
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Monitoring steam traps:</span> Check condensate 
                            discharge and flash steam. Continuous blue steam indicates a leak; intermittent 
                            white clouds indicate flash steam.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Avoiding steam leakages:</span> A 3mm leak in 
                            a 7 kg/cm² line can waste 33 KL of fuel oil per year. Implement a regular leak 
                            detection program.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Providing dry steam:</span> Dry saturated steam 
                            is best for process heating. Wet steam reduces heat transfer and overloads traps. 
                            Superheated steam transfers heat slower than condensing saturated steam.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Utilizing steam at the lowest acceptable pressure:</span> Lower 
                            pressure steam has higher latent heat, but also lower temperature, which might 
                            increase processing time.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Proper utilization of directly injected steam:</span> Direct 
                            steam injection is efficient but can cause dilution and agitation. Indirect 
                            heating is preferred when these are concerns.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Minimising heat transfer barriers:</span> Air, 
                            condensate, and scale hinder heat transfer. Regular cleaning and proper boiler 
                            operation can minimize these.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Proper air venting:</span> Air in steam systems 
                            reduces heating efficiency. Install automatic air vents to remove air.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Condensate recovery:</span> Returning condensate 
                            to the boiler reduces fuel, water, and effluent costs. Each 60°C rise in 
                            feedwater temperature saves about 1% of fuel.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Insulation of steam pipelines and hot process equipment:</span> Uninsulated 
                            surfaces radiate heat. Use detachable insulation covers on flanges.
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Flash steam recovery:</span> Flash steam produced 
                            when high-pressure condensate is released to lower pressure can be used for 
                            low pressure heating.
                            <p className="font-mono bg-gray-50 px-3 py-2 rounded my-4">
                                Flash steam available (%) = (S<sub>1</sub> - S<sub>2</sub>) / L<sub>2</sub>
                            </p>
                            <p className="mt-2">Where:</p>
                            <ul className="space-y-2 mt-2 ml-6">
                                <li>S<sub>1</sub> = Sensible heat of higher pressure condensate</li>
                                <li>S<sub>2</sub> = Sensible heat of steam at lower pressure</li>
                                <li>L<sub>2</sub> = Latent heat of flash steam at lower pressure</li>
                            </ul>
                        </li>
                        <li className="text-sm sm:text-base text-gray-700">
                            <span className="font-semibold">Reducing the work to be done by steam:</span> Use 
                            mechanical drying methods before using steam, ensure automatic draining, and 
                            prevent water hammer and thermal shock.
                        </li>
                    </ol>
                </Section>
            </Section>
        </div>
    );
};

export default SteamChapter;



