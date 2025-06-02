/**
 * Developer tools for monitoring Fast Refresh in the browser
 * This file adds commands to the browser console for debugging Fast Refresh performance
 */

import { logRefreshStats, getRefreshStats } from './refresh-monitor';

// Only run in development mode and in browser environment
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add helper functions to window object for console access
  (window as any).FastRefreshTools = {
    // Log refresh stats to console
    logStats: () => {
      logRefreshStats();
      return 'Fast Refresh stats logged to console';
    },
    
    // Get raw stats object
    getStats: () => getRefreshStats(),
    
    // Find slow refreshing components (above threshold in ms)
    findSlowComponents: (thresholdMs = 100) => {
      const stats = getRefreshStats();
      if (!stats) return 'No stats available';
      
      const slowComponents = Object.values(stats).filter(
        comp => comp.averageRefreshTime > thresholdMs
      );
      
      if (slowComponents.length === 0) {
        return 'No slow components found above ' + thresholdMs + 'ms';
      }
      
      console.group('Slow Refreshing Components (>' + thresholdMs + 'ms)');
      console.table(
        slowComponents.map(comp => ({
          Component: comp.name,
          'Avg Time (ms)': comp.averageRefreshTime.toFixed(2),
          'Refresh Count': comp.refreshCount,
        }))
      );
      console.groupEnd();
      
      return `Found ${slowComponents.length} slow components`;
    },
    
    // Clear collected stats
    clearStats: () => {
      if (typeof window === 'undefined') return;
      if (!(window as any).__FAST_REFRESH_MONITOR__) return;
      
      (window as any).__FAST_REFRESH_MONITOR__.components = {};
      (window as any).__FAST_REFRESH_MONITOR__.startTimes = {};
      
      return 'Fast Refresh stats cleared';
    },
    
    // Help information
    help: () => {
      console.group('Fast Refresh Developer Tools Help');
      console.log('Available commands:');
      console.log('  FastRefreshTools.logStats() - Log all component refresh stats to console');
      console.log('  FastRefreshTools.getStats() - Return raw stats object');
      console.log('  FastRefreshTools.findSlowComponents(thresholdMs = 100) - Find slow refreshing components');
      console.log('  FastRefreshTools.clearStats() - Clear all collected stats');
      console.log('  FastRefreshTools.help() - Show this help information');
      console.log('\nExample: FastRefreshTools.findSlowComponents(50)');
      console.groupEnd();
      
      return 'Help information shown above';
    }
  };
  
  // Log initial help message
  console.log(
    '%c Fast Refresh Developer Tools Available',
    'background: #0070f3; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;'
  );
  console.log(
    '%c Type FastRefreshTools.help() for available commands',
    'color: #0070f3; font-weight: bold;'
  );
}