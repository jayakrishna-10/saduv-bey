// app/nce/flashcards/page.js
'use client';
import { useState } from 'react';
import NavBar from '../../components/NavBar';
// Replace @/components/ui/button with relative import
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function FlashcardsPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const sampleFlashcard = {
    front: "What is the primary goal of counseling according to the NCE guidelines?",
    back: "The primary goal of counseling is to help individuals achieve their optimal level of psychosocial functioning through resolving emotional, social, and mental health issues."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NCE Flashcards</h1>
          <p className="text-gray-600">Review key concepts and definitions with interactive flashcards</p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-8">
          <div className="inline-block p-2 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-4">
            Coming Soon
          </div>
        </div>

        {/* Sample Flashcard */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sample Flashcard</h2>
          <div 
            className={`relative w-full h-64 cursor-pointer transition-transform duration-700 perspective-1000 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <Card className={`absolute inset-0 backface-hidden p-6 flex items-center justify-center text-center ${
              isFlipped ? 'rotate-y-180 invisible' : ''
            }`}>
              <p className="text-lg">{sampleFlashcard.front}</p>
            </Card>
            <Card className={`absolute inset-0 backface-hidden p-6 flex items-center justify-center text-center bg-blue-50 ${
              !isFlipped ? 'rotate-y-180 invisible' : ''
            }`}>
              <p className="text-lg">{sampleFlashcard.back}</p>
            </Card>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-medium mb-2">Topic-based Organization</h3>
            <p className="text-gray-600">Flashcards organized by NCE exam topics</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-medium mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Track your review progress</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
