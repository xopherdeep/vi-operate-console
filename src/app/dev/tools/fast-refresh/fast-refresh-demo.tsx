'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { 
  useFastRefreshState, 
  memoComponent, 
  useFastRefreshStableCallback,
  withRefreshMonitoring 
} from '@/lib/utils/fast-refresh/index';

/**
 * A demo component showing Fast Refresh optimization techniques
 * This component preserves state during Fast Refresh
 */
function FastRefreshDemoComponent() {
  // This state will be preserved during Fast Refresh cycles
  const [count, setCount] = useFastRefreshState(0, 'demo-counter');
  
  // Regular state that will reset during Fast Refresh
  const [regularCount, setRegularCount] = React.useState(0);
  
  // Stable callback that preserves function identity during Fast Refresh
  const incrementPersisted = useFastRefreshStableCallback(() => {
    setCount(prev => prev + 1);
  });
  
  // Regular callback that will change identity during Fast Refresh
  const incrementRegular = React.useCallback(() => {
    setRegularCount(prev => prev + 1);
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Fast Refresh Demo
          <Badge variant="outline">Development Tool</Badge>
        </CardTitle>
        <CardDescription>
          This component demonstrates Fast Refresh optimizations.
          Edit this file and see how state is preserved differently.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Preserved State</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{count}</span>
            <Button onClick={incrementPersisted}>
              Increment Preserved
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This counter state is preserved during Fast Refresh
          </p>
        </div>
        
        <div className="rounded-md bg-muted p-4">
          <h3 className="text-sm font-medium mb-2">Regular State</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{regularCount}</span>
            <Button variant="outline" onClick={incrementRegular}>
              Increment Regular
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This counter resets during Fast Refresh
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <p className="text-sm text-muted-foreground">
          Open the console and type <code className="bg-muted px-1 py-0.5 rounded">FastRefreshTools.help()</code> to see available tools
        </p>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).FastRefreshTools) {
              (window as any).FastRefreshTools.logStats();
            }
          }}
        >
          Log Refresh Stats
        </Button>
      </CardFooter>
    </Card>
  );
}

// Export the component with display name and monitoring
export const FastRefreshDemo = withRefreshMonitoring(
  memoComponent(FastRefreshDemoComponent, 'FastRefreshDemo'),
  'FastRefreshDemo'
);