// app/page.js - Clean, honest homepage
'use client';
import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, BookOpen, Target, Zap, ArrowRight, Play, ChevronRight, Clock, FileText, MessageCircle, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const features = [
    {
      title: 'Organized Question Banks',
      description: 'Questions sorted by paper, topic, and year',
      icon: BookOpen,
      color: '#10b981'
    },
    {
      title: 'AI Explanations',
      description: 'Detailed explanations for every question',
      icon: Brain,
      color: '#6366f1'
    },
    {
      title: 'Mock Tests',
      description: 'Practice with timed exam simulations',
      icon: Clock,
      color: '#8b5cf6'
    },
    {
      title: 'Progress Tracking',
      description: 'See your performance and improvement',
      icon: BarChart3,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 opacity-60 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 opacity-40 blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-light text-gray-900 dark:text-gray-100 mb-8 leading-tight"
            >
              Better Exam{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent bg-300% font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Preparation
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
            >
              Organized questions, AI explanations, and practice tests for professional certification exams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/nce">
                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg">
                  <Play className="h-5 w-5" />
                  Try NCE Prep
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-8 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">Simple. Organized. Effective.</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need to prepare efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all text-center"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NCE Focus */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              Now Available
            </div>
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">
              NCE Preparation Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Prepare for the National Certification Examination for Energy Managers and Energy Auditors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { paper: 'Paper 1', title: 'Energy Management & Audit', color: '#6366f1' },
              { paper: 'Paper 2', title: 'Thermal Utilities', color: '#f59e0b' },
              { paper: 'Paper 3', title: 'Electrical Utilities', color: '#10b981' }
            ].map((paper, index) => (
              <motion.div
                key={paper.paper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 text-center"
              >
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-3"
                  style={{ backgroundColor: paper.color }}
                >
                  {paper.paper}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{paper.title}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/nce">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform shadow-lg font-medium"
              >
                Start Preparing
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
            saduvbey
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Modern exam preparation platform
          </p>
        </div>
      </footer>
    </div>
  )
}
