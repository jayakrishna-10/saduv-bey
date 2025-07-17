// FILE: app/components/test/TestNavigation.js
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid, Flag } from 'lucide-react';

export function TestNavigation({ onPrevious, onNext, onPaletteToggle, onFinishConfirm, hasPrev, hasNext }) {
  return (
    <AnimatePresence>
      {/* Desktop Orbs */}
      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <motion.button onClick={onPrevious} disabled={!hasPrev} whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border shadow-xl disabled:opacity-50"><ChevronLeft /></motion.button>
      </motion.div>
      <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <motion.button onClick={onNext} disabled={!hasNext} whileHover={{ scale: 1.1 }} className="p-4 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border shadow-xl disabled:opacity-50"><ChevronRight /></motion.button>
      </motion.div>

      {/* Bottom Dock (Mobile and Desktop) */}
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 inset-x-0 flex justify-center z-50">
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border shadow-xl p-2">
            <button onClick={onPrevious} disabled={!hasPrev} className="md:hidden p-3 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-50"><ChevronLeft /></button>
            <button onClick={onPaletteToggle} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all">
                <Grid className="h-4 w-4" />
                <span className="text-sm font-medium">Palette</span>
            </button>
            <button onClick={onFinishConfirm} className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-xl transition-all">
                <Flag className="h-4 w-4" />
                <span className="text-sm font-medium">Finish</span>
            </button>
            <button onClick={onNext} disabled={!hasNext} className="md:hidden p-3 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-50"><ChevronRight /></button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
