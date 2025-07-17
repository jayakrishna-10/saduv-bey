// app/components/TestDashboard.js - Test Mode Selection Dashboard
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Award, 
  Target,
  Clock,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Play,
  FileCheck,
  Lightbulb,
  Shield,
  Zap,
  Calendar,
  Users,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

const STUDY_MODES = {
  quiz: {
    id: 'quiz',
    name: 'Practice Quiz',
    description: 'Interactive learning with instant feedback and explanations',
    icon: Lightbulb,
    color: 'from-indigo-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30',
    features: [
      'Instant feedback on answers',
      'Detailed explanations for every question', 
      'Flexible question count and topics',
      'Chapter hints and year information',
      'Perfect for learning and concept building'
    ],
    href: '/nce/quiz',
    stats: { avgTime: '15-45 min', difficulty: 'Adaptive', bestFor: 'Learning' }
  },
  test: {
    id: 'test',
    name: 'Practice Test',
    description: 'Exam simulation with comprehensive performance analysis',
    icon: Award,
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    features: [
      'Mock and practice test modes',
      'Real exam timing and conditions',
      'Question flagging and navigation palette',
      'Comprehensive performance analysis',
      'Perfect for exam preparation'
    ],
    href: '/nce/test',
    stats: { avgTime: '30-60 min', difficulty: 'Fixed', bestFor: 'Assessment' }
  }
};

const RECENT_FEATURES = [
  {
    title: 'Enhanced Test Analytics',
    description: 'Detailed performance breakdown by topic and difficulty',
    icon: BarChart3,
    badge: 'New'
  },
  {
    title: 'Smart Question Flagging',
    description: 'Mark questions for review with intelligent recommendations',
    icon: Target,
    badge: 'Updated'
  },
  {
    title: 'Adaptive Learning Path',
    description: 'Personalized study recommendations based on performance',
    icon: TrendingUp,
    badge: 'Beta'
  }
];

export function TestDashboard() {
  const [selectedMode, setSelectedMode] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    timeSpent: 0,
    strongestTopic: null
  });

  // Mouse tracking for ambient effects
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

  // Load user stats (mock data for now)
  useEffect(() => {
    // In a real app, this would fetch from an API
    setStats({
      totalAttempts: 24,
      averageScore: 76,
      timeSpent: 180, // minutes
      strongestTopic: 'Energy Management'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: mousePosition.x * 0.1, 
            y: mousePosition.y * 0.1,
          }} 
          transition={{ type: "spring", stiffness: 50, damping: 15 }} 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/30 dark:to-purple-900/30 blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: -mousePosition.x * 0.05, 
            y: -mousePosition.y * 0.05,
          }} 
          transition={{ type: "spring", stiffness: 30, damping: 15 }} 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200/30 to-red-200/30 dark:from-orange-900/20 dark:to-red-900/20 blur-3xl" 
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
              NCE Preparation Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Master the National Certified Energy Manager exam with interactive quizzes and comprehensive practice tests
            </p>
          </motion.div>

          {/* User Stats */}
          {stats.totalAttempts > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl font-light text-indigo-600 dark:text-indigo-400 mb-1">
                  {stats.totalAttempts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl font-light text-emerald-600 dark:text-emerald-400 mb-1">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl font-light text-purple-600 dark:text-purple-400 mb-1">
                  {Math.floor(stats.timeSpent / 60)}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Study Time</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl font-light text-orange-600 dark:text-orange-400 mb-1">
                  <Star className="h-6 w-6 mx-auto" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.strongestTopic?.split(' ')[0]}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Study Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            {Object.values(STUDY_MODES).map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onMouseEnter={() => setSelectedMode(mode.id)}
                onMouseLeave={() => setSelectedMode(null)}
                className="group relative"
              >
                <div className={`p-8 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
                  selectedMode === mode.id
                    ? 'border-gray-300 dark:border-gray-600 shadow-2xl ring-4 ring-gray-100 dark:ring-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl'
                } ${mode.gradient}`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-6 right-6 text-8xl">
                      {mode.id === 'quiz' ? '💡' : '🏆'}
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${mode.color} text-white shadow-lg flex items-center justify-center`}>
                        <mode.icon className="h-8 w-8" />
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Best for
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {mode.stats.bestFor}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {mode.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {mode.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {mode.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{mode.stats.avgTime}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{mode.stats.difficulty}</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={mode.href}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${mode.color} text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-200`}
                      >
                        <Play className="h-5 w-5" />
                        Start {mode.name}
                        <ChevronRight className="h-5 w-5" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-3">
                Latest Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                New improvements to enhance your learning experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECENT_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                      <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      feature.badge === 'New' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                      feature.badge === 'Updated' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    }`}>
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-3">
                Quick Access
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Jump straight into your preferred study mode
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/nce/quiz">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 p-4 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all"
                >
                  <Lightbulb className="h-5 w-5" />
                  Quick Quiz
                </motion.button>
              </Link>

              <Link href="/nce/test">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 p-4 bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/70 text-orange-700 dark:text-orange-300 rounded-xl transition-all"
                >
                  <FileCheck className="h-5 w-5" />
                  Practice Test
                </motion.button>
              </Link>

              <Link href="/nce/notes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 p-4 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all"
                >
                  <BookOpen className="h-5 w-5" />
                  Study Notes
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
