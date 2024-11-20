// app/components/ChapterLoader.js
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Book, Clock, AlertCircle } from 'lucide-react';
import { getBookBySlug, getChapterBySlug } from '@/config/chapters';

export function ChapterLoader({ bookSlug, chapterSlug }) {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const book = getBookBySlug(bookSlug);
  const chapter = getChapterBySlug(bookSlug, chapterSlug);

  useEffect(() => {
    async function loadChapter() {
      try {
        setIsLoading(true);
        if (!chapter?.path) {
          throw new Error('Chapter not found');
        }

        // Dynamic import based on chapter path
        const ChapterComponent = dynamic(
          () => import(`../notes/chapters/${chapter.path}`),
          {
            loading: () => <ChapterLoadingIndicator />,
            ssr: false,
          }
        );
        
        setComponent(() => ChapterComponent);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadChapter();
  }, [chapter?.path]);

  if (error) {
    return <ChapterErrorState error={error} />;
  }

  if (isLoading || !Component) {
    return <ChapterLoadingIndicator />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ChapterHeader book={book} chapter={chapter} />
      <div className="prose prose-lg max-w-none">
        <Component />
      </div>
    </div>
  );
}

function ChapterHeader({ book, chapter }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <Book className="h-5 w-5" />
        <span className="text-sm font-medium">{book.title}</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {chapter.title}
      </h1>
      <p className="text-xl text-gray-600 mb-6">
        {chapter.description}
      </p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{chapter.readingTime} read</span>
        </div>
      </div>
    </div>
  );
}

function ChapterLoadingIndicator() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

function ChapterErrorState({ error }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load chapter
        </h1>
        <p className="text-gray-600">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
    </div>
  );
}
