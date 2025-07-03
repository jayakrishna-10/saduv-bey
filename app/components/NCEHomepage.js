import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileText, BookOpen, Target, Clock, CheckCircle, ArrowRight, Zap, Users, Trophy, Home } from 'lucide-react';

export default function NCEHomepageMinimalist() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(0);

  // Track mouse for subtle parallax effect
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
      id: 'quiz',
      title: 'Interactive Quiz',
      description: 'Smart practice with instant feedback and detailed explanations',
      icon: Brain,
      href: '/nce/quiz',
      color: '#6366f1',
      stats: ['2000+ Questions', 'Instant Explanations', 'Topic-wise Practice', 'Performance Tracking']
    },
    {
      id: 'test',
      title: 'Mock Tests',
      description: 'Exam-style tests with timer and comprehensive analysis',
      icon: FileText,
      href: '/nce/test',
      color: '#8b5cf6',
      stats: ['Timed Exams', 'Detailed Analytics', 'Review Mode', 'Paper-wise Tests']
    },
    {
      id: 'notes',
      title: 'Study Notes',
      description: 'Comprehensive study materials organized by topics',
      icon: BookOpen,
      href: '/nce/notes',
      color: '#10b981',
      stats: ['50+ Chapters', 'Visual Aids', 'Quick Reference', 'Structured Content']
    }
  ];

  const papers = [
    {
      paper: 'Paper 1',
      title: 'General Aspects of Energy Management and Energy Audit',
      color: '#6366f1',
      chapters: 9,
      description: 'Foundation concepts and audit principles'
    },
    {
      paper: 'Paper 2',
      title: 'Energy Efficiency in Thermal Utilities',
      color: '#f59e0b',
      chapters: 8,
      description: 'Boilers, steam systems, and thermal efficiency'
    },
    {
      paper: 'Paper 3',
      title: 'Energy Efficiency in Electrical Utilities',
      color: '#10b981',
      chapters: 10,
      description: 'Motors, lighting, and electrical systems'
    }
  ];

  const achievements = [
    { label: 'Practice Questions', value: '2,500+', icon: Target },
    { label: 'Study Chapters', value: '50+', icon: BookOpen },
    { label: 'Mock Tests', value: '25+', icon: Clock },
    { label: 'Success Rate', value: '94%', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * 0.08,
            y: mousePosition.y * 0.08,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.04,
            y: -mousePosition.y * 0.04,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 opacity-40 blur-3xl"
        />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border-2 border-indigo-300 rotate-45"
          />
        </div>
        <div className="absolute bottom-1/3 right-20">
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-6 bg-gradient-to-b from-purple-300 to-indigo-300 rounded-full opacity-60"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="text-2xl font-light text-gray-900">saduvbey</div>
            <div className="text-sm text-gray-500">/ NCE Preparation</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Home className="h-4 w-4" />
              Home
            </a>
            <div className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm">
              NCE Platform
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-16">
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
              className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight"
            >
              Master Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-normal">
                NCE
              </span>{' '}
              Preparation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Comprehensive preparation platform for National Certification Examination 
              for Energy Managers and Energy Auditors
            </motion.p>
          </motion.div>

          {/* Achievement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -3 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
              >
                <achievement.icon className="h-8 w-8 text-gray-700 mx-auto mb-3" />
                <div className="text-2xl font-light text-gray-900 mb-1">{achievement.value}</div>
                <div className="text-sm text-gray-600">{achievement.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-gray-600">
              Multiple ways to prepare for your NCE examination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setActiveCard(index)}
                className="group cursor-pointer"
              >
                <a href={feature.href} className="block">
                  <div className="h-full p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 hover:shadow-xl transition-all duration-300">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                    </div>
                    
                    <h3 className="text-2xl font-light text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {feature.stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div 
                            className="w-1.5 h-1.5 rounded-full mr-3"
                            style={{ backgroundColor: feature.color }}
                          />
                          {stat}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-gray-700 group-hover:text-gray-900 font-medium">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section className="relative z-10 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Examination Structure
            </h2>
            <p className="text-lg text-gray-600">
              Complete coverage of all three NCE papers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {papers.map((paper, index) => (
              <motion.div
                key={paper.paper}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-2xl text-white text-sm font-medium mb-6"
                  style={{ backgroundColor: paper.color }}
                >
                  {paper.paper}
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4 leading-relaxed">
                  {paper.title}
                </h3>
                
                <p className="text-gray-600 mb-6">{paper.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {paper.chapters} chapters
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Ready to study
                  </div>
                </div>
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
          className="max-w-4xl mx-auto"
        >
          <div className="text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-light mb-6">Ready to Start Your Preparation?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of successful candidates who prepared with our comprehensive platform
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.a
                  href="/nce/quiz"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all"
                >
                  <Brain className="h-5 w-5" />
                  Start Practice Quiz
                </motion.a>
                <motion.a
                  href="/nce/test"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all"
                >
                  <FileText className="h-5 w-5" />
                  Take Mock Test
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            © 2025 saduvbey. Comprehensive NCE preparation platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
