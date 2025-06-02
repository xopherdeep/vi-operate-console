'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitFork } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { NodeComponentProps } from '../types';
import { NODE_COLORS } from '../types';

export const DecisionNode = memo(({ data, isConnectable, selected }: NodeComponentProps) => {
  return (
    <Card className={`min-w-[180px] max-w-[250px] shadow-md transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-2 py-2 px-3 bg-amber-50">
        <GitFork size={16} className="text-amber-500" />
        <CardTitle className="text-sm font-medium truncate">{data.label}</CardTitle>
        <Badge variant="secondary" className="ml-auto text-[10px] py-0 h-5">Decision</Badge>
      </CardHeader>
      <CardContent className="py-2 px-3 text-xs">
        <p className="text-muted-foreground">{data.description || 'Branch workflow based on conditions'}</p>
      </CardContent>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: NODE_COLORS.decision }}
        isConnectable={isConnectable}
      />
      
      {/* Output handle - Yes */}
      <Handle
        type="source"
        id="yes"
        position={Position.Bottom}
        style={{ background: NODE_COLORS.decision, left: '30%' }}
        isConnectable={isConnectable}
      />
      
      {/* Output handle - No */}
      <Handle
        type="source"
        id="no"
        position={Position.Bottom}
        style={{ background: NODE_COLORS.decision, left: '70%' }}
        isConnectable={isConnectable}
      />
      
      {/* Labels for the handles */}
      <div className="absolute bottom-[-20px] left-0 w-full flex justify-around text-[10px] text-gray-500">
        <span style={{ left: '30%', position: 'absolute', transform: 'translateX(-50%)' }}>Yes</span>
        <span style={{ left: '70%', position: 'absolute', transform: 'translateX(-50%)' }}>No</span>
      </div>
    </Card>
  );
});

DecisionNode.displayName = 'DecisionNode';
