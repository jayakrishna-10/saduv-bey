
// File: app/nce/notes/chapters/b1c5.js
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


const FansAndBlowersChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="5. FANS AND BLOWERS" 
                level={1}
                icon={<Wind className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p>
                        Fans and blowers: Types, Performance evaluation, Efficient system operation, Flow control strategies and energy conservation opportunities
                    </p>
                </Section>

                <Section 
                    title="5.1 Introduction" 
                    level={2}
                    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p>
                        Fans and blowers supply air for ventilation and industrial processes. Fans create pressure to move air (or gases) against resistance from ducts, dampers, etc. The fan rotor receives energy from a rotating shaft and transfers it to the air.
                    </p>
                </Section>

                <Section 
                    title="Difference between Fans, Blowers and Compressors" 
                    level={2}
                    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
                >
                    <p>
                        These are differentiated by how they move air and the system pressure they operate against. The American Society of Mechanical Engineers (ASME) uses the specific ratio (discharge pressure / suction pressure) to define them:
                    </p>
                    <table>
                        <caption>TABLE 5.1 DIFFERENCES BETWEEN FANS, BLOWER AND COMPRESSOR</caption>
                        <thead>
                            <tr>
                                <th>Equipment</th>
                                <th>Specific Ratio</th>
                                <th>Pressure rise (mmWg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Fans</td>
                                <td>Up to 1.11</td>
                                <td>1136</td>
                            </tr>
                            <tr>
                                <td>Blowers</td>
                                <td>1.11 to 1.20</td>
                                <td>1136 - 2066</td>
                            </tr>
                            <tr>
                                <td>Compressors</td>
                                <td>more than 1.20</td>
                                <td> </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>


                <Section 
                    title="5.2 Fan Types" 
                    level={2}
                    icon={<Wind  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
                >
                    <p>
                        Fan and blower selection depends on volume flow rate, pressure, material handled, space, and efficiency.  Fan efficiencies vary by design and type (Table 5.2).
                    </p>
                    <p>Two main categories:</p>
                    <ul>
                        <li><b>Centrifugal flow:</b> Airflow changes direction twice (entering and leaving). Types: forward curved, backward curved/inclined, radial.</li>
                        <li><b>Axial flow:</b> Air enters and leaves without direction change.  Types: propeller, tubeaxial, vaneaxial.</li>
                    </ul>
                    <h3>Centrifugal Fan: Types</h3>
                    <p>
                        Major types: radial, forward curved, backward curved. Radial fans handle high static pressures and contaminated airstreams, suited for high temperatures. Forward-curved fans are for clean environments, low tip speeds, and high airflow at low pressures. Backward-inclined fans are more efficient than forward-curved and don't overload the motor with static pressure changes.
                    </p>
                    <h3>Axial Flow Fan: Types</h3>
                    <p>
                        Major types: tube axial, vane axial, propeller. Tubeaxial fans have a wheel inside a cylindrical housing for efficient airflow, operating at high pressures with up to 65% efficiency. Vaneaxial fans are similar but have guide vanes for higher static pressure and efficiency. Propeller fans run at low speeds, moderate temperatures, and handle large volumes at low pressure, suitable for exhaust applications.
                    </p>
                    <h3>Centrifugal Fan: Types</h3>
                    <p>
                        Major types: radial, forward curved, backward curved. Radial fans handle high static pressures and contaminated airstreams, suited for high temperatures. Forward-curved fans are for clean environments, low tip speeds, and high airflow at low pressures. Backward-inclined fans are more efficient than forward-curved and don't overload the motor with static pressure changes.
                    </p>
                    <h3>Axial Flow Fan: Types</h3>
                    <p>
                        Major types: tube axial, vane axial, propeller. Tubeaxial fans have a wheel inside a cylindrical housing for efficient airflow, operating at high pressures with up to 65% efficiency. Vaneaxial fans are similar but have guide vanes for higher static pressure and efficiency. Propeller fans run at low speeds, moderate temperatures, and handle large volumes at low pressure, suitable for exhaust applications.
                    </p>
                 </Section>

            

                <Section 
                    title="Common Blower Types" 
                    level={2}
                    icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p>
                        Blowers achieve higher pressures than fans (up to 1.20 kg/cm²) and can create vacuums. Main types are centrifugal (impeller driven up to 15,000 rpm, can be multi-stage) and positive-displacement (rotors trap and push air, constant volume even with varying system pressure).
                    </p>
                </Section>

                <Section 
                    title="5.3 Fan Performance Evaluation and Efficient System Operation" 
                    level={2}
                    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <h3>System Characteristics</h3>
                    <p>
                        System resistance is the sum of static pressure losses, depending on ducts, elbows, etc. It varies with the square of airflow: higher airflow, higher resistance.  It's important to know system resistance to determine fan volume output.  A system resistance curve plots flow rate (x-axis) against resistance (y-axis).
                    </p>
                    <h3>Fan Characteristics</h3>
                    <p>
                        Fan curves show performance under specific conditions (volume, static pressure, speed, brake horsepower, sometimes efficiency). The intersection of the system curve and static pressure curve determines the operating point. Changes in system resistance change the operating point. Power required is found by projecting the operating point onto the power (BHP) curve.
                    </p>
                    <h3>System Characteristics and Fan Curves</h3>
                    <p>
                        System resistance (pressure) increases with airflow (flow squared). Plotting this creates a system performance curve.  Plotting this on a fan curve shows the operating point where the two curves intersect (actual airflow at a specific pressure). Two ways to reduce airflow from Q<sub>1</sub> to Q<sub>2</sub>: 1) Restrict airflow with a damper (increases system resistance, moves operating point on fan curve to higher pressure, lower flow), 2) Reduce fan speed (shifts operating point to lower pressure, lower flow on a new fan curve). Reducing fan speed is more efficient.
                    </p>
                    <h3>Fan Laws</h3>
                    <ul>
                        <li>Flow ∝ Speed</li>
                        <li>Pressure ∝ (Speed)<sup>2</sup></li>
                        <li>Power ∝ (Speed)<sup>3</sup></li>
                    </ul>
                    <p>
                        A 10% change in RPM causes a 10% change in flow, a 19% decrease/21% increase in static pressure, and a 27% decrease/33% increase in power.  Where Q = flow, SP = Static Pressure, kW = Power, and N = speed (RPM).
                    </p>
                    <h3>System Characteristics</h3>
                    <p>
                        System resistance is the sum of static pressure losses, depending on ducts, elbows, etc. It varies with the square of airflow: higher airflow, higher resistance.  It's important to know system resistance to determine fan volume output.  A system resistance curve plots flow rate (x-axis) against resistance (y-axis).
                    </p>
                    <h3>Fan Characteristics</h3>
                    <p>
                        Fan curves show performance under specific conditions (volume, static pressure, speed, brake horsepower, sometimes efficiency). The intersection of the system curve and static pressure curve determines the operating point. Changes in system resistance change the operating point. Power required is found by projecting the operating point onto the power (BHP) curve.
                    </p>
                    <h3>System Characteristics and Fan Curves</h3>
                    <p>
                        System resistance (pressure) increases with airflow (flow squared). Plotting this creates a system performance curve.  Plotting this on a fan curve shows the operating point where the two curves intersect (actual airflow at a specific pressure). Two ways to reduce airflow from Q<sub>1</sub> to Q<sub>2</sub>: 1) Restrict airflow with a damper (increases system resistance, moves operating point on fan curve to higher pressure, lower flow), 2) Reduce fan speed (shifts operating point to lower pressure, lower flow on a new fan curve). Reducing fan speed is more efficient.
                    </p>
                    <h3>Fan Laws</h3>
                    <ul>
                        <li>Flow ∝ Speed</li>
                        <li>Pressure ∝ (Speed)<sup>2</sup></li>
                        <li>Power ∝ (Speed)<sup>3</sup></li>
                    </ul>
                    <p>
                        A 10% change in RPM causes a 10% change in flow, a 19% decrease/21% increase in static pressure, and a 27% decrease/33% increase in power.  Where Q = flow, SP = Static Pressure, kW = Power, and N = speed (RPM).
                    </p>
                </Section>
```
```jsx
                <Section 
                    title="5.4 Fan Design and Selection Criteria" 
                    level={2}
                    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p>
                        Airflow and outlet pressure are key to selecting fan type and size. Airflow is determined by process needs (heat transfer, combustion air). System pressure is calculated from pressure drops across ducts, bends, filters, etc., plus any fixed process pressure. Oversizing due to large safety margins leads to inefficient operation. Centrifugal fans are for low to moderate flow at high pressures, axial fans for low to high flows at low pressures. Centrifugal fans are generally more expensive.  Aerofoil and backward-curved centrifugal fans are more expensive than forward-curved, but offer better lifecycle economics.
                    </p>
                    <p>Once flow and pressure requirements are known, select fan and impeller type.  Fan type depends on flow and static pressure magnitudes; impeller type also depends on speed. High-speed smaller units are generally more economical (higher efficiency, lower cost), but large, low-speed units are better for low-pressure ratios.</p>
                    <h3>Safety margin</h3>
                    <p>Safety margin impacts efficiency.  Generally 5% over maximum flow rate. ID fans in boilers: 20% on volume, 30% on head. FD and PA fans: no safety margin necessary, but 10% on volume and 20% on pressure are often used.</p>
                    <h3>Some pointers on fan specification</h3>
                    <p>
                        Provide detailed specifications to the manufacturer, including design and normal operating points, maximum continuous rating, low load operation point, ambient temperature range, maximum gas temperature, gas density at different temperatures, gas composition, dust concentration and nature, control mechanisms, operating frequency, and plant altitude.  Letting the manufacturer choose the fan speed usually results in highest efficiency.
                    </p>
                    <h3>Installation of Fan</h3>
                    <p>Proper installation and maintenance are crucial for fan efficiency. Maintain correct clearances (radial, axial overlap, back plate, labyrinth seal) between impeller and housing.</p>
                    <h3>System Resistance Change</h3>
                    <p>System resistance affects fan performance and can change due to duct coating buildup, equipment changes, or duct modifications. Monitor resistance periodically and adjust fan operation as needed.</p>
                </Section>

                <Section 
                    title="5.5 Flow Control Strategies" 
                    level={2}
                    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p>Methods to change airflow:</p>
                    <ul>
                        <li><b>Pulley Change:</b> For permanent volume changes, change fan speed by altering drive or driven pulley sizes (V-belt driven systems).</li>
                        <li><b>Damper Controls:</b> Change airflow by adjusting dampers (inlet or outlet), adding/removing system resistance. Limited adjustment, not energy efficient.</li>
                        <li><b>Inlet Guide Vanes:</b> Curved sections at fan inlet; closing them pre-swirls air, changing fan curve characteristics.  Efficient for modest flow reductions (down to 80%).</li>
                        <li><b>Variable Pitch Blades (Axial Fans):</b> Hydraulically/pneumatically controlled blades change pitch while stationary, modifying fan characteristics for high efficiency.</li>
                        <li><b>Variable Speed Drives:</b> Expensive but offer wide speed control, matching fan speed to flow needs for optimal efficiency. May not be economical for infrequent flow changes. Account for control system efficiency.</li>
                        <li><b>Series and Parallel Operation:</b> Parallel operation doubles flow at free delivery, but less increase at higher system resistance. Series operation increases static pressure, best for high-resistance systems. Instability can occur in combined curves with multiple fans.</li>
                    </ul>
                </Section>
```
```jsx
                <Section 
                    title="5.6 Fan Performance Assessment" 
                    level={2}
                    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
                >
                    <p>Field performance is measured by flow, head, temperature (fan side) and electrical motor kW input (motor side).</p>
                    <h3>Air flow measurement</h3>
                    <p>Use pitot tube/manometer, flow sensor, or anemometer. Consider traverse points, straight duct sections, upstream/downstream measurement location. Measure on suction, discharge, or preferably both sides.</p>
                    <h3>Static pressure</h3>
                    <p>Potential energy added by the fan, converted to velocity pressure due to friction. Creates low pressure at duct inlet.</p>
                    <h3>Velocity pressure</h3>
                    <p>Pressure along the flow due to air movement; used to calculate air velocity.</p>
                    <h3>Total pressure</h3>
                    <p>Sum of static and velocity pressures. Constant except for friction losses.</p>
                    <h3>Measurements and Calculations</h3>
                    <h4>Velocity pressure/velocity calculation</h4>
                    <p>Measure duct diameter to calculate velocity and volume.  Measure velocity pressure at multiple points across the duct (center velocity x 0.9 for approximation if traversing is impossible), average the velocities (not velocity pressures), and use that average velocity for calculations.</p>
                    <h4>Air density calculation:</h4>
                    <p>
                        Gas Density (γ) = (273 x 1.293) / (273 + t°C)<br/>
                        where t°C = temperature of gas/air at site condition
                    </p>
                    <h4>Velocity calculation:</h4>
                    <p>
                        Velocity (v), m/s = (C<sub>p</sub> x √(2 x 9.81 x Δp x γ)) / γ <br/>
                        where:<br/>
                        C<sub>p</sub> = Pitot tube constant (0.85 or manufacturer's value)<br/>
                        Δp = Average differential pressure measured by pitot tube <br/>
                        γ = Density of air or gas at test condition
                    </p>
                    <h4>Volume calculation:</h4>
                    <p>Volumetric flow (Q), m³/sec = Velocity (V, m/sec) x Area (m²)</p>
                    <h4>Fan efficiency:</h4>
                    <p>
                        <b>Mechanical Efficiency:</b> <br/> 
                        η<sub>mechanical</sub> (%) = (Volume (m³/sec) x Δp (total pressure, mmwc)) / (102 x Power input to fan shaft (kW)) x 100
                    </p>
                    <p>
                        <b>Static Efficiency:</b> <br/>
                        η<sub>static</sub> (%) = (Volume (m³/sec) x Δp (static pressure, mmwc)) / (102 x Power input to fan shaft (kW)) x 100
                    </p>
                </Section>

                <Section 
                    title="5.7 Energy Saving Opportunities" 
                    level={2}
                    icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p>Minimize fan demand by:</p>
                    <ol>
                        <li>Reducing excess air in combustion systems.</li>
                        <li>Minimizing air leaks in hot flue gas paths.</li>
                        <li>Minimizing leaks in air conditioning systems.</li>
                    </ol>
                    <p>Other improvements:</p>
                    <ol>
                        <li>Use high-efficiency impellers and cones.</li>
                        <li>Replace entire fan assembly with a more efficient unit.</li>
                        <li>Use smaller diameter impellers (de-rating).</li>
                        <li>Replace metallic/GRP impellers with hollow FRP impellers (axial flow fans).</li>
                        <li>Reduce fan speed with pulley changes.</li>
                        <li>Use two-speed motors or variable speed drives.</li>
                        <li>Use energy-efficient belts.</li>
                        <li>Use inlet guide vanes instead of discharge dampers.</li>
                        <li>Improve duct systems to minimize resistance and pressure drops.</li>
                    </ol>
                </Section>

                <Section 
                    title="Case Studies" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
                >
                    <p>Cement plants have realized substantial energy savings by optimizing fan systems, including replacing impellers, using liners, integrating air supply ducts, and implementing VFDs.</p>
                    <p>FRP fans offer significant energy savings compared to conventional aluminium/steel fans in cooling tower and humidification plant applications.</p>
                </Section>

                <Section 
                    title="Questions" 
                    level={2}
                    icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p>The document concludes with 13 review questions on fan selection, system resistance, fan laws, and performance measurement.</p>
                </Section>

            </Section>
        </div>
    );
};

export default FansAndBlowersChapter;