// app/components/test/TestReviewNavigation.js - Enhanced mobile optimization
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
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine responsive layout based on screen width
  const isExtraSmall = screenWidth > 0 && screenWidth < 320;  // Very small phones
  const isSmall = screenWidth > 0 && screenWidth < 360;       // Small phones
  const isMedium = screenWidth > 0 && screenWidth < 480;      // Medium phones
  const isLarge = screenWidth >= 480;                         // Large phones and up

  // Dynamic styles based on screen size
  const getContainerPadding = () => {
    if (isExtraSmall) return 'p-1.5';
    if (isSmall) return 'p-2';
    if (isMedium) return 'p-2';
    return 'p-3';
  };

  const getButtonPadding = () => {
    if (isExtraSmall) return 'p-2';
    if (isSmall) return 'p-2.5';
    if (isMedium) return 'p-2.5';
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
    if (isSmall) return 'px-2.5 py-2';
    if (isMedium) return 'px-3 py-2';
    return 'px-4 py-2.5';
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

  const getContainerSpacing = () => {
    if (isExtraSmall) return 'bottom-3 left-2 right-2';
    if (isSmall) return 'bottom-3 left-2 right-2';
    if (isMedium) return 'bottom-4 left-3 right-3';
    return 'bottom-4 left-4 right-4';
  };

  // Navigation arrow buttons
  const NavButton = ({ onClick, disabled, icon: Icon, direction, title }) => (
    <motion.button 
      onClick={onClick} 
      disabled={!disabled} 
      whileHover={{ scale: disabled ? 1.05 : 1 }} 
      whileTap={{ scale: disabled ? 0.95 : 1 }}
      className={`${getButtonPadding()} rounded-xl transition-all flex-shrink-0 ${
        disabled 
          ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-lg' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
      }`}
      title={title}
    >
      <Icon className={`${getIconSize()} ${disabled ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
    </motion.button>
  );

  // Action buttons with responsive text
  const ActionButton = ({ onClick, className, icon: Icon, children, shortText, title }) => {
    const showText = !isExtraSmall;
    const displayText = (isSmall || isMedium) ? (shortText || children) : children;
    
    return (
      <motion.button 
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-center ${getTextButtonPadding()} rounded-xl transition-all font-medium ${getTextSize()} min-w-0 flex-shrink ${className}`}
        title={title}
      >
        <Icon className={`${getIconSize()} ${showText ? 'mr-1.5' : ''} flex-shrink-0`} />
        {showText && <span className="truncate min-w-0">{displayText}</span>}
      </motion.button>
    );
  };

  if (!isMobile) {
    // Desktop layout - Enhanced floating navigation
    return (
      <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 px-6">
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 100, opacity: 0 }}
          className="flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-3"
        >
          {/* Previous Button */}
          <motion.button 
            onClick={onPrevious} 
            disabled={!hasPrev} 
            whileHover={{ scale: hasPrev ? 1.05 : 1 }} 
            whileTap={{ scale: hasPrev ? 0.95 : 1 }}
            className={`p-3 rounded-xl transition-all ${
              hasPrev 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title="Previous Question"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          
          {/* Center Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Question Palette Button */}
            <motion.button
              onClick={onPaletteToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all font-medium text-sm"
            >
              <Grid className="h-4 w-4" />
              Questions
            </motion.button>

            {/* Feedback Button */}
            <motion.button
              onClick={onFeedbackOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-all font-medium text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Report
            </motion.button>
            
            {/* Finish Review Button */}
            <motion.button
              onClick={onFinishReview}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all font-medium text-sm"
            >
              <CheckSquare className="h-4 w-4" />
              Finish Review
            </motion.button>
          </div>
          
          {/* Next Button */}
          <motion.button 
            onClick={onNext} 
            disabled={!hasNext} 
            whileHover={{ scale: hasNext ? 1.05 : 1 }} 
            whileTap={{ scale: hasNext ? 0.95 : 1 }}
            className={`p-3 rounded-xl transition-all ${
              hasNext 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title="Next Question"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Mobile layout - Enhanced responsive design
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className={`fixed ${getContainerSpacing()} flex justify-center z-50`}
    >
      <div className={`flex items-center ${getButtonSpacing()} bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl ${getContainerPadding()} max-w-full overflow-hidden`}>
        
        {/* Previous Button */}
        <NavButton 
          onClick={onPrevious}
          disabled={hasPrev}
          icon={ChevronLeft}
          direction="prev"
          title="Previous Question"
        />
        
        {/* Center Action Buttons - Ultra Responsive Layout */}
        <div className={`flex items-center ${getButtonSpacing()} min-w-0 flex-1 justify-center overflow-hidden`}>
          {isExtraSmall ? (
            // Extra small screens: Only icons, minimal spacing
            <>
              <ActionButton
                onClick={onPaletteToggle}
                icon={Grid}
                className="bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300"
                title="Question Palette"
              />

              <ActionButton
                onClick={onFeedbackOpen}
                icon={MessageSquare}
                className="bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                title="Report Issue"
              />
              
              <ActionButton
                onClick={onFinishReview}
                icon={CheckSquare}
                className="bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300"
                title="Finish Review"
              />
            </>
          ) : isSmall ? (
            // Small screens: Icons with minimal text
            <>
              <ActionButton
                onClick={onPaletteToggle}
                icon={Grid}
                className="bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300"
                shortText="Grid"
                title="Question Palette"
              >
                Grid
              </ActionButton>

              <ActionButton
                onClick={onFeedbackOpen}
                icon={MessageSquare}
                className="bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                shortText="Report"
                title="Report Issue"
              >
                Report
              </ActionButton>
              
              <ActionButton
                onClick={onFinishReview}
                icon={CheckSquare}
                className="bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300"
                shortText="Done"
                title="Finish Review"
              >
                Done
              </ActionButton>
            </>
          ) : isMedium ? (
            // Medium screens: Icons with short text
            <>
              <ActionButton
                onClick={onPaletteToggle}
                icon={Grid}
                className="bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300"
                shortText="Questions"
                title="Question Palette"
              >
                Questions
              </ActionButton>

              <ActionButton
                onClick={onFeedbackOpen}
                icon={MessageSquare}
                className="bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                shortText="Report"
                title="Report Issue"
              >
                Report
              </ActionButton>
              
              <ActionButton
                onClick={onFinishReview}
                icon={CheckSquare}
                className="bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300"
                shortText="Finish"
                title="Finish Review"
              >
                Finish
              </ActionButton>
            </>
          ) : (
            // Large mobile screens: Full text
            <>
              <ActionButton
                onClick={onPaletteToggle}
                icon={Grid}
                className="bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300"
                title="Question Palette"
              >
                Questions
              </ActionButton>

              <ActionButton
                onClick={onFeedbackOpen}
                icon={MessageSquare}
                className="bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300"
                title="Report Issue"
              >
                Report
              </ActionButton>
              
              <ActionButton
                onClick={onFinishReview}
                icon={CheckSquare}
                className="bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300"
                title="Finish Review"
              >
                Finish Review
              </ActionButton>
            </>
          )}
        </div>
        
        {/* Next Button */}
        <NavButton 
          onClick={onNext}
          disabled={hasNext}
          icon={ChevronRight}
          direction="next"
          title="Next Question"
        />
      </div>
    </motion.div>
  );
}
