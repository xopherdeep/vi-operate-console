'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/ui/card';
import { Button } from '@/ui/button';
import {
  Gauge,
  LineChart,
  Users,
  Phone,
  PhoneOutgoing,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { DashboardTable } from '@/app/console/dashboards/_common/components/table'; 
import { getDashboardSummary } from '@/app/console/dashboards/_common/services/dashboard.service';
import { Page } from '@/components/common/layout';
import { useSearchParams } from 'next/navigation';

// Metadata is defined in metadata.ts

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const offset = Number(searchParams.get('offset') || '10');
  
  // Use this ref to track if data has already been loaded
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch data once, not on every search param change
    if (dataFetchedRef.current) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary();
        if (isMounted) {
          setDashboardData(data);
          dataFetchedRef.current = true;
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          // Set default data even if there's an error to prevent infinite loading
          setDashboardData({ dashboards: [], recentReports: [] });
          dataFetchedRef.current = true;
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent memory leaks and state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - we only want to fetch once when the component mounts

  // Convert the dashboards data to the format expected by DashboardCardList
  const dashboardCards = ((dashboardData && dashboardData.dashboards) || []).map(
    (dashboard: any) => {
      const statusVariantMap: Record<
        string,
        { variant: string; className: string }
      > = {
        active: {
          variant: 'outline',
          className: 'bg-green-50 text-green-700 border-green-200'
        },
        development: {
          variant: 'outline',
          className: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        inactive: {
          variant: 'outline',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
        }
      };

      const iconMap: Record<string, React.ReactNode> = {
        'inbound-call-center': <Phone className="h-5 w-5" />,
        'outbound-call-center': <PhoneOutgoing className="h-5 w-5" />,
        'agent-performance': <Users className="h-5 w-5" />,
        'workforce-management': <Calendar className="h-5 w-5" />,
        'quality-monitoring': <Gauge className="h-5 w-5" />
      };

      const statusBadge = dashboard.status
        ? {
            text:
              dashboard.status === 'active'
                ? 'Active'
                : dashboard.status === 'development'
                  ? 'In Development'
                  : 'Inactive',
            ...statusVariantMap[dashboard.status]
          }
        : undefined;

      const badgeObjects = [
        ...(dashboard.badges || []).map((badge: string) => ({
          text: badge,
          variant: 'outline' as const
        })),
        ...(statusBadge ? [statusBadge] : [])
      ];

      return {
        title: dashboard.title,
        description: dashboard.description,
        icon: iconMap[dashboard.id] || undefined,
        badges: badgeObjects,
        metrics: dashboard.metrics,
        statusIndicator: dashboard.trend
          ? {
              icon: <TrendingUp className="h-3 w-3 mr-1 text-green-500" />,
              text: (
                <div className="flex items-center">
                  <span
                    className={`text-${dashboard.trend.direction === 'up' ? 'green' : 'red'}-500 font-medium mr-1`}
                  >
                    {dashboard.trend.direction === 'up' ? '↑' : '↓'}{' '}
                    {dashboard.trend.value}
                  </span>
                  <span>{dashboard.trend.text}</span>
                </div>
              )
            }
          : dashboard.lastUpdated
            ? {
                icon: <Calendar className="h-3 w-3 mr-1" />,
                text: `Last updated ${dashboard.lastUpdated}`
              }
            : undefined,
        href: `/console/dashboards/${dashboard.id}`
      };
    }
  );

  // Format recent reports
  const recentReports = (dashboardData && dashboardData.recentReports) || [];

  return (
    <Page
      title="Dashboards"
      isLoading={isLoading} 
      actionButton={{
        label: 'Create Dashboard',
        onClick: () => console.log('Create dashboard clicked')
      }}
    >
      <DashboardTable 
        dashboards={(dashboardData && dashboardData.dashboards) || []} 
        basePath="/console/dashboards"
        currentOffset={offset}
        itemsPerPage={10}
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentReports.map((report: any, index: number) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">{report.description}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Last updated: {report.lastUpdated}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" size="sm" className="text-sm p-0">
                  View Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

// Export the main component with Suspense boundary around the content using useSearchParams
export default function DashboardsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
