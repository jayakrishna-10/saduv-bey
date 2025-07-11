
// File: app/nce/notes/chapters/b1c6.js
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

const FinancialManagementChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="6. FINANCIAL MANAGEMENT" 
        level={1}
        icon={<BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
    >
        <Section
            title="Syllabus"
            level={2}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Financial Management encompasses Investment-need, Appraisal and criteria, Financial analysis techniques (Simple pay back period, Return on investment, Net present value, Internal rate of return, Cash flows, Risk and sensitivity analysis), Financing options, Energy performance contracts and role of ESCOS.
            </p>
        </Section>


        <Section
            title="6.1 Introduction"
            level={2}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Energy management often requires investments for reducing energy consumption. This could involve modifications, retrofits, or new technologies. A systematic approach should be used to evaluate investment options by considering not only energy savings but also other benefits like increased productivity and product quality.  The total cost should include direct project cost, additional operation &amp; maintenance costs, and training costs.  Investment analysis techniques are explained later in the chapter.
            </p>
        </Section>


        <Section
            title="6.2 Investment Need, Appraisal and Criteria"
            level={2}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">To justify energy efficiency investments, demonstrate the following:</p>
            <List items={[
                'Available measures to reduce waste',
                'Current energy problem size',
                'Predicted return on investment',
                'Realized returns on past measures'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Investment needs arise in situations such as:</p>
            <List items={[
                'New equipment or process improvements',
                'Staff training',
                'Energy information system upgrades'
            ]} />
            <Section
                title="Criteria"
                level={3}
                icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Investments should complement, not replace, effective energy management practices. Before investing, ensure:</p>
                <List items={[
                    'Optimal performance from existing plant and equipment',
                    'Lowest possible energy tariffs',
                    'Efficient use of best energy forms (fuels or electricity)',
                    'Regular implementation of good housekeeping practices'
                ]} />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Consider these criteria when listing investment opportunities:</p>
                <List items={[
                    'Energy consumption per unit of production',
                    'Current state of repair and energy efficiency of building design, plant, services, and controls',
                    'Indoor environment quality (temperature, air quality, etc.)',
                    'Impact of proposed measures on staff'
                ]} />
            </Section>
            <Section
                title="Energy Proposals Vs Other Competitive Proposals"
                level={3}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Justifying energy efficiency investments over other priorities can be challenging. Organizations often prioritize core or profit-making activities and demand higher rates of return from energy efficiency investments.</p>
            </Section>
            <Section
                title="Investment Appraisal"
                level={3}
                icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Identify how cost savings can be redeployed. Demonstrate benefits to top management, including reduced costs, increased comfort, improved cost-effectiveness, protection of core activities, enhanced service quality, and environmental protection.</p>
            </Section>

        <Section
                title="Criteria"
                level={3}
                icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Investments should complement, not replace, effective energy management practices. Before investing, ensure:</p>
                <List items={[
                    'Optimal performance from existing plant and equipment',
                    'Lowest possible energy tariffs',
                    'Efficient use of best energy forms (fuels or electricity)',
                    'Regular implementation of good housekeeping practices'
                ]} />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Consider these criteria when listing investment opportunities:</p>
                <List items={[
                    'Energy consumption per unit of production',
                    'Current state of repair and energy efficiency of building design, plant, services, and controls',
                    'Indoor environment quality (temperature, air quality, etc.)',
                    'Impact of proposed measures on staff'
                ]} />
            </Section>
            <Section
                title="Energy Proposals Vs Other Competitive Proposals"
                level={3}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Justifying energy efficiency investments over other priorities can be challenging. Organizations often prioritize core or profit-making activities and demand higher rates of return from energy efficiency investments.</p>
            </Section>
            <Section
                title="Investment Appraisal"
                level={3}
                icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Identify how cost savings can be redeployed. Demonstrate benefits to top management, including reduced costs, increased comfort, improved cost-effectiveness, protection of core activities, enhanced service quality, and environmental protection.</p>
            </Section>
        </Section>



        <Section
            title="6.3 Financial Analysis"
            level={2}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Investment in energy efficiency should follow the same financial principles as other investments. Basic criteria include:</p>
            <List items={[
                <b>Simple Payback:</b> + ' Time to recover investment cost. Formula: First Cost / (Yearly Benefits - Yearly Costs)',
                <b>Return on Investment (ROI) and Internal Rate of Return (IRR):</b> + ' Compare with other investment options.',
                <b>Net Present Value (NPV) and Cash Flow:</b>+ ' Facilitate financial planning.'
            ]} />
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Initially, simple payback may suffice, but as investments increase, more sophisticated methods like Discounted Cash Flow, IRR, and NPV should be used.</p>
            <Section
                title="Protecting Energy Investment"
                level={3}
                icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Maintenance is crucial for protecting energy investments.  It is needed for cost-effective improvements and to realize savings from installed measures.</p>
            </Section>
                        <Section
                title="Protecting Energy Investment"
                level={3}
                icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Maintenance is crucial for protecting energy investments.  It is needed for cost-effective improvements and to realize savings from installed measures.</p>
            </Section>
        </Section>


        <Section
            title="6.4 Financial Analysis Techniques"
            level={2}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
            <Section
                title="6.4.1 Simple Pay Back Period:"
                level={3}
                icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The simple payback period (SPP) is the time (in years) needed to recover the initial investment based on the net annual savings.
                Formula:  SPP = First Cost / (Annual Benefits - Annual Costs)</p>
            </Section>
            <Section
                title="Time Value of Money"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Projects involve capital costs and ongoing costs/savings.  The time value of money must be considered as money's value changes over time. Discounting equates cash flows to a common basis. Future Value (FV) = NPV(1+i)<sup>n</sup> OR Net Present Value (NPV) = FV / (1+i)<sup>n</sup> where FV is the Future Value, NPV is Net Present Value, 'i' is the Interest or discount rate, and 'n' is Number of Years.</p>
            </Section>
            <Section
                title="6.4.2 Return on Investment (ROI)"
                level={3}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">ROI is the annual return from the project as a percentage of capital cost: ROI = (Annual Net Cash Flow / Capital Cost) * 100. ROI should exceed the cost of money (interest rate).</p>
            </Section>
            <Section
                title="6.4.3 Net Present Value (NPV)"
                level={3}
                icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">NPV is the sum of the present values of all cash flows.
                Formula: NPV = ∑<sub>t=0</sub><sup>n</sup> [CF<sub>t</sub> / (1+k)<sup>t</sup>]
                where CF<sub>t</sub> is the cash flow at the end of year 't', 'n' is the project life, and 'k' is the discount rate.</p>
            </Section>
            <Section
                title="6.4.4 Internal Rate of Return (IRR)"
                level={3}
                icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">IRR is the discount rate that makes NPV zero.  It is calculated by trial and error.
                Formula: 0 = ∑<sub>t=0</sub><sup>n</sup> [CF<sub>t</sub> / (1+k)<sup>t</sup>]</p>
            </Section>
            <Section
                title="Cash Flows"
                level={3}
                icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cash flows include initial investment, savings, capital costs, annual cash flows (taxes, insurance, leases, energy costs, etc.), intermittent cash flows (e.g., boiler relining).</p>
            </Section>
        <Section
                title="6.4.1 Simple Pay Back Period:"
                level={3}
                icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The simple payback period (SPP) is the time (in years) needed to recover the initial investment based on the net annual savings.
                Formula:  SPP = First Cost / (Annual Benefits - Annual Costs)</p>
            </Section>
            <Section
                title="Time Value of Money"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Projects involve capital costs and ongoing costs/savings.  The time value of money must be considered as money's value changes over time. Discounting equates cash flows to a common basis. Future Value (FV) = NPV(1+i)<sup>n</sup> OR Net Present Value (NPV) = FV / (1+i)<sup>n</sup> where FV is the Future Value, NPV is Net Present Value, 'i' is the Interest or discount rate, and 'n' is Number of Years.</p>
            </Section>
            <Section
                title="6.4.2 Return on Investment (ROI)"
                level={3}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">ROI is the annual return from the project as a percentage of capital cost: ROI = (Annual Net Cash Flow / Capital Cost) * 100. ROI should exceed the cost of money (interest rate).</p>
            </Section>
            <Section
                title="6.4.3 Net Present Value (NPV)"
                level={3}
                icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">NPV is the sum of the present values of all cash flows.
                Formula: NPV = ∑<sub>t=0</sub><sup>n</sup> [CF<sub>t</sub> / (1+k)<sup>t</sup>]
                where CF<sub>t</sub> is the cash flow at the end of year 't', 'n' is the project life, and 'k' is the discount rate.</p>
            </Section>
            <Section
                title="6.4.4 Internal Rate of Return (IRR)"
                level={3}
                icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">IRR is the discount rate that makes NPV zero.  It is calculated by trial and error.
                Formula: 0 = ∑<sub>t=0</sub><sup>n</sup> [CF<sub>t</sub> / (1+k)<sup>t</sup>]</p>
            </Section>
            <Section
                title="Cash Flows"
                level={3}
                icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cash flows include initial investment, savings, capital costs, annual cash flows (taxes, insurance, leases, energy costs, etc.), intermittent cash flows (e.g., boiler relining).</p>
            </Section>
        </Section>


        <Section
            title="6.5 Sensitivity and Risk Analysis"
            level={2}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Cash flows are based on assumptions, some of which are uncertain. Sensitivity analysis assesses risk by examining how project feasibility changes with changes in input parameters.</p>
        </Section>

        <Section
            title="6.6 Financing Options"
            level={2}
            icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
            <List items={[
                'Central budget',
                'Departmental budget',
                'Bank loan',
                'Stock market',
                'Energy Service Company (ESCO)',
                'Retained savings'
            ]} />

            <Section
                title="Self-Financing Energy Management"
                level={3}
                icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Splitting savings to provide returns to stakeholders incentivizes energy management and ensures its continuity.</p>
            </Section>
            <Section
                title="Energy Performance Contracting and Role of ESCOS"
                level={3}
                icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">ESCOs provide complete energy project services, including financing, and are repaid from energy savings.  They assume technology and management risks. Performance contracting minimizes upfront costs for the end-user.</p>
            </Section>
        <Section
                title="Self-Financing Energy Management"
                level={3}
                icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Splitting savings to provide returns to stakeholders incentivizes energy management and ensures its continuity.</p>
            </Section>
            <Section
                title="Energy Performance Contracting and Role of ESCOS"
                level={3}
                icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">ESCOs provide complete energy project services, including financing, and are repaid from energy savings.  They assume technology and management risks. Performance contracting minimizes upfront costs for the end-user.</p>
            </Section>
        </Section>

    </Section>
    </div>
);
};

export default FinancialManagementChapter;
