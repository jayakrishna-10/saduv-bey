// app/components/ErrorBoundary.js - Enhanced with better error handling and recovery
'use client';
import { Component } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

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
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorId: Date.now()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    this.setState({
      error,
      errorInfo
    });
    
    // Log to console for debugging
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // You could also log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  }

  reloadPage = () => {
    window.location.reload();
  }

  goHome = () => {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      const isRenderError = this.state.error?.message?.includes('Cannot read properties of undefined');
      const isContentError = this.state.error?.message?.includes('type') || 
                           this.state.errorInfo?.componentStack?.includes('ContentBlock');

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                {isContentError ? 'Content Loading Error' : 'Something went wrong'}
              </h1>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                {isContentError ? (
                  'There was an issue loading the content. This might be due to malformed data or a temporary glitch.'
                ) : isRenderError ? (
                  'A rendering error occurred. This is usually due to missing or corrupted data.'
                ) : (
                  'An unexpected error occurred while loading the page. This might be a temporary issue.'
                )}
              </p>

              {/* Error Details (collapsible) */}
              <details className="mb-6 text-left">
                <summary className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors">
                  <Bug className="h-4 w-4 inline mr-2" />
                  Technical Details (for developers)
                </summary>
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="text-red-300 text-sm font-mono mb-2">
                    <strong>Error:</strong> {this.state.error?.message}
                  </div>
                  {this.state.error?.stack && (
                    <div className="text-white/60 text-xs font-mono max-h-32 overflow-y-auto">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.error.stack}</pre>
                    </div>
                  )}
                  <div className="text-white/50 text-xs mt-2">
                    Error ID: {this.state.errorId}
                  </div>
                </div>
              </details>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.resetError}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                
                <button
                  onClick={this.reloadPage}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.goHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </button>
              </div>

              {/* Helpful Tips */}
              <div className="mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
                <h3 className="text-blue-300 font-semibold mb-2">💡 What you can try:</h3>
                <ul className="text-blue-200 text-sm space-y-1 text-left">
                  <li>• Refresh the page to reload the content</li>
                  <li>• Try navigating to a different section</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache if the issue persists</li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="mt-6 text-white/50 text-sm">
                If the problem continues, this error information can help with troubleshooting.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
