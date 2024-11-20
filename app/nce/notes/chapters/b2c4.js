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
    File,
    RecycleIcon
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

const FurnacesChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="4. FURNACES" 
                level={1}
                icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Furnaces: Classification, General fuel economy measures in furnaces, Excess air, Heat distribution, Temperature control, Draft control, Waste heat recovery.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        A furnace is equipment used to melt metals for casting or heat materials for changing their shape (rolling, forging, etc.) or properties (heat treatment).
                    </p>
                </Section>

                <Section 
                    title="4.1 Types and Classification of Different Furnaces" 
                    level={2}
                    icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
                >
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <div className="flex-1">
                                <strong>Based on heat generation:</strong> Combustion (using fuels like oil, coal, or gas) and electric.
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <div className="flex-1">
                                <strong>Based on material charging:</strong>
                                <ul className="mt-2 space-y-2 ml-6">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                        <span>Intermittent/Batch/Periodical: Material is charged and discharged in batches.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                        <span>Continuous: Material flows continuously through the furnace.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <div className="flex-1">
                                <strong>Based on waste heat recovery:</strong>
                                <ul className="mt-2 space-y-2 ml-6">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                        <span>Recuperative: Heat is recovered from the flue gases and used to preheat combustion air.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                        <span>Regenerative: Heat is stored in a regenerative bed and then used to preheat combustion air or material.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section
                    title="Characteristics of an Efficient Furnace"
                    level={3}
                    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        An efficient furnace should heat the maximum amount of material to a uniform temperature in a given time using the least possible fuel and labor. This involves:
                    </p>
                    <List items={[
                        "Determining the heat required by the material",
                        "Generating sufficient heat to overcome losses",
                        "Efficiently transferring heat from furnace gases to the material",
                        "Ensuring uniform temperature distribution within the material",
                        "Minimizing heat losses from the furnace"
                    ]} />
                </Section>

                <Section
                    title="Furnace Energy Supply"
                    level={3}
                    icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        Fuel choice is important as flue gases contact the stock. Sulphur content, particulate matter from solid fuels are considerations. Most furnaces use liquid fuels, gaseous fuels, or electricity. Electric arc and induction furnaces are common for steel and cast iron melting, while non-ferrous melting often uses oil.
                    </p>
                </Section>

                <Section 
                    title="4.3 General Fuel Economy Measures in Furnaces" 
                    level={2}
                    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <List items={[
                        "Complete combustion with minimum excess air",
                        "Correct heat distribution",
                        "Operating at desired temperature",
                        "Minimizing heat loss from openings",
                        "Maintaining correct furnace draft",
                        "Optimum capacity utilization",
                        "Waste heat recovery from flue gases",
                        "Minimizing refractory losses",
                        "Using ceramic coatings"
                    ]} />
                </Section>

                <Section
                    title="Waste Heat Recovery"
                    level={3}
                    icon={<RecycleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Methods include:</p>
                    <List items={[
                        "Stock preheating",
                        "Combustion air preheating (using recuperators or regenerators)",
                        "Using waste heat for other processes (e.g., steam generation)"
                    ]} />
                </Section>
            </Section>
        </div>
    );
};

export default FurnacesChapter;