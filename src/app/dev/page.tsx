import { ArrowRightIcon, RefreshCcwIcon, BugIcon, LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Developer Tools',
  description: 'Development utilities and testing tools'
};

interface DevToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badgeText?: string;
}

export default function DevToolsPage() {
  const devTools: DevToolCard[] = [
    {
      title: 'Fast Refresh Tools',
      description: 'Test and monitor React Fast Refresh performance with enhanced tools for preserving component state and tracking refresh times.',
      icon: <RefreshCcwIcon className="h-6 w-6" />,
      href: '/dev/tools/fast-refresh',
      badgeText: 'New'
    },
    // Add other developer tools here as needed
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Developer Tools</h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-2xl">
        These tools are designed to help with development, testing, and optimization of the application.
        They are only available in development mode and won't be included in production builds.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {devTools.map((tool) => (
          <Link key={tool.title} href={tool.href} className="block group">
            <div className="h-full bg-card rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  {tool.icon}
                </div>
                {tool.badgeText && (
                  <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded">
                    {tool.badgeText}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h2>
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <div className="flex items-center text-sm font-medium text-primary">
                Open tool <ArrowRightIcon className="ml-1 h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}