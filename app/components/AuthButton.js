// FILE: app/components/AuthButton.js
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, User, LayoutDashboard, Loader2, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative" ref={menuRef}>
        {/* Profile Button */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 hidden md:block ${
              isMenuOpen ? 'rotate-180' : ''
            }`} 
          />
        </motion.button>

        {/* Dropdown Menu - Same pattern as NavBar mobile menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute right-0 top-full mt-2 overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl z-50 min-w-[200px]"
        >
          <div className="p-2">
            {/* User Info */}
            <div className="px-3 py-2 border-b border-gray-200/50 dark:border-gray-700/50 mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Signed in as
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {session.user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session.user.email}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <Link 
                href="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
              >
                <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Backdrop for mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => signIn('google')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium text-sm"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden xs:inline">Sign In</span>
    </motion.button>
  );
}
