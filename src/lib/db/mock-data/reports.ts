import { BarChart, Calendar, FileBarChart, LineChart, PieChart } from 'lucide-react';
import React from 'react';

export const reportsMockData = [
  {
    title: 'Historical Call Center Usage',
    description: 'Detailed analysis of historical call center metrics and trends',
    badges: ['Last 90 Days', 'Tabular'],
    lastUpdated: '2 days ago',
    iconName: 'LineChart',
    iconColor: 'muted-foreground',
    iconSize: 'md'
  },
  {
    title: 'Labor Forecast for Inbound',
    description: 'Projected staffing needs based on forecast models and call volume predictions',
    badges: ['Next 14 Days', 'Chart + Table'],
    lastUpdated: 'Today',
    iconName: 'BarChart',
    iconColor: 'muted-foreground',
    iconSize: 'md'
  },
  {
    title: 'Agent Performance Analytics',
    description: 'Individual and team performance metrics with benchmarking',
    badges: ['Current Month', 'Dashboard'],
    lastUpdated: 'Yesterday',
    iconName: 'PieChart',
    iconColor: 'muted-foreground',
    iconSize: 'md'
  }
];

export const scheduledReportsMockData = [
  {
    title: 'Weekly Performance Summary',
    description: 'Sent every Monday to management team',
    nextDelivery: 'Monday, 8:00 AM',
    frequency: 'Weekly',
    iconName: 'Calendar',
    iconColor: 'muted-foreground',
    iconSize: 'sm'
  },
  {
    title: 'Daily Forecast vs Actual',
    description: 'Sent daily to operations team',
    nextDelivery: 'Tomorrow, 6:00 AM',
    frequency: 'Daily',
    iconName: 'Calendar',
    iconColor: 'muted-foreground',
    iconSize: 'sm'
  },
  {
    title: 'Monthly Executive Summary',
    description: 'Sent on the 1st of each month to executive team',
    nextDelivery: 'Dec 1, 7:00 AM',
    frequency: 'Monthly',
    iconName: 'Calendar',
    iconColor: 'muted-foreground',
    iconSize: 'sm'
  }
];

export const reportTabsMockData = [
  {
    iconName: 'FileBarChart',
    iconBg: 'bg-blue-100',
    iconColor: 'blue-600',
    hover: 'hover:border-blue-600',
    name: 'Reports',
    value: 'reports'
  },
  {
    iconName: 'Calendar',
    iconBg: 'bg-purple-100',
    iconColor: 'purple-600',
    hover: 'hover:border-purple-200',
    name: 'Scheduled Reports',
    value: 'scheduled'
  }
];
