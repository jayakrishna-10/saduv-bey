// FILE: app/components/test/TestReviewNavigation.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckSquare, Grid, MessageSquare } from 'lucide-react';

export function TestReviewNavigation({ 
  onPrevious, 
  onNext, 
  onFinishReview, 
  hasPrev, 
  hasNext, 
  onPaletteToggle,
  onFeedbackOpen
}) {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine responsive layout based on screen width
  const isExtraSmall = screenWidth > 0 && screenWidth < 320;  // Very small phones
  const isSmall = screenWidth > 0 && screenWidth < 400;       // Small phones
  const isMedium = screenWidth > 0 && screenWidth < 640;      // Medium phones
  const isLarge = screenWidth >= 640;                         // Tablets and up

  // Dynamic styles based on screen size
  const getContainerPadding = () => {
    if (isExtraSmall) return 'p-1';
    if (isSmall) return 'p-1.5';
    if (isMedium) return 'p-2';
    return 'p-2';
  };

  const getButtonPadding = () => {
    if (isExtraSmall) return 'p-2';
    if (isSmall) return 'p-2.5';
    if (isMedium) return 'p-3';
    return 'p-3';
  };

  const getButtonSpacing = () => {
    if (isExtraSmall) return 'gap-1';
    if (isSmall) return 'gap-1.5';
    if (isMedium) return 'gap-2';
    return 'gap-3';
  };

  const getTextButtonPadding = () => {
    if (isExtraSmall) return 'px-2 py-2';
    if (isSmall) return 'px-3 py-2';
    if (isMedium) return 'px-3 py-2';
    return 'px-4 py-2';
  };

  const getIconSize = () => {
    if (isExtraSmall) return 'h-4 w-4';
    if (isSmall) return 'h-4 w-4';
    return 'h-4 w-4';
  };

  const getTextSize = () => {
    if (isExtraSmall) return 'text-xs';
    if (isSmall) return 'text-xs';
    if (isMedium) return 'text-sm';
    return 'text-sm';
  };

  // Navigation arrow buttons
  const NavButton = ({ onClick, disabled, icon: Icon, direction }) => (
    <motion.button 
      onClick={onClick} 
      disabled={!disabled} 
      whileHover={{ scale: disabled ? 1.1 : 1 }} 
      whileTap={{ scale: disabled ? 0.95 : 1 }}
      className={`${getButtonPadding()} rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700 transition-all`}
      title={direction === 'prev' ? 'Previous Question' : 'Next Question'}
    >
      <Icon className={`${getIconSize()} text-gray-700 dark:text-gray-300`} />
    </motion.button>
  );

  // Action buttons with responsive text
  const ActionButton = ({ onClick, className, icon: Icon, children, shortText, title }) => {
    const showText = !isExtraSmall;
    const displayText = isSmall ? (shortText || children) : children;
    
    return (
      <motion.button 
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center ${getTextButtonPadding()} rounded-xl transition-all font-medium ${getTextSize()} ${className}`}
        title={title}
      >
        <Icon className={`${getIconSize()} ${showText ? 'mr-1.5' : ''}`} />
        {showText && <span className="truncate">{displayText}</span>}
      </motion.button>
    );
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 inset-x-0 flex justify-center z-50 px-4"
    >
      <div className={`flex items-center ${getButtonSpacing()} bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl ${getContainerPadding()} max-w-full overflow-hidden`}>
        
        {/* Previous Button */}
        <NavButton 
          onClick={onPrevious}
          disabled={hasPrev}
          icon={ChevronLeft}
          direction="prev"
        />
        
        {/* Center Action Buttons - Responsive Layout */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 justify-center">
          {/* Question Palette Button */}
          <ActionButton
            onClick={onPaletteToggle}
            icon={Grid}
            className="bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 flex-shrink-0"
            shortText="Grid"
            title="Question Palette"
          >
            {isMedium ? "Grid" : "Questions"}
          </ActionButton>

          {/* Feedback Button */}
          <ActionButton
            onClick={onFeedbackOpen}
            icon={MessageSquare}
            className="bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 flex-shrink-0"
            shortText="Report"
            title="Report Issue"
          >
            Report
          </ActionButton>
          
          {/* Finish Review Button */}
          <ActionButton
            onClick={onFinishReview}
            icon={CheckSquare}
            className="bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 flex-shrink-0"
            shortText="Done"
            title="Finish Review"
          >
            {isMedium ? "Finish" : "Finish Review"}
          </ActionButton>
        </div>
        
        {/* Next Button */}
        <NavButton 
          onClick={onNext}
          disabled={hasNext}
          icon={ChevronRight}
          direction="next"
        />
      </div>
    </motion.div>
  );
}
