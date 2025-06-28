// app/components/NCEHomepage.js - Cleaned up version
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, FileText, BookOpen } from 'lucide-react';

const features = [
  {
    id: 'quiz',
    title: 'Practice Quiz',
    description: 'Interactive learning with instant feedback and explanations',
    icon: Brain,
    href: '/nce/quiz',
    color: 'from-blue-500 to-cyan-500',
    features: ['Instant explanations', 'Topic-wise practice', 'Performance tracking']
  },
  {
    id: 'test',
    title: 'Mock Tests',
    description: 'Exam-style tests with timer and comprehensive analysis',
    icon: FileText,
    href: '/nce/test',
    color: 'from-purple-500 to-pink-500',
    features: ['Timed exams', 'Detailed analytics', 'Review mode']
  },
  {
    id: 'notes',
    title: 'Study Notes',
    description: 'Comprehensive study materials organized by topics',
    icon: BookOpen,
    href: '/nce/notes',
    color: 'from-green-500 to-emerald-500',
    features: ['Chapter-wise content', 'Quick reference', 'Visual aids']
  }
];

export default function NCEHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="py-16 px-4 pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Master Your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NCE
              </span>{' '}
              Preparation
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Comprehensive preparation platform for National Certification Examination for Energy Managers and Energy Auditors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-white/70 text-lg">
              Multiple ways to prepare for your NCE examination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link href={feature.href} className="block">
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-white/60 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-3"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    
                    <div className={`mt-6 inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:text-white transition-colors`}>
                      Get Started →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Paper Information Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Examination Structure
            </h2>
            <p className="text-white/70 text-lg">
              Complete coverage of all three papers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                paper: 'Paper 1',
                title: 'General Aspects of Energy Management and Energy Audit',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                paper: 'Paper 2', 
                title: 'Energy Efficiency in Thermal Utilities',
                color: 'from-orange-500 to-red-600'
              },
              {
                paper: 'Paper 3',
                title: 'Energy Efficiency in Electrical Utilities', 
                color: 'from-emerald-500 to-cyan-600'
              }
            ].map((paper, index) => (
              <motion.div
                key={paper.paper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl p-6 border border-white/20"
              >
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${paper.color} text-white text-sm font-semibold mb-4`}>
                  {paper.paper}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{paper.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Preparation?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Join thousands of successful candidates who prepared with our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nce/quiz"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <Brain className="h-5 w-5" />
                Start Practice Quiz
              </Link>
              <Link
                href="/nce/test"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Take Mock Test
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/5 backdrop-blur-xl py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            © 2025 saduvbey. Comprehensive NCE preparation platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
