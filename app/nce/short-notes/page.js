// app/nce/short-notes/page.js
'use client';
import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Star } from 'lucide-react';

export default function ShortNotesPage() {
  const sampleNotes = [
    {
      title: "Counseling Theories Overview",
      content: "Quick reference guide to major counseling theories including CBT, Person-Centered, and Psychodynamic approaches...",
      tags: ["theories", "fundamental"]
    },
    {
      title: "Assessment Techniques",
      content: "Key points on various assessment methods and their applications in counseling practice...",
      tags: ["assessment", "practical"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NCE Short Notes</h1>
          <p className="text-gray-600">Quick reference materials for rapid revision</p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-8">
          <div className="inline-block p-2 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-4">
            Coming Soon
          </div>
        </div>

        {/* Sample Notes */}
        <div className="space-y-6 mb-8">
          {sampleNotes.map((note, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{note.content}</p>
                  <div className="flex gap-2">
                    {note.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Star className="w-6 h-6 mx-auto mb-3 text-yellow-500" />
            <h3 className="font-medium mb-2">Important Concepts</h3>
            <p className="text-sm text-gray-600">Key points highlighted for quick revision</p>
          </Card>
          <Card className="p-6 text-center">
            <FileText className="w-6 h-6 mx-auto mb-3 text-blue-500" />
            <h3 className="font-medium mb-2">Structured Format</h3>
            <p className="text-sm text-gray-600">Clear and concise note organization</p>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-6 h-6 mx-auto mb-3 text-green-500" />
            <h3 className="font-medium mb-2">Quick Access</h3>
            <p className="text-sm text-gray-600">Easy navigation between topics</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
