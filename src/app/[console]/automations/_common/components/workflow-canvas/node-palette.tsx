'use client';

import React from 'react';
import { Cpu, Code, GitFork, Bell, Globe, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { NODE_COLORS } from './types';
import { WorkflowStepType } from '@/types/workflow';

interface NodePaletteProps {
  onNodeAdd?: (nodeType: string, data: any) => void;
}

/**
 * The NodePalette component displays a set of node types that users can
 * drag and drop onto the workflow canvas.
 */
export function NodePalette({ onNodeAdd }: NodePaletteProps) {
  // Handle dragging a node from the palette
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    // Set the node type as data to be used when dropped
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodeData', JSON.stringify(data));
    
    // Set the offset so the node appears where it's dropped
    const dragOffset = JSON.stringify({
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY,
    });
    event.dataTransfer.setData('application/offsetData', dragOffset);
    
    // Set the drag image to be a stylized version of the node
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle clicking on a node in the palette (alternative to drag and drop)
  const handleAdd = (nodeType: string, data: any) => {
    if (onNodeAdd) {
      onNodeAdd(nodeType, data);
    }
  };

  // Define the node types that can be added to the canvas
  const nodeOptions = [
    {
      type: 'agentNode',
      label: 'Agent',
      description: 'Performs specific automated tasks',
      icon: <Cpu className="w-4 h-4" />,
      data: { type: 'agent', label: 'Agent' }
    },
    {
      type: 'transformNode',
      label: 'Transform',
      description: 'Transforms or processes data',
      icon: <Code className="w-4 h-4" />,
      data: { type: 'transform', label: 'Transform' }
    },
    {
      type: 'decisionNode',
      label: 'Decision',
      description: 'Branches workflow based on conditions',
      icon: <GitFork className="w-4 h-4" />,
      data: { type: 'decision', label: 'Decision' }
    },
    {
      type: 'notificationNode',
      label: 'Notification',
      description: 'Sends alerts or notifications',
      icon: <Bell className="w-4 h-4" />,
      data: { type: 'notification', label: 'Notification' }
    },
    {
      type: 'apiNode',
      label: 'API',
      description: 'Makes external API calls',
      icon: <Globe className="w-4 h-4" />,
      data: { type: 'api', label: 'API' }
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Node Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="nodes">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="nodes">Nodes</TabsTrigger>
            <TabsTrigger className="flex-1" value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nodes" className="pt-2">
            <div className="space-y-2">
              {nodeOptions.map((option) => (
                <div
                  key={option.type}
                  className="flex items-center p-2 rounded-md border border-gray-200 bg-white cursor-grab hover:shadow-md transition-all"
                  draggable
                  onDragStart={(event) => onDragStart(event, option.type, option.data)}
                  onClick={() => handleAdd(option.type, option.data)}
                >
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${NODE_COLORS[option.data.type as WorkflowStepType]}20` }}
                  >
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="pt-2">
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start text-left p-3 h-auto">
                <div className="flex gap-2 items-center">
                  <Plus className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Data Processing</div>
                    <div className="text-xs text-gray-500">3 nodes</div>
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start text-left p-3 h-auto">
                <div className="flex gap-2 items-center">
                  <Plus className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Alert Sequence</div>
                    <div className="text-xs text-gray-500">4 nodes</div>
                  </div>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default NodePalette;
