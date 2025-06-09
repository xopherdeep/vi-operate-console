import { CustomEdge, CustomNode } from '@/app/[console]/automations/_common/components/workflow-canvas';

// Define the interface for workflow properties
export interface WorkflowTemplate {
  id?: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
}

// Default workflow template
export const defaultWorkflowTemplate: WorkflowTemplate = {
  name: 'Labor Insights Workflow',
  description: 'Automation workflow for labor insights and forecasting',
  nodes: [],
  edges: []
};

// Active automation configuration
export interface AutomationConfig {
  frequency: string;
  source: string;
  destination: string;
}

export const defaultAutomationConfig: AutomationConfig = {
  frequency: 'Real Time',
  source: 'CALL LOGS',
  destination: 'LABOR FORECAST'
};
