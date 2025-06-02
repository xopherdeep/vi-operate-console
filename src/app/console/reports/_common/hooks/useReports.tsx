'use client';

import { useQuery } from '@tanstack/react-query';
import { ReportsList, ScheduledReportsList } from '@/app/console/reports/components/lists';
import { ReportViewModel, ScheduledReportCardProps, ReportTab } from '@/types/report';
import { IconLucide } from '@/ui/icons';
import { reportsApi } from '@/lib/api/endpoints';
import React from 'react';

// Transform reports data to include React icons
function processReportsData(reports: any[]) {
  return reports.map(report => ({
    ...report,
    icon: <IconLucide 
            name={report.iconName} 
            color={report.iconColor} 
            size={report.iconSize} 
          />
  }));
}

export function useReports() {
  // Reports query
  const { 
    data: reportsData = [], 
    error: reportsError, 
    isLoading: isLoadingReports 
  } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsApi.getReports,
    select: processReportsData
  });

  // Scheduled reports query
  const { 
    data: scheduledReportsData = [], 
    error: scheduledError, 
    isLoading: isLoadingScheduled 
  } = useQuery({
    queryKey: ['scheduledReports'],
    queryFn: reportsApi.getScheduledReports,
    select: processReportsData
  });

  // Combined loading and error state
  const loading = isLoadingReports || isLoadingScheduled;
  const error = reportsError || scheduledError 
    ? (reportsError?.message || scheduledError?.message || 'Failed to load reports') 
    : null;

  return {
    reports: reportsData,
    scheduledReports: scheduledReportsData,
    loading,
    error
  };
}

type TabWithComponent = ReportTab & { children: React.ReactNode };

export function useReportTabs() {
  const { 
    data: tabsData = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ['reportTabs'],
    queryFn: reportsApi.getReportTabs
  });

  const tabComponents = {
    reports: <ReportsList />,
    scheduled: <ScheduledReportsList />
  };

  // Transform tabs to include component and icon
  const tabs = tabsData.map((tab: any) => ({
    ...tab,
    icon: <IconLucide 
            name={tab.iconName} 
            color={tab.iconColor} 
            className={tab.iconBg}
          />,
    children: tabComponents[tab.value as keyof typeof tabComponents]
  }));

  return {
    tabs,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}
