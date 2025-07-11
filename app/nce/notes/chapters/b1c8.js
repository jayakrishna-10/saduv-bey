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

const EnergyMonitoringChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="8. ENERGY MONITORING AND TARGETING" 
        level={1}
        icon={<BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
        <Section title="Syllabus" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
            <p>Energy Monitoring and Targeting: Defining monitoring &amp; targeting, Elements of monitoring &amp; targeting, Data and information-analysis, Techniques - energy consumption, Production, Cumulative sum of differences (CUSUM).</p>
        </Section>

        <Section title="8.1 Definition" level={2} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
            <p>Energy monitoring and targeting (M&amp;T) is a management technique using energy information to eliminate waste, reduce and control energy use, and improve operating procedures. It follows the principle "you can't manage what you don't measure" and combines energy use principles with statistics. Monitoring establishes existing energy consumption patterns, while targeting identifies desirable consumption levels as a management goal for energy conservation.</p>
            <p>M&amp;T manages plant and building utilities (fuel, steam, refrigeration, compressed air, water, effluent, electricity) as controllable resources, similar to raw materials, inventory, and personnel.  It involves systematically dividing the facility into Energy Cost Centers, monitoring utility usage in each center, and comparing energy used with production volume or other operational measures. This regular information enables target setting, variance identification, interpretation, and implementation of remedial actions. M&amp;T programs have proven effective, reducing annual energy costs by 5-20% in various industrial sectors.</p>
        </Section>

        <Section title="8.2 Elements of Monitoring &amp; Targeting System" level={2} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
            <p>The key elements of an M&amp;T system are:</p>
            <List items={[
              <>
                <strong>Recording:</strong> Measuring and recording energy consumption.
                </>,
                <>
                <strong>Analyzing:</strong> Correlating energy consumption with measured output e.g. production quantity.
                </>,
                <>
                <strong>Comparing:</strong> Comparing energy consumption against a standard or benchmark.
                </>,
                <>
                <strong>Setting Targets:</strong> Establishing targets for reducing or controlling energy consumption.
                </>,
                <>
                <strong>Monitoring:</strong> Regularly comparing energy consumption to the set target.
                </>,
                <>
                <strong>Reporting:</strong> Reporting results, including variances from targets.
                </>,
                <>
                <strong>Controlling:</strong> Implementing management measures to address variances.
                </>
            ]} />
            <p>M&amp;T systems specifically involve:</p>
            <List items={[
                'Checking energy invoice accuracy.',
                'Allocating energy costs to specific departments (Energy Accounting Centers).',
                'Determining energy performance/efficiency.',
                'Recording energy use to track efficiency improvement projects.',
                'Highlighting performance issues in equipment or systems.'
            ]} />
        </Section>

        <Section title="8.3 A Rationale for Monitoring, Targeting and Reporting" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
            <p>Energy use varies with production processes, volumes, and input. Relating energy use to key performance indicators helps determine:</p>
            <List items={[
                'Current energy performance compared to past performance.',
                'Trends in energy consumption (seasonal, weekly, operational).',
                'Projected energy use changes based on business changes.',
                'Areas of wasted energy.',
                'Comparison with similar businesses ("benchmarking").',
                'Past responses to changes.',
                'Performance target development for energy management.'
            ]} />
            <p>Energy use information sources:</p>
            <List items={[
                'Plant level: Financial accounting systems (utility cost centers).',
                'Plant department level: Comparative energy data, meter readings.',
                'System level (e.g., boiler plant): Sub-metering data.',
                'Equipment level: Nameplate data, run-time, schedules, sub-metering.'
            ]} />
        </Section>

        <Section title="8.4 Data and Information Analysis" level={2} icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
            <p>Electricity and fuel bills should be collected and analyzed periodically.  Data can be organized in a table showing monthly costs for different fuels and electricity (day, night, maximum demand).  From this, a pie chart can visually represent the proportion of total energy cost for each fuel.</p>
            <p>To compare different fuels, convert their consumption to a common unit like kCal using conversion factors.</p>
        </Section>

        <Section title="8.5 Relating Energy Consumption and Production" level={2} icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
            <h3>Graphing the Data</h3>
            <p>M&amp;T analyzes the drivers of energy consumption (production, operating hours, weather).  Graphical representation is recommended for better understanding.</p>
            <h3>Use of Bar Chart</h3>
            <p>Energy data (e.g., monthly energy consumption for consecutive years) can be visualized using bar charts. Moving annual totals (sum of the previous 12 months) smooth out seasonal variations and meter reading timing errors. Plotting both energy and production on the same chart with two y-axes reveals their correlation.  Deviations from the expected correlation can signal waste or confirm energy efficiency improvements.</p>
            <p>Specific Energy Consumption (SEC) is calculated as energy consumption per unit of production. Plotting SEC over time and alongside production data can reveal fixed energy consumption (independent of production) and highlight areas for improvement.</p>
            <p>To understand the relationship between energy and production, plot energy against production in an XY chart and add a trend line (linear regression). This can establish a "standard" for future consumption and identify potential savings. The relationship can be expressed as:</p>
            <p><strong>Energy consumed = C + M x Production</strong></p>
            <p>Where:</p>
            <List items={[
                'C = fixed energy consumption (lighting, heating/cooling, etc.)',
                'M = variable energy consumption (directly related to production)'
            ]} />
            <p>This allows predicting "standard" energy consumption for any production level and setting targets (e.g., standard less 5%). This can be applied at both factory and individual process levels.</p>
                        <h3>Graphing the Data</h3>
            <p>M&amp;T analyzes the drivers of energy consumption (production, operating hours, weather).  Graphical representation is recommended for better understanding.</p>
            <h3>Use of Bar Chart</h3>
            <p>Energy data (e.g., monthly energy consumption for consecutive years) can be visualized using bar charts. Moving annual totals (sum of the previous 12 months) smooth out seasonal variations and meter reading timing errors. Plotting both energy and production on the same chart with two y-axes reveals their correlation.  Deviations from the expected correlation can signal waste or confirm energy efficiency improvements.</p>
            <p>Specific Energy Consumption (SEC) is calculated as energy consumption per unit of production. Plotting SEC over time and alongside production data can reveal fixed energy consumption (independent of production) and highlight areas for improvement.</p>
            <p>To understand the relationship between energy and production, plot energy against production in an XY chart and add a trend line (linear regression). This can establish a "standard" for future consumption and identify potential savings. The relationship can be expressed as:</p>
            <p><strong>Energy consumed = C + M x Production</strong></p>
            <p>Where:</p>
            <List items={[
                'C = fixed energy consumption (lighting, heating/cooling, etc.)',
                'M = variable energy consumption (directly related to production)'
            ]} />
            <p>This allows predicting "standard" energy consumption for any production level and setting targets (e.g., standard less 5%). This can be applied at both factory and individual process levels.</p>

        </Section>

        <Section title="8.6 CUSUM" level={2} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}>
            <p>Cumulative Sum (CUSUM) charts track the difference between actual and expected (or standard) energy consumption over time. They visualize trends, calculate savings/losses, and highlight performance changes.</p>
            <p>A typical CUSUM graph fluctuates around zero (representing standard consumption). Changes in direction indicate events affecting consumption patterns (e.g., energy saving measures, efficiency declines due to poor control or maintenance). Interpreting these changes requires site-specific knowledge.</p>
        </Section>


<Section title="8.7 Case Study" level={2} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}>
<h3>The CUSUM Technique</h3>
<p>This case study uses 18 months of energy and production data for a plant that installed a heat recovery system in month 9. The CUSUM technique is used to estimate the savings from the heat recovery system.</p>
<h3>Steps for CUSUM analysis</h3>
<ol>
<li>Plot Energy vs. Production for the first 9 months.</li>
<li>Draw a best-fit straight line through the data points.</li>
<li>Derive the equation of the line (in this case, E = 0.4P + 180, where E is energy consumption and P is production).</li>
<li>Calculate expected energy consumption using the equation.</li>
<li>Calculate the difference between actual (E<sub>act</sub>) and calculated (E<sub>calc</sub>) energy consumption.</li>
<li>Compute the CUSUM (cumulative sum of differences).</li>
<li>Plot the CUSUM graph.</li>
<li>Estimate savings from the heat recovery system based on the CUSUM graph.</li>
</ol>
<p>In this case study, the CUSUM chart shows that the heat recovery system took about two months to become fully operational, after which consistent savings were achieved. The accumulated savings over the last 7 months were 44 toe, representing approximately 1.8% of energy consumption.</p>
<h3>The CUSUM Technique</h3>
<p>This case study uses 18 months of energy and production data for a plant that installed a heat recovery system in month 9. The CUSUM technique is used to estimate the savings from the heat recovery system.</p>
<h3>Steps for CUSUM analysis</h3>
<ol>
<li>Plot Energy vs. Production for the first 9 months.</li>
<li>Draw a best-fit straight line through the data points.</li>
<li>Derive the equation of the line (in this case, E = 0.4P + 180, where E is energy consumption and P is production).</li>
<li>Calculate expected energy consumption using the equation.</li>
<li>Calculate the difference between actual (E<sub>act</sub>) and calculated (E<sub>calc</sub>) energy consumption.</li>
<li>Compute the CUSUM (cumulative sum of differences).</li>
<li>Plot the CUSUM graph.</li>
<li>Estimate savings from the heat recovery system based on the CUSUM graph.</li>
</ol>
<p>In this case study, the CUSUM chart shows that the heat recovery system took about two months to become fully operational, after which consistent savings were achieved. The accumulated savings over the last 7 months were 44 toe, representing approximately 1.8% of energy consumption.</p>
</Section>


        <Section title="QUESTIONS" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
            <p>Standard questions related to the covered material.</p>
        </Section>

        <Section title="REFERENCES" level={2} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
            <p>List of relevant publications.</p>
        </Section>
    </Section>
    </div>
);
};

export default EnergyMonitoringChapter;
