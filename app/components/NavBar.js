// app/components/NavBar.js - Redesigned with minimalist geometric style
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const isNCESection = pathname.startsWith('/nce');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-[60] w-full bg-white/30 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                saduvbey
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {isNCESection ? (
                <>
                  {/* NCE Section Navigation */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 px-3 py-1 bg-white/50 rounded-full flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      NCE Preparation
                    </span>
                    
                    {/* NCE Sub-navigation */}
                    <div className="flex items-center gap-1">
                      <Link href="/nce/quiz">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                            pathname === '/nce/quiz'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Quiz
                        </motion.button>
                      </Link>
                      <Link href="/nce/test">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                            pathname === '/nce/test'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Test
                        </motion.button>
                      </Link>
                      <Link href="/nce/notes">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                            pathname.startsWith('/nce/notes')
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Notes
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                  
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </motion.button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Main Site Navigation */}
                  <div className="flex items-center gap-6">
                    <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                      Features
                    </a>
                    <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                      About
                    </a>
                    <a href="#products" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                      Products
                    </a>
                  </div>
                  
                  <Link href="/nce">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-medium"
                    >
                      NCE Exam
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden bg-white/90 backdrop-blur-xl border-t border-gray-200/50"
        >
          <div className="px-6 py-4 space-y-3">
            {isNCESection ? (
              <>
                {/* NCE Mobile Menu */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide px-3">NCE Preparation</div>
                  <Link href="/nce/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${
                      pathname === '/nce/quiz'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Practice Quiz
                    </div>
                  </Link>
                  <Link href="/nce/test" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${
                      pathname === '/nce/test'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Mock Tests
                    </div>
                  </Link>
                  <Link href="/nce/notes" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${
                      pathname.startsWith('/nce/notes')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      Study Notes
                    </div>
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Main Site Mobile Menu */}
                <div className="space-y-2">
                  <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    Features
                  </a>
                  <a href="#about" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    About
                  </a>
                  <a href="#products" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    Products
                  </a>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <Link href="/nce" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="px-3 py-2 bg-gray-900 text-white rounded-lg text-center font-medium">
                      NCE Exam Preparation
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
