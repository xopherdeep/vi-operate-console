/**
 * Type definitions for the workflow canvas
 */

import { 
  Node, 
  Edge, 
  NodeProps, 
  EdgeProps, 
  ConnectionLineType 
} from 'reactflow';
import { WorkflowStep, WorkflowStepType } from '@/types/workflow';

export type NodeData = {
  label: string;
  type: WorkflowStepType;
  stepConfig?: Record<string, any>;
  icon?: React.ReactNode;
  description?: string;
};

export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;

export interface WorkflowCanvasProps {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange?: (nodes: CustomNode[]) => void;
  onEdgesChange?: (edges: CustomEdge[]) => void;
  onConnect?: (params: any) => void;
  onNodeClick?: (event: React.MouseEvent, node: CustomNode) => void;
  readOnly?: boolean;
  className?: string;
}

export interface NodeComponentProps extends NodeProps<NodeData> {
  selected: boolean;
  dragging: boolean;
}

export interface EdgeComponentProps extends EdgeProps {
  selected: boolean;
  label?: string | React.ReactNode;
}

export const NODE_TYPES: Record<WorkflowStepType, string> = {
  'agent': 'agentNode',
  'transform': 'transformNode',
  'decision': 'decisionNode',
  'notification': 'notificationNode',
  'api': 'apiNode'
};

export const NODE_COLORS: Record<WorkflowStepType, string> = {
  'agent': 'rgb(97, 186, 255)', // Blue
  'transform': 'rgb(110, 231, 183)', // Teal
  'decision': 'rgb(251, 191, 36)', // Amber
  'notification': 'rgb(167, 139, 250)', // Purple
  'api': 'rgb(248, 113, 113)' // Red
};
