// app/components/auth/SafeAuthWrapper.js - Safe wrapper for authenticated operations
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, Loader } from 'lucide-react';

const SafeAuthWrapper = ({ 
  children, 
  fallback = null, 
  requireAuth = false,
  onAuthChange = null,
  className = ''
}) => {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Use refs to prevent infinite loops
  const lastAuthState = useRef(null);
  const authChangeReported = useRef(false);

  useEffect(() => {
    // Only proceed when session status is determined
    if (status === 'loading') {
      setIsReady(false);
      return;
    }

    try {
      const currentAuthState = {
        isAuthenticated: !!session,
        googleId: session?.user?.googleId,
        userId: session?.user?.id,
        email: session?.user?.email
      };

      // Check if auth state actually changed
      const authStateChanged = JSON.stringify(currentAuthState) !== JSON.stringify(lastAuthState.current);
      
      if (authStateChanged) {
        console.log('SafeAuthWrapper: Auth state changed:', currentAuthState);
        lastAuthState.current = currentAuthState;
        authChangeReported.current = false;
        setAuthError(null);
        
        // Report auth change if callback provided and not already reported
        if (onAuthChange && !authChangeReported.current) {
          authChangeReported.current = true;
          try {
            onAuthChange(currentAuthState);
          } catch (error) {
            console.error('SafeAuthWrapper: Error in auth change callback:', error);
            setAuthError('Authentication callback failed');
          }
        }
      }

      // Validate authentication if required
      if (requireAuth) {
        if (!session) {
          setAuthError('Authentication required');
          setIsReady(false);
          return;
        }

        if (!session.user?.googleId) {
          setAuthError('Invalid authentication: Google ID missing');
          setIsReady(false);
          return;
        }
      }

      setIsReady(true);
    } catch (error) {
      console.error('SafeAuthWrapper: Error processing auth state:', error);
      setAuthError('Authentication processing failed');
      setIsReady(false);
    }
  }, [session, status, onAuthChange, requireAuth]);

  // Loading state
  if (status === 'loading' || !isReady) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{authError}</span>
        </div>
      </div>
    );
  }

  // Authentication required but not available
  if (requireAuth && !session) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="text-center">
          <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please sign in to access this feature
          </p>
        </div>
      </div>
    );
  }

  // Success - render children
  return children;
};

// Hook to safely get authentication data
export const useSafeAuth = () => {
  const { data: session, status } = useSession();
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    try {
      if (session?.user) {
        const safeAuthData = {
          isAuthenticated: true,
          googleId: session.user.googleId || null,
          userId: session.user.id || null,
          email: session.user.email || null,
          name: session.user.name || null,
          image: session.user.image || null,
          createdAt: session.user.createdAt || null
        };
        
        // Validate that we have the minimum required data
        if (!safeAuthData.googleId && !safeAuthData.userId) {
          throw new Error('Invalid session: missing user identifiers');
        }

        setAuthData(safeAuthData);
        setError(null);
      } else {
        setAuthData({
          isAuthenticated: false,
          googleId: null,
          userId: null,
          email: null,
          name: null,
          image: null,
          createdAt: null
        });
        setError(null);
      }
    } catch (err) {
      console.error('useSafeAuth: Error processing session:', err);
      setError(err.message);
      setAuthData(null);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  return { authData, isLoading, error };
};

// Utility function to safely execute authenticated operations
export const withSafeAuth = async (operation, authData, fallbackValue = null) => {
  try {
    if (!authData?.isAuthenticated) {
      console.warn('withSafeAuth: Operation attempted without authentication');
      return fallbackValue;
    }

    if (!authData.googleId) {
      console.warn('withSafeAuth: Operation attempted without Google ID');
      return fallbackValue;
    }

    return await operation(authData);
  } catch (error) {
    console.error('withSafeAuth: Operation failed:', error);
    return fallbackValue;
  }
};

export default SafeAuthWrapper;
