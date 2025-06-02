/**
 * Utilities for optimizing React Fast Refresh behavior
 * 
 * These utilities help maintain component state during Fast Refresh
 * and optimize how components are memoized and rendered.
 */

import React from 'react';

/**
 * A typed wrapper for React.memo that preserves component display names
 * and type information, helping Fast Refresh properly manage component updates.
 */
export function memoComponent<T extends object>(
  Component: React.FC<T>, 
  displayName?: string
): React.MemoExoticComponent<React.FC<T>> {
  const MemoizedComponent = React.memo(Component);
  
  // Set display name to help with component identification in React DevTools
  // and improve Fast Refresh component matching
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  } else if (Component.displayName) {
    MemoizedComponent.displayName = `Memo(${Component.displayName})`;
  } else if (Component.name) {
    MemoizedComponent.displayName = `Memo(${Component.name})`;
  }
  
  return MemoizedComponent;
}

/**
 * A utility to create stable callback references that survive Fast Refresh cycles
 * by using a ref to store the actual function.
 */
export function useFastRefreshStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = React.useRef(callback);
  
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return React.useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Wrapper for creating components that work better with Fast Refresh by:
 * 1. Adding a display name
 * 2. Ensuring proper props typing
 * 3. Setting up for better state preservation
 */
export function createFastRefreshComponent<T extends object>(
  Component: React.FC<T>,
  displayName: string
): React.FC<T> {
  Component.displayName = displayName;
  return Component;
}