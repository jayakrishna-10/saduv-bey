// app/components/quiz/QuizSwipeHandler.js - Touch gesture handler
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function QuizSwipeHandler({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
  children,
  swipeThreshold = 50,
  velocityThreshold = 500
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const dragStartRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePanStart = (event, info) => {
    if (disabled || !isMobile) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: info.point.x, y: info.point.y };
    
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

  // Visual feedback variants
  const dragVariants = {
    idle: { 
      x: 0, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    dragging: {
      scale: 0.98,
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

  // Swipe hints for user guidance
  const SwipeHints = () => {
    if (!isMobile || isDragging) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
      >
        <div className="bg-black/70 dark:bg-white/70 text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl">
          Swipe left/right to navigate
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
          touchAction: disabled ? 'auto' : 'pan-y', // Allow vertical scrolling but capture horizontal gestures
        }}
        className={`${disabled ? '' : 'cursor-grab active:cursor-grabbing'} select-none`}
      >
        {children}
      </motion.div>

      {getSwipeIndicator()}
      <SwipeHints />
    </>
  );
}

// Hook for programmatic swipe detection
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

      // Minimum distance and maximum time for a swipe
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
      
      // Clear swipe direction after a short delay
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

// Utility component for swipe gesture training
export function SwipeGuide({ visible = false, onDismiss }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Swipe Navigation
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">←</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Swipe right for previous question</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">→</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Swipe left for next question</span>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-all"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
