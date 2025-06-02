'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { WorkflowCanvasProps, CustomNode, CustomEdge, NODE_COLORS } from './types';
import { WorkflowStepType } from '@/types/workflow';

/**
 * WorkflowCanvas component for creating and editing automation workflows
 * 
 * This component provides a visual canvas for designing automation workflows
 * with drag-and-drop nodes and connections between steps.
 */
export function WorkflowCanvas({
  nodes: initialNodes = [],
  edges: initialEdges = [],
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  onConnect,
  onNodeClick,
  readOnly = false,
  className = '',
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // Handle node changes - either use the prop callback or handle internally
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeInternal(changes);
      if (onNodesChangeProp) {
        onNodesChangeProp(nodes);
      }
    },
    [nodes, onNodesChangeInternal, onNodesChangeProp]
  );

  // Handle edge changes - either use the prop callback or handle internally
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChangeProp) {
        onEdgesChangeProp(edges);
      }
    },
    [edges, onEdgesChangeInternal, onEdgesChangeProp]
  );

  // Handle new connections between nodes
  const handleConnect = useCallback(
    (params: Connection) => {
      // Create a new edge with a custom type
      const newEdge = {
        ...params,
        type: 'custom',
        animated: true,
        style: { strokeWidth: 1.5 }
      };
      
      // Update edges locally
      setEdges((eds) => addEdge(newEdge, eds));
      
      // If parent component wants to handle connections
      if (onConnect) {
        onConnect(params);
      }
    },
    [setEdges, onConnect]
  );

  // Handle drag-over for dropping new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping new nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Get the node data from the drag event
      const nodeType = event.dataTransfer.getData('application/reactflow');

      // If no valid node type is found, return
      if (!nodeType) return;

      try {
        // Parse the node data
        const data = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // Get position where node was dropped
        const position = {
          x: event.clientX - (data.offsetX || 0),
          y: event.clientY - (data.offsetY || 0),
        };

        // Create unique ID for the new node
        const newId = `${nodeType}-${Date.now()}`;

        // Create the new node
        const newNode: Node = {
          id: newId,
          type: nodeType,
          position,
          data: {
            ...data,
            label: data.label || 'New Node',
          },
        };

        // Add the new node to the canvas
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error creating node:', error);
      }
    },
    [setNodes]
  );

  return (
    <div className={`workflow-canvas h-[600px] border border-gray-200 rounded-md ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onDragOver={!readOnly ? onDragOver : undefined}
        onDrop={!readOnly ? onDrop : undefined}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes as any}
        connectionLineType={ConnectionLineType.Bezier}
        deleteKeyCode={readOnly ? null : 'Delete'}
        fitView
        attributionPosition="bottom-right"
      >
        {/* Background pattern */}
        <Background gap={16} size={1} color="#f1f1f1" />
        
        {/* Controls for zooming and panning */}
        <Controls />
        
        {/* Mini map for navigation */}
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node: Node) => {
            const type = node.data?.type as WorkflowStepType;
            if (!type) return '#eee';
            return NODE_COLORS[type] || '#eee';
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default WorkflowCanvas;
