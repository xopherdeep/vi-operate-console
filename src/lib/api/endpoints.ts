/**
 * API endpoints for specific domain areas
 * Builds on the base apiClient to provide domain-specific methods
 */

import { apiClient } from './client';
import { 
  SourceViewModel, 
  ConnectionOption,
  Archetype,
  ArchetypeViewModel
} from '@/types';
import { archetypeToViewModel, entitiesToViewModels } from '@/lib/utils/transformers';

// Sources API
export const sourcesApi = {
  // Get all sources
  getSources: async () => {
    const data = await apiClient.get<any[]>('/api/sources');
    return data;
  },
  
  // Get connection options
  getConnectionOptions: async () => {
    return apiClient.get<ConnectionOption[]>('/api/sources/connection-options');
  }
};

// Reports API
export const reportsApi = {
  // Get all reports
  getReports: async () => {
    return apiClient.get<any[]>('/api/reports');
  },
  
  // Get scheduled reports
  getScheduledReports: async () => {
    return apiClient.get<any[]>('/api/reports/scheduled');
  },
  
  // Get report tabs
  getReportTabs: async () => {
    return apiClient.get<any[]>('/api/reports/tabs');
  }
};

// Automations API
export const automationsApi = {
  // Get automation tabs
  getAutomationTabs: async () => {
    return apiClient.get<any[]>('/api/automations/tabs');
  }
};

// Archetypes API
export const archetypesApi = {
  // Get all archetypes
  getArchetypes: async () => {
    const data = await apiClient.get<Archetype[]>('/api/archetypes');
    return entitiesToViewModels(data, archetypeToViewModel);
  }
};

// Workflows API
export const workflowsApi = {
  // Get all workflows
  getWorkflows: async () => {
    return apiClient.get<any[]>('/api/workflows');
  }
};

// Agents API
export const agentsApi = {
  // Get all agents
  getAgents: async () => {
    return apiClient.get<any[]>('/api/agents');
  }
};