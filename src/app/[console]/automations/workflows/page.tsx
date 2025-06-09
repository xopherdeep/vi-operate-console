'use client';

import { useState } from 'react';
import { Plus, ChevronRight, Play, MoreVertical, Filter, Clock, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { Page, PageHeader } from '@/components/common/layout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';

// Mock workflows data - in a real app, this would come from an API
const MOCK_WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Labor Insights Workflow',
    description: 'Analyzes labor data and provides scheduling insights',
    status: 'active',
    lastRunAt: '2023-05-27T14:30:00',
    nextRunAt: '2023-05-28T14:30:00',
    nodeCount: 5
  },
  {
    id: 'wf-2',
    name: 'Customer Support Alert',
    description: 'Monitors call logs for tier_support and sends notifications',
    status: 'active',
    lastRunAt: '2023-05-27T12:00:00',
    nextRunAt: '2023-05-27T16:00:00',
    nodeCount: 3
  },
  {
    id: 'wf-3',
    name: 'Weekly Forecast Builder',
    description: 'Builds labor forecasts based on historical data',
    status: 'inactive',
    lastRunAt: '2023-05-20T08:00:00',
    nextRunAt: null,
    nodeCount: 7
  },
  {
    id: 'wf-4',
    name: 'Daily Schedule Optimizer',
    description: 'Reviews and optimizes daily staff schedules',
    status: 'error',
    lastRunAt: '2023-05-27T06:00:00',
    nextRunAt: '2023-05-28T06:00:00',
    nodeCount: 4
  }
];

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return '—';
  
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

// Helper for status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Active</Badge>;
    case 'inactive':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">Inactive</Badge>;
    case 'error':
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function WorkflowsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter workflows based on search query
  const filteredWorkflows = MOCK_WORKFLOWS.filter(
    workflow => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Workflows</h1>
            <p className="text-muted-foreground mt-1">
              Design and manage automated workflows
            </p>
          </div>
          <Button onClick={() => router.push('/console/automations/workflows/builder')}>
            <Plus className="mr-2 h-4 w-4" /> Create Workflow
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Your Workflows</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </Button>
              </div>
            </div>
            <CardDescription>
              Manage your automated workflow sequences
            </CardDescription>
            <div className="mt-2">
              <Input 
                placeholder="Search workflows..." 
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">Last Run</div>
                <div className="col-span-2 text-center">Next Run</div>
                <div className="col-span-1 text-center">Nodes</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
            
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((workflow) => (
                  <div 
                    key={workflow.id}
                    className="grid grid-cols-12 gap-4 p-4 border-t items-center text-sm hover:bg-muted/20 cursor-pointer"
                    onClick={() => router.push(`/console/automations/workflows/builder?id=${workflow.id}`)}
                  >
                    <div className="col-span-4">
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{workflow.description}</div>
                    </div>
                    <div className="col-span-2 text-center">
                      {getStatusBadge(workflow.status)}
                    </div>
                    <div className="col-span-2 text-center flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDate(workflow.lastRunAt)}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      {formatDate(workflow.nextRunAt)}
                    </div>
                    <div className="col-span-1 text-center">
                      {workflow.nodeCount}
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Run workflow:', workflow.id);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/console/automations/workflows/builder?id=${workflow.id}`);
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              console.log('Duplicate workflow:', workflow.id);
                            }}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete workflow:', workflow.id);
                            }} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No workflows found. Create one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
