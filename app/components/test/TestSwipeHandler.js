// app/components/test/TestSwipeHandler.js - Test Swipe Navigation
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TestSwipeHandler({
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  children,
  swipeThreshold = 50,
  velocityThreshold = 500,
  currentQuestionIndex = 0
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasUserSwiped, setHasUserSwiped] = useState(false);
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

  // Show hint for first few questions and only if user hasn't swiped yet
  useEffect(() => {
    if (!isMobile || hasUserSwiped) return;
    
    // Show hint for the first 3 questions to help users learn
    if (currentQuestionIndex < 3) {
      setShouldShowHint(true);
      
      // Auto-hide hint after 4 seconds
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setShouldShowHint(false);
      }, 4000);
    }

    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, [currentQuestionIndex, isMobile, hasUserSwiped]);

  // Reset swipe learning when test restarts
  useEffect(() => {
    if (currentQuestionIndex === 0) {
      setHasUserSwiped(false);
    }
  }, [currentQuestionIndex]);

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
    
    // Only consider horizontal swipes for test navigation
    if (Math.abs(deltaX) > 10) {
      setDragDirection(deltaX > 0 ? 'right' : 'left');
    }
  };

  const handlePanEnd = (event, info) => {
    if (disabled || !isMobile) return;

    setIsDragging(false);
    setDragDirection(null);
    
    const deltaX = info.offset.x;
    const velocityX = info.velocity.x;

    // Check if swipe meets threshold requirements (horizontal only)
    const horizontalSwipe = Math.abs(deltaX) > swipeThreshold || Math.abs(velocityX) > velocityThreshold;

    if (horizontalSwipe) {
      // Mark that user has swiped (permanently hide hints)
      setHasUserSwiped(true);
      
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
    }

    dragStartRef.current = null;
  };

  // Visual feedback variants
  const dragVariants = {
    idle: { 
      x: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    dragging: {
      scale: 0.99,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  // Swipe direction indicator
  const getSwipeIndicator = () => {
    if (!isDragging || !dragDirection || !isMobile) return null;

    const indicators = {
      left: { icon: '→', color: 'text-orange-500', bg: 'bg-orange-100/80 dark:bg-orange-900/50', label: 'Next' },
      right: { icon: '←', color: 'text-orange-500', bg: 'bg-orange-100/80 dark:bg-orange-900/50', label: 'Previous' }
    };

    const indicator = indicators[dragDirection];
    if (!indicator) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className={`px-4 py-3 rounded-2xl ${indicator.bg} backdrop-blur-xl border border-white/20 dark:border-gray-700/50 flex items-center gap-2 shadow-xl`}>
          <span className={`text-2xl ${indicator.color}`}>
            {indicator.icon}
          </span>
          <span className={`text-sm font-medium ${indicator.color}`}>
            {indicator.label}
          </span>
        </div>
      </motion.div>
    );
  };

  // Test-specific swipe hints
  const SwipeHints = () => {
    if (!isMobile || isDragging || !shouldShowHint || hasUserSwiped) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 0.7,
          y: 0 
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut" 
        }}
        className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-orange-600/80 dark:bg-orange-500/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border border-orange-500/20"
        >
          <div className="flex items-center gap-2">
            <span className="opacity-80">👈</span>
            <span className="opacity-90">Swipe to navigate questions</span>
            <span className="opacity-80">👉</span>
          </div>
        </motion.div>
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

// Hook for programmatic swipe detection in test context
export function useTestSwipeDetection() {
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
      const deltaTime = Date.now() - touchStartRef.current.time;

      const minDistance = 50;
      const maxTime = 300;

      if (Math.abs(deltaX) > minDistance && deltaTime < maxTime) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
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
