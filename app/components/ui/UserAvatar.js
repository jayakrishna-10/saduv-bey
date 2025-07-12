// app/components/ui/UserAvatar.js - Safe avatar component with proper error handling
'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

const UserAvatar = ({ user, size = 80, className = '', showFallback = true }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [shouldShowImage, setShouldShowImage] = useState(false);
  
  // Use refs to prevent infinite re-renders
  const imageUrl = useRef(null);
  const hasValidImage = useRef(false);
  
  // Check if we have a valid image URL
  useEffect(() => {
    const newImageUrl = user?.image;
    
    // Only update if the URL actually changed
    if (newImageUrl !== imageUrl.current) {
      imageUrl.current = newImageUrl;
      
      // Reset states for new image
      setImageError(false);
      setImageLoading(false);
      setShouldShowImage(false);
      
      // Check if we have a valid image URL
      if (newImageUrl && typeof newImageUrl === 'string' && newImageUrl.trim().length > 0) {
        hasValidImage.current = true;
        setImageLoading(true);
        setShouldShowImage(true);
      } else {
        hasValidImage.current = false;
      }
    }
  }, [user?.image]);

  const getInitials = useCallback((name) => {
    if (!name || typeof name !== 'string') return 'U';
    
    try {
      return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    } catch (error) {
      console.warn('Error generating initials:', error);
      return 'U';
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback((error) => {
    console.warn('Avatar image failed to load:', error);
    setImageError(true);
    setImageLoading(false);
    setShouldShowImage(false);
    hasValidImage.current = false;
  }, []);

  const sizeClasses = {
    20: 'w-5 h-5 text-xs',
    24: 'w-6 h-6 text-xs',
    32: 'w-8 h-8 text-sm', 
    40: 'w-10 h-10 text-base',
    48: 'w-12 h-12 text-lg',
    56: 'w-14 h-14 text-lg',
    64: 'w-16 h-16 text-xl',
    80: 'w-20 h-20 text-2xl',
    96: 'w-24 h-24 text-3xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses[40];
  const initials = getInitials(user?.name);

  // If no valid image or error occurred, show fallback
  if (!hasValidImage.current || imageError || !shouldShowImage) {
    if (!showFallback) {
      return (
        <div className={`${sizeClass} ${className} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0`}>
          <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-400" />
        </div>
      );
    }

    return (
      <div className={`${sizeClass} ${className} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} ${className} rounded-full overflow-hidden flex-shrink-0 relative`}>
      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
          {initials}
        </div>
      )}
      
      {/* Actual image */}
      <Image
        src={imageUrl.current}
        alt={user?.name || 'User avatar'}
        width={size}
        height={size}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        unoptimized={true} // Disable Next.js optimization for external URLs
        priority={size >= 64} // Only prioritize larger avatars
        placeholder="empty" // Don't show blur placeholder for avatars
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(UserAvatar);
