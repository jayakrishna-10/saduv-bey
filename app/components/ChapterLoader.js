// app/components/ChapterLoader.js
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Book, Clock, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getBookBySlug, getChapterBySlug, getNextChapter, getPreviousChapter, getChapterStatus } from '@/config/chapters';

export function ChapterLoader({ bookSlug, chapterSlug }) {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const book = getBookBySlug(bookSlug);
  const chapter = getChapterBySlug(bookSlug, chapterSlug);
  const nextChapter = getNextChapter(bookSlug, chapterSlug);
  const prevChapter = getPreviousChapter(bookSlug, chapterSlug);
  const chapterStatus = getChapterStatus(bookSlug, chapterSlug);

  useEffect(() => {
    async function loadChapter() {
      try {
        setIsLoading(true);
        setError(null);

        if (!chapter?.path) {
          throw new Error('Chapter not found');
        }

        if (chapterStatus === 'coming-soon') {
          throw new Error('This chapter is coming soon');
        }

        // Dynamic import based on chapter path
        const ChapterComponent = dynamic(
          () => import(`../nce/notes/chapters/${chapter.path}`).catch(err => {
            console.error('Failed to load chapter:', err);
            throw new Error('Failed to load chapter content');
          }),
          {
            loading: () => <ChapterLoadingIndicator />,
            ssr: false,
          }
        );
        
        setComponent(() => ChapterComponent);
      } catch (err) {
        console.error('Chapter loading error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadChapter();
  }, [chapter?.path, chapterStatus]);

  if (error) {
    return <ChapterErrorState error={error} bookSlug={bookSlug} />;
  }

  if (isLoading || !Component) {
    return <ChapterLoadingIndicator />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader book={book} chapter={chapter} />
      <div className="prose prose-lg max-w-none">
        <Component />
      </div>
      <ChapterNavigation 
        prevChapter={prevChapter} 
        nextChapter={nextChapter} 
        bookSlug={bookSlug} 
      />
    </div>
  );
}

function ChapterHeader({ book, chapter }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <Book className="h-5 w-5" />
        <Link href={`/nce/notes`} className="text-sm font-medium hover:text-blue-700">
          Notes
        </Link>
        <span className="text-gray-400">/</span>
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
        {chapter.topics && (
          <div className="flex gap-2 flex-wrap">
            {chapter.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChapterLoadingIndicator() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading chapter content...</p>
      </div>
    </div>
  );
}

function ChapterErrorState({ error, bookSlug }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {error.message || 'Failed to load chapter'}
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message === 'This chapter is coming soon'
            ? 'This chapter is currently being prepared and will be available soon.'
            : 'An unexpected error occurred while loading the chapter content.'}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/nce/notes"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Notes
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChapterNavigation({ prevChapter, nextChapter, bookSlug }) {
  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex justify-between items-center">
        {prevChapter ? (
          <Link
            href={`/nce/notes/${bookSlug}/${prevChapter.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            <div>
              <div className="text-sm text-gray-500">Previous</div>
              <div className="font-medium">{prevChapter.title}</div>
            </div>
          </Link>
        ) : (
          <div /> // Empty div for spacing
        )}
        
        {nextChapter ? (
          <Link
            href={`/nce/notes/${bookSlug}/${nextChapter.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500">Next</div>
              <div className="font-medium">{nextChapter.title}</div>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div /> // Empty div for spacing
        )}
      </div>
    </div>
  );
}
