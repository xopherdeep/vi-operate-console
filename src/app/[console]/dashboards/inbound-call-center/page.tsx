'use client';

import { Metadata } from 'next';
import { Page } from '@/components/common/layout/page';
import { InboundDashboard } from '@/app/[console]/dashboards/inbound-call-center/inbound-dashboard';
import { useState, useEffect } from 'react';

export default function InboundCallCenterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getDashboardData } = await import('@/app/[console]/dashboards/_common/services/dashboard.service');
        const data = await getDashboardData('inbound-call-center');
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <Page
      title="Labor Forecast"
      actionButton={{
        label: 'Generate New Forecast',
        onClick: () => {}
      }}
      isLoading={isLoading}
      error={error?.message}
    >
      <InboundDashboard initialData={dashboardData} />
    </Page>
  );
}
