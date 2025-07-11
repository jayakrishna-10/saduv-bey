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


const GlobalEnvironmentChapter = () => {
return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <Section title="9. GLOBAL ENVIRONMENTAL CONCERNS" level={1} icon={<Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}>
            <Section title="9.1 Global Environmental Issues" level={2} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}>
    <p>In 1896, Svante Arrhenius predicted human activities would interfere with the sun's interaction with Earth, leading to global warming and climate change. This prediction has proven true, disrupting global environmental stability.  Several treaties, conventions, and protocols have been established for global environmental protection.  Key global environmental issues include:</p>
    <List items={[
        "Ozone layer depletion",
        "Global warming",
        "Loss of biodiversity"
    ]} />
    <p>A critical characteristic of environmental degradation is its global impact, regardless of country, region, or race. This raises questions about responsibility for combating this degradation.</p>
</Section>

<Section title="9.2 Ozone Layer Depletion" level={2} icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}>
    <p>Earth's atmosphere has three regions: troposphere, stratosphere, and mesosphere.  The stratosphere (10-50 km from Earth's surface) contains ozone (O<sub>3</sub>), which filters harmful solar ultraviolet B (UV-B) rays.  Ozone production and destruction occur naturally, maintaining a balanced equilibrium until recently.</p>
    <Section title="9.2.1 Ozone Depletion Process" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}>
        <p>Man-made chlorine and bromine compounds (found in refrigerants and air conditioners) break down ozone.  The process starts with the emission of ozone-depleting substances (ODS), like chlorofluorocarbons (CFCs). Winds distribute ODS in the troposphere.  These substances are stable, don't dissolve in rain, and have long lifespans. They eventually reach the stratosphere by diffusion, where strong UV light breaks them down.  CFCs, HCFCs, carbon tetrachloride, and methyl chloroform release chlorine atoms, while halons and methyl bromide release bromine atoms. These chlorine and bromine atoms destroy ozone.  A single chlorine atom can destroy 10,000 to 100,000 ozone molecules.</p>
        <p><b>Chemistry of Ozone Depletion:</b></p>
        <List items={[
            "UV radiation breaks a carbon-chlorine bond in CFC (CFCl₃), releasing a chlorine (Cl) atom.",
            "The Cl atom reacts with ozone (O₃), breaking it into an oxygen molecule (O₂) and chlorine monoxide (ClO).",
            "A free oxygen atom (released from UV breaking down O₂) then breaks the ClO, releasing the Cl atom to repeat the ozone destruction process."
        ]} />
        <p>CFC: chlorofluorocarbon (contains chlorine, fluorine, and carbon atoms)</p>
        <p><b>Chemical Equations:</b></p>
        <pre>
CFCl<sub>3</sub> + UV Light ==&gt; CFCl<sub>2</sub> + Cl
Cl + O<sub>3</sub> ==&gt; ClO + O<sub>2</sub>
ClO + O ==&gt; Cl + O<sub>2</sub>
        </pre>
        <p>This cycle repeats thousands of times.</p>
        <p>Ozone layer thickness is measured in Dobson units using a Dobson ozone spectrophotometer, which measures ultraviolet radiation reaching the ground. Higher Dobson units indicate a thicker ozone layer. ODS have disrupted the natural ozone equilibrium since the 1970s. Developed countries plan to phase out ODS by 2005, developing countries by 2015.</p>
    </Section>
    <Section title="9.2.2 Effects of Ozone Layer Depletion" level={3} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}>
        <List items={[
            "<b>Human and Animal Health:</b> Increased UV-B radiation can cause eye diseases, skin cancer, and infectious diseases.",
            "<b>Terrestrial Plants:</b> Increased radiation can alter species composition and biodiversity in forests and grasslands, impacting plant form and secondary metabolism.",
            "<b>Aquatic Ecosystems:</b>  High radiation in tropics and subtropics affects phytoplankton distribution (base of aquatic food webs), damages early development stages of marine life (reducing reproductive capacity and impairing larval development).",
            "<b>Bio-geo-chemical Cycles:</b>  Increased UV radiation affects terrestrial and aquatic bio-geo-chemical cycles, changing sources and sinks of greenhouse gases (CO<sub>2</sub>, CO, COS), contributing to atmospheric buildup.",
            "<b>Air Quality:</b> Reduced stratospheric ozone and increased UV-B lead to higher photo dissociation rates of trace gases, increasing production and destruction of ozone and related oxidants (e.g., hydrogen peroxide), with adverse effects on human health, plants, and materials."
        ]} />
        <p>The ozone layer filters harmful solar radiation.  Its depletion increases harmful radiation reaching Earth, with dangerous consequences.</p>
    </Section>
    <Section title="9.2.3 Ozone Depletion Counter Measures" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}>
        <List items={[
            "International cooperation through the Montreal Protocol (1974) aims to phase out ozone-depleting chemicals.",
            "Taxes on ozone-depleting substances.",
            "Ozone-friendly substitutes like HCFCs (with less ozone-depleting potential and shorter lifespans).",
            "Recycling of CFCs and halons."
        ]} />
    </Section>
</Section>


<Section title="9.3 Global Warming" level={2} icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}>
    <p>Before the Industrial Revolution, climate change was natural. Post-industrialization, fossil fuel combustion, agriculture, and deforestation have altered atmospheric gas composition, significantly changing climate and environment. The Earth's temperature has risen 0.3-0.6°C in the last 100 years, unlike the relatively stable temperatures of the past 8000 years.</p>
    <Section title="9.3.1 Sources of Greenhouse Gases" level={3} icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />}>
        <p>Some greenhouse gases are natural (water vapor, CO<sub>2</sub>, methane, nitrous oxide, ozone), while others are man-made.  Human activities increase the levels of most naturally occurring gases.</p>
        <List items={[
            <>
            <b>CO<sub>2</sub>:</b> Released from burning solid waste, fossil fuels (oil, natural gas, coal), wood, and wood products.
            </>,
            <>
            <b>Methane (CH<sub>4</sub>):</b> Emitted from coal, natural gas, and oil production and transport; decomposition of organic waste in landfills; livestock.</>,
            <>
            <b>Nitrous Oxide (N<sub>2</sub>O):</b> Emitted from agricultural and industrial activities, and burning solid waste and fossil fuels.</>,
            <>
            <b>Powerful man-made greenhouse gases:</b> hydrofluorocarbons (HFCs), perfluorocarbons (PFCs), sulfur hexafluoride (SF<sub>6</sub>) - from industrial processes.</>
        ]} />
        <p>Greenhouse gas emissions are often measured in millions of metric tons of carbon equivalents (MMTCE), weighting each gas by its Global Warming Potential (GWP).</p>
    </Section>
    <Section title="9.3.2 Global Warming Potentials" level={3} icon={<Battery className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700" />}>
        <p>Global Warming Potential (GWP) measures a greenhouse gas's influence on the greenhouse effect.  It considers the gas's heat-trapping ability and atmospheric lifespan.  HFCs and PFCs absorb the most heat. Methane traps 21 times more heat per molecule than CO<sub>2</sub> (GWP = 21), while nitrous oxide traps 270 times more (GWP = 270). CO<sub>2</sub>'s GWP is 1. Despite lower concentrations, CO<sub>2</sub> is the most important greenhouse gas, contributing ~60% to the enhanced greenhouse effect.</p>
    </Section>
    <Section title="9.3.3 Global Warming (Climate Change) Implications" level={3} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />}>
        <List items={[
            "<b>Rise in global temperature:</b> Global temperatures have risen ~0.6°C over the 20th century due to human activities. Models predict a 6°C rise by 2100.",
            "<b>Rise in sea level:</b> Projected sea level rise of 9-88 cm by 2100, causing flooding and damage. Faster climate change increases the risk.",
            "<b>Food shortages and hunger:</b> Changing precipitation and evaporation patterns affect agriculture, threatening food security and potentially causing shortages and hunger.",
            "<b>India's heightened risk:</b> Models predict a 2.3-4.8°C temperature increase in India, with higher increases in Northern India. Potential consequences include 7 million displaced people, loss of land and roads, and decreased wheat yields."
        ]} />
    </Section>
</Section>

<Section title="9.4 Loss of Biodiversity" level={2} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}>
    <p>Biodiversity refers to the variety of life on earth (species, genes, and ecosystems).  It enhances ecosystem productivity. Each species plays a vital role in preventing and recovering from disasters.  Human activity is changing biodiversity and causing extinctions. The World Resource Institute reports a link between biodiversity and climate change. Rapid global warming hinders ecosystems' natural adaptation. Deforestation contributes to CO<sub>2</sub> buildup and loss of biodiversity (genes, species, ecosystem services).</p>
    <Section title="Link between Biodiversity and Climate change" level={3} icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />}>
        <List items={[
            "Climate change threatens species already at risk from habitat fragmentation (due to colonization, logging, agriculture, mining).",
            "Species with small ranges, low populations, restricted habitats, and patchy distribution are most threatened and may not adapt.",
            "Ecosystems may shift northward or upward, but limited space may constrain them. A 1°C temperature change correlates with a 100 km latitudinal shift.  Habitat shifts by 2100 could be 140-580 km.",
            "Increased coral reef mortality and erosion. Higher CO<sub>2</sub> levels harm coral building (calcification).",
            "Rising sea levels could engulf low-lying areas, causing island disappearance and species extinction.",
            "Climate change may aid invasive species, outcompeting native wildlife.",
            "Increased risk of droughts and wildfires due to warming and drying vegetation.",
            "Sustained climate change could alter species competition, leading to forest destruction."
        ]} />
    </Section>
</Section>


<Section title="9.5 Climatic Change Problem and Response" level={2} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}>
    <Section title="9.5.1 The United Nations Framework Convention on Climate Change (UNFCCC)" level={3} icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}>
        <p>Signed in 1992 by over 150 nations, the UNFCCC is the basis for international climate change cooperation. It addresses the serious consequences of human activities enhancing the natural greenhouse effect, which can harm human settlements and ecosystems. The goal is stabilizing greenhouse gas concentrations to prevent dangerous interference with the climate system.</p>
        <p>The UNFCCC requires parties to adopt policies and measures to mitigate climate change by limiting anthropogenic greenhouse gas emissions and enhancing greenhouse gas sinks and reservoirs.  It also requires preparing national greenhouse gas inventories. It doesn't set specific targets or timetables for nations. The objective is to stabilize greenhouse gas emissions at 1990 levels by 2000.</p>
        <p>The Conference of Parties (COP) is the UNFCCC's deciding body.  COP meetings review obligations, define objectives, and develop the UNFCCC's implementation. COP 1 was held in Berlin (1995), and COP 10 was in Buenos Aires (2004).</p>
    </Section>
    <Section title="9.5.2 The Kyoto Protocol" level={3} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />}>
        <p>Due to concerns about major nations not meeting voluntary stabilization targets, parties to the UNFCCC entered into negotiations in 1995 to establish legally binding limitations on greenhouse gas emissions for developed countries (Annex A countries), including former Communist countries.</p>
        <p>The Kyoto Protocol (completed December 11, 1997) commits industrialized nations to legally binding reductions in emissions of six greenhouse gases: CO<sub>2</sub>, CH<sub>4</sub>, N<sub>2</sub>O, HFCs, PFCs, and SF<sub>6</sub>.</p>
        <p><b>Emissions Reductions:</b>  The US was obligated to reduce greenhouse gas emissions by 7% below 1990 levels (for CO<sub>2</sub>, CH<sub>4</sub>, N<sub>2</sub>O) and below 1995 levels (for HFCs, PFCs, SF<sub>6</sub>), averaged over 2008-2012.  Developed countries were committed to reducing overall greenhouse gas emissions by at least 5% below 1990 levels during 2008-2012.</p>
        <p><b>Developing Country Responsibilities:</b>  The treaty is ambiguous about developing nations' participation. The 1992 climate treaty stated that while developed nations should take the lead, developing nations also have a role. Developing nations have low per capita CO<sub>2</sub> emissions compared to developed nations.</p>
        <p>Developing countries (including India and China) weren't initially required to commit to reductions due to their lower per capita emissions, less developed economies, and minimal contribution to existing pollution levels, which primarily resulted from the developed world's Industrial Revolution. They will be integrated more actively as new energy technologies emerge and as they industrialize.</p>
    </Section>
    <Section title="Annex I and Annex II Parties" level={3} icon={<Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}>
        <p>Annex I parties have commitments under the Kyoto Protocol (see Table 9.1 in the document). Annex II parties (a subset of Annex I) have a special obligation to provide financial and technological support to developing countries (non-Annex I) for climate change mitigation and technology transfer. Commitments are expressed as a percentage of base year emissions to be achieved during 2008-2012.</p>
        <p>The base year is 1990 for most countries, except economies in transition, which could choose an alternative base year or multi-year period.</p>
    </Section>
    <Section title="Actions required from developed and developing Nations" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}>
        <p>The Kyoto Protocol calls on all parties (developed and developing) to develop national and regional programs to improve "local emission factors," activity data, models, and national greenhouse gas inventories.  They should also formulate, publish, and update climate change mitigation and adaptation measures and cooperate in technology transfer and research.</p>
    </Section>
    <Section title="Who is bound by the Kyoto Protocol?" level={3} icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700" />}>
        <p>The Kyoto Protocol needed ratification by 55 countries responsible for at least 55% of the developed world's 1990 CO<sub>2</sub> emissions to enter into force. Russia's ratification met this requirement, and the Protocol entered into force on February 16, 2005.</p>
    </Section>
    <Section title="9.5.3 India's Greenhouse Gas Emissions" level={3} icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />}>
        <p>India's fossil fuel CO<sub>2</sub> emissions have increased by 5.9% since 1950. India is the 6th largest CO<sub>2</sub> emitter, behind China (2nd).  However, India's per capita CO<sub>2</sub> emissions (0.93 tons/year) are below the world average (3.87 tons/year). India is vulnerable to climate change due to its reliance on climate-sensitive sectors (agriculture, forestry) and its extensive low-lying coastline.</p>
        <p>India's primary CO<sub>2</sub> source is coal burning (energy sector contributes 55% of total emissions).  Agriculture is the next largest contributor (~34%), including emissions from livestock, manure management, rice cultivation, and agricultural residue burning.  Industrial emissions mainly come from cement production.</p>
    </Section>
    <Section title="Indian Response to Climatic Change" level={3} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />}>
        <p>Developing countries like India don't have binding GHG mitigation commitments under the UNFCCC due to their smaller contribution to the greenhouse problem and limited resources. India's Ministry of Environment and Forests handles climate change issues and has established Working Groups on the UNFCCC and Kyoto Protocol.  India ratified the Kyoto Protocol in 2002.</p>
    </Section>
</Section>

<Section title="9.6 The Conference of the Parties (COP)" level={2} icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}>
    <p>The COP is the supreme body of the Climate Change Convention, with most countries as members.  The Convention becomes effective 90 days after ratification. The COP first met in 1995 and meets annually.  Subsidiary bodies advise and support the COP and meet more frequently.</p>
    <p>The COP reviews parties' obligations and institutional arrangements based on the Convention's objectives, implementation experience, and scientific knowledge. It assesses information on policies and emissions shared by parties through national communications, promotes the development of methodologies for quantifying emissions and evaluating measures, assesses parties' efforts to meet treaty commitments, and publishes regular reports on the Convention's implementation. It also oversees resource provision by developed countries to support developing countries in submitting national communications, adapting to climate change, and acquiring environmentally sound technologies.  COP 3 adopted the Kyoto Protocol.</p>
    <Section title="9.6.1 The Flexible Mechanisms" level={3} icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />}>
        <p>The Kyoto Protocol allows Annex I countries to partially meet their commitments through three flexible mechanisms:</p>
        <ol>
            <li><b>Emissions trading:</b> Countries can trade emission allowances with a pre-defined total permitted emission amount. This benefits both buyer and seller, encourages cost-effective reductions, and stimulates environmental technology development. </li>
            <li><b>Joint implementation (JI):</b> Annex I countries can exchange greenhouse gas emission reductions from projects between themselves. Projects must lead to higher-than-usual emissions reductions.</li>
            <li><b>Clean development mechanism (CDM):</b> Annex I countries can finance emission reduction projects in developing countries (non-Annex I) to gain Certified Emission Reductions (CERs). Projects must contribute to sustainable development and achieve greater emission reductions than would have occurred otherwise.</li>
        </ol>
    </Section>
</Section>

<Section title="9.7 Prototype Carbon Fund (PCF)" level={2} icon={<File className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />}>
    <p>The World Bank established the Prototype Carbon Fund (PCF) to invest in projects generating high-quality greenhouse gas emission reductions registerable with the UNFCCC for the Kyoto Protocol. Independent experts monitor validation, verification, and certification procedures. The PCF pilots emission reduction production within the JI and CDM frameworks.  It invests contributions from companies and governments in projects designed to produce emission reductions consistent with the Kyoto Protocol. Participants in the PCF receive a share of verified and certified emission reductions.</p>
</Section>

<Section title="9.8 Sustainable Development" level={2} icon={<Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />}>
    <Section title="9.8.1 What is Sustainable Development?" level={3} icon={<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />}>
        <p>Sustainable development meets present needs without compromising future generations' ability to meet their own needs.  It has three interconnected objectives: economic security and prosperity, social development and advancement, and environmental sustainability. It requires finding ways of living and working that enable a healthy, fulfilling, and economically secure life without damaging the environment or future welfare.</p>
        <p>Sustainable development applied to energy and the environment considers:</p>
        <List items={[
            "<b>Inputs</b> (fuels, energy sources, land, raw materials):  Non-renewable inputs should only be used if substitutable. Renewable inputs should be used within their renewal rate.",
            "<b>Outputs</b> (from production and consumption): Should not overstrain ecosystems or their capacity to absorb waste."
        ]} />
    </Section>
</Section>
        </Section> {/* Closing tag for the main level 1 section */}
    </div>
);
};

export default GlobalEnvironmentChapter;

