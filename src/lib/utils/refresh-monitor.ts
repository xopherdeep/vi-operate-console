/**
 * Utilities for monitoring Fast Refresh performance in development
 */

import React from 'react'; // Add missing React import

// Type for component refresh timing data
interface ComponentRefreshData {
  name: string;
  refreshCount: number;
  lastRefreshTime: number;
  totalRefreshTime: number;
  averageRefreshTime: number;
}

// Global store for refresh data (only available in development)
const getRefreshStore = () => {
  if (typeof window === 'undefined') return null;
  if (process.env.NODE_ENV !== 'development') return null;
  
  if (!(window as any).__FAST_REFRESH_MONITOR__) {
    (window as any).__FAST_REFRESH_MONITOR__ = {
      components: {} as Record<string, ComponentRefreshData>,
      startTimes: {} as Record<string, number>
    };
  }
  
  return (window as any).__FAST_REFRESH_MONITOR__;
};

/**
 * Starts monitoring a component refresh cycle
 * @param componentName - Name of the component to monitor
 */
export function startRefreshMonitor(componentName: string): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const store = getRefreshStore();
  if (!store) return;
  
  store.startTimes[componentName] = performance.now();
}

/**
 * Ends monitoring a component refresh cycle and records data
 * @param componentName - Name of the component being monitored
 */
export function endRefreshMonitor(componentName: string): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const store = getRefreshStore();
  if (!store) return;
  
  const startTime = store.startTimes[componentName];
  if (!startTime) return;
  
  const endTime = performance.now();
  const refreshTime = endTime - startTime;
  
  // Initialize component data if it doesn't exist
  if (!store.components[componentName]) {
    store.components[componentName] = {
      name: componentName,
      refreshCount: 0,
      lastRefreshTime: 0,
      totalRefreshTime: 0,
      averageRefreshTime: 0
    };
  }
  
  // Update component data
  const data = store.components[componentName];
  data.refreshCount += 1;
  data.lastRefreshTime = refreshTime;
  data.totalRefreshTime += refreshTime;
  data.averageRefreshTime = data.totalRefreshTime / data.refreshCount;
  
  // Clean up start time
  delete store.startTimes[componentName];
}

/**
 * Returns all collected refresh performance data for debugging
 */
export function getRefreshStats(): Record<string, ComponentRefreshData> | null {
  const store = getRefreshStore();
  return store ? store.components : null;
}

/**
 * Logs current refresh stats to console
 */
export function logRefreshStats(): void {
  const stats = getRefreshStats();
  if (!stats) return;
  
  console.group('Fast Refresh Performance Stats');
  
  // Sort components by average refresh time (slowest first)
  const sortedComponents = Object.values(stats).sort(
    (a, b) => b.averageRefreshTime - a.averageRefreshTime
  );
  
  // Log table of components and their refresh performance
  console.table(
    sortedComponents.map(comp => ({
      Component: comp.name,
      'Refresh Count': comp.refreshCount,
      'Avg Time (ms)': comp.averageRefreshTime.toFixed(2),
      'Last Time (ms)': comp.lastRefreshTime.toFixed(2),
      'Total Time (ms)': comp.totalRefreshTime.toFixed(2)
    }))
  );
  
  console.groupEnd();
}

/**
 * Higher-order function that wraps a component and monitors its refresh performance
 * @param Component - The component to monitor
 * @param displayName - Optional display name for the component
 */
export function withRefreshMonitoring<P extends object>(
  Component: React.FC<P>,
  displayName?: string
): React.FC<P> {
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }
  
  const componentName = displayName || Component.displayName || Component.name || 'UnnamedComponent';
  
  const MonitoredComponent: React.FC<P> = (props) => {
    startRefreshMonitor(componentName);
    
    // Use React.useEffect for cleanup on unmount
    React.useEffect(() => {
      endRefreshMonitor(componentName);
    });
    
    return React.createElement(Component, props);
  };
  
  MonitoredComponent.displayName = `Monitored(${componentName})`;
  return MonitoredComponent;
}