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
  GraduationCap 
} from 'lucide-react';

function NavCard({ icon: Icon, title, description, href }) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { href } : {};

  return (
    <CardWrapper {...cardProps} className="block transition-transform hover:scale-105">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 transition-shadow hover:shadow-xl">
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

export default function NCEHomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="flex min-h-screen flex-col items-center justify-center py-16">
          <div className="max-w-3xl text-center mb-16 pt-16">
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
          </div>

          {/* Navigation Cards */}
          <div className="w-full max-w-6xl px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <NavCard
                icon={Book}
                title="Syllabus"
                description="Complete exam curriculum and topic breakdown"
              />
              <NavCard
                icon={ListChecks}
                title="Quiz"
                description="Practice questions for quick concept revision"
                href="/nce/quiz"
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
