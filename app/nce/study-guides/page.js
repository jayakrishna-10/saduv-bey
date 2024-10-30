// app/nce/study-guides/page.js
'use client';
import NavBar from '../../components/NavBar';
import { Book, CheckCircle, Clock } from 'lucide-react';

export default function StudyGuidesPage() {
  const sampleGuides = [
    {
      title: "Human Growth and Development",
      description: "Theories of human development, learning, personality, and behavior",
      duration: "2 hours",
      chapters: 12
    },
    {
      title: "Social and Cultural Diversity",
      description: "Multicultural and pluralistic characteristics within groups",
      duration: "1.5 hours",
      chapters: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NCE Study Guides</h1>
          <p className="text-gray-600">Comprehensive study materials organized by topic</p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-8">
          <div className="inline-block p-2 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-4">
            Coming Soon
          </div>
        </div>

        {/* Sample Study Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sampleGuides.map((guide, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Book className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {guide.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {guide.chapters} chapters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
