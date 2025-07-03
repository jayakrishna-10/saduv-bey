import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileText, BookOpen, PenTool, Play, ChevronRight, Zap, Target, Clock, Users, Download, Sparkles, ArrowRight } from 'lucide-react';

export default function MinimalistHomepage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFeature, setCurrentFeature] = useState(0);

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

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 'quiz',
      title: 'Interactive Quiz',
      subtitle: 'Smart Learning System',
      description: 'AI-powered adaptive quizzes that learn from your performance and optimize your study path.',
      icon: Brain,
      color: '#6366f1',
      stats: ['2000+ Questions', 'Real-time Analysis', 'Personalized Learning'],
      href: '/nce/quiz'
    },
    {
      id: 'test',
      title: 'Mock Examinations',
      subtitle: 'Exam Simulation',
      description: 'Full-scale mock tests that replicate actual NCE exam conditions with precise timing.',
      icon: FileText,
      color: '#8b5cf6',
      stats: ['Timed Tests', 'Detailed Reports', 'Performance Tracking'],
      href: '/nce/test'
    },
    {
      id: 'notes',
      title: 'Study Materials',
      subtitle: 'Curated Content',
      description: 'Professionally curated study notes organized by topics with visual learning aids.',
      icon: BookOpen,
      color: '#10b981',
      stats: ['50+ Chapters', 'Visual Diagrams', 'Quick Reference'],
      href: '/nce/notes'
    }
  ];

  const stats = [
    { label: 'Practice Questions', value: '2,500+', icon: Target, color: '#6366f1' },
    { label: 'Study Materials', value: '50+', icon: BookOpen, color: '#10b981' },
    { label: 'Mock Tests', value: '25+', icon: Clock, color: '#8b5cf6' },
    { label: 'Success Rate', value: '94%', icon: Zap, color: '#f59e0b' }
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
        <div className="absolute top-2/3 left-1/4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-indigo-400 rounded-full opacity-70"
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              saduvbey
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
            <a href="/nce" className="text-gray-700 hover:text-gray-900 transition-colors">NCE Prep</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all"
            >
              Get Started
            </motion.button>
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
                style={{ backgroundSize: "300% 100%" }}
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
              Clean, focused, and designed for serious learners seeking excellence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.a
                href="/nce"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all flex items-center gap-3"
              >
                <Play className="h-5 w-5" />
                Start Learning
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 hover:bg-gray-100 transition-all"
              >
                <Download className="h-5 w-5 inline mr-2" />
                Download App
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-light text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Product Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                NCE Preparation Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive preparation for National Certification Examination for Energy Managers and Energy Auditors
              </p>
            </div>

            <div className="relative p-8 md:p-12 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Feature Description */}
                <div>
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${features[currentFeature].color}20` }}
                      >
                        <features[currentFeature].icon 
                          className="h-8 w-8" 
                          style={{ color: features[currentFeature].color }} 
                        />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{features[currentFeature].subtitle}</div>
                        <h3 className="text-3xl font-light text-gray-900">{features[currentFeature].title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {features[currentFeature].description}
                    </p>
                    
                    <div className="space-y-3">
                      {features[currentFeature].stats.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 text-gray-600"
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: features[currentFeature].color }}
                          />
                          {stat}
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.a
                      href={features[currentFeature].href}
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-all group"
                    >
                      Try {features[currentFeature].title}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </motion.div>
                </div>

                {/* Feature Tabs */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.button
                      key={feature.id}
                      onClick={() => setCurrentFeature(index)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full p-6 rounded-2xl border transition-all text-left ${
                        currentFeature === index
                          ? 'bg-white border-gray-300 shadow-lg'
                          : 'bg-white/30 border-gray-200 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${feature.color}20` }}
                        >
                          <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{feature.title}</div>
                          <div className="text-sm text-gray-600">{feature.subtitle}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Papers Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">Examination Structure</h2>
              <p className="text-lg text-gray-600">Complete coverage of all three NCE papers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  paper: 'Paper 1',
                  title: 'General Aspects of Energy Management and Energy Audit',
                  color: '#6366f1',
                  topics: ['Energy Scenario', 'Energy Management', 'Financial Management']
                },
                {
                  paper: 'Paper 2',
                  title: 'Energy Efficiency in Thermal Utilities',
                  color: '#f59e0b',
                  topics: ['Fuels & Combustion', 'Boilers', 'Steam Systems']
                },
                {
                  paper: 'Paper 3',
                  title: 'Energy Efficiency in Electrical Utilities',
                  color: '#10b981',
                  topics: ['Electric Motors', 'HVAC Systems', 'Lighting']
                }
              ].map((paper, index) => (
                <motion.div
                  key={paper.paper}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="inline-block px-4 py-2 rounded-2xl text-white text-sm font-medium mb-6"
                    style={{ backgroundColor: paper.color }}
                  >
                    {paper.paper}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">{paper.title}</h3>
                  <div className="space-y-2">
                    {paper.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: paper.color }}
                        />
                        {topic}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-light mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands who've already elevated their exam preparation with our comprehensive platform
            </p>
            <motion.a
              href="/nce"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all font-medium"
            >
              Start Your Journey Today
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-light text-gray-900">saduvbey</span>
              </div>
              <p className="text-gray-600 text-sm max-w-xs">
                Empowering students with cutting-edge technology for competitive exam success.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Products</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/nce" className="hover:text-gray-900 transition-colors">NCE Preparation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">More Exams (Soon)</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Study Guides</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Practice Tests</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
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
  );
}
