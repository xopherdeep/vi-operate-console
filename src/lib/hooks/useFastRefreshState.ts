import { useRef, useState, useEffect } from 'react';

/**
 * A hook that preserves state across Fast Refresh cycles
 * 
 * This is helpful for components with complex state that you want
 * to persist during development when Fast Refresh occurs.
 * 
 * @param initialState - The initial state value
 * @param key - Optional unique key to identify this state (useful for multiple states in one component)
 * @returns A tuple with the current state and a setter function
 */
export function useFastRefreshState<T>(
  initialState: T | (() => T), 
  key?: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Create a ref to hold the state
  const stateRef = useRef<{ value: T | null }>({ value: null });
  
  // Create a name for storing in global scope
  const stateId = `__FAST_REFRESH_STATE_${key || ''}`;
  
  // Regular useState
  const [state, setState] = useState<T>(() => {
    // Check if we have a value in the ref from previous renders
    if (stateRef.current.value !== null) {
      return stateRef.current.value;
    }
    
    // Check if we have a value in the window object from previous renders
    if (typeof window !== 'undefined' && (window as any)[stateId]) {
      return (window as any)[stateId];
    }
    
    // Otherwise, initialize with the provided initial state
    const value = initialState instanceof Function ? initialState() : initialState;
    return value;
  });
  
  // Update the ref and window object whenever state changes
  useEffect(() => {
    stateRef.current.value = state;
    if (typeof window !== 'undefined') {
      (window as any)[stateId] = state;
    }
  }, [state, stateId]);
  
  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any)[stateId];
      }
    };
  }, [stateId]);
  
  return [state, setState];
}
