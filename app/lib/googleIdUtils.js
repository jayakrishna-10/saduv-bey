// app/lib/googleIdUtils.js - Centralized Google ID validation and utilities
/**
 * Centralized utilities for Google ID validation and handling
 * This ensures consistent validation across the entire application
 */
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export class GoogleIdUtils {
  
  /**
   * Validates Google ID format
   * @param {string} googleId - The Google ID to validate
   * @returns {Object} - Validation result with isValid boolean and reason string
   */
  static validate(googleId) {
    if (!googleId) {
      return { isValid: false, reason: 'No Google ID provided', code: 'MISSING_ID' };
    }
    
    if (typeof googleId !== 'string') {
      return { 
        isValid: false, 
        reason: `Google ID must be a string, got ${typeof googleId}`, 
        code: 'INVALID_TYPE' 
      };
    }
    
    // Google IDs should be numeric strings, typically 18-21 digits
    const googleIdPattern = /^\d{18,21}$/;
    if (!googleIdPattern.test(googleId)) {
      return { 
        isValid: false, 
        reason: `Invalid Google ID format. Expected 18-21 digit numeric string, got: ${googleId}`, 
        code: 'INVALID_FORMAT' 
      };
    }
    
    // Check if it looks like a UUID (common mistake)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(googleId)) {
      return { 
        isValid: false, 
        reason: 'This appears to be a UUID, not a Google ID', 
        code: 'UUID_DETECTED' 
      };
    }
    
    // Check for other common invalid formats
    if (googleId.includes('-') || googleId.includes('_')) {
      return { 
        isValid: false, 
        reason: 'Google IDs should not contain dashes or underscores', 
        code: 'INVALID_CHARACTERS' 
      };
    }
    
    return { isValid: true, reason: 'Valid Google ID format', code: 'VALID' };
  }

  /**
   * Validates and throws error if invalid
   * @param {string} googleId - The Google ID to validate
   * @throws {Error} - If Google ID is invalid
   */
  static validateOrThrow(googleId) {
    const validation = this.validate(googleId);
    if (!validation.isValid) {
      throw new Error(`Invalid Google ID: ${validation.reason} (Code: ${validation.code})`);
    }
  }

  /**
   * Safely extracts Google ID from session object
   * @param {Object} session - NextAuth session object
   * @returns {string|null} - Valid Google ID or null
   */
  static extractFromSession(session) {
    if (!session?.user?.googleId) {
      console.warn('GoogleIdUtils: No Google ID found in session');
      return null;
    }

    const validation = this.validate(session.user.googleId);
    if (!validation.isValid) {
      console.error('GoogleIdUtils: Invalid Google ID in session:', validation.reason);
      return null;
    }

    return session.user.googleId;
  }

  /**
   * Logs validation details for debugging
   * @param {string} googleId - The Google ID to analyze
   * @param {string} context - Context where this validation is happening
   */
  static debugLog(googleId, context = 'Unknown') {
    console.log(`GoogleIdUtils Debug [${context}]:`, {
      value: googleId,
      type: typeof googleId,
      length: googleId?.length,
      validation: this.validate(googleId)
    });
  }

  /**
   * Attempts to fix common Google ID issues
   * @param {any} input - The input to attempt to fix
   * @returns {string|null} - Fixed Google ID or null if unfixable
   */
  static attemptFix(input) {
    if (!input) return null;

    // Convert to string if it's a number
    let fixed = String(input);

    // Remove common prefixes/suffixes
    fixed = fixed.replace(/^(google_|goog_|user_)/, '');
    fixed = fixed.replace(/(_user|_google|_goog)$/, '');

    // Remove non-digits
    fixed = fixed.replace(/\D/g, '');

    // Check if the result is valid
    const validation = this.validate(fixed);
    return validation.isValid ? fixed : null;
  }

  /**
   * Checks if a value looks like it might be a corrupted Google ID
   * @param {any} value - The value to check
   * @returns {boolean} - True if it might be a corrupted Google ID
   */
  static looksLikeCorruptedGoogleId(value) {
    if (!value || typeof value !== 'string') return false;

    // Check for UUID pattern (common corruption)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(value)) return true;

    // Check for partial numeric strings that might be truncated Google IDs
    if (/^\d{10,17}$/.test(value)) return true;

    // Check for Google IDs with prefixes/suffixes
    if (/^(google_|goog_|user_)\d{18,21}/.test(value)) return true;
    if (/^\d{18,21}_(user|google|goog)$/.test(value)) return true;

    return false;
  }

  /**
   * Generates a migration report for corrupted Google IDs in data
   * @param {Array} records - Array of records to check
   * @param {string} idField - Field name containing the Google ID
   * @returns {Object} - Migration report
   */
  static generateMigrationReport(records, idField = 'google_id') {
    const report = {
      total: records.length,
      valid: 0,
      invalid: 0,
      corrupted: 0,
      fixable: 0,
      issues: []
    };

    records.forEach((record, index) => {
      const googleId = record[idField];
      const validation = this.validate(googleId);

      if (validation.isValid) {
        report.valid++;
      } else {
        report.invalid++;
        
        const isCorrupted = this.looksLikeCorruptedGoogleId(googleId);
        if (isCorrupted) {
          report.corrupted++;
        }

        const fixed = this.attemptFix(googleId);
        if (fixed) {
          report.fixable++;
        }

        report.issues.push({
          index,
          recordId: record.id,
          currentValue: googleId,
          validationError: validation.reason,
          isCorrupted,
          suggestedFix: fixed,
          canAutoFix: !!fixed
        });
      }
    });

    return report;
  }
}

/**
 * React hook for safely getting Google ID from session
 */
export function useGoogleId() {
  const { data: session, status } = useSession();
  const [googleId, setGoogleId] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;

    try {
      const extractedGoogleId = GoogleIdUtils.extractFromSession(session);
      setGoogleId(extractedGoogleId);
      setIsValid(!!extractedGoogleId);
      setError(null);
    } catch (err) {
      setGoogleId(null);
      setIsValid(false);
      setError(err.message);
    }
  }, [session, status]);

  return { googleId, isValid, error, isLoading: status === 'loading' };
}

/**
 * Higher-order component for components that need a valid Google ID
 */
export function withValidGoogleId(WrappedComponent) {
  return function WithValidGoogleIdComponent(props) {
    const { googleId, isValid, error, isLoading } = useGoogleId();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      );
    }

    if (!isValid) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {error || 'Invalid or missing Google ID. Please sign out and sign back in.'}
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} googleId={googleId} />;
  };
}

// Export validation function for backward compatibility
export const validateGoogleId = GoogleIdUtils.validate;
export const extractGoogleIdFromSession = GoogleIdUtils.extractFromSession;
