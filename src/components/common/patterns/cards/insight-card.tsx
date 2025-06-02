'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { TrendingUp, AlertCircle, AlertTriangle, Info, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: React.ReactNode;
  type?: 'success' | 'warning' | 'info' | 'alert';
  metrics?: {
    label: string;
    value: string | number;
    change?: {
      value: string | number;
      positive?: boolean;
    };
  }[];
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function InsightCard({
  title,
  description,
  type = 'info',
  metrics,
  icon,
  chart,
  action,
  className
}: InsightCardProps) {
  // Define styles based on type
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-900',
      text: 'text-green-700 dark:text-green-400',
      icon: <TrendingUp className="h-5 w-5" />
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-900',
      text: 'text-amber-700 dark:text-amber-400',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900',
      text: 'text-blue-700 dark:text-blue-400',
      icon: <Info className="h-5 w-5" />
    },
    alert: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-900',
      text: 'text-red-700 dark:text-red-400',
      icon: <AlertCircle className="h-5 w-5" />
    }
  };

  const currentStyle = styles[type];

  return (
    <Card
      className={cn(
        'overflow-hidden border-2',
        currentStyle.border,
        currentStyle.bg,
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={cn('rounded-full p-1.5', currentStyle.bg, currentStyle.text)}>
              {icon || currentStyle.icon}
            </span>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="text-sm text-muted-foreground">{description}</div>
            
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="text-lg font-bold">{metric.value}</div>
                    {metric.change && (
                      <div 
                        className={cn(
                          "text-xs font-medium flex items-center", 
                          metric.change.positive 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {metric.change.positive ? "↑" : "↓"} {metric.change.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {chart && (
            <div className="lg:col-span-7 xl:col-span-8 flex items-center">
              {chart}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}