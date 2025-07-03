// app/page.js - Redesigned with minimalist geometric style
'use client';
import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, BookOpen, Target, Zap, Users, Trophy, ArrowRight, Sparkles, Download, Play, ChevronRight, Clock, FileText, PenTool } from "lucide-react"
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

  const features = [
    {
      id: 'quiz',
      title: 'Interactive Quiz',
      subtitle: 'Smart Learning System',
      description: 'AI-powered adaptive quizzes that learn from your performance and optimize your study path.',
      icon: Brain,
      color: '#6366f1',
      href: '/nce/quiz',
      stats: ['2000+ Questions', 'Real-time Analysis', 'Personalized Learning']
    },
    {
      id: 'test',
      title: 'Mock Examinations',
      subtitle: 'Exam Simulation',
      description: 'Full-scale mock tests that replicate actual NCE exam conditions with precise timing.',
      icon: FileText,
      color: '#8b5cf6',
      href: '/nce/test',
      stats: ['Timed Tests', 'Detailed Reports', 'Performance Tracking']
    },
    {
      id: 'notes',
      title: 'Study Materials',
      subtitle: 'Curated Content',
      description: 'Professionally curated study notes organized by topics with visual learning aids.',
      icon: BookOpen,
      color: '#10b981',
      href: '/nce/notes',
      stats: ['50+ Chapters', 'Visual Diagrams', 'Quick Reference']
    },
    {
      id: 'flashcards',
      title: 'Smart Flashcards',
      subtitle: 'Memory Enhancement',
      description: 'Spaced repetition flashcards that adapt to your learning pace and memory retention.',
      icon: PenTool,
      color: '#f59e0b',
      href: '/nce/flashcards',
      stats: ['Active Recall', 'Spaced Repetition', 'Progress Tracking']
    }
  ];

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
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-60 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.05,
            y: -mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 opacity-40 blur-3xl"
        />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-indigo-300 rotate-45"
          />
        </div>
        <div className="absolute bottom-40 right-32">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 rounded-full border-2 border-purple-300"
          />
        </div>
        <div className="absolute top-1/3 right-20">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-8 bg-gradient-to-b from-yellow-300 to-orange-300 rounded-full opacity-60"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            saduvbey
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
            <a href="#products" className="text-gray-700 hover:text-gray-900 transition-colors">Products</a>
            <Link href="/nce">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105">
                Get Started
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
              className="text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight"
            >
              Perfect Your{' '}
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-300% font-normal"
                style={{ backgroundSize: '300% 100%' }}
              >
                Exam Journey
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Experience the future of exam preparation with our precision-engineered learning platform. 
              Clean, focused, and designed for serious learners who demand excellence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/nce">
                <button className="group px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center gap-3">
                  <Play className="h-5 w-5" />
                  Start Learning
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 transition-all">
                View Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          >
            {[
              { label: 'Active Learners', value: '12,000+', icon: Users },
              { label: 'Practice Questions', value: '2,500+', icon: Target },
              { label: 'Study Hours', value: '50,000+', icon: Clock },
              { label: 'Success Rate', value: '94%', icon: Zap }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 transition-all"
              >
                <stat.icon className="h-8 w-8 text-gray-700 mx-auto mb-3" />
                <div className="text-3xl font-light text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
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
                        
                        <div className="space-y-2">
                          {feature.stats.map((stat, idx) => (
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
                              {stat}
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="mt-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group-hover:translate-x-2 transition-all"
                        >
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* NCE Specific Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">NCE Examination Coverage</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Complete preparation for all three papers of the National Certification Examination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  paper: 'Paper 1',
                  title: 'General Aspects of Energy Management and Energy Audit',
                  color: '#6366f1',
                  description: 'Fundamental concepts and principles'
                },
                {
                  paper: 'Paper 2', 
                  title: 'Energy Efficiency in Thermal Utilities',
                  color: '#f59e0b',
                  description: 'Boilers, steam systems, and heat recovery'
                },
                {
                  paper: 'Paper 3',
                  title: 'Energy Efficiency in Electrical Utilities', 
                  color: '#10b981',
                  description: 'Motors, lighting, and power systems'
                }
              ].map((paper, index) => (
                <motion.div
                  key={paper.paper}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 transition-all"
                >
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4"
                    style={{ backgroundColor: paper.color }}
                  >
                    {paper.paper}
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-4">{paper.title}</h3>
                  <p className="text-gray-600">{paper.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="about" className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white"
        >
          <h2 className="text-4xl font-light mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the thousands who've already elevated their NCE exam preparation with our modern platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/nce">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 font-medium">
                Start Your Journey Today
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-gray-400 text-gray-300 rounded-full hover:border-gray-300 hover:text-white transition-all">
              Download Mobile App
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                saduvbey
              </div>
              <p className="text-gray-600 text-sm max-w-xs">
                Empowering students with cutting-edge technology for competitive exam success.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Products</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/nce" className="hover:text-gray-900 transition-colors">NCE Preparation</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">More Exams (Soon)</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Study Guides</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Practice Tests</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 saduvbey. All rights reserved. Empowering exam preparation worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
