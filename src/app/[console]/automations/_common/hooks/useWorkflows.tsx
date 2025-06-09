'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { workflowsApi } from '@/lib/api/endpoints';

export function useWorkflows() {
  const { 
    data: workflowsData = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: workflowsApi.getWorkflows
  });

  // Transform the data to include React children
  const workflows = workflowsData.map((workflow: any) => ({
    title: workflow.title,
    children: <>{workflow.description}</>
  }));

  return {
    workflows,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}
