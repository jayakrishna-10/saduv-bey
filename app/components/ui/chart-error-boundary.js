'use client';

import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error('Chart Error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[500px] w-full border rounded-lg bg-red-50 flex flex-col items-center justify-center p-4">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-red-600 font-medium mb-2">Chart failed to load</p>
          <p className="text-red-500 text-sm text-center mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
