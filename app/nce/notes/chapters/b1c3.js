
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


const EnergyManagementChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <Section title="Energy Management and Audit Summary" level={1} icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}>
            <Section title="3. ENERGY MANAGEMENT AND AUDIT" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
                <Section title="3.1 Definition & Objectives of Energy Management" level={3} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
                    <p>The main goal of energy management is to produce goods and provide services with minimal cost and environmental impact.</p>
                    <p>One definition emphasizes maximizing profits (or minimizing costs) and enhancing competitive positions through judicious and effective energy use.</p>
                    <p>Another definition highlights the strategic adjustment and optimization of energy using systems and procedures to reduce energy requirements per output unit while maintaining or reducing total production costs.</p>
                    <p>The objectives of Energy Management are:</p>
                    <List items={[
                        "Minimize energy costs/waste without impacting production and quality.",
                        "Minimize environmental impact."
                    ]} />
                </Section>

                <Section title="3.2 Energy Audit: Types And Methodology" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
                    <p>An Energy Audit is a systematic approach for decision-making in energy management. It balances energy inputs with their use and identifies all energy streams within a facility. It quantifies energy usage based on specific functions and is an effective tool for comprehensive energy management programs.</p>
                    <p>Energy Audit is defined as the verification, monitoring, and analysis of energy use, including a technical report with recommendations for improving energy efficiency, cost-benefit analysis, and an action plan to reduce energy consumption.</p>
                    <h4>3.2.1 Need for Energy Audit</h4>
                    <p>Energy costs often rank among the top operating expenses in industries. Energy management is thus a crucial area for cost reduction. Energy Audits help understand energy and fuel use, identify areas of waste, and highlight improvement opportunities.</p>
                    <p>Energy Audits promote energy cost reduction, preventive maintenance, and quality control. They focus on variations in energy costs, supply reliability, and help decide on an optimal energy mix, identify conservation technologies, and retrofit equipment.</p>
                    <p>Energy Audits translate conservation ideas into practical solutions, considering technical, economic, and organizational aspects within a timeframe.  They aim to reduce energy consumption per unit output or lower operating costs, providing a benchmark for managing energy and forming the basis for effective energy use.</p>
                    <h4>3.2.2 Type of Energy Audit</h4>
                    <p>Types of Energy Audits:</p>
                    <List items={[
                        "Preliminary Audit",
                        "Detailed Audit"
                    ]}/>
                    <p>The choice depends on the industry's function, required audit depth, and potential cost reduction.</p>
                    <h4>3.2.3 Preliminary Energy Audit Methodology</h4>
                    <p>A preliminary audit is quick, aiming to:</p>
                    <List items={[
                        "Establish energy consumption",
                        "Estimate savings scope",
                        "Identify easy areas for improvement",
                        "Identify immediate (no/low-cost) improvements/savings",
                        "Set a reference point",
                        "Identify areas for detailed study"
                    ]} />
                    <p>It relies on existing or readily available data.</p>
                    <h4>3.2.4 Detailed Energy Audit Methodology</h4>
                    <p>A detailed audit provides a comprehensive energy project implementation plan, evaluating major energy-using systems. It gives the most accurate estimate of energy savings and costs, considering the interactive effects of projects and accounting for the energy use of all major equipment.</p>
                    <p>A key element is the energy balance, which involves inventorying energy-using systems, making assumptions about current operating conditions, calculating energy use, and comparing this with utility bill charges.</p>
                    <p>Detailed audits have three phases:</p>
                    <List items={[
                        "Phase I: Pre-Audit Phase",
                        "Phase II: Audit Phase",
                        "Phase III: Post-Audit Phase"
                    ]}/>
                    <p>A ten-step methodology for detailed audits is outlined, allowing flexibility for different industries. (Detailed steps are included in the original document)</p>

                    <h4>Phase I -Pre Audit Phase Activities</h4>
                    <p>An initial site visit is crucial for planning the audit. It involves meeting personnel, familiarizing with the site, and assessing necessary procedures. Activities include discussing audit aims, economic guidelines, analyzing energy data, obtaining site drawings, and touring the site.  The main aims are to finalize the audit team, identify major energy-consuming areas, determine instrumentation needs, plan the timeframe, collect macro data, and raise awareness.</p>
                    <h4>Phase II- Detailed Energy Audit Activities</h4>
                    <p>Detailed audits can take weeks or months. They involve in-depth studies of energy and material balances, checks of plant operations (including nights and weekends). The report includes descriptions of energy inputs and outputs, evaluates efficiency at each manufacturing step, lists improvement means, performs preliminary cost assessments, and concludes with recommendations for further studies and analyses.</p>
                    <p>Data collected during the detailed audit includes energy and material balances, energy costs, process flow diagrams, energy supply sources, potential for fuel substitution/process modification/cogeneration, and energy management procedures.</p>
                    <p><strong>Data Collection Hints:</strong> Emphasize using easy-to-use measurement systems with appropriate accuracy, considering cost-effectiveness. Ensure data quality for accurate conclusions, define data collection frequency to capture process variations, consider abnormal workload periods, and use design values when measurements are difficult. "Do not estimate when you can calculate. Do not calculate when you can measure."</p>
                    <p><strong>Drawing process flow diagrams:</strong> An overview of unit operations, process steps, material and energy use areas, and waste generation sources should be represented in a flowchart. Input and output streams at each step should be identified. The focus areas depend on input resource consumption, energy efficiency potential, the impact of process steps, and waste generation intensity. (An example of Penicillin-G manufacturing is provided).</p>
                    <h4>3.2.1 Need for Energy Audit</h4>
                    <p>Energy costs often rank among the top operating expenses in industries. Energy management is thus a crucial area for cost reduction. Energy Audits help understand energy and fuel use, identify areas of waste, and highlight improvement opportunities.</p>
                    <p>Energy Audits promote energy cost reduction, preventive maintenance, and quality control. They focus on variations in energy costs, supply reliability, and help decide on an optimal energy mix, identify conservation technologies, and retrofit equipment.</p>
                    <p>Energy Audits translate conservation ideas into practical solutions, considering technical, economic, and organizational aspects within a timeframe.  They aim to reduce energy consumption per unit output or lower operating costs, providing a benchmark for managing energy and forming the basis for effective energy use.</p>


                    <h4>3.2.2 Type of Energy Audit</h4>
                    <p>Types of Energy Audits:</p>
                    <List items={[
                        "Preliminary Audit",
                        "Detailed Audit"
                    ]} />
                    <p>The choice depends on the industry's function, required audit depth, and potential cost reduction.</p>
                    <h4>3.2.3 Preliminary Energy Audit Methodology</h4>
                    <p>A preliminary audit is quick, aiming to:</p>
                    <List items={[
                        "Establish energy consumption",
                        "Estimate savings scope",
                        "Identify easy areas for improvement",
                        "Identify immediate (no/low-cost) improvements/savings",
                        "Set a reference point",
                        "Identify areas for detailed study"
                    ]}/>
                    <p>It relies on existing or readily available data.</p>


                    <h4>3.2.4 Detailed Energy Audit Methodology</h4>
                    <p>A detailed audit provides a comprehensive energy project implementation plan, evaluating major energy-using systems. It gives the most accurate estimate of energy savings and costs, considering the interactive effects of projects and accounting for the energy use of all major equipment.</p>
                    <p>A key element is the energy balance, which involves inventorying energy-using systems, making assumptions about current operating conditions, calculating energy use, and comparing this with utility bill charges.</p>
                    <p>Detailed audits have three phases:</p>
                    <List items={[
                        "Phase I: Pre-Audit Phase",
                        "Phase II: Audit Phase",
                        "Phase III: Post-Audit Phase"
                    ]} />
                    <p>A ten-step methodology for detailed audits is outlined, allowing flexibility for different industries. (Detailed steps are included in the original document)</p>


                    <h4>Phase I -Pre Audit Phase Activities</h4>
                    <p>An initial site visit is crucial for planning the audit. It involves meeting personnel, familiarizing with the site, and assessing necessary procedures. Activities include discussing audit aims, economic guidelines, analyzing energy data, obtaining site drawings, and touring the site.  The main aims are to finalize the audit team, identify major energy-consuming areas, determine instrumentation needs, plan the timeframe, collect macro data, and raise awareness.</p>
                    <h4>Phase II- Detailed Energy Audit Activities</h4>
                    <p>Detailed audits can take weeks or months. They involve in-depth studies of energy and material balances, checks of plant operations (including nights and weekends). The report includes descriptions of energy inputs and outputs, evaluates efficiency at each manufacturing step, lists improvement means, performs preliminary cost assessments, and concludes with recommendations for further studies and analyses.</p>
                    <p>Data collected during the detailed audit includes energy and material balances, energy costs, process flow diagrams, energy supply sources, potential for fuel substitution/process modification/cogeneration, and energy management procedures.</p>
                    <p><strong>Data Collection Hints:</strong> Emphasize using easy-to-use measurement systems with appropriate accuracy, considering cost-effectiveness. Ensure data quality for accurate conclusions, define data collection frequency to capture process variations, consider abnormal workload periods, and use design values when measurements are difficult. "Do not estimate when you can calculate. Do not calculate when you can measure."</p>
                    <p><strong>Drawing process flow diagrams:</strong> An overview of unit operations, process steps, material and energy use areas, and waste generation sources should be represented in a flowchart. Input and output streams at each step should be identified. The focus areas depend on input resource consumption, energy efficiency potential, the impact of process steps, and waste generation intensity. (An example of Penicillin-G manufacturing is provided).</p>

                </Section>

                <Section title="3.3 Energy Audit Reporting Format" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}>
                    <p>(A detailed table of contents for a typical energy audit report is provided, including sections on plant introduction, production process description, energy and utility systems, detailed process flow, energy efficiency analysis, energy conservation options, and annexures.)</p>
                    <p>Worksheets for summarizing energy-saving recommendations and prioritizing energy-saving measures based on cost and investment type are provided.</p>
                    <p>A sample reporting format is provided, including sections for title, description of existing and proposed systems, energy saving calculations, and cost-benefit analysis.</p>
                </Section>



                <Section title="3.4 Understanding Energy Costs" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}>
                    <p>Understanding energy costs is essential for awareness and savings calculations.  When meters are unavailable, energy and fuel costs can be found on invoices and annual balance sheets.  Energy invoices are useful for establishing a baseline, identifying potential savings, highlighting potential areas for improvement, and quantifying savings from energy conservation measures.</p>
                    <h4>Fuel Costs</h4>
                    <p>Various fuels are used for thermal energy, including fuel oil (LSHS, LDO), LPG, coal, lignite, and wood. Key factors for fuel procurement are availability, cost, and quality. Other considerations include price at source, transport charges, fuel quality (contaminations, moisture), and energy content.</p>
                    <h4>Power Costs</h4>
                    <p>Electricity prices vary significantly based on location and consumer type. Factors affecting the final cost include maximum demand charges (kVA), energy charges (kWh), time-of-day charges, power factor charges, other incentives/penalties, tariff rate changes, slab rate variations, tariff clauses for different consumer categories, and tariff rates for different areas/states, including tax holidays for new projects.</p>
                    <p>A table illustrating a typical energy bill with different energy sources is provided.</p>
                    <p>Different energy forms are sold in different units (kWh, liters, tons). For comparison, convert to a common unit (kWh, GJ, kCal).</p>
                    <h4>Fuel Costs</h4>
                    <p>Various fuels are used for thermal energy, including fuel oil (LSHS, LDO), LPG, coal, lignite, and wood. Key factors for fuel procurement are availability, cost, and quality. Other considerations include price at source, transport charges, fuel quality (contaminations, moisture), and energy content.</p>
                    <h4>Power Costs</h4>
                    <p>Electricity prices vary significantly based on location and consumer type. Factors affecting the final cost include maximum demand charges (kVA), energy charges (kWh), time-of-day charges, power factor charges, other incentives/penalties, tariff rate changes, slab rate variations, tariff clauses for different consumer categories, and tariff rates for different areas/states, including tax holidays for new projects.</p>
                    <p>A table illustrating a typical energy bill with different energy sources is provided.</p>
                    <p>Different energy forms are sold in different units (kWh, liters, tons). For comparison, convert to a common unit (kWh, GJ, kCal).</p>
                </Section>


                <Section title="3.5 Benchmarking and Energy Performance" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
                    <p>Benchmarking energy consumption, both internally (historical/trend analysis) and externally (across similar industries), are powerful tools for performance assessment and identifying improvement areas. Internal benchmarking uses historical data to analyze trends in energy consumption, cost, production, and specific energy consumption.  External benchmarking compares performance across similar units, but it's crucial to consider factors like scale of operation, technology vintage, raw material/product specifications, and quality to avoid misleading findings.  Benchmarking allows for quantifying energy consumption trends, comparing industry performance, identifying best practices, identifying potential savings, and setting targets.</p>
                    <p>Benchmark parameters can be related to gross production (e.g., kWh/MT of product) or equipment/utility (e.g., boiler efficiency). Relevant process parameters should be mentioned for meaningful comparison (e.g., type of cement for cement plants, yarn type for textile units).  Examples of such parameters for various industries are given.</p>
                    <h4>Plant Energy Performance (PEP)</h4>
                    <p>PEP measures whether a plant is using more or less energy for production than in the past. It compares energy consumption changes between years, considering output variations.</p>
                    <p><strong>Production Factor:</strong> This is used to determine the energy required to produce the current year's output if the plant operated as in the reference year.
                        <br/>
                        Production factor = Current year's production / Reference year's production
                    </p>
                    <p><strong>Reference Year Equivalent Energy Use:</strong> The reference year's energy use required to produce the current year's output.
                        <br/>
                        Reference year equivalent = Reference year energy use x Production factor
                    </p>
                    <p><strong>Plant energy performance:</strong> The percentage of energy saved compared to the reference year.
                        <br/>
                        Plant energy performance = (Reference year equivalent - Current year's energy) / Reference year equivalent * 100
                    </p>
                    <p>PEP can also be used for monthly reporting.</p>

                    <h4>Plant Energy Performance (PEP)</h4>
                    <p>PEP measures whether a plant is using more or less energy for production than in the past. It compares energy consumption changes between years, considering output variations.</p>
                    <p><strong>Production Factor:</strong> This is used to determine the energy required to produce the current year's output if the plant operated as in the reference year.
                        <br/>
                        Production factor = Current year's production / Reference year's production
                    </p>
                    <p><strong>Reference Year Equivalent Energy Use:</strong> The reference year's energy use required to produce the current year's output.
                        <br/>
                        Reference year equivalent = Reference year energy use x Production factor
                    </p>
                    <p><strong>Plant energy performance:</strong> The percentage of energy saved compared to the reference year.
                        <br/>
                        Plant energy performance = (Reference year equivalent - Current year's energy) / Reference year equivalent * 100
                    </p>
                    <p>PEP can also be used for monthly reporting.</p>

                </Section>

                <Section title="3.6 Matching Energy Usage to Requirement" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
                    <p>Mismatches between equipment capacity and user requirements often lead to inefficiencies. Optimizing energy equipment capacity to match end-use needs is essential. Examples include:</p>
                    <List items={[
                        "Eliminating pump throttling through impeller trimming, resizing, or variable speed drives.",
                        "Improving fan efficiency through impeller trimming, variable speed drives, pulley modifications, or resizing.",
                        "Moderating chilled water temperature.",
                        "Recovering energy lost in control valve pressure drops.",
                        "Adopting task lighting."
                    ]} />
                </Section>

                <Section title="3.7 Maximising System Efficiency" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
                    <p>Once energy usage and sources are matched, efficient equipment operation and maintenance are crucial. This includes:</p>
                    <List items={[
                        "Eliminating steam leaks.",
                        "Maximizing condensate recovery.",
                        "Adopting combustion controls.",
                        "Replacing inefficient equipment with energy-efficient alternatives."
                    ]}/>
                </Section>


                <Section title="3.8 Fuel and Energy Substitution" level={3} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
                    <p>Fuel substitution involves replacing existing fossil fuels with more efficient, less costly, and less polluting alternatives like natural gas, biogas, or agro-residues. Energy substitution involves replacing one form of energy with another, such as replacing electric heaters with steam heaters or steam-based hot water with solar systems. Examples of fuel substitution include replacing coal with coconut shells or rice husk and LDO with LSHS.  An example of replacing a furnace oil-fired thermic fluid heater with an agro-fuel-fired heater is provided with associated calculations.</p>
                </Section>


                <Section title="3.9 Energy Audit Instruments" level={3} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
                    <p>Energy audits require portable, durable, easy-to-operate, and relatively inexpensive instruments for measurements. Parameters measured include basic electrical parameters (voltage, current, power factor, etc.), temperature and heat flow, radiation, air and gas flow, liquid flow, RPM, noise and vibration, dust concentration, TDS, pH, moisture content, and flue gas analysis.</p>
                    <p>Key instruments include electrical measuring instruments, combustion analyzers, fuel efficiency monitors, fyrite, contact and infrared thermometers, pitot tubes and manometers, water flow meters, speed measurement instruments (tachometers, stroboscopes), leak detectors, and lux meters.</p>
                </Section>
            </Section>
        </Section>
    </div>
);
};

export default EnergyManagementChapter;
