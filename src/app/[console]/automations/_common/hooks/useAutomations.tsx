'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AgentsList,
  ApiList,
  CronsList,
  DataList,
  EventsList,
  WorkflowsList
} from '@/app/[console]/automations/_common/components/lists';
import { AutomationTab } from '@/app/console/automations/types/automation';
import { IconLucide } from '@/ui/icons';
import { automationsApi } from '@/lib/api/endpoints';
import React from 'react';

type TabWithComponent = AutomationTab & { children: React.ReactNode };

export function useAutomationTabs() {
  const { 
    data: tabsData = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ['automationTabs'],
    queryFn: automationsApi.getAutomationTabs
  });

  const tabComponents = {
    workflows: <WorkflowsList />,
    agents: <AgentsList />,
    cron: <CronsList />,
    events: <EventsList />,
    data: <DataList />,
    api: <ApiList />
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
