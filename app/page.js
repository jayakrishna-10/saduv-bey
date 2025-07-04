// app/page.js - Updated with problem-focused positioning and NCE emphasis
'use client';
import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, BookOpen, Target, Zap, Users, Trophy, ArrowRight, Sparkles, Download, Play, ChevronRight, Clock, FileText, PenTool, CheckCircle, AlertCircle, MessageCircle, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const problemSolutions = [
    {
      problem: "Scattered PDF Study Materials",
      solution: "Organized, Categorized Question Banks",
      icon: FileText,
      color: "from-red-500 to-orange-500"
    },
    {
      problem: "No Explanations Provided",
      solution: "Comprehensive AI-Powered Explanations",
      icon: Brain,
      color: "from-blue-500 to-indigo-500"
    },
    {
      problem: "Static, Outdated Content",
      solution: "Interactive, Modern Learning Experience",
      icon: Sparkles,
      color: "from-emerald-500 to-cyan-500"
    },
    {
      problem: "No Progress Tracking",
      solution: "Advanced Analytics & Performance Insights",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const uniqueFeatures = [
    {
      id: 'ai-assistant',
      title: 'Contextual AI Assistant',
      subtitle: 'AskAI - Your Smart Study Companion',
      description: 'Get instant help that understands exactly what you\'re studying. Our AI reads the current page content and provides relevant explanations.',
      icon: MessageCircle,
      color: '#8b5cf6',
      badge: 'Exclusive',
      benefits: ['Context-aware responses', 'Instant doubt clearing', 'Available on every page']
    },
    {
      id: 'organized-content',
      title: 'Systematically Organized Content',
      subtitle: 'No More PDF Hunting',
      description: 'All questions categorized by papers, topics, and years. Find exactly what you need to study without digging through scattered files.',
      icon: BookOpen,
      color: '#10b981',
      badge: 'Core Feature',
      benefits: ['Topic-wise categorization', 'Year-wise filtering', 'Paper-wise organization']
    },
    {
      id: 'comprehensive-explanations',
      title: 'Detailed Explanations',
      subtitle: 'Beyond Just Answers',
      description: 'Every question comes with comprehensive explanations, formulas, concepts, and practical applications - not just correct answers.',
      icon: Brain,
      color: '#6366f1',
      badge: 'Value Added',
      benefits: ['Concept explanations', 'Formula derivations', 'Practical examples']
    },
    {
      id: 'modern-experience',
      title: 'Modern Learning Platform',
      subtitle: 'Study Anywhere, Anytime',
      description: 'Responsive design, progress tracking, performance analytics, and seamless experience across all devices.',
      icon: Zap,
      color: '#f59e0b',
      badge: 'User Experience',
      benefits: ['Mobile-first design', 'Progress tracking', 'Performance analytics']
    }
  ];

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

      {/* Hero Section - Problem-Focused */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-full mb-6">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">Common Problem</span>
              </div>
              <h2 className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4">
                Struggling with scattered PDFs and fragmented study materials?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Most students waste hours hunting through disorganized content with no proper explanations
              </p>
            </div>

            {/* Solution */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-light text-gray-900 dark:text-gray-100 mb-8 leading-tight"
            >
              The Modern Way to{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent bg-300% font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Master Exams
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Organized study materials, AI-powered explanations, and comprehensive practice tests - 
              all designed for serious learners who demand excellence in professional certification exams.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/nce">
                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg">
                  <Play className="h-5 w-5" />
                  Start NCE Preparation
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#features">
                <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                  See How It Works
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>2,500+ Organized Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>AI-Powered Explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>5,000+ Active Learners</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section id="features" className="relative z-10 px-8 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Why Students Choose Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We solve the real problems that hold students back from exam success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {problemSolutions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} text-white`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 dark:text-red-400 text-sm">❌ Problem:</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.problem}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 dark:text-emerald-400 text-sm">✅ Our Solution:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{item.solution}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Features you won't find anywhere else - designed specifically for modern learners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="h-full p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center relative"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                      <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-medium">
                        {feature.badge}
                      </div>
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{feature.subtitle}</div>
                      <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                      
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 + idx * 0.05 }}
                            className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: feature.color }}
                            />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Focus - NCE Section */}
      <section className="relative z-10 px-8 py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              Currently Available
            </div>
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
              NCE Certification Preparation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Master the National Certification Examination for Energy Managers and Energy Auditors with our comprehensive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                paper: 'Paper 1',
                title: 'General Aspects of Energy Management and Energy Audit',
                questions: '800+',
                color: '#6366f1',
                icon: '📊'
              },
              {
                paper: 'Paper 2', 
                title: 'Energy Efficiency in Thermal Utilities',
                questions: '900+',
                color: '#f59e0b',
                icon: '🔥'
              },
              {
                paper: 'Paper 3',
                title: 'Energy Efficiency in Electrical Utilities', 
                questions: '800+',
                color: '#10b981',
                icon: '⚡'
              }
            ].map((paper, index) => (
              <motion.div
                key={paper.paper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all text-center"
              >
                <div className="text-4xl mb-4">{paper.icon}</div>
                <div 
                  className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4"
                  style={{ backgroundColor: paper.color }}
                >
                  {paper.paper}
                </div>
                <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4">{paper.title}</h3>
                <div className="text-2xl font-light text-gray-700 dark:text-gray-300">{paper.questions}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Questions Available</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/nce">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform shadow-lg font-medium text-lg"
              >
                Start NCE Preparation Now
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof & Stats */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { label: 'Active Learners', value: '5,000+', icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Practice Questions', value: '2,500+', icon: Target, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Study Hours Saved', value: '15,000+', icon: Clock, color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Success Rate', value: '94%', icon: Trophy, color: 'text-yellow-600 dark:text-yellow-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-3xl text-white dark:text-gray-900"
        >
          <h2 className="text-4xl font-light mb-6">Ready to Transform Your Exam Preparation?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands who've upgraded from scattered PDFs to organized, AI-powered learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nce">
              <button className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform hover:scale-105 font-medium">
                Start Your NCE Journey
              </button>
            </Link>
            <Link href="#features">
              <button className="px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-300 dark:text-gray-600 rounded-full hover:border-gray-300 dark:hover:border-gray-500 hover:text-white dark:hover:text-gray-500 transition-all">
                Learn More About Features
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                saduvbey
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
                The modern way to prepare for professional certification exams with AI-powered learning.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Current Offerings</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><Link href="/nce" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">NCE Preparation</Link></li>
                <li><span className="text-gray-400 dark:text-gray-500">More Exams (Coming Soon)</span></li>
                <li><span className="text-gray-400 dark:text-gray-500">Mobile App (Coming Soon)</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>AI-Powered Explanations</li>
                <li>Organized Question Banks</li>
                <li>Performance Analytics</li>
                <li>Mobile-Friendly Platform</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 saduvbey. Empowering students with modern exam preparation technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
