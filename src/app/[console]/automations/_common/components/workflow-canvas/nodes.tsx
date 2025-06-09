'use client';

import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeComponentProps, NODE_COLORS } from './types';
import { Cpu, Code, GitFork, Bell, Globe } from 'lucide-react';

// Base node component that all our custom nodes will use
const BaseNode = memo(({
  id, 
  data, 
  selected,
  type: nodeType
}: NodeComponentProps) => {
  const icon = useCallback(() => {
    switch (data.type) {
      case 'agent':
        return <Cpu className="w-4 h-4" />;
      case 'transform':
        return <Code className="w-4 h-4" />;
      case 'decision':
        return <GitFork className="w-4 h-4" />;
      case 'notification':
        return <Bell className="w-4 h-4" />;
      case 'api':
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  }, [data.type]);

  const nodeColor = NODE_COLORS[data.type];
  
  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
        selected ? 'border-primary ring-2 ring-primary' : 'border-gray-200'
      }`}
      style={{
        borderLeftColor: nodeColor,
        borderLeftWidth: '4px',
      }}
    >
      {/* Input handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      
      {/* Node content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md" style={{ backgroundColor: `${nodeColor}30` }}>
            {icon()}
          </div>
          <div className="text-sm font-medium">{data.label}</div>
        </div>
      </div>
      
      {data.description && (
        <div className="mt-1 text-xs text-gray-500 truncate max-w-[180px]">
          {data.description}
        </div>
      )}
      
      {/* Output handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

// Agent Node: Represents an agent that performs actions
export const AgentNode = memo((props: NodeComponentProps) => {
  return <BaseNode {...props} />;
});

AgentNode.displayName = 'AgentNode';

// Transform Node: Represents data transformation operations
export const TransformNode = memo((props: NodeComponentProps) => {
  return <BaseNode {...props} />;
});

TransformNode.displayName = 'TransformNode';

// Decision Node: Represents conditional branching
export const DecisionNode = memo((props: NodeComponentProps) => {
  return (
    <div>
      <BaseNode {...props} />
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="no"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ top: '30%' }}
      />
    </div>
  );
});

DecisionNode.displayName = 'DecisionNode';

// Notification Node: Represents notification or alert actions
export const NotificationNode = memo((props: NodeComponentProps) => {
  return <BaseNode {...props} />;
});

NotificationNode.displayName = 'NotificationNode';

// API Node: Represents API calls
export const ApiNode = memo((props: NodeComponentProps) => {
  return <BaseNode {...props} />;
});

ApiNode.displayName = 'ApiNode';

export const nodeTypes = {
  agentNode: AgentNode,
  transformNode: TransformNode,
  decisionNode: DecisionNode,
  notificationNode: NotificationNode,
  apiNode: ApiNode,
};
