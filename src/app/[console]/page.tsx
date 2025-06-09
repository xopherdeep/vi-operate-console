'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// UI Components
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/card';
import { Page } from '@/components/common/layout';

// Icons
import {
  Gauge,
  LineChart,
  Cog,
  Network,
  ServerCog,
  ChevronRight,
  LayoutDashboard,
  BarChart2,
  Table,
  Clock,
  Code2,
  Database,
  Workflow,
  Settings2,
  GitMerge,
  History,
  Users,
  Activity
} from 'lucide-react';

export default function ConsolePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Define the main console components with consistent theming
  const consoleComponents = [
    {
      title: 'Dashboards',
      description: 'Interactive visual displays of operational data for real-time monitoring and decision making.',
      icon: <Gauge className="h-6 w-6" />,
      href: '/console/dashboards',
      color: 'text-blue-500',
      features: [
        { icon: <LayoutDashboard className="h-4 w-4" />, text: 'Real-time operational views' },
        { icon: <BarChart2 className="h-4 w-4" />, text: 'Interactive data visualization' },
        { icon: <Table className="h-4 w-4" />, text: 'Call center staffing metrics' }
      ]
    },
    {
      title: 'Reports',
      description: 'Comprehensive analysis and forecasting tools for historical data and future predictions.',
      icon: <LineChart className="h-6 w-6" />,
      href: '/console/reports',
      color: 'text-emerald-500',
      features: [
        { icon: <Clock className="h-4 w-4" />, text: 'Historical trend analysis' },
        { icon: <Activity className="h-4 w-4" />, text: 'Performance forecasting' },
        { icon: <Users className="h-4 w-4" />, text: 'Workforce management insights' }
      ]
    },
    {
      title: 'Automations',
      description: 'Configure and manage workflows, agents, triggers, and data streams for automated operations.',
      icon: <Cog className="h-6 w-6" />,
      href: '/console/automations',
      color: 'text-amber-500',
      features: [
        { icon: <Workflow className="h-4 w-4" />, text: 'Workflow automation' },
        { icon: <Code2 className="h-4 w-4" />, text: 'Agents and triggers' },
        { icon: <Settings2 className="h-4 w-4" />, text: 'Task scheduling with cron jobs' }
      ]
    },
    {
      title: 'Archetypes',
      description: 'Data models and pattern recognition templates for advanced analytics and prediction.',
      icon: <Network className="h-6 w-6" />,
      href: '/console/archetypes',
      color: 'text-violet-500',
      features: [
        { icon: <GitMerge className="h-4 w-4" />, text: 'Pattern recognition' },
        { icon: <Database className="h-4 w-4" />, text: 'Data modeling' },
        { icon: <History className="h-4 w-4" />, text: 'Behavioral analysis' }
      ]
    },
    {
      title: 'Sources',
      description: 'Manage connections and integration with external data sources and systems.',
      icon: <ServerCog className="h-6 w-6" />,
      href: '/console/sources',
      color: 'text-pink-500',
      features: [
        { icon: <Database className="h-4 w-4" />, text: 'Data source management' },
        { icon: <GitMerge className="h-4 w-4" />, text: 'Integration configurations' },
        { icon: <Activity className="h-4 w-4" />, text: 'Connection monitoring' }
      ]
    }
  ];

  return (
    <Page title="Console" variant="splash">
      <div className="fixed inset-0 bg-gradient-to-b from-background to-accent/20" />
      <div
        className={`relative z-20 flex flex-col items-center w-full min-h-[100vh] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} py-10 px-4`}
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mb-10">
          <h1 className="text-4xl font-bold text-card-foreground mb-3">VI Operate Console</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            Powerful tools for operational management, data analysis, and process automation
          </p>
        </div>

        {/* Main Components Grid */}
        <div className="w-full px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {consoleComponents.map((component, index) => (
            <Link href={component.href} key={index} className="group transition-all">
              <Card className="h-full hover:shadow-lg hover:shadow-primary/10 border border-border backdrop-blur-md bg-card/90 transition-all duration-300 group-hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${component.color.replace('text', 'bg')}/10`}>
                      <div className={`${component.color}`}>{component.icon}</div>
                    </div>
                    <Badge variant="outline" className={`border-primary/30 ${component.color}`}>
                      Core Feature
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground mt-3">{component.title}</CardTitle>
                  <CardDescription>
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {component.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`${component.color}`}>{feature.icon}</div>
                        <span className="text-sm text-muted-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between hover:bg-accent/50"
                  >
                    <span>Explore {component.title}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* System Status Section */}
        <div className="w-full max-w-7xl mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">System Status</h2>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
              All Systems Operational
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'API Gateway', status: 'Operational', latency: '24ms' },
              { name: 'Data Pipeline', status: 'Operational', latency: '46ms' },
              { name: 'ML Services', status: 'Operational', latency: '112ms' },
              { name: 'Storage', status: 'Operational', latency: '18ms' }
            ].map((service, idx) => (
              <Card key={idx} className="bg-card/90 backdrop-blur-md border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-card-foreground">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">{service.latency}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
