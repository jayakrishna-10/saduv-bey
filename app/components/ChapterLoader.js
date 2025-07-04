// app/components/ChapterLoader.js - Updated with dark mode support
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book, Clock, AlertCircle, ChevronLeft, ChevronRight, Loader2, Home, ArrowLeft, BookOpen, Timer } from 'lucide-react';
import { getBookBySlug, getChapterBySlug, getNextChapter, getPreviousChapter, getChapterStatus } from '@/config/chapters';

export function ChapterLoader({ bookSlug, chapterSlug }) {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const book = getBookBySlug(bookSlug);
  const chapter = getChapterBySlug(bookSlug, chapterSlug);
  const nextChapter = getNextChapter(bookSlug, chapterSlug);
  const prevChapter = getPreviousChapter(bookSlug, chapterSlug);
  const chapterStatus = getChapterStatus(bookSlug, chapterSlug);

  // Mouse tracking for animations
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 opacity-40 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-30 blur-3xl"
        />
      </div>

      {/* Navigation Header */}
      <header className="relative z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Breadcrumb Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/nce" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">NCE</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Link href="/nce/notes" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Notes</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{book?.title}</span>
            </motion.div>

            {/* Chapter Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {prevChapter && (
                <Link href={`/nce/notes/${bookSlug}/${prevChapter.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm hidden sm:block">Previous</span>
                  </motion.button>
                </Link>
              )}
              
              {nextChapter && (
                <Link href={`/nce/notes/${bookSlug}/${nextChapter.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <span className="text-sm hidden sm:block">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <ChapterHeader book={book} chapter={chapter} />
          
          {/* Main Content Area */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 mb-12">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <Component />
            </div>
          </div>

          <ChapterNavigation 
            prevChapter={prevChapter} 
            nextChapter={nextChapter} 
            bookSlug={bookSlug} 
          />
        </div>
      </main>
    </div>
  );
}

function ChapterHeader({ book, chapter }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      {/* Chapter Title Section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 text-sm font-medium mb-4"
        >
          {book?.title}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-6 leading-tight"
        >
          {chapter?.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          {chapter?.description}
        </motion.p>
      </div>

      {/* Chapter Meta Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-6 mb-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
          <Timer className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{chapter?.readingTime} read</span>
        </div>
        
        {chapter?.topics && (
          <div className="flex flex-wrap gap-2">
            {chapter.topics.map((topic, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 rounded-full border border-indigo-200 dark:border-indigo-700"
              >
                {topic}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ChapterLoadingIndicator() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300 text-lg font-light">Loading chapter content...</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Preparing your study materials</p>
      </motion.div>
    </div>
  );
}

function ChapterErrorState({ error, bookSlug }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center"
        >
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
        </motion.div>
        
        <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">
          {error.message || 'Failed to load chapter'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {error.message === 'This chapter is coming soon'
            ? 'This chapter is currently being prepared and will be available soon. Thank you for your patience.'
            : 'An unexpected error occurred while loading the chapter content. Please try again or contact support if the issue persists.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/nce/notes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-2xl transition-all duration-200"
            >
              Return to Notes
            </motion.button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 font-medium rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ChapterNavigation({ prevChapter, nextChapter, bookSlug }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8"
    >
      <div className="flex justify-between items-center">
        {prevChapter ? (
          <Link href={`/nce/notes/${bookSlug}/${prevChapter.slug}`}>
            <motion.div
              whileHover={{ scale: 1.02, x: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 cursor-pointer group max-w-sm"
            >
              <div className="p-3 bg-white/70 dark:bg-gray-700/70 rounded-full group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previous Chapter</div>
                <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {prevChapter.title}
                </div>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div /> // Empty div for spacing
        )}
        
        {nextChapter ? (
          <Link href={`/nce/notes/${bookSlug}/${nextChapter.slug}`}>
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 cursor-pointer group max-w-sm text-right"
            >
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Chapter</div>
                <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {nextChapter.title}
                </div>
              </div>
              <div className="p-3 bg-white/70 dark:bg-gray-700/70 rounded-full group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <div /> // Empty div for spacing
        )}
      </div>
    </motion.div>
  );
}
