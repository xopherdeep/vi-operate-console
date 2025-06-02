'use client';

import { 
  LayoutDashboard, 
  Grip, 
  Cog, 
  BookOpen, 
  Users, 
  LineChart, 
  Briefcase, 
  Network, 
  ServerCog,
  Sparkle
} from 'lucide-react';

interface AppItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  platform: 'operate' | 'acquire' | 'engage';
  category: 'primary' | 'secondary' | 'tools';
  new?: boolean;
  beta?: boolean;
}

export function useAppLauncher(): {
  apps: AppItem[];
} {
  return {
    apps: [
      // Primary apps
      {
        name: 'Dashboard',
        description: 'Overview of key metrics and insights',
        icon: <LayoutDashboard className="h-5 w-5" />,
        url: '/console',
        platform: 'operate',
        category: 'primary',
      },
      {
        name: 'Labor Forecasting',
        description: 'Predictive labor management',
        icon: <LineChart className="h-5 w-5" />,
        url: '/console/forecasting',
        platform: 'operate',
        category: 'primary',
        new: true,
      },
      {
        name: 'Scheduling',
        description: 'Staff scheduling and management',
        icon: <Briefcase className="h-5 w-5" />,
        url: '/console/scheduling',
        platform: 'operate',
        category: 'primary',
      },
      
      // Secondary apps
      {
        name: 'Data Sources',
        description: 'Manage data integrations',
        icon: <Network className="h-5 w-5" />,
        url: '/console/sources',
        platform: 'operate',
        category: 'secondary',
      },
      {
        name: 'Archetypes',
        description: 'Configure data transformation models',
        icon: <ServerCog className="h-5 w-5" />,
        url: '/console/archetypes',
        platform: 'operate',
        category: 'secondary',
        beta: true,
      },
      {
        name: 'Automations',
        description: 'Create and manage automated processes',
        icon: <Sparkle className="h-5 w-5" />,
        url: '/console/automations',
        platform: 'operate',
        category: 'secondary',
      },
      {
        name: 'Reports',
        description: 'Generate and schedule reports',
        icon: <BookOpen className="h-5 w-5" />,
        url: '/console/reports',
        platform: 'operate',
        category: 'secondary',
      },
      
      // Tools
      {
        name: 'App Launcher',
        description: 'Access all VI platform applications',
        icon: <Grip className="h-5 w-5" />,
        url: '/app-launcher',
        platform: 'operate',
        category: 'tools',
      },
      {
        name: 'Settings',
        description: 'Configure application settings',
        icon: <Cog className="h-5 w-5" />,
        url: '/settings',
        platform: 'operate',
        category: 'tools',
      },
      {
        name: 'User Management',
        description: 'Manage users and permissions',
        icon: <Users className="h-5 w-5" />,
        url: '/users',
        platform: 'operate',
        category: 'tools',
      }
    ]
  };
}

export const platformColors = {
  operate: 'bg-blue-900 text-gray-200',
  acquire: 'bg-purple-900 text-gray-200',
  engage: 'bg-emerald-900 text-gray-200'
};
