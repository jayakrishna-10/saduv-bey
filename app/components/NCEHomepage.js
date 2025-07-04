// app/components/NCEHomepage.js - Updated with problem-solution focus and exam info
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, FileText, BookOpen, PenTool, Play, ChevronRight, Target, Clock, Users, CheckCircle, ArrowRight, AlertCircle, ExternalLink, Calendar, Award, DollarSign, Briefcase, Globe, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    id: 'quiz',
    title: 'Interactive Practice',
    subtitle: 'Smart Quiz System',
    description: 'AI-powered adaptive quizzes with instant explanations that understand your learning patterns',
    icon: Brain,
    href: '/nce/quiz',
    color: '#6366f1',
    features: ['Instant AI explanations', 'Topic-wise practice', 'Performance tracking'],
    stats: { questions: '2000+', topics: '50+', success: '94%' }
  },
  {
    id: 'test',
    title: 'Mock Examinations',
    subtitle: 'Real Exam Simulation',
    description: 'Full exam-style tests with precise timing and comprehensive performance analysis',
    icon: FileText,
    href: '/nce/test',
    color: '#8b5cf6',
    features: ['Timed exams', 'Detailed analytics', 'Review mode'],
    stats: { tests: '100+', analysis: 'Deep', time: 'Real-time' }
  },
  {
    id: 'notes',
    title: 'Organized Study Materials',
    subtitle: 'Structured Content',
    description: 'Professionally curated study materials organized by topics with visual aids - no more PDF hunting',
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
    description: 'Spaced repetition flashcards that optimize retention and recall scientifically',
    icon: PenTool,
    href: '/nce/flashcards',
    color: '#f59e0b',
    features: ['Spaced repetition', 'Active recall', 'Progress tracking'],
    stats: { cards: '1500+', retention: '85%', time: 'Optimized' }
  }
];

const traditionalVsModern = [
  {
    traditional: "Scattered PDF files",
    modern: "Organized by topics & years",
    icon: BookOpen,
    color: "text-emerald-500"
  },
  {
    traditional: "Just answers provided",
    modern: "Comprehensive explanations",
    icon: Brain,
    color: "text-blue-500"
  },
  {
    traditional: "Static, outdated content",
    modern: "Interactive, updated platform",
    icon: Target,
    color: "text-purple-500"
  },
  {
    traditional: "No progress tracking",
    modern: "Advanced analytics",
    icon: BarChart3,
    color: "text-indigo-500"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Animated geometric background */}
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
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 opacity-40 blur-3xl"
        />
      </div>

      {/* Problem-Focused Hero Section */}
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
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">NCE Preparation Challenge</span>
              </div>
              <h2 className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4">
                Tired of studying from scattered PDFs with no explanations?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Official BEE materials are unorganized PDFs - we've solved that problem
              </p>
            </motion.div>

            {/* Solution */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-light text-gray-900 dark:text-gray-100 mb-8 leading-tight"
            >
              Master Your{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-emerald-600 to-indigo-600 dark:from-indigo-400 dark:via-emerald-400 dark:to-indigo-400 bg-clip-text text-transparent font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                NCE Certification
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              India's most comprehensive preparation platform for National Certification Examination for Energy Managers and Energy Auditors. 
              Organized, explained, and optimized for your success.
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
                  Start Practice Quiz
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

          {/* Trust Indicators */}
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
                className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
              >
                <stat.icon className="h-8 w-8 text-gray-700 dark:text-gray-300 mx-auto mb-3" />
                <div className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Traditional vs Modern Comparison */}
      <section className="relative z-10 px-8 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Traditional vs Modern Preparation</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See why thousands are switching from PDF-based preparation to our organized platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditionalVsModern.map((comparison, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              >
                <comparison.icon className={`h-8 w-8 ${comparison.color} mx-auto mb-4`} />
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-red-500 text-sm">❌</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{comparison.traditional}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-emerald-500 text-sm">✅</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">{comparison.modern}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Complete Preparation Suite</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to ace the NCE examination in one organized platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onHoverStart={() => setActiveFeature(index)}
                className="group cursor-pointer"
              >
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
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{feature.subtitle}</div>
                        <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                        
                        <div className="space-y-2 mb-6">
                          {feature.features.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
                              className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: feature.color }}
                              />
                              {item}
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex gap-4 mb-6">
                          {Object.entries(feature.stats).map(([key, value], idx) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-light text-gray-900 dark:text-gray-100">{value}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                        
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the NCE Exam Section */}
      <section className="relative z-10 px-8 py-20 bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-900/20 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">About the NCE Examination</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about the National Certification Examination for Energy Managers and Energy Auditors
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
                Examination Structure
              </h3>
              <div className="space-y-6">
                {[
                  {
                    paper: 'Paper 1',
                    title: 'General Aspects of Energy Management and Energy Audit',
                    duration: '3 hours',
                    questions: '100 MCQs',
                    marks: '100',
                    color: '#6366f1'
                  },
                  {
                    paper: 'Paper 2', 
                    title: 'Energy Efficiency in Thermal Utilities',
                    duration: '3 hours',
                    questions: '100 MCQs',
                    marks: '100',
                    color: '#f59e0b'
                  },
                  {
                    paper: 'Paper 3',
                    title: 'Energy Efficiency in Electrical Utilities', 
                    duration: '3 hours',
                    questions: '100 MCQs',
                    marks: '100',
                    color: '#10b981'
                  }
                ].map((paper, index) => (
                  <div key={paper.paper} className="border-l-4 pl-4" style={{ borderColor: paper.color }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-2 py-1 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: paper.color }}
                      >
                        {paper.paper}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{paper.duration} • {paper.questions} • {paper.marks} marks</span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{paper.title}</h4>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Key Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Exam Schedule</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Typically held twice a year (May & November)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Passing Criteria</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Minimum 50% in each paper + 60% aggregate</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Eligibility</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Engineering/Science graduates with relevant experience</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Career Benefits</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Energy Manager/Auditor certification by BEE</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Official Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
          >
            <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Official Resources & Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Bureau of Energy Efficiency (BEE)",
                  description: "Official exam conducting body",
                  url: "https://beeindia.gov.in",
                  type: "Official Website"
                },
                {
                  title: "NCE Notification & Registration",
                  description: "Latest exam notifications and registration",
                  url: "https://beeindia.gov.in/content/nce-energy-manager-energy-auditor",
                  type: "Registration"
                },
                {
                  title: "Syllabus & Exam Pattern",
                  description: "Detailed syllabus and examination pattern",
                  url: "https://beeindia.gov.in/sites/default/files/NCE%20Brochure%202023.pdf",
                  type: "Syllabus"
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
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">{resource.type}</span>
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

      {/* Social Proof & Success Stories */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Join Successful Candidates</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thousands have already upgraded their preparation with our organized platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Rajesh Kumar",
                role: "Energy Manager",
                company: "Manufacturing Industry",
                quote: "Finally, a platform that organizes everything. No more hunting through PDFs!",
                success: "Passed all 3 papers in first attempt"
              },
              {
                name: "Priya Sharma",
                role: "Energy Auditor",
                company: "Consulting Firm",
                quote: "The explanations are incredibly detailed. Understood concepts I struggled with for months.",
                success: "Scored 78% aggregate"
              },
              {
                name: "Amit Patel",
                role: "Mechanical Engineer",
                company: "Power Plant",
                quote: "AskAI feature is a game changer. It's like having a personal tutor 24/7.",
                success: "Top 10% in NCE 2024"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="mb-4">
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1">{testimonial.success}</div>
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
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 rounded-3xl text-white dark:text-gray-900"
        >
          <h2 className="text-4xl font-light mb-6">Ready to Start Your NCE Success Journey?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands who've upgraded from scattered PDFs to organized, AI-powered preparation
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/nce/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium flex items-center gap-3 justify-center shadow-lg"
              >
                <Brain className="h-5 w-5" />
                Start Practice Quiz
              </motion.button>
            </Link>
            <Link href="/nce/test">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-300 dark:text-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 hover:text-white dark:hover:text-gray-500 transition-all flex items-center gap-3 justify-center"
              >
                <FileText className="h-5 w-5" />
                Take Mock Test
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 saduvbey. India's most comprehensive NCE preparation platform. 
            <span className="block mt-2">
              <em>Not affiliated with BEE. Independent preparation platform.</em>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
