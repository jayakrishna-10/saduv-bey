// tailwind.config.js - Enhanced with custom responsive breakpoints
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '360px',        // Custom extra small breakpoint
        'xs-max': {'max': '359px'}, // Max width utilities for extra small
        'sm-max': {'max': '639px'}, // Max width utilities for small
        'md-max': {'max': '767px'}, // Max width utilities for medium
        'lg-max': {'max': '1023px'}, // Max width utilities for large
        'xl-max': {'max': '1279px'}, // Max width utilities for extra large
      },
      fontFamily: {
        sans: ['Inter', 'Lexend', 'Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
        'loading-dots': 'loadingDots 1.4s ease-in-out infinite both',
        'swipe-indicator': 'swipeIndicator 0.15s ease-out',
        'correct-answer': 'correctAnswer 0.6s ease-out',
        'incorrect-answer': 'incorrectAnswer 0.6s ease-out',
        'modal-slide-in': 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'notification-slide-in': 'notificationSlideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        swipeIndicator: {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.5)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.1)' },
          '100%': { opacity: '0.8', transform: 'translate(-50%, -50%) scale(1)' },
        },
        correctAnswer: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(34, 197, 94, 0.3)' },
          '100%': { transform: 'scale(1.02)' },
        },
        incorrectAnswer: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.02) rotate(1deg)' },
          '75%': { transform: 'scale(1.02) rotate(-1deg)' },
          '100%': { transform: 'scale(1.02) rotate(0deg)' },
        },
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        notificationSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(100px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      minWidth: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '97': '0.97',
        '98': '0.98',
      },
    },
  },
  plugins: [
    // Custom plugin for responsive navigation utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Navigation-specific utilities
        '.nav-transition': {
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-morphism-dark': {
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        },
        // Mobile-first navigation spacing
        '.nav-spacing-mobile': {
          padding: '0.5rem',
          gap: '0.5rem',
        },
        '.nav-spacing-xs': {
          padding: '0.75rem',
          gap: '0.375rem',
        },
        '.nav-spacing-sm': {
          padding: '0.75rem',
          gap: '0.5rem',
        },
        // Button size variants for responsive navigation
        '.btn-nav-xs': {
          minWidth: '2rem',
          minHeight: '2rem',
          padding: '0.375rem',
        },
        '.btn-nav-sm': {
          minWidth: '2.25rem',
          minHeight: '2.25rem',
          padding: '0.5rem',
        },
        '.btn-nav-md': {
          minWidth: '2.5rem',
          minHeight: '2.5rem',
          padding: '0.625rem',
        },
        // Text size variants for responsive navigation
        '.text-nav-xs': {
          fontSize: '0.75rem',
          lineHeight: '1rem',
        },
        '.text-nav-sm': {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        },
      }

      addUtilities(newUtilities)
    },
  ],
}
