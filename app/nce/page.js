// app/components/NCEHomepage.js
import Link from 'next/link';
import NavBar from './NavBar';
import { Card } from '@/components/ui/card';
import { Book, Brain, Cards, FileText, PenTool } from 'lucide-react';

export default function NCEHomepage() {
  const sections = [
    {
      title: "Practice Quiz",
      description: "Test your knowledge with our comprehensive question bank",
      icon: <Brain className="w-6 h-6" />,
      href: "/nce/quiz",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Flashcards",
      description: "Review key concepts with interactive flashcards",
      icon: <Cards className="w-6 h-6" />,
      href: "/nce/flashcards",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Study Guides",
      description: "In-depth materials covering all exam topics",
      icon: <Book className="w-6 h-6" />,
      href: "/nce/study-guides",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Short Notes",
      description: "Quick reference materials for rapid revision",
      icon: <FileText className="w-6 h-6" />,
      href: "/nce/short-notes",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              NCE Exam Preparation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive study materials and practice tests to help you succeed in the National Counselor Examination
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Study Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${section.bgColor}`}>
                    <div className={section.color}>{section.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <p className="text-gray-600">{section.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,000+</div>
              <div className="text-gray-600">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">8</div>
              <div className="text-gray-600">Study Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Study Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
