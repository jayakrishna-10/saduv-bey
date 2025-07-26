// app/components/NCEHomepage.js - Updated with coming soon badges
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, FileText, BookOpen, PenTool, Play, ChevronRight, Target, Clock, ExternalLink, Calendar, Award, Briefcase, Globe, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    id: 'quiz',
    title: 'Practice Quiz',
    description: 'Interactive questions with instant AI explanations',
    icon: Brain,
    href: '/nce/quiz',
    color: '#6366f1',
    status: 'available'
  },
  {
    id: 'test',
    title: 'Mock Tests',
    description: 'Full exam simulation with timing and analysis',
    icon: FileText,
    href: '/nce/test',
    color: '#8b5cf6',
    status: 'available'
  },
  {
    id: 'notes',
    title: 'Study Notes',
    description: 'Organized materials by topics and chapters',
    icon: BookOpen,
    href: '/nce/notes',
    color: '#10b981',
    status: 'coming-soon'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Quick review cards for key concepts',
    icon: PenTool,
    href: '/nce/flashcards',
    color: '#f59e0b',
    status: 'coming-soon'
  }
];

export default function NCEHomepage() {
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
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-60 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-30 blur-3xl"
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
              NCE{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-emerald-600 to-indigo-600 dark:from-indigo-400 dark:via-emerald-400 dark:to-indigo-400 bg-clip-text text-transparent font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Preparation
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
            >
              Prepare for the National Certification Examination for Energy Managers and Energy Auditors with organized questions and AI explanations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/nce/quiz">
                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-full hover:from-indigo-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg">
                  <Brain className="h-5 w-5" />
                  Start Practice
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/nce/test">
                <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                  Take Mock Test
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-8 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete preparation tools in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group cursor-pointer relative"
              >
                {feature.status === 'available' ? (
                  <Link href={feature.href}>
                    <div className="h-full p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${feature.color}20` }}
                        >
                          <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>
                          
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium group-hover:translate-x-2 transition-all"
                          >
                            Get Started
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 relative opacity-75">
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-medium rounded-full shadow-lg">
                      Coming Soon
                    </div>
                    
                    <div className="flex items-start gap-6">
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center opacity-60"
                        style={{ backgroundColor: `${feature.color}20` }}
                      >
                        <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>
                        
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 font-medium">
                          Coming Soon
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Info */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">About the NCE Exam</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Key information about the National Certification Examination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Exam Structure */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Exam Papers
              </h3>
              <div className="space-y-4">
                {[
                  { paper: 'Paper 1', title: 'General Aspects of Energy Management', color: '#6366f1' },
                  { paper: 'Paper 2', title: 'Energy Efficiency in Thermal Utilities', color: '#f59e0b' },
                  { paper: 'Paper 3', title: 'Energy Efficiency in Electrical Utilities', color: '#10b981' }
                ].map((paper, index) => (
                  <div key={paper.paper} className="border-l-4 pl-4" style={{ borderColor: paper.color }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="px-2 py-1 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: paper.color }}
                      >
                        {paper.paper}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">50 MCQs • 8 SAQs • 6 LAQs • 3 hours</span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{paper.title}</h4>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Key Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Schedule</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Usually held once a year</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Passing Criteria</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">50% in each paper</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Certification</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Energy Manager/Auditor by BEE</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Official Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
          >
            <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Official Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Bureau of Energy Efficiency",
                  description: "Official exam conducting body",
                  url: "https://beeindia.gov.in"
                },
                {
                  title: "NCE Registration",
                  description: "Exam notifications and registration",
                  url: "https://beeindia.gov.in/content/nce-energy-manager-energy-auditor"
                },
                {
                  title: "Syllabus & Pattern",
                  description: "Detailed exam information",
                  url: "https://beeindia.gov.in/sites/default/files/NCE%20Brochure%202023.pdf"
                }
              ].map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">Official</span>
                    <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{resource.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{resource.description}</p>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-3xl text-white dark:text-gray-900"
        >
          <h2 className="text-3xl font-light mb-6">Ready to Start?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8">
            Begin your NCE preparation with organized materials and AI explanations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nce/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
              >
                Start Practice Quiz
              </motion.button>
            </Link>
            <Link href="/nce/test">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-300 dark:text-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 hover:text-white dark:hover:text-gray-500 transition-all"
              >
                Take Mock Test
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 saduvbey. NCE preparation platform.
            <span className="block mt-2">
              <em>Not affiliated with BEE. Independent preparation platform.</em>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
