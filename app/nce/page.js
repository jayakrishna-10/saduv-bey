'use client';
// app/nce/page.js
import Link from 'next/link';
import { 
  Book, 
  FileText, 
  ListChecks, 
  PenTool,
  BookOpen, 
  Library, 
  GraduationCap,
  Zap,
  Settings,
  Lightbulb
} from 'lucide-react';

function NavCard({ icon: Icon, title, description, href, badge }) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { href } : {};
  return (
    <CardWrapper {...cardProps} className="block transition-transform hover:scale-105">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 transition-shadow hover:shadow-xl relative">
        {badge && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

function PaperCard({ paperNumber, title, description, topics = [], available = true }) {
  const iconMapping = {
    1: Settings,
    2: Zap,
    3: Lightbulb
  };
  const Icon = iconMapping[paperNumber] || Book;

  return (
    <div className={`bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-6 transition-shadow hover:shadow-xl ${!available ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Paper {paperNumber}</h3>
          <h4 className="text-md font-medium text-gray-700 mb-2">{title}</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      {topics.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Key Topics:</h5>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      {!available && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full">
            Questions Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}

export default function NCEHomePage() {
  const papers = [
    {
      number: 1,
      title: "General Aspects of Energy Management and Energy Audit",
      description: "Fundamental concepts, energy scenarios, material & energy balance, financial management, and environmental concerns",
      topics: ["Energy Scenario", "Energy Audit", "Financial Management", "Project Management", "Environmental Concerns"],
      available: true
    },
    {
      number: 2,
      title: "Energy Efficiency in Thermal Utilities",
      description: "Comprehensive coverage of thermal energy systems including boilers, furnaces, steam systems, and waste heat recovery",
      topics: ["Fuels & Combustion", "Boilers", "Steam Systems", "Furnaces", "Cogeneration", "Waste Heat Recovery"],
      available: true
    },
    {
      number: 3,
      title: "Energy Efficiency in Electrical Utilities",
      description: "Detailed study of electrical energy systems covering motors, HVAC, lighting, and power management",
      topics: ["Electric Motors", "HVAC Systems", "Lighting", "Power Factor", "Compressed Air", "Pumping Systems"],
      available: true
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="flex min-h-screen flex-col items-center justify-center py-16">
          <div className="max-w-4xl text-center mb-16 pt-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-blue-500 font-medium">Certification Prep</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tighter text-gray-800 md:text-6xl lg:text-7xl mb-6">
              National Certification Examination
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              For Energy Managers and Energy Auditors
            </p>
            
            {/* Papers Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Exam Papers</h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.number}
                    paperNumber={paper.number}
                    title={paper.title}
                    description={paper.description}
                    topics={paper.topics}
                    available={paper.available}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Cards */}
          <div className="w-full max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Study Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <NavCard
                icon={Book}
                title="Syllabus"
                description="Complete exam curriculum and topic breakdown"
              />
              <NavCard
                icon={ListChecks}
                title="Quiz"
                description="Practice questions for all three papers"
                href="/nce/quiz"
                badge="Updated"
              />
              <NavCard
                icon={PenTool}
                title="Test"
                description="Full-length mock exams with detailed solutions"
              />
              <NavCard
                icon={FileText}
                title="Short Notes"
                description="Concise study materials for quick reference"
                href="/nce/notes"
              />
              <NavCard
                icon={BookOpen}
                title="Glossary"
                description="Key terms and definitions for energy management"
              />
              <NavCard
                icon={Library}
                title="Resources"
                description="Additional study materials and references"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed left-0 top-0 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />
      <div className="fixed bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
    </div>
  );
}
