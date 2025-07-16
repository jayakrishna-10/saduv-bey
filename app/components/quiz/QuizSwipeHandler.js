// app/components/quiz/QuizSwipeHandler.js - Updated with session-based hint tracking
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizSwipeHandler({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
  children,
  swipeThreshold = 50,
  velocityThreshold = 500,
  currentQuestionIndex = 0 // Add this to track question changes
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [questionsWithHints, setQuestionsWithHints] = useState(new Set());
  const [shouldShowHint, setShouldShowHint] = useState(false);
  const dragStartRef = useRef(null);
  const hintTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track hints for first 3 questions only
  useEffect(() => {
    if (!isMobile) return;
    
    // Show hint for first 3 unique questions only
    if (questionsWithHints.size < 3 && !questionsWithHints.has(currentQuestionIndex)) {
      setShouldShowHint(true);
      setQuestionsWithHints(prev => new Set([...prev, currentQuestionIndex]));
      
      // Auto-hide hint after 3 seconds
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setShouldShowHint(false);
      }, 3000);
    }

    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, [currentQuestionIndex, isMobile, questionsWithHints]);

  // Reset hints when quiz is restarted (currentQuestionIndex goes back to 0 with empty Set)
  useEffect(() => {
    if (currentQuestionIndex === 0 && questionsWithHints.size > 0) {
      setQuestionsWithHints(new Set());
    }
  }, [currentQuestionIndex, questionsWithHints.size]);

  const handlePanStart = (event, info) => {
    if (disabled || !isMobile) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: info.point.x, y: info.point.y };
    setShouldShowHint(false); // Hide hint when user starts interacting
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePan = (event, info) => {
    if (disabled || !isMobile || !isDragging) return;

    const deltaX = info.offset.x;
    const deltaY = info.offset.y;
    
    // Determine primary direction based on larger delta
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setDragDirection(deltaY > 0 ? 'down' : 'up');
    }
  };

  const handlePanEnd = (event, info) => {
    if (disabled || !isMobile) return;

    setIsDragging(false);
    setDragDirection(null);
    
    const deltaX = info.offset.x;
    const deltaY = info.offset.y;
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;

    // Check if swipe meets threshold requirements
    const horizontalSwipe = Math.abs(deltaX) > swipeThreshold || Math.abs(velocityX) > velocityThreshold;
    const verticalSwipe = Math.abs(deltaY) > swipeThreshold || Math.abs(velocityY) > velocityThreshold;

    // Determine swipe direction and trigger appropriate callback
    if (horizontalSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
        // Haptic feedback for successful swipe
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
        // Haptic feedback for successful swipe
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      }
    } else if (verticalSwipe && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
        // Haptic feedback for successful swipe
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
        // Haptic feedback for successful swipe
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      }
    }

    dragStartRef.current = null;
  };

  // Visual feedback variants - reduced scale for less distraction
  const dragVariants = {
    idle: { 
      x: 0, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    dragging: {
      scale: 0.99, // More subtle scale change
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  // Swipe direction indicator
  const getSwipeIndicator = () => {
    if (!isDragging || !dragDirection || !isMobile) return null;

    const indicators = {
      left: { icon: '→', color: 'text-blue-500', bg: 'bg-blue-100/80 dark:bg-blue-900/50' },
      right: { icon: '←', color: 'text-blue-500', bg: 'bg-blue-100/80 dark:bg-blue-900/50' },
      up: { icon: '↓', color: 'text-green-500', bg: 'bg-green-100/80 dark:bg-green-900/50' },
      down: { icon: '↑', color: 'text-purple-500', bg: 'bg-purple-100/80 dark:bg-purple-900/50' }
    };

    const indicator = indicators[dragDirection];
    if (!indicator) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none`}
      >
        <div className={`w-16 h-16 rounded-full ${indicator.bg} backdrop-blur-xl border border-white/20 dark:border-gray-700/50 flex items-center justify-center shadow-xl`}>
          <span className={`text-2xl ${indicator.color}`}>
            {indicator.icon}
          </span>
        </div>
      </motion.div>
    );
  };

  // Session-based swipe hints (only for first 3 questions)
  const SwipeHints = () => {
    if (!isMobile || isDragging || !shouldShowHint) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
      >
        <div className="bg-black/80 dark:bg-white/80 text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border border-white/10 dark:border-black/10">
          <div className="flex items-center gap-2">
            <span>👈</span>
            <span>Swipe to navigate</span>
            <span>👉</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        variants={dragVariants}
        animate={isDragging ? "dragging" : "idle"}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{
          touchAction: disabled ? 'auto' : 'pan-y',
        }}
        className={`${disabled ? '' : 'cursor-grab active:cursor-grabbing'} select-none`}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {getSwipeIndicator()}
        <SwipeHints />
      </AnimatePresence>
    </>
  );
}

// Hook for programmatic swipe detection (unchanged)
export function useSwipeDetection() {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      const minDistance = 50;
      const maxTime = 300;

      if (Math.abs(deltaX) > minDistance && deltaTime < maxTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setSwipeDirection(deltaX > 0 ? 'right' : 'left');
        }
      } else if (Math.abs(deltaY) > minDistance && deltaTime < maxTime) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          setSwipeDirection(deltaY > 0 ? 'down' : 'up');
        }
      }

      touchStartRef.current = null;
      setTimeout(() => setSwipeDirection(null), 100);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return swipeDirection;
}
