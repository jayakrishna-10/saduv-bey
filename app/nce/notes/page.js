// app/nce/notes/page.js - Updated with dark mode support
'use client';
import Link from 'next/link';
import { books } from '@/config/chapters';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, CheckCircle, Users, Target, Timer, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NCENotesPage() {
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
        
        {/* Geometric shapes */}
        <div className="absolute top-32 left-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-emerald-300 dark:border-emerald-500 rounded-full opacity-60"
          />
        </div>
        <div className="absolute bottom-40 right-32">
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 bg-gradient-to-br from-indigo-300 to-purple-300 dark:from-indigo-600 dark:to-purple-600 rotate-45 opacity-50"
          />
        </div>
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
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Study Notes</span>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{books.length} Books</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{books.reduce((total, book) => total + book.chapters.length, 0)} Chapters</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
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
                className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Study Notes
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Professionally curated study materials organized by papers and chapters. 
              Master every concept with clear explanations and visual aids.
            </motion.p>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { label: 'Study Hours', value: '50+', icon: Timer, color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Visual Aids', value: '200+', icon: Target, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Quick References', value: '150+', icon: CheckCircle, color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Active Readers', value: '2,000+', icon: Users, color: 'text-cyan-600 dark:text-cyan-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="group"
              >
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-xl transition-all duration-300">
                  {/* Book Header */}
                  <div className={`h-32 bg-gradient-to-br ${book.color} flex items-center justify-center relative overflow-hidden`}>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BookOpen className="h-16 w-16 text-white opacity-90" />
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/20 rotate-45"></div>
                  </div>
                  
                  <div className="p-8">
                    <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{book.description}</p>
                    
                    {/* Chapter Preview */}
                    <div className="space-y-3 mb-6">
                      {book.chapters.slice(0, 3).map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/nce/notes/${book.slug}/${chapter.slug}`}
                          className="block p-3 rounded-2xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors border border-gray-200/50 dark:border-gray-600/50 group/chapter"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-gray-900 dark:text-gray-100 font-medium text-sm mb-1 group-hover/chapter:text-indigo-600 dark:group-hover/chapter:text-indigo-400 transition-colors">
                                {chapter.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{chapter.readingTime}</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-xs ${
                                  chapter.status === 'available' 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                                    : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                                }`}>
                                  {chapter.status === 'available' ? 'Available' : 'Coming Soon'}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover/chapter:text-indigo-500 dark:group-hover/chapter:text-indigo-400 group-hover/chapter:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                      
                      {book.chapters.length > 3 && (
                        <Link
                          href={`/nce/notes/${book.slug}`}
                          className="block p-3 rounded-2xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors border border-gray-200/50 dark:border-gray-600/50 text-center group/all"
                        >
                          <span className="text-gray-700 dark:text-gray-300 text-sm group-hover/all:text-indigo-600 dark:group-hover/all:text-indigo-400 transition-colors">
                            View all {book.chapters.length} chapters
                          </span>
                          <ArrowRight className="h-4 w-4 inline ml-2 text-gray-400 dark:text-gray-500 group-hover/all:text-indigo-500 dark:group-hover/all:text-indigo-400 group-hover/all:translate-x-1 transition-all" />
                        </Link>
                      )}
                    </div>

                    {/* Book Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{book.chapters.length} chapters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{book.chapters.filter(ch => ch.status === 'available').length} available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Our Study Notes?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Expertly crafted content designed for optimal learning and retention
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Structured Learning",
                description: "Content organized in logical progression from basic concepts to advanced applications",
                icon: Target,
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "Visual Explanations", 
                description: "Diagrams, charts, and illustrations to help you understand complex concepts",
                icon: BookOpen,
                color: "from-emerald-500 to-cyan-500"
              },
              {
                title: "Quick Reference",
                description: "Key formulas, definitions, and important points highlighted for easy review",
                icon: CheckCircle,
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                className="text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-3xl text-white dark:text-gray-900"
        >
          <h2 className="text-3xl font-light mb-6">Ready to Master Your NCE Studies?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            Start with any paper and build your knowledge systematically with our comprehensive study materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/nce/notes/${books[0]?.slug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
              >
                Start with Paper 1
              </motion.button>
            </Link>
            <Link href="/nce/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-300 dark:text-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 hover:text-white dark:hover:text-gray-500 transition-all font-medium"
              >
                Practice Quiz
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
