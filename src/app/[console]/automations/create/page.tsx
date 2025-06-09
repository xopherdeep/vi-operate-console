'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Connection, Edge, Node } from 'reactflow';
import { Sparkles, Save, Play, FileJson, Settings, MessageSquare, ZoomIn, ZoomOut } from 'lucide-react';

// UI Components
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/ui/resizable';

// Custom Components
import { WorkflowCanvas, NodePalette, CustomNode, CustomEdge } from '../_common/components/workflow-canvas';
import { Page } from '@/components/common/layout';
import AutomationSheet from './sheet';
import AutomationAssistant from './assistant';

// Mock Data
import { defaultWorkflowTemplate, defaultAutomationConfig, WorkflowTemplate, AutomationConfig } from '@/lib/db/mock-data/workflow-templates';  // Interface is imported from mock-data/workflow-templates

/**
 * Renders the Automation Creation Page component.
 *
 * This component provides a visual interface for creating a new workflow automation.
 * It includes a canvas for designing the workflow with nodes and connections,
 * a palette of available nodes, and an AI assistant that guides users through
 * the process and offers real-time suggestions.
 */
export default function AutomationCreatePage() {
  // Sheet and assistant states
  const [sheetOpen, setSheetOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);
  
  // Workflow state
  const [workflow, setWorkflow] = useState<WorkflowTemplate>(defaultWorkflowTemplate);

  // Selection state for nodes/edges
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  
  // Automation configuration
  const [activeAutomation, setActiveAutomation] = useState<AutomationConfig>(defaultAutomationConfig);
  
  // Canvas reference
  const canvasRef = useRef(null);
  
  // User prompt for AI assistance
  const [userPrompt, setUserPrompt] = useState('');

  // Handler for workflow property changes
  const handleWorkflowPropertyChange = (property: keyof WorkflowTemplate, value: any) => {
    setWorkflow(prevWorkflow => ({
      ...prevWorkflow,
      [property]: value
    }));
  };
  
  // Handler for node changes (position, etc.)
  const onNodesChange = useCallback((nodes: CustomNode[]) => {
    setWorkflow(prevWorkflow => ({
      ...prevWorkflow,
      nodes
    }));
  }, []);
  
  // Handler for edge changes
  const onEdgesChange = useCallback((edges: CustomEdge[]) => {
    setWorkflow(prevWorkflow => ({
      ...prevWorkflow,
      edges
    }));
  }, []);
  
  // Handler for new connections between nodes
  const onConnect = useCallback((params: Connection) => {
    setWorkflow(prevWorkflow => {
      const newEdge: CustomEdge = {
        id: `edge-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'custom',
        animated: true
      };
      
      return {
        ...prevWorkflow,
        edges: [...prevWorkflow.edges, newEdge]
      };
    });
  }, []);
  
  // Handler for selecting nodes/edges
  const onElementClick = useCallback((event: React.MouseEvent, element: Node | Edge) => {
    setSelectedElement(element);
    setSheetOpen(true);
  }, []);
  
  // Handler for adding a node from the palette
  const handleAddNode = useCallback((nodeType: string, data: any) => {
    const newNode: CustomNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50
      },
      data: {
        ...data,
        label: data.label || 'New Node'
      }
    };
    
    setWorkflow(prevWorkflow => ({
      ...prevWorkflow,
      nodes: [...prevWorkflow.nodes, newNode]
    }));
  }, []);

  // Toggle the assistant panel
  const toggleAssistant = () => {
    setAssistantOpen(prev => !prev);
  };

  return (
    <Page title='Create Automation' variant='splash'>
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-4">
          <Input
            value={workflow.name}
            onChange={(e) => handleWorkflowPropertyChange('name', e.target.value)}
            className="text-xl font-bold bg-transparent border-none shadow-none max-w-md px-0 h-auto focus-visible:ring-0"
            style={{ paddingLeft: 0 }}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAssistant}
            className="gap-1"
          >
            <MessageSquare size={16} />
            Assistant
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <Save size={16} />
            Save
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
          >
            <Play size={16} />
            Test Run
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <ResizablePanelGroup direction="horizontal" className="border rounded-md h-full">
          {/* Left panel: Node palette */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full p-2">
              <NodePalette onNodeAdd={handleAddNode} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Right panel: Canvas */}
          <ResizablePanel defaultSize={80}>
            <Tabs defaultValue="canvas" className="h-full flex flex-col">
              <div className="border-b px-4">
                <div className="flex justify-between items-center">
                  <TabsList className="mt-2">
                    <TabsTrigger value="canvas" className="data-[state=active]:bg-muted gap-1 text-xs">
                      Canvas
                    </TabsTrigger>
                    <TabsTrigger value="json" className="data-[state=active]:bg-muted gap-1 text-xs">
                      <FileJson className="w-3.5 h-3.5 mr-1" />
                      JSON
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2 pr-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <TabsContent value="canvas" className="flex-1 p-0 m-0 data-[state=active]:flex">
                <div className="w-full h-full" ref={canvasRef}>
                  <WorkflowCanvas
                    nodes={workflow.nodes}
                    edges={workflow.edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onElementClick}
                    className="w-full h-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="json" className="flex-1 m-0 p-4 overflow-auto data-[state=active]:block">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify({
                    name: workflow.name,
                    description: workflow.description,
                    nodes: workflow.nodes,
                    edges: workflow.edges
                  }, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Sheet component for node/edge properties */}
      <AutomationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        userPrompt={userPrompt}
        activeAutomation={activeAutomation}
      />
      
      {/* Assistant component */}
      <AutomationAssistant 
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        workflowName={workflow.name}
      />
    </Page>
  );
}
