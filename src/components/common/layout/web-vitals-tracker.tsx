'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/utils/web-vitals';

/**
 * Client component to initialize web vitals tracking
 * This is separated from the layout to keep the server component pure
 */
export default function WebVitalsTracker() {
  useEffect(() => {
    initWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}