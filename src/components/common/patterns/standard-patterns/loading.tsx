'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  /**
   * Optional text to display below the spinner
   */
  message?: string;
  /**
   * Provide additional CSS classes
   */
  className?: string;
  /**
   * Size of the spinner (small, medium, large)
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Loading component that displays a spinner and optional message
 */
export function Loading({ 
  message, 
  className, 
  size = 'medium' 
}: LoadingProps) {
  const spinnerSizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={cn(
      "w-full h-full flex flex-col items-center justify-center gap-2",
      className
    )}>
      <div className={cn(
        "animate-spin rounded-full border-b-2 border-primary",
        spinnerSizes[size]
      )} />
      {message && (
        <div className="text-muted-foreground text-sm">{message}</div>
      )}
    </div>
  );
}