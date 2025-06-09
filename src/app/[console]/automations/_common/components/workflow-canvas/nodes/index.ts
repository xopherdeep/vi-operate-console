'use client';

import { AgentNode } from './agent-node';
import { TransformNode } from './transform-node';
import { DecisionNode } from './decision-node';
import { NotificationNode } from './notification-node';
import { ApiNode } from './api-node';

// Export a map of node types to their respective components
export const nodeTypes = {
  agentNode: AgentNode,
  transformNode: TransformNode,
  decisionNode: DecisionNode,
  notificationNode: NotificationNode,
  apiNode: ApiNode
};
