'use client';
// app/nce/page.js
import Link from 'next/link';
import { 
  Book, 
  FileText, 
  ListChecks, 
  PenTool, // Changed from NotebookPen to PenTool
  BookOpen, 
  Library, 
  GraduationCap 
} from 'lucide-react';

function NavCard({ icon: Icon, title, description, href }) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { href } : {};

  return (
    <CardWrapper {...cardProps}>
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer group">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

export default function NCEHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/api/placeholder/1200/400")',
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-blue-400 font-medium">Certification Prep</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              National Certification Examination for Energy Managers and Energy Auditors
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Comprehensive preparation resources to help you succeed in your certification journey
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            icon={PenTool} // Changed icon here
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
  );
}
