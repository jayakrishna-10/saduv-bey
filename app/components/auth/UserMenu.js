// app/components/auth/UserMenu.js
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  BarChart3, 
  Settings, 
  History, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const menuItems = [
    { 
      href: '/profile', 
      icon: User, 
      label: 'Profile' 
    },
    { 
      href: '/profile/analytics', 
      icon: BarChart3, 
      label: 'Analytics' 
    },
    { 
      href: '/profile/history', 
      icon: History, 
      label: 'Study History' 
    },
    { 
      href: '/profile/settings', 
      icon: Settings, 
      label: 'Settings' 
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.name || 'User'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}