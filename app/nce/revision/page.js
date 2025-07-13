// app/nce/revision/page.js
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Target, 
  Timer, 
  Home, 
  ChevronRight,
  FileText,
  Brain,
  Lightbulb,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

const PAPERS = {
  1: {
    name: 'Paper 1',
    title: 'General Aspects of Energy Management and Energy Audit',
    color: 'from-blue-500 to-indigo-600',
    icon: '📊'
  },
  2: {
    name: 'Paper 2', 
    title: 'Energy Efficiency in Thermal Utilities',
    color: 'from-orange-500 to-red-600',
    icon: '🔥'
  },
  3: {
    name: 'Paper 3',
    title: 'Energy Efficiency in Electrical Utilities',
    color: 'from-emerald-500 to-cyan-600',
    icon: '⚡'
  }
};

export default function RevisionNotesPage() {
  const [revisionNotes, setRevisionNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    fetchRevisionNotes();
  }, [selectedPaper]);

  const fetchRevisionNotes = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedPaper !== 'all') {
        params.append('paper', selectedPaper);
      }

      const response = await fetch(`/api/revision-notes?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revision notes');
      }

      const data = await response.json();
      setRevisionNotes(data.revisionNotes || []);
    } catch (err) {
      console.error('Error fetching revision notes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = revisionNotes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.chapter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.notes?.metadata?.chapter_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const groupedByPaper = filteredNotes.reduce((acc, note) => {
    const paperNo = note.paper_no;
    if (!acc[paperNo]) {
      acc[paperNo] = [];
    }
    acc[paperNo].push(note);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-lg font-light">Loading revision notes...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">Error loading revision notes</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchRevisionNotes}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors"
          >
            Try Again
          </button>
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Breadcrumb Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/nce" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">NCE Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Revision Notes</span>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{revisionNotes.length} Chapters</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{Object.keys(groupedByPaper).length} Papers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-light text-gray-900 dark:text-gray-100 mb-8 leading-tight"
            >
              Comprehensive{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Revision Notes
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Ultra-dense, exam-focused revision material with formulas, mindmaps, case studies, and strategic study guidance for every NCE chapter.
            </motion.p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 flex flex-col md:flex-row gap-4 justify-center"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 min-w-[300px]"
              />
            </div>

            {/* Paper Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
              >
                <option value="all">All Papers</option>
                {Object.entries(PAPERS).map(([key, paper]) => (
                  <option key={key} value={key}>{paper.name}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Papers Grid */}
          <div className="space-y-12">
            {Object.entries(groupedByPaper).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([paperNo, chapters], paperIndex) => (
              <motion.div
                key={paperNo}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + paperIndex * 0.2 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12"
              >
                {/* Paper Header */}
                <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${PAPERS[paperNo]?.color} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{PAPERS[paperNo]?.icon}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-light mb-2">{PAPERS[paperNo]?.name}</h2>
                      <p className="text-white/90 text-lg">{PAPERS[paperNo]?.title}</p>
                      <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
                        <span>{chapters.length} chapters available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.sort((a, b) => a.chapter_no - b.chapter_no).map((chapter, index) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + paperIndex * 0.2 + index * 0.1 }}
                      className="group"
                    >
                      <Link href={`/nce/revision/${paperNo}/${chapter.chapter_no}`}>
                        <div className="h-full p-6 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:shadow-xl">
                          {/* Chapter Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                                  {chapter.chapter_no}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                {chapter.notes?.metadata?.difficulty_level && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    chapter.notes.metadata.difficulty_level === 'Basic' 
                                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                      : chapter.notes.metadata.difficulty_level === 'Intermediate'
                                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                                  }`}>
                                    {chapter.notes.metadata.difficulty_level}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                          </div>

                          {/* Chapter Content */}
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {chapter.notes?.metadata?.chapter_title || chapter.chapter_name}
                          </h3>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {chapter.notes?.metadata?.estimated_study_time_hours && (
                              <div className="flex items-center gap-1">
                                <Timer className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {chapter.notes.metadata.estimated_study_time_hours}h study
                                </span>
                              </div>
                            )}
                            {chapter.notes?.key_concepts?.length && (
                              <div className="flex items-center gap-1">
                                <Brain className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {chapter.notes.key_concepts.length} concepts
                                </span>
                              </div>
                            )}
                            {chapter.notes?.content_sections && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {chapter.notes.content_sections.filter(s => s.content_type === 'theory').length} sections
                                </span>
                              </div>
                            )}
                            {chapter.notes?.formulas_quick_reference?.length && (
                              <div className="flex items-center gap-1">
                                <Lightbulb className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {chapter.notes.formulas_quick_reference.length} formulas
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Exam Weightage */}
                          {chapter.notes?.metadata?.exam_weightage_percentage && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Exam Weight:</span>
                              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                {chapter.notes.metadata.exam_weightage_percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No revision notes found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Revision notes are being prepared'}
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
