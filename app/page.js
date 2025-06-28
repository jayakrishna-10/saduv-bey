// app/page.js
'use client';
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, Target, Zap, Users, Trophy, ArrowRight, Sparkles, Download } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [particles, setParticles] = useState([]);

  // Generate floating particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      duration: Math.random() * 20 + 15
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-2xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-3" href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              saduvbey
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#about">
              About
            </Link>
            <Link className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#products">
              Products
            </Link>
            <Link className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="#contact">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              href="#"
            >
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl border-0 shadow-lg">
                Sign up
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="container mx-auto">
            <div className="flex min-h-[80vh] flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Column: Hero Text */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 space-y-8"
              >
                <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
                  >
                    Prepare.{" "}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Practice
                      </span>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      />
                    </span>
                    . Succeed.
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/80 max-w-2xl"
                  >
                    Your ultimate competitive exam companion. Master your preparation with AI-powered learning, comprehensive study materials, and real-time progress tracking.
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="inline-flex h-12 items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-8 border-0 shadow-lg">
                      <Download className="h-5 w-5" />
                      <span className="font-medium">Download App</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="inline-flex h-12 items-center justify-center space-x-2 backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-8">
                      <Brain className="h-5 w-5" />
                      <span className="font-medium">Try Web Version</span>
                    </Button>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-white/60"
                >
                  Different Platform?{" "}
                  <Link className="font-medium text-white/80 hover:text-white underline transition-colors" href="#contact">
                    Contact us
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Column: Product Cards */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:w-1/2 space-y-6 w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href="/nce" className="block">
                    <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">NCE Preparation</h2>
                          <p className="text-white/70 text-sm">Energy Managers & Auditors</p>
                        </div>
                      </div>
                      <p className="text-white/80 mb-4">
                        Comprehensive preparation for National Certification Examination with interactive quizzes, mock tests, and detailed study materials.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>2000+ Questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>50+ Topics</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                        Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 rounded-3xl shadow-2xl p-8 border border-white/20"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">More Exams</h2>
                      <p className="text-white/70 text-sm">Coming Soon</p>
                    </div>
                  </div>
                  <p className="text-white/80 mb-4">
                    Expanding our platform to cover more competitive exams. Stay tuned for exciting new features and comprehensive study materials.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Growing Community</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>High Success Rate</span>
                    </div>
                  </div>
                  <div className="mt-4 text-white/50 text-sm">
                    Notify me when available
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">saduvbey</span>?
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Advanced features designed to accelerate your learning and boost exam performance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Learning",
                  description: "Personalized study plans and intelligent recommendations based on your progress and performance patterns.",
                  gradient: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  icon: Target,
                  title: "Precision Practice",
                  description: "Targeted practice sessions with real exam questions and detailed explanations for every answer.",
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
                {
                  icon: Trophy,
                  title: "Track Progress",
                  description: "Comprehensive analytics and performance insights to monitor your improvement journey.",
                  gradient: "from-green-500/20 to-emerald-500/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className={`backdrop-blur-xl bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-12 border border-white/20 text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Exam Preparation?
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of successful candidates who achieved their goals with our comprehensive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/nce"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-200"
                  >
                    <Brain className="h-5 w-5" />
                    Start Learning Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                  >
                    <Download className="h-5 w-5" />
                    Download App
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">saduvbey</span>
              </div>
              <p className="text-white/60 text-sm max-w-xs">
                Empowering students with cutting-edge technology for competitive exam success.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/nce" className="hover:text-white transition-colors">NCE Preparation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">More Exams (Soon)</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Study Guides</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Practice Tests</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 saduvbey. All rights reserved. Empowering exam preparation worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
