'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // TODO: Send to error tracking service
    // Example:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { react: errorInfo } });
    // }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Don't expose error details in production
      const safeError = process.env.NODE_ENV === 'development' 
        ? this.state.error 
        : null;
      
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={safeError} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full card-surface p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={this.resetError}
              className="btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary mt-4"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

