'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { NodeComponentProps } from '../types';
import { NODE_COLORS } from '../types';

export const NotificationNode = memo(({ data, isConnectable, selected }: NodeComponentProps) => {
  return (
    <Card className={`min-w-[180px] max-w-[250px] shadow-md transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-2 py-2 px-3 bg-purple-50">
        <Bell size={16} className="text-purple-500" />
        <CardTitle className="text-sm font-medium truncate">{data.label}</CardTitle>
        <Badge variant="secondary" className="ml-auto text-[10px] py-0 h-5">Notification</Badge>
      </CardHeader>
      <CardContent className="py-2 px-3 text-xs">
        <p className="text-muted-foreground">{data.description || 'Send notifications to users'}</p>
      </CardContent>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: NODE_COLORS.notification }}
        isConnectable={isConnectable}
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: NODE_COLORS.notification }}
        isConnectable={isConnectable}
      />
    </Card>
  );
});

NotificationNode.displayName = 'NotificationNode';
