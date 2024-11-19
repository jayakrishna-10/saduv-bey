// File: app/nce/notes/chapters/b1c7.js
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


const ProjectManagementChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <Section 
        title="7. PROJECT MANAGEMENT" 
        level={1}
        icon={<Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
    >
        <Section 
        title="Syllabus" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Definition and scope of project, Technical design, Financing, Contracting, Implementation and performance monitoring. Implementation plan for top management, Planning Budget, Procurement Procedures, Construction, Measurement &amp; Verification.
        </p>
        </Section>

        <Section 
        title="7.1 Introduction" 
        level={2}
        icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Project management involves planning and coordinating a project from start to finish, meeting requirements, and ensuring timely completion within budget and quality standards. It's used for focused, non-repetitive, time-limited activities with some risk, going beyond regular operational activities.
        </p>
        </Section>

        <Section 
        title="7.2 Steps in Project Management" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ol className="list-decimal space-y-2 sm:space-y-3 my-3 sm:my-4 pl-6">
            <li className="text-sm sm:text-base text-gray-700">Project Definition and Scope</li>
            <li className="text-sm sm:text-base text-gray-700">Technical Design</li>
            <li className="text-sm sm:text-base text-gray-700">Financing</li>
            <li className="text-sm sm:text-base text-gray-700">Contracting</li>
            <li className="text-sm sm:text-base text-gray-700">Implementation</li>
            <li className="text-sm sm:text-base text-gray-700">Performance Monitoring</li>
        </ol>
        </Section>


        <Section 
        title="7.2.1 Project Definition and Scope" 
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            A project is a temporary, unique endeavor with a defined start and end, aiming to create a specific product or service. It involves constraints and risks related to cost, schedule, and performance.  It's distinct from ongoing business operations.
        </p>
        </Section>
        <Section
            title="Four Basic Elements of Project Management"
            level={3}
            icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">A successful Project Manager must manage these four elements simultaneously:</p>
        <List items={[
            'Resources (labor, equipment, materials)',
            'Time and Schedule',
            'Costs (estimated, actual, contingency)',
            'Scope'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">These elements are interconnected and must be managed together for project success.</p>
        </Section>

        <Section 
            title="Managing Resources"
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Effective resource management involves having the right people with the right skills and tools, in the right quantity at the right time.  It also extends to managing equipment and materials assigned to the project.</p>
        </Section>
        <Section 
            title="Managing Time and Schedule"
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}

        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Time management is crucial. Poor schedule management often leads to budget overruns. Project software can assist in managing the project timeline by breaking down tasks, durations, resource needs, and their sequence.</p>
        </Section>
        <Section 
            title="Managing Costs"
            level={3}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}

        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Project Managers are often evaluated on their ability to stay within budget.  Managing costs involves tracking estimated costs, actual costs, and cost variability. Contingency costs account for external factors like weather, supplier issues, and design changes.</p>

        </Section>
        <Section 
            title="How the 80/20 Rule can help a project manager"
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The 80/20 rule suggests that 20% of the work (the first and last 10%) consumes 80% of the time and resources. Successful Project Managers focus on these critical periods.</p>
        </Section>

        <Section 
            title="Project Management Life Cycle"
            level={3}
            icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ol className="list-decimal space-y-2 sm:space-y-3 my-3 sm:my-4 pl-6">
            <li className="text-sm sm:text-base text-gray-700">Need identification</li>
            <li className="text-sm sm:text-base text-gray-700">Initiation</li>
            <li className="text-sm sm:text-base text-gray-700">Planning</li>
            <li className="text-sm sm:text-base text-gray-700">Executing</li>
            <li className="text-sm sm:text-base text-gray-700">Controlling</li>
            <li className="text-sm sm:text-base text-gray-700">Closing out</li>
        </ol>
        </Section>
        <Section 
            title="a) Need Identification"
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Projects originate from internal needs (identified by energy managers or audits) or external sources (energy audits by external companies). Project opportunities are ranked based on cost-effectiveness (IRR, NPV, payback), savings sustainability, measurement ease, technology availability, and other benefits.</p>

        </Section>
        <Section 
            title="b) Initiation"
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This crucial starting point involves getting agreement from all stakeholders (deliverers, users, and those with a stake) on the project's initiation.  Complete and accurate information, management support, and proper authorization are essential for the project team's success.</p>
        </Section>


        <Section 
            title="c) Planning"
            level={3}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The most important phase. Defines activities, products, and execution methods. Each major task is defined, with estimated time, resources, and cost. This creates a framework for review and control. The project plan is the outcome, a comprehensive document that guides the project team.</p>
        </Section>


        <Section 
            title="d) Executing"
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The project team utilizes resources to carry out the project plan. The focus shifts from planning to execution, observation, and analysis of the work. This phase integrates all project management disciplines to achieve project deliverables and objectives.</p>
        </Section>


        <Section 
            title="e) Controlling"
            level={3}
            icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}

        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This phase involves comparing actual performance with the plan, taking corrective action if needed. Regular monitoring, identifying variances, and taking corrective actions ensure project objectives are met.</p>
        </Section>


        <Section 
            title="f) Closing out"
            level={3}
            icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Occurs after objectives are met and deliverables are accepted. This phase allows for capturing lessons learned and information for future projects. It comprises contract closeout and administrative closure.</p>
        </Section>

        <Section
            title="Four Basic Elements of Project Management"
            level={3}
            icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">A successful Project Manager must manage these four elements simultaneously:</p>
        <List items={[
            'Resources (labor, equipment, materials)',
            'Time and Schedule',
            'Costs (estimated, actual, contingency)',
            'Scope'
        ]} />
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">These elements are interconnected and must be managed together for project success.</p>
        </Section>

        <Section 
            title="Managing Resources"
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Effective resource management involves having the right people with the right skills and tools, in the right quantity at the right time.  It also extends to managing equipment and materials assigned to the project.</p>
        </Section>
        <Section 
            title="Managing Time and Schedule"
            level={3}
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Time management is crucial. Poor schedule management often leads to budget overruns. Project software can assist in managing the project timeline by breaking down tasks, durations, resource needs, and their sequence.</p>
        </Section>
        <Section 
            title="Managing Costs"
            level={3}
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Project Managers are often evaluated on their ability to stay within budget.  Managing costs involves tracking estimated costs, actual costs, and cost variability. Contingency costs account for external factors like weather, supplier issues, and design changes.</p>
        </Section>

        <Section 
            title="How the 80/20 Rule can help a project manager"
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The 80/20 rule suggests that 20% of the work (the first and last 10%) consumes 80% of the time and resources. Successful Project Managers focus on these critical periods.</p>
        </Section>

        <Section 
            title="Project Management Life Cycle"
            level={3}
            icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <ol className="list-decimal space-y-2 sm:space-y-3 my-3 sm:my-4 pl-6">
            <li className="text-sm sm:text-base text-gray-700">Need identification</li>
            <li className="text-sm sm:text-base text-gray-700">Initiation</li>
            <li className="text-sm sm:text-base text-gray-700">Planning</li>
            <li className="text-sm sm:text-base text-gray-700">Executing</li>
            <li className="text-sm sm:text-base text-gray-700">Controlling</li>
            <li className="text-sm sm:text-base text-gray-700">Closing out</li>
        </ol>
        </Section>
        <Section 
            title="a) Need Identification"
            level={3}
            icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Projects originate from internal needs (identified by energy managers or audits) or external sources (energy audits by external companies). Project opportunities are ranked based on cost-effectiveness (IRR, NPV, payback), savings sustainability, measurement ease, technology availability, and other benefits.</p>
        </Section>

        <Section 
            title="b) Initiation"
            level={3}
            icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This crucial starting point involves getting agreement from all stakeholders (deliverers, users, and those with a stake) on the project's initiation.  Complete and accurate information, management support, and proper authorization are essential for the project team's success.</p>
        </Section>

        <Section 
            title="c) Planning"
            level={3}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The most important phase. Defines activities, products, and execution methods. Each major task is defined, with estimated time, resources, and cost. This creates a framework for review and control. The project plan is the outcome, a comprehensive document that guides the project team.</p>
        </Section>

        <Section 
            title="d) Executing"
            level={3}
            icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">The project team utilizes resources to carry out the project plan. The focus shifts from planning to execution, observation, and analysis of the work. This phase integrates all project management disciplines to achieve project deliverables and objectives.</p>
        </Section>

        <Section 
            title="e) Controlling"
            level={3}
            icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">This phase involves comparing actual performance with the plan, taking corrective action if needed. Regular monitoring, identifying variances, and taking corrective actions ensure project objectives are met.</p>
        </Section>

        <Section 
            title="f) Closing out"
            level={3}
            icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Occurs after objectives are met and deliverables are accepted. This phase allows for capturing lessons learned and information for future projects. It comprises contract closeout and administrative closure.</p>
        </Section>
     
        <Section 
        title="7.2.2 Technical Design" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            A project requires a sound technical feasibility study covering proposed technologies, process modifications, equipment, supply chain, viability, technical complexities, preliminary designs, and an organizational/management plan.
        </p>
        </Section>

        <Section 
        title="7.2.3 Financing" 
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Projects compete for capital. Energy efficiency is a key consideration in all projects.  Funding can be internal (cash reserves, revenue budget, new capital) or external (bank loans, leasing, payment by savings, energy service contracts, private finance initiatives). The project submission's quality is crucial for securing funding.
        </p>
        </Section>

        <Section 
        title="7.2.4 Contracting" 
        level={2}
        icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Proper contract management is critical. This involves ensuring contractor competence, enforcing discipline, imposing penalties/offering incentives, providing support to contractors, and retaining the flexibility to reassign contracts if needed.
        </p>

        <Section 
            title="Types of Contracts"
            level={3}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Traditional Contract:</strong> Contractor provides everything based on specifications at cost-plus or fixed price.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Extended Technical Guarantee/Service:</strong> Extended guarantees and service agreements.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Extended Financing Terms:</strong> Extended lease or financing options linked to savings.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Guaranteed Saving Performance Contract:</strong> Savings are guaranteed, and payments are linked to achieved savings.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Shared Savings Performance Contract:</strong> Contractor provides financing and is paid a portion of achieved savings.</li>
        </ul>
        </Section>

        <Section 
            title="Types of Contracts"
            level={3}
            icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
        <ul className="space-y-2 sm:space-y-3 my-3 sm:my-4">
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Traditional Contract:</strong> Contractor provides everything based on specifications at cost-plus or fixed price.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Extended Technical Guarantee/Service:</strong> Extended guarantees and service agreements.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Extended Financing Terms:</strong> Extended lease or financing options linked to savings.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Guaranteed Saving Performance Contract:</strong> Savings are guaranteed, and payments are linked to achieved savings.</li>
            <li className="text-sm sm:text-base text-gray-700"><strong className="font-semibold">Shared Savings Performance Contract:</strong> Contractor provides financing and is paid a portion of achieved savings.</li>
        </ul>
        </Section>
        </Section>

        <Section 
        title="7.2.5 Implementation" 
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Key challenges during implementation include poor progress monitoring, inadequate risk management, and poor cost management.
        </p>
        </Section>
        <Section 
        title="7.2.6 Performance Monitoring" 
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Post-project performance reviews compare actual with projected performance. This provides valuable feedback for future projects, suggesting corrective actions and uncovering biases. Performance Indicators (PIs) help communicate project benefits and measure energy performance.
        </p>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Savings are calculated by comparing adjusted baseline energy use with post-installation energy use:
        </p>
        <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">
            Savings = (Baseline Energy Use)<sub>adjusted</sub> - Post-Installation Energy Use
        </p>
        </Section>

        <Section
        title="Implementation Plan for Top Management"
        level={2}
        icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Top management needs to be involved in approving projects with significant investments.  Projects are ranked based on technical feasibility and financial analysis.
        </p>
        </Section>

        <Section
        title="Planning Budget"
        level={2}
        icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Budgets depend on project duration and size.  Resources should be allocated judiciously for long-duration projects.
        </p>
        </Section>

        <Section
        title="Procurement Procedures"
        level={2}
        icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Involves identifying vendors, providing specifications, obtaining quotations, and negotiating with selected vendors. Tendering might be used for high-value items. A purchase manager on the team can streamline procurement.
        </p>
        </Section>

        <Section
        title="Construction"
        level={2}
        icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Careful planning is required to minimize production disruptions.  Energy and project managers should supervise construction to ensure quality and safety.
        </p>
        </Section>

        <Section
        title="Measurement &amp; Verification (M&amp;V)"
        level={2}
        icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
        >
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        Savings are determined by comparing pre- and post-installation energy use. The baseline is the "before" case, and the performance period is the "after" case.  Adjustments are made for factors not related to the conservation measures (capacity utilization, raw material quality, etc.).
        </p>
        </Section>

        <Section
        title="Project Planning Techniques"
        level={2}
        icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
        >
            <Section
                title="Gantt Chart"
                level={3}
                icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Uses bars to represent tasks, with lengths indicating durations.  Simple but doesn't show task dependencies well.</p>
            </Section>

            <Section
                title="CPM - Critical Path Method"
                level={3}
                icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Models activities and events as a network.  Identifies the critical path (longest path), which determines the minimum project duration.  Doesn't account for time variations.</p>
            </Section>

            <Section
                title="PERT - Program Evaluation and Review Technique"
                level={3}
                icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
            >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Similar to CPM, but incorporates randomness in activity completion times. Uses three time estimates (optimistic, most likely, pessimistic) to calculate expected time:</p>
                <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Expected time = (OT + 4 × MT + PT) / 6</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">where OT is Optimistic Time, MT is Most Likely Time, and PT is Pessimistic Time.</p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Variance for each activity is calculated as:</p>
                <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed">Variance = [(PT - OT) / 6]<sup>2</sup></p>
            </Section>
        </Section>
    </Section>
    </div>
);
};

export default ProjectManagementChapter;
