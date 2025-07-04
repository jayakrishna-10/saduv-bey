// app/components/NCEHomepage.js - Redesigned with minimalist geometric style
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, FileText, BookOpen, PenTool, Play, ChevronRight, Target, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    id: 'quiz',
    title: 'Practice Quiz',
    subtitle: 'Adaptive Learning',
    description: 'Interactive learning with instant feedback and explanations that adapt to your progress',
    icon: Brain,
    href: '/nce/quiz',
    color: '#6366f1',
    features: ['Instant explanations', 'Topic-wise practice', 'Performance tracking'],
    stats: { questions: '2000+', topics: '50+', success: '94%' }
  },
  {
    id: 'test',
    title: 'Mock Tests',
    subtitle: 'Exam Simulation',
    description: 'Full exam-style tests with timer and comprehensive performance analysis',
    icon: FileText,
    href: '/nce/test',
    color: '#8b5cf6',
    features: ['Timed exams', 'Detailed analytics', 'Review mode'],
    stats: { tests: '100+', analysis: 'Deep', time: 'Real-time' }
  },
  {
    id: 'notes',
    title: 'Study Notes',
    subtitle: 'Comprehensive Content',
    description: 'Professionally curated study materials organized by topics with visual aids',
    icon: BookOpen,
    href: '/nce/notes',
    color: '#10b981',
    features: ['Chapter-wise content', 'Quick reference', 'Visual aids'],
    stats: { chapters: '50+', diagrams: '200+', updates: 'Weekly' }
  },
  {
    id: 'flashcards',
    title: 'Smart Flashcards',
    subtitle: 'Memory Enhancement',
    description: 'Spaced repetition flashcards that optimize retention and recall',
    icon: PenTool,
    href: '/nce/flashcards',
    color: '#f59e0b',
    features: ['Spaced repetition', 'Active recall', 'Progress tracking'],
    stats: { cards: '1500+', retention: '85%', time: 'Optimized' }
  }
];

export default function NCEHomepage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);

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
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-60 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 opacity-40 blur-3xl"
        />
        
        {/* Geometric shapes specific to NCE */}
        <div className="absolute top-32 left-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-indigo-300 rounded-full opacity-70"
          />
        </div>
        <div className="absolute bottom-32 right-40">
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 bg-gradient-to-br from-emerald-300 to-cyan-300 rotate-45 opacity-60"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-6 bg-white/30 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent cursor-pointer"
            >
              saduvbey
            </motion.div>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <span className="text-sm text-gray-600 px-3 py-1 bg-white/50 rounded-full">NCE Preparation</span>
            <Link href="/">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                ← Home
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight"
            >
              Master Your{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                NCE Journey
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Comprehensive preparation platform for National Certification Examination for Energy Managers and Energy Auditors. 
              Clean, focused, and scientifically designed for optimal learning outcomes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/nce/quiz">
                <button className="group px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center gap-3">
                  <Brain className="h-5 w-5" />
                  Start Practice Quiz
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/nce/test">
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-all">
                  Take Mock Test
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          >
            {[
              { label: 'Practice Questions', value: '2,500+', icon: Target },
              { label: 'Study Hours Saved', value: '100+', icon: Clock },
              { label: 'Active Learners', value: '5,000+', icon: Users },
              { label: 'Success Rate', value: '94%', icon: CheckCircle }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 transition-all"
              >
                <stat.icon className="h-8 w-8 text-gray-700 mx-auto mb-3" />
                <div className="text-2xl font-light text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                onHoverStart={() => setActiveFeature(index)}
                className="group cursor-pointer"
              >
                <Link href={feature.href}>
                  <div className="h-full p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${feature.color}20` }}
                      >
                        <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">{feature.subtitle}</div>
                        <h3 className="text-2xl font-light text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                        
                        <div className="space-y-2 mb-6">
                          {feature.features.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.4 + index * 0.1 + idx * 0.05 }}
                              className="flex items-center gap-3 text-sm text-gray-600"
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: feature.color }}
                              />
                              {item}
                            </motion.div>
                          ))}
                        </div>

                        {/* Feature Stats */}
                        <div className="flex gap-4 mb-6">
                          {Object.entries(feature.stats).map(([key, value], idx) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-light text-gray-900">{value}</div>
                              <div className="text-xs text-gray-500 capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                        
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group-hover:translate-x-2 transition-all"
                        >
                          Get Started
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Paper Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">Examination Structure</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Complete coverage of all three papers with detailed topic-wise preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  paper: 'Paper 1',
                  title: 'General Aspects of Energy Management and Energy Audit',
                  color: '#6366f1',
                  topics: ['Energy Scenario', 'Energy Management', 'Financial Management', 'Project Management'],
                  questions: '500+'
                },
                {
                  paper: 'Paper 2', 
                  title: 'Energy Efficiency in Thermal Utilities',
                  color: '#f59e0b',
                  topics: ['Fuels & Combustion', 'Boilers', 'Steam Systems', 'Waste Heat Recovery'],
                  questions: '600+'
                },
                {
                  paper: 'Paper 3',
                  title: 'Energy Efficiency in Electrical Utilities', 
                  color: '#10b981',
                  topics: ['Electric Motors', 'HVAC Systems', 'Lighting Systems', 'Power Factor'],
                  questions: '700+'
                }
              ].map((paper, index) => (
                <motion.div
                  key={paper.paper}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 transition-all group"
                >
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4"
                    style={{ backgroundColor: paper.color }}
                  >
                    {paper.paper}
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">{paper.title}</h3>
                  
                  <div className="space-y-2 mb-6">
                    {paper.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: paper.color }}
                        />
                        {topic}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-light text-gray-900">{paper.questions}</span>
                    <span className="text-sm text-gray-500">Questions</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white"
        >
          <h2 className="text-4xl font-light mb-6">Ready to Start Your Preparation?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who prepared with our comprehensive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/nce/quiz">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 font-medium flex items-center gap-3 justify-center">
                <Brain className="h-5 w-5" />
                Start Practice Quiz
              </button>
            </Link>
            <Link href="/nce/test">
              <button className="px-8 py-4 border-2 border-gray-400 text-gray-300 rounded-full hover:border-gray-300 hover:text-white transition-all flex items-center gap-3 justify-center">
                <FileText className="h-5 w-5" />
                Take Mock Test
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            © 2025 saduvbey. Comprehensive NCE preparation platform designed for success.
          </p>
        </div>
      </footer>
    </div>
  );
}
