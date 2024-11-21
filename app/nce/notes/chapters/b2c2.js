
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

const BoilerChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="2. BOILERS" 
                level={1}
                icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p>Boilers: Types, Combustion in boilers, Performance evaluation, Analysis of losses, Feed water treatment, Blowdown, Energy conservation opportunities.</p>
                </Section>

                <Section 
                    title="2.1 Introduction" 
                    level={2}
                    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">A boiler is a closed vessel that transfers combustion heat into water to produce hot water or steam under pressure for processes. Water is an efficient and cost-effective medium for heat transfer.  When water boils into steam, its volume expands significantly (about 1600 times), making boilers potentially dangerous and requiring careful operation.</p>
                    <p>Heat transfer mechanisms:</p>
                    <ul>
                        <li><strong>Radiation:</strong> Heat transfer from a hot body to a cold body without a medium.</li>
                        <li><strong>Convection:</strong> Heat transfer through a medium like air or water.</li>
                        <li><strong>Conduction:</strong> Heat transfer through direct physical contact.</li>
                    </ul>

                    <h3>Boiler Specification</h3>
                    <p><strong>Heating surface:</strong> The boiler metal area exposed to hot combustion gases on one side and water on the other, contributing to steam generation.  It's measured in square meters and directly relates to boiler efficiency.</p>
                    <p><strong>Maximum Continuous Rating (MCR):</strong> Hourly steam evaporation sustainable for 24 hours, expressed in tons per hour (TPH).</p>
                    <p><strong>F &amp; A:</strong> Steam generated from water at 100°C to saturated steam at 100°C.</p>

                    <h3>Indian Boiler Regulation</h3>
                    <p>The Indian Boilers Act and the Indian Boilers Regulation (IBR) govern the design, construction, operation, and maintenance of boilers in India.</p>

                    <h3>Boiler Specification</h3>
                    <p><strong>Heating surface:</strong> The boiler metal area exposed to hot combustion gases on one side and water on the other, contributing to steam generation.  It's measured in square meters and directly relates to boiler efficiency.</p>
                    <p><strong>Maximum Continuous Rating (MCR):</strong> Hourly steam evaporation sustainable for 24 hours, expressed in tons per hour (TPH).</p>
                    <p><strong>F &amp; A:</strong> Steam generated from water at 100°C to saturated steam at 100°C.</p>

                    <h3>Indian Boiler Regulation</h3>
                    <p>The Indian Boilers Act and the Indian Boilers Regulation (IBR) govern the design, construction, operation, and maintenance of boilers in India.</p>
                </Section>


                <Section
                    title="2.2 Boiler Systems"
                    level={2}
                    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p>A boiler system consists of:</p>
                    <ul>
                        <li><strong>Feed water system:</strong> Supplies water to the boiler and regulates it to meet steam demand.</li>
                        <li><strong>Steam system:</strong> Collects and controls the generated steam, distributing it through pipes to where it's needed.</li>
                        <li><strong>Fuel system:</strong> Provides fuel for combustion.</li>
                    </ul>
                    <p><strong>Feed water:</strong> Water converted into steam. Sources:</p>
                    <ul>
                        <li><strong>Condensate:</strong> Condensed steam returned from processes.</li>
                        <li><strong>Makeup water:</strong> Treated raw water from outside the system.</li>
                    </ul>
                    <p><strong>Economizer:</strong> Preheats feed water using waste heat from flue gases to improve boiler efficiency.</p>
                </Section>

                <Section
                    title="2.3 Boiler Types and Classifications"
                    level={2}
                    icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />}
                 >
                    <ul>
                        <li><strong>Fire-tube (fire-in-tube):</strong> Hot gases pass through tubes surrounded by water. Lower initial cost, fuel-efficient, easier to operate, but limited in capacity (typically 25 tons/hr) and pressure (17.5 kg/cm²).</li>
                        <li><strong>Water-tube (water-in-tube):</strong> Water passes through tubes surrounded by hot gases. Higher capacities and pressures, and higher efficiencies than fire-tube boilers.</li>
                        <li><strong>Packaged boiler:</strong> Self-contained unit requiring only external connections. Typically shell type with fire-tube design for high heat transfer.</li>
                    </ul>
                    <p>Packaged boiler features:</p>
                    <ul>
                        <li>Small combustion space and high heat release for faster evaporation.</li>
                        <li>Small diameter tubes for good convective heat transfer.</li>
                        <li>Forced or induced draft for efficient combustion.</li>
                        <li>Multiple passes for better heat transfer.</li>
                        <li>Higher thermal efficiency.</li>
                    </ul>
                    <p>Boiler classification based on passes (number of times hot gases travel through the boiler): Common types include one-pass, two-pass, and three-pass boilers.</p>
                    <h3>Stoker Fired Boiler</h3>
                    <p>Classified by fuel feeding method and grate type:</p>
                    <ul>
                        <li>Chain-grate/traveling-grate stoker: Coal burns on a moving chain grate.</li>
                        <li>Spreader stoker: Coal is spread over a burning bed, combining suspension and grate burning. Offers good flexibility for load changes.</li>
                    </ul>
                    <h3>Pulverized Fuel Boiler</h3>
                    <p>Uses finely ground coal blown into the furnace with air. Used in most coal-fired power plants and large industrial boilers. High efficiency and fuel flexibility.</p>
                    <h3>Fluidized Bed Combustion (FBC) Boiler</h3>
                    <p>Coal burns in a fluidized bed of inert material (e.g., sand) suspended by upward airflow.  High fuel flexibility, reduced emissions (SOx and NOx), compact design, high combustion efficiency.</p>
                    <h3>Stoker Fired Boiler</h3>
                    <p>Classified by fuel feeding method and grate type:</p>
                    <ul>
                        <li>Chain-grate/traveling-grate stoker: Coal burns on a moving chain grate.</li>
                        <li>Spreader stoker: Coal is spread over a burning bed, combining suspension and grate burning. Offers good flexibility for load changes.</li>
                    </ul>
                    <h3>Pulverized Fuel Boiler</h3>
                    <p>Uses finely ground coal blown into the furnace with air. Used in most coal-fired power plants and large industrial boilers. High efficiency and fuel flexibility.</p>
                    <h3>Fluidized Bed Combustion (FBC) Boiler</h3>
                    <p>Coal burns in a fluidized bed of inert material (e.g., sand) suspended by upward airflow.  High fuel flexibility, reduced emissions (SOx and NOx), compact design, high combustion efficiency.</p>


                </Section>


            </Section>
       

<Section 
    title="2.4 Performance Evaluation of Boilers" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p>Performance parameters like efficiency and evaporation ratio degrade over time due to factors like poor combustion, fouling, and maintenance issues. Efficiency tests are conducted to identify deviations and areas for improvement.</p>

    <h3>Boiler Efficiency</h3>
    <p>Percentage of heat input effectively used to generate steam. Calculation methods:</p>
    <ol>
        <li><strong>Direct Method:</strong> Compares the energy gain in the working fluid (water and steam) with the energy content of the fuel.
            <p>Formula:
            Boiler Efficiency (η) = (Heat Output / Heat Input) × 100</p>
            <p>Where:</p>
            <ul>
                <li>Heat Output = Q × (h<sub>g</sub> - h<sub>f</sub>)</li>
                <li>Heat Input = q × GCV</li>
            </ul>
            <p>Variables:</p>
            <ul>
                <li>Q: Quantity of steam generated per hour (kg/hr)</li>
                <li>h<sub>g</sub>: Enthalpy of saturated steam (kcal/kg)</li>
                <li>h<sub>f</sub>: Enthalpy of feed water (kcal/kg)</li>
                <li>q: Quantity of fuel used per hour (kg/hr)</li>
                <li>GCV: Gross Calorific Value of fuel (kcal/kg)</li>
            </ul>
        </li>
        <li><strong>Indirect Method:</strong> Calculates efficiency by subtracting losses from the total energy input. Losses include:
            <ul>
                <li>Dry flue gas loss</li>
                <li>Loss due to moisture in fuel and air</li>
                <li>Loss due to combustion of hydrogen</li>
                <li>Radiation loss</li>
                <li>Unburnt fuel loss</li>
            </ul>
        </li>
    </ol>
</Section>


<Section 
    title="2.5 Boiler Blowdown" 
    level={2}
    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
    <p>Process of removing a portion of boiler water to control the concentration of dissolved solids and prevent scaling, foaming, and carryover.  Two types:</p>
    <ul>
        <li><strong>Intermittent blowdown:</strong> Manual operation of a valve at the lowest point of the boiler.</li>
        <li><strong>Continuous blowdown:</strong> Steady removal and replacement of boiler water, maintaining constant TDS.</li>
    </ul>
    <p><strong>Blowdown (%) = (Feed water TDS × % Make-up water) / Maximum Permissible TDS in Boiler Water</strong></p>
</Section>

<Section 
    title="2.6 Boiler Water Treatment" 
    level={2}
    icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <p>Essential for maintaining steam quality, preventing deposits and corrosion.  Types:</p>
    <ul>
        <li><strong>Internal treatment:</strong> Chemicals added to the boiler to convert scale-forming compounds into removable sludge.</li>
        <li><strong>External treatment:</strong> Processes like ion exchange, demineralization, reverse osmosis, and de-aeration to remove impurities before water enters the boiler.</li>
    </ul>
</Section>

<Section 
    title="2.7 Energy Conservation Opportunities" 
    level={2}
    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
    <ol>
        <li><strong>Stack Temperature:</strong> Maintain the lowest possible stack temperature without causing condensation and corrosion.</li>
        <li><strong>Feed Water Preheating:</strong> Use economizers to recover heat from flue gases.</li>
        <li><strong>Combustion Air Preheat:</strong> Preheating combustion air improves thermal efficiency.</li>
        <li><strong>Incomplete Combustion:</strong> Ensure complete combustion by proper air-fuel ratio and fuel distribution.</li>
        <li><strong>Excess Air Control:</strong> Optimize excess air levels to minimize losses.</li>
        <li><strong>Radiation and Convection Heat Loss:</strong> Minimize heat loss through insulation.</li>
        <li><strong>Automatic Blowdown Control:</strong> Use automatic systems to optimize blowdown and reduce heat loss.</li>
        <li><strong>Reduction of Scaling and Soot Losses:</strong> Regularly remove soot and scale deposits to improve heat transfer.</li>
        <li><strong>Reduction of Boiler Steam Pressure:</strong> Reduce steam pressure when possible to save energy.</li>
        <li><strong>Variable Speed Control:</strong> Use variable speed drives for fans, blowers, and pumps to optimize operation.</li>
        <li><strong>Effect of Boiler Loading on Efficiency:</strong> Operate boilers near their optimal load range.</li>
        <li><strong>Proper Boiler Scheduling:</strong> Optimize boiler operation by running fewer boilers at higher loads.</li>
        <li><strong>Boiler Replacement:</strong> Consider replacing old and inefficient boilers.</li>
    </ol>
</Section>

<Section 
    title="2.8 Case Study: Installing Boiler Economiser" 
    level={2}
    icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
>
    <p>A case study illustrating the benefits of installing an economizer in a paper mill to recover waste heat from flue gases and preheat boiler feed water, resulting in fuel oil savings.</p>
</Section>

<Section 
    title="Questions" 
    level={2}
    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
    <p>A list of questions related to boiler operation, efficiency, and maintenance.</p>
</Section>

<Section 
    title="References" 
    level={2}
    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
    <p>A list of relevant resources for further information on boiler systems and operation.</p>
</Section>

</div>
    );
};

export default BoilerChapter;