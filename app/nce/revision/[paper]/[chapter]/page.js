// app/nce/revision/[paper]/[chapter]/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  ArrowLeft,
  Clock,
  Target,
  Brain,
  Lightbulb,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { RevisionNotesDisplay } from '@/components/RevisionNotesDisplay';

const PAPERS = {
  1: { name: 'Paper 1', title: 'General Aspects of Energy Management and Energy Audit' },
  2: { name: 'Paper 2', title: 'Energy Efficiency in Thermal Utilities' },
  3: { name: 'Paper 3', title: 'Energy Efficiency in Electrical Utilities' }
};

export default function ChapterRevisionPage({ params }) {
  const { paper, chapter } = params;
  const [revisionData, setRevisionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    fetchChapterData();
    fetchAllChapters();
  }, [paper, chapter]);

  const fetchChapterData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/revision-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperNo: parseInt(paper),
          chapterNo: parseInt(chapter)
        })
      });

      if (!response.ok) {
        throw new Error('Chapter not found');
      }

      const data = await response.json();
      setRevisionData(data.revisionNotes);
    } catch (err) {
      console.error('Error fetching chapter data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllChapters = async () => {
    try {
      const response = await fetch(`/api/revision-notes?paper=${paper}`);
      if (response.ok) {
        const data = await response.json();
        setAllChapters(data.revisionNotes || []);
      }
    } catch (err) {
      console.error('Error fetching all chapters:', err);
    }
  };

  const currentChapterIndex = allChapters.findIndex(ch => ch.chapter_no === parseInt(chapter));
  const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg font-light">Loading revision notes...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Paper {paper} • Chapter {chapter}
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !revisionData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
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
            Chapter Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The revision notes for Paper {paper}, Chapter {chapter} are not available yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nce/revision">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-2xl transition-all duration-200"
              >
                Back to Revision Notes
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
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
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 opacity-40 blur-3xl"
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
              <Link href="/nce/revision" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Revision</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {PAPERS[paper]?.name} • Ch. {chapter}
              </span>
            </motion.div>

            {/* Chapter Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {prevChapter && (
                <Link href={`/nce/revision/${paper}/${prevChapter.chapter_no}`}>
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
                <Link href={`/nce/revision/${paper}/${nextChapter.chapter_no}`}>
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

      {/* Chapter Header */}
      <section className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Chapter Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 text-sm font-medium mb-4"
            >
              {PAPERS[paper]?.title}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-6 leading-tight"
            >
              Chapter {chapter}: {revisionData.notes?.metadata?.chapter_title || revisionData.chapter_name}
            </motion.h1>

            {/* Chapter Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-8"
            >
              {revisionData.notes?.metadata?.estimated_study_time_hours && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {revisionData.notes.metadata.estimated_study_time_hours}h study time
                  </span>
                </div>
              )}
              
              {revisionData.notes?.metadata?.difficulty_level && (
                <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border ${
                  revisionData.notes.metadata.difficulty_level === 'Basic' 
                    ? 'bg-green-100/60 dark:bg-green-900/30 border-green-200/50 dark:border-green-700/50'
                    : revisionData.notes.metadata.difficulty_level === 'Intermediate'
                    ? 'bg-yellow-100/60 dark:bg-yellow-900/30 border-yellow-200/50 dark:border-yellow-700/50'
                    : 'bg-red-100/60 dark:bg-red-900/30 border-red-200/50 dark:border-red-700/50'
                }`}>
                  <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {revisionData.notes.metadata.difficulty_level}
                  </span>
                </div>
              )}

              {revisionData.notes?.key_concepts?.length && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <Brain className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {revisionData.notes.key_concepts.length} key concepts
                  </span>
                </div>
              )}

              {revisionData.notes?.formulas_quick_reference?.length && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <Lightbulb className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {revisionData.notes.formulas_quick_reference.length} formulas
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <RevisionNotesDisplay revisionData={revisionData.notes} />
        </div>
      </main>

      {/* Chapter Navigation Footer */}
      <footer className="relative z-10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8"
          >
            <div className="flex justify-between items-center">
              {prevChapter ? (
                <Link href={`/nce/revision/${paper}/${prevChapter.chapter_no}`}>
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
                      <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        Ch. {prevChapter.chapter_no}: {prevChapter.notes?.metadata?.chapter_title || prevChapter.chapter_name}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextChapter ? (
                <Link href={`/nce/revision/${paper}/${nextChapter.chapter_no}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 cursor-pointer group max-w-sm text-right"
                  >
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next Chapter</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        Ch. {nextChapter.chapter_no}: {nextChapter.notes?.metadata?.chapter_title || nextChapter.chapter_name}
                      </div>
                    </div>
                    <div className="p-3 bg-white/70 dark:bg-gray-700/70 rounded-full group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
