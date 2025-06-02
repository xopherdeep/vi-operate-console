'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { agentsApi } from '@/lib/api/endpoints';

export function useAgents() {
  const { 
    data: agentsData = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.getAgents
  });

  // Transform the data to include React children
  const agents = agentsData.map((agent: any) => ({
    title: agent.title,
    children: <>{agent.description}</>
  }));

  return {
    agents,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}
