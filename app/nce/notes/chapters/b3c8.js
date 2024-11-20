
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


const LightingSystemChapter = () => {
    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <Section 
                title="8. LIGHTING SYSTEM" 
                level={1}
                icon={<Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />}
            >
                <Section 
                    title="Syllabus" 
                    level={2}
                    icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                >
                    <p>Lighting System: Light source, Choice of lighting, Luminance requirements, and Energy conservation avenues</p>
                </Section>

                <Section 
                    title="8.1 Introduction" 
                    level={2}
                    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                >
                    <p>Lighting is crucial in industries, consuming 2-10% of total power. Innovations offer significant energy-saving potential.</p>
                </Section>

                <Section 
                    title="8.2 Basic Terms in Lighting System and Features" 
                    level={2}
                    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
                >
                    <h3>Lamps</h3>
                    <ul>
                        <li><strong>Incandescent lamps:</strong> Produce light by heating a filament. Key parts: filament, bulb, fill gas, cap.</li>
                        <li><strong>Reflector lamps:</strong> Incandescent lamps with an internal mirror for better output and maintenance.</li>
                        <li><strong>Gas discharge lamps:</strong> Light produced by exciting gas in a bulb. Common types:
                            <ul>
                                <li>Fluorescent tube lamps (FTL)</li>
                                <li>Compact Fluorescent Lamps (CFL)</li>
                                <li>Mercury Vapour Lamps</li>
                                <li>Sodium Vapour Lamps</li>
                                <li>Metal Halide Lamps</li>
                            </ul>
                        </li>
                    </ul>
                    <h3>Luminaire</h3>
                    <p>A device that distributes, filters, or transforms light from one or more lamps. Includes parts for fixing and protecting lamps. May also include circuit auxiliaries. Principles used: reflection, absorption, transmission, refraction.</p>
                    <h3>Control Gear</h3>
                    <ul>
                        <li><strong>Ballast:</strong> Limits current in discharge lamps. Aids initial voltage build-up in fluorescent lamps.</li>
                        <li><strong>Ignitors:</strong> Start high-intensity Metal Halide and Sodium vapor lamps.</li>
                    </ul>
                    <h3>Illuminance</h3>
                    <p>Luminous flux incident on a surface element divided by the area of that element. Measured on a specified plane, usually the working plane.</p>
                    <h3>Lux (lx)</h3>
                    <p>Illuminance produced by one lumen uniformly distributed over one square meter. 1 lx = 1 lm/m²</p>
                    <h3>Luminous Efficacy (lm/W)</h3>
                    <p>Ratio of luminous flux emitted by a lamp to the power it consumes. Reflects energy conversion efficiency from electricity to light.</p>
                    <h3>Colour Rendering Index (RI)</h3>
                    <p>Measures how accurately a light source renders colors compared to a reference illuminant.</p>
                    <h3>Lamps</h3>
                    <ul>
                        <li><strong>Incandescent lamps:</strong> Produce light by heating a filament. Key parts: filament, bulb, fill gas, cap.</li>
                        <li><strong>Reflector lamps:</strong> Incandescent lamps with an internal mirror for better output and maintenance.</li>
                        <li><strong>Gas discharge lamps:</strong> Light produced by exciting gas in a bulb. Common types:
                            <ul>
                                <li>Fluorescent tube lamps (FTL)</li>
                                <li>Compact Fluorescent Lamps (CFL)</li>
                                <li>Mercury Vapour Lamps</li>
                                <li>Sodium Vapour Lamps</li>
                                <li>Metal Halide Lamps</li>
                            </ul>
                        </li>
                    </ul>
                    <h3>Luminaire</h3>
                    <p>A device that distributes, filters, or transforms light from one or more lamps. Includes parts for fixing and protecting lamps. May also include circuit auxiliaries. Principles used: reflection, absorption, transmission, refraction.</p>
                    <h3>Control Gear</h3>
                    <ul>
                        <li><strong>Ballast:</strong> Limits current in discharge lamps. Aids initial voltage build-up in fluorescent lamps.</li>
                        <li><strong>Ignitors:</strong> Start high-intensity Metal Halide and Sodium vapor lamps.</li>
                    </ul>
                    <h3>Illuminance</h3>
                    <p>Luminous flux incident on a surface element divided by the area of that element. Measured on a specified plane, usually the working plane.</p>
                    <h3>Lux (lx)</h3>
                    <p>Illuminance produced by one lumen uniformly distributed over one square meter. 1 lx = 1 lm/m²</p>
                    <h3>Luminous Efficacy (lm/W)</h3>
                    <p>Ratio of luminous flux emitted by a lamp to the power it consumes. Reflects energy conversion efficiency from electricity to light.</p>
                    <h3>Colour Rendering Index (RI)</h3>
                    <p>Measures how accurately a light source renders colors compared to a reference illuminant.</p>
                </Section>
<Section 
    title="8.3 Lamp Types and their Features" 
    level={2}
    icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
>
    <p>(Refer to Table 8.1 in the document for a comparison of different lamp types.)</p>
</Section>

<Section 
    title="8.4 Recommended Illuminance Levels for Various Tasks / Activities / Locations" 
    level={2}
    icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
>
    <h3>Recommendations on Illuminance</h3>
    <p><strong>Scale of Illuminance:</strong> Minimum for non-working interiors is 20 lux (IS 3646).  A factor of 1.5 represents a significant difference in subjective effect. Recommended scale: 20-30-50-75–100–150–200-300-500-750–1000–1500–2000 lux.</p>
    <p><strong>Illuminance ranges:</strong> A range is recommended due to varying conditions. The range consists of three values (L-R-H):
    <ul>
        <li>R: Recommended service illuminance</li>
        <li>H: Higher value for demanding visual tasks.</li>
        <li>L: Lower value when high reflectance and contrast are present, and speed/accuracy is less critical.</li>
    </ul>
    </p>
    <p>(Refer to tables in the document for recommended illuminance levels for various sectors.)</p>
</Section>

<Section 
    title="8.5 Methodology of Lighting System Energy Efficiency Study" 
    level={2}
    icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
>
    <ol>
        <li><strong>Inventory:</strong> List all lighting system elements and transformers (or distribution boards), including their ratings, population, and usage profile.</li>
        <li><strong>Lux Measurement:</strong> Measure and document daytime and nighttime lux levels at various locations.</li>
        <li><strong>Power Measurement:</strong> Measure voltage, current, power factor, and power consumption at distribution boards or transformers.</li>
        <li><strong>Comparison:</strong> Compare measured lux values with standards, identify under-lit and over-lit areas.</li>
        <li><strong>Failure Analysis:</strong> Analyze failure rates and lifespan of lamps and ballasts.</li>
        <li><strong>Improvement Options:</strong> Based on the assessment, suggest improvements, including:
            <ul>
                <li>Maximizing daylight use</li>
                <li>Replacing with energy-efficient lamps</li>
                <li>Using energy-efficient ballasts</li>
                <li>Choosing appropriate interior colors</li>
                <li>Optimizing layout for lighting</li>
                <li>Implementing lighting controls (individual/group, occupancy sensors, photocells, timers, etc.)</li>
                <li>Installing voltage regulators</li>
                <li>Using energy-efficient displays</li>
            </ul>
        </li>
    </ol>
</Section>

<Section 
    title="8.6 Case Examples" 
    level={2}
    icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
>
    <p>(Refer to Table 8.4 in the document for energy savings by using high-efficacy lamps and Table 8.5 for potential savings in street lighting.)</p>
</Section>

<Section 
    title="8.7 Some Good Practices in Lighting" 
    level={2}
    icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
>
    <ul>
        <li>Replace conventional fluorescent lamps with energy-efficient tri-phosphor fluorescent lamps.</li>
        <li>Replace incandescent lamps with CFLs.</li>
        <li>Replace mercury/sodium vapor lamps with metal halide lamps for color-critical applications.</li>
        <li>Use HPSV lamps where color rendering is not critical (e.g., street lighting).</li>
        <li>Replace filament panel indicator lamps with LEDs.</li>
        <li>Use efficient luminaires with appropriate light distribution characteristics (mirror-optic, bat-wing).</li>
        <li>Classify luminaires based on height: Low bay (&lt;5m), Medium bay (5-7m), High bay (&gt;7m).</li>
        <li>Optimize system layout and fixing of luminaires.</li>
    </ul>
    <h3>Light Control</h3>
    <ul>
        <li>Simple On/Off switching is the cheapest but least efficient.</li>
        <li>Flexible lighting systems allow switching off or dimming when not needed.</li>
        <li>Control options include grouping, timer controls, microprocessor-based controllers, and daylighting integration.</li>
    </ul>
    <h3>Other Energy Efficiency Measures</h3>
    <ul>
        <li>Use a dedicated transformer for lighting to isolate it from voltage fluctuations.</li>
        <li>If a dedicated transformer is not feasible, use a servo stabilizer for voltage regulation.</li>
        <li>Use high-frequency (HF) electronic ballasts instead of conventional magnetic ballasts for energy savings, reduced heat, improved power factor, and longer lamp life.</li>
    </ul>
    <p>(Refer to Table 8.6 for luminaire, gear, and control types used in different industrial areas.)</p>
</Section>
</Section>
        </div>
    )
}

export default LightingSystemChapter;
