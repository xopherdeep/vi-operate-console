# Automations Module

## Structure

- `/automations` - Main automations module
  - `/create` - Automation creation flow
  - `/builder` - **(Redirects to workflows/builder)** Maintained for backwards compatibility
  - `/workflows` - Workflow-specific pages 
    - `/builder` - Visual workflow builder using ReactFlow
  - `/components/workflow-canvas` - Reusable workflow builder components
  - `/__tests__` - Tests for automation functionality

## Workflow Builder

The workflow builder is the main interface for creating and editing automation workflows. 
It uses ReactFlow to provide a visual canvas for designing workflows with nodes and edges.

### Components

The workflow builder uses components in the `/automations/components/workflow-canvas` directory:

- `canvas.tsx` - Main ReactFlow canvas component
- `node-palette.tsx` - Sidebar component for available nodes
- `nodes/` - Custom node implementations
- `edges.tsx` - Custom edge implementation
- `types.ts` - Type definitions

## Usage Flow

1. Users start at the main automations page (`/automations/page.tsx`)
2. They click "New Automation" which takes them to the create page (`/automations/create/page.tsx`) 
3. After configuring basic settings, they proceed to the visual builder (`/automations/workflows/builder/page.tsx`)

## Implementation Notes

- The original builder implementation was moved to `/workflows/builder` and the old path (`/builder`) now redirects to the new location
- The builder uses ReactFlow for the drag-and-drop workflow canvas
- The implementation has been streamlined to maintain a single source of truth for workflow components
- Tests have been added to ensure redirection works correctly and integration between components is maintained
