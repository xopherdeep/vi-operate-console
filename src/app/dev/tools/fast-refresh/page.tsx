import { FastRefreshDemo } from '@/app/dev/tools/fast-refresh/fast-refresh-demo';

export const metadata = {
  title: 'Fast Refresh Development Tools',
  description: 'Test and monitor Fast Refresh optimizations'
};

export default function FastRefreshDevPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">Fast Refresh Development Tools</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates the Fast Refresh optimization tools. You can use these tools to improve
        component development experience and monitor refresh performance.
      </p>
      
      <FastRefreshDemo />
      
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">How to Use Fast Refresh Tools</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">1. Browser Console Commands</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Open your browser console and try these commands:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {`// Show available commands
FastRefreshTools.help()

// Log refresh performance stats
FastRefreshTools.logStats()

// Find slow refreshing components (above 50ms)
FastRefreshTools.findSlowComponents(50)

// Clear collected stats
FastRefreshTools.clearStats()`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">2. Component Utilities</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Import these utilities in your client components:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {`import { 
  useFastRefreshState,
  useFastRefreshStableCallback,
  withRefreshMonitoring,
  memoComponent
} from '@/lib/utils/fast-refresh';

// Preserve state during refresh
const [state, setState] = useFastRefreshState(initialState);

// Create stable callbacks
const handleClick = useFastRefreshStableCallback(() => {
  // This callback preserves its identity during refresh
});

// Monitor component refresh performance
export const MyComponent = withRefreshMonitoring(
  MyComponentImplementation,
  'MyComponent'
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}