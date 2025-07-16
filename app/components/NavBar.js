// FILE: app/components/NavBar.js
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import AuthButton from './AuthButton'; // Import the new AuthButton

export default function NavBar() {
  const pathname = usePathname();
  const isNCESection = pathname.startsWith('/nce');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme, isLoading } = useTheme();

  return (
    <>
      <nav className="fixed top-0 z-[60] w-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                >
                  saduvbey
                </motion.div>
              </Link>
              
              <motion.button
                onClick={toggleTheme}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                    />
                  ) : isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4 text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {isNCESection ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      NCE Preparation
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Link href="/nce/quiz">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${ pathname === '/nce/quiz' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                          Quiz
                        </motion.button>
                      </Link>
                      <Link href="/nce/test">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${ pathname === '/nce/test' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                          Test
                        </motion.button>
                      </Link>
                      <Link href="/nce/notes">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${ pathname.startsWith('/nce/notes') ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                          Notes
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                  
                  <Link href="/">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <Home className="h-4 w-4" />
                      Home
                    </motion.button>
                  </Link>
                  <AuthButton />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm font-medium">
                      Features
                    </a>
                  </div>
                  
                  <Link href="/nce">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium">
                      NCE Exam
                    </motion.button>
                  </Link>
                  <AuthButton />
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <AuthButton />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="px-6 py-4 space-y-3">
            {isNCESection ? (
              <>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3">NCE Preparation</div>
                  <Link href="/nce/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${ pathname === '/nce/quiz' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                      Practice Quiz
                    </div>
                  </Link>
                  <Link href="/nce/test" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${ pathname === '/nce/test' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                      Mock Tests
                    </div>
                  </Link>
                  <Link href="/nce/notes" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg transition-all ${ pathname.startsWith('/nce/notes') ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                      Study Notes
                    </div>
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <a href="#features" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    Features
                  </a>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <Link href="/nce" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-center font-medium">
                      NCE Exam Preparation
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </nav>
      <div className="h-16" />
    </>
  );
}
