// app/components/ErrorBoundary.js - Enhanced to catch infinite loops
'use client';
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Generate a unique error ID for tracking
    const errorId = Math.random().toString(36).substr(2, 9);
    
    // Check if it's likely an infinite loop
    const isInfiniteLoop = error.message?.includes('Maximum call stack size exceeded') ||
                          error.stack?.includes('Maximum call stack size exceeded');
    
    return { 
      hasError: true, 
      error,
      isInfiniteLoop,
      errorId
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId
    });
    
    // If it's an infinite loop, also log a warning
    if (error.message?.includes('Maximum call stack size exceeded')) {
      console.warn('Infinite loop detected! This is usually caused by:');
      console.warn('1. useEffect with missing or incorrect dependencies');
      console.warn('2. State updates that trigger themselves');
      console.warn('3. Components that render themselves recursively');
      console.warn('Component stack:', errorInfo.componentStack);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      isInfiniteLoop: false
    });
  }

  forceReload = () => {
    window.location.reload();
  }

  goHome = () => {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      const { error, isInfiniteLoop, errorId } = this.state;
      
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isInfiniteLoop ? 'Infinite Loop Detected' : 'Something went wrong'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {isInfiniteLoop ? (
                'The application encountered an infinite loop. This usually happens when components continuously re-render themselves.'
              ) : (
                'An unexpected error occurred while rendering this page.'
              )}
            </p>
            
            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs font-mono overflow-auto max-h-32">
                  <div className="text-red-600 dark:text-red-400 mb-2">
                    {error?.message}
                  </div>
                  {error?.stack && (
                    <div className="text-gray-600 dark:text-gray-400">
                      {error.stack.split('\n').slice(0, 5).join('\n')}
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Error ID: {errorId}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              {isInfiniteLoop && (
                <button
                  onClick={this.forceReload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Force Reload Page
                </button>
              )}
              
              <button
                onClick={this.goHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <Home className="h-4 w-4" />
                Go to Homepage
              </button>
            </div>
            
            {isInfiniteLoop && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-left">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Debugging Tips:
                </p>
                <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Check useEffect dependency arrays</li>
                  <li>• Look for state updates that trigger themselves</li>
                  <li>• Verify component render logic</li>
                  <li>• Check browser console for more details</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
