'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Connection, Edge, Node } from 'reactflow';
import { Save, Play, FileJson, Settings, ZoomIn, ZoomOut } from 'lucide-react';

// UI Components
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Input } from '@/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/ui/resizable';
import { Textarea } from '@/ui/textarea';
// Custom Components
import { WorkflowCanvas, NodePalette, CustomNode, CustomEdge } from '../../_common/components/workflow-canvas';
import { Page } from '@/components/common/layout';
import { Breadcrumb } from '@/ui/breadcrumb';

// Define the interface for workflow properties
interface WorkflowProps {
  id?: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
}

/**
 * WorkflowBuilder component for creating and editing workflow automations
 * 
 * This page provides a visual canvas for designing workflow automations with
 * a node palette, canvas, and properties panel.
 */
export default function WorkflowBuilderPage() {
  // Workflow state
  const [workflow, setWorkflow] = useState<WorkflowProps>({
    name: 'New Workflow',
    description: 'Describe your workflow here',
    nodes: [],
    edges: []
  });
  
  // Selection state
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);
  
  // Refs for the canvas
  const canvasRef = useRef(null);
  
  // Handler for workflow property changes
  const handleWorkflowPropertyChange = (property: keyof WorkflowProps, value: any) => {
    setWorkflow(prevWorkflow => ({
      ...prevWorkflow,
      [property]: value
    }));
  };
  
  // Handler for node changes (position, etc.)
  const onNodesChange = useCallback((changes: any) => {
    setWorkflow(prevWorkflow => {
      const updatedNodes = [...prevWorkflow.nodes];
      
      changes.forEach((change: any) => {
        if (change.type === 'position') {
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: change.position || updatedNodes[nodeIndex].position
            };
          }
        } else if (change.type === 'remove') {
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes.splice(nodeIndex, 1);
          }
        }
      });
      
      return {
        ...prevWorkflow,
        nodes: updatedNodes
      };
    });
  }, []);
  
  // Handler for edge changes
  const onEdgesChange = useCallback((changes: any) => {
    setWorkflow(prevWorkflow => {
      const updatedEdges = [...prevWorkflow.edges];
      
      changes.forEach((change: any) => {
        if (change.type === 'remove') {
          const edgeIndex = updatedEdges.findIndex(e => e.id === change.id);
          if (edgeIndex !== -1) {
            updatedEdges.splice(edgeIndex, 1);
          }
        }
      });
      
      return {
        ...prevWorkflow,
        edges: updatedEdges
      };
    });
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
  
  // Handler for saving the workflow
  const handleSaveWorkflow = useCallback(() => {
    // Here you would typically save to your backend
    console.log('Saving workflow:', workflow);
    
    // Display a notification (using alert for now, replace with toast when available)
    alert(`"${workflow.name}" has been saved successfully.`);
  }, [workflow]);
  
  // Handler for testing the workflow
  const handleTestWorkflow = useCallback(() => {
    // Display a notification (using alert for now, replace with toast when available)
    alert(`Test execution of "${workflow.name}" has started.`);
  }, [workflow]);
  
  const breadcrumbItems = [
    { name: 'Console', href: '/console' },
    { name: 'Automations', href: '/console/automations' },
    { name: 'Workflows', href: '/console/automations/workflows' },
    { name: workflow.name, href: '#' }
  ];
  
  return (
    <Page 
      title="Workflow Builder" 
      variant="container"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <a href={item.href} className={index === breadcrumbItems.length - 1 ? "font-medium text-foreground" : "hover:text-foreground"}>
                  {item.name}
                </a>
                {index < breadcrumbItems.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Input
              value={workflow.name}
              onChange={(e) => handleWorkflowPropertyChange('name', e.target.value)}
              className="text-xl font-bold bg-transparent border-none shadow-none max-w-md px-0 h-auto focus-visible:ring-0"
              style={{ paddingLeft: 0 }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveWorkflow}
            className="gap-1"
          >
            <Save size={16} />
            Save
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleTestWorkflow}
            className="gap-1"
          >
            <Play size={16} />
            Test Run
          </Button>
        </div>
      </div>

      <div className="p-4">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="min-h-[calc(100vh-12rem)] border rounded-md"
        >
          {/* Left panel: Node palette */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full p-2">
              <NodePalette onNodeAdd={handleAddNode} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Middle panel: Canvas */}
          <ResizablePanel defaultSize={55}>
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
          
          <ResizableHandle />
          
          {/* Right panel: Properties */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
            <div className="h-full p-2">
              <Card className="h-full">
                <div className="p-4 h-full flex flex-col">
                  <h3 className="text-lg font-medium mb-1">Properties</h3>
                  
                  {selectedElement ? (
                    <div className="flex flex-col gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Type</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedElement.type === 'custom' ? 'Connection' : selectedElement.type}
                        </p>
                      </div>
                      
                      {'data' in selectedElement && (
                        <>
                          <div>
                            <p className="text-sm font-medium mb-1">Label</p>
                            <Input
                              value={selectedElement.data?.label || ''}
                              onChange={(e) => {
                                const updatedNodes = workflow.nodes.map(node => 
                                  node.id === selectedElement.id 
                                    ? { ...node, data: { ...node.data, label: e.target.value } } 
                                    : node
                                );
                                handleWorkflowPropertyChange('nodes', updatedNodes);
                              }}
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Description</p>
                            <Textarea
                              value={selectedElement.data?.description || ''}
                              onChange={(e) => {
                                const updatedNodes = workflow.nodes.map(node => 
                                  node.id === selectedElement.id 
                                    ? { ...node, data: { ...node.data, description: e.target.value } } 
                                    : node
                                );
                                handleWorkflowPropertyChange('nodes', updatedNodes);
                              }}
                              className="text-sm"
                              rows={3}
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="mt-auto">
                        <Button 
                          variant="destructive" 
                          className="w-full mt-2"
                          onClick={() => {
                            if ('source' in selectedElement) {
                              const updatedEdges = workflow.edges.filter(edge => edge.id !== selectedElement.id);
                              handleWorkflowPropertyChange('edges', updatedEdges);
                            } else {
                              const updatedNodes = workflow.nodes.filter(node => node.id !== selectedElement.id);
                              handleWorkflowPropertyChange('nodes', updatedNodes);
                            }
                            setSelectedElement(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Workflow Description</p>
                        <Textarea 
                          value={workflow.description}
                          onChange={(e) => handleWorkflowPropertyChange('description', e.target.value)}
                          className="text-sm"
                          placeholder="Describe the purpose of this workflow..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center opacity-50">
                        <p className="text-sm text-center text-muted-foreground">
                          Select a node or edge to edit its properties
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Page>
  );
}
