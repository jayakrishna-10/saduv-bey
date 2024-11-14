'use client';
import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';

function FlashcardContent() {
  const [isFlipped, setIsFlipped] = useState(false);

  const sampleFlashcard = {
    front: "What is the primary goal of counseling according to the NCE guidelines?",
    back: "The primary goal of counseling is to help individuals achieve their optimal level of psychosocial functioning through resolving emotional, social, and mental health issues."
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">NCE Flashcards</h1>
        <p className="text-gray-600">Review key concepts and definitions with interactive flashcards</p>
      </div>

      <div className="text-center py-8">
        <div className="inline-block p-2 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-4">
          Coming Soon
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sample Flashcard</h2>
        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="text-center">
            <p className="text-lg">
              {isFlipped ? sampleFlashcard.back : sampleFlashcard.front}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-medium mb-2">Topic-based Organization</h3>
          <p className="text-gray-600">Flashcards organized by NCE exam topics</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-medium mb-2">Progress Tracking</h3>
          <p className="text-gray-600">Track your review progress</p>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return <FlashcardContent />;
}
