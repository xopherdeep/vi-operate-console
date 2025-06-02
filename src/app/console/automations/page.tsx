'use client';

import { Page } from '@/components/common/layout';
import { actionButton } from './_common/components/artifacts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { automationsApi } from '@/lib/api/endpoints';
import { AutomationList } from './_common/components/automation-list';
import { AutomationTable } from './_common/components/automation-table';
import { LayoutGrid, List } from 'lucide-react';

export default function AutomationsPage() {
  // State for view type (card or table) - changed default to 'table'
  const [viewType, setViewType] = useState<'card' | 'table'>('table');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch automations data using Tanstack Query
  const { 
    data: automations = [], 
    error: automationsError, 
    isLoading: isLoadingAutomations 
  } = useQuery({
    queryKey: ['automations'],
    queryFn: automationsApi.getAutomationTabs
  });

  // Filter automations based on search term
  const filteredAutomations = automations.filter(
    (automation: any) =>
      automation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle view between card and table
  const toggleViewMode = () => {
    setViewType(prev => prev === 'card' ? 'table' : 'card');
  };

  return (
    <Page 
      title="Automations" 
      actionButton={actionButton} 
      variant="container"
      isLoading={isLoadingAutomations}
      error={automationsError ? (automationsError as Error).message : null}
      secondaryActionButton={{
        icon: viewType === 'card' ? <List className="h-4 w-4 mr-2" /> : <LayoutGrid className="h-4 w-4 mr-2" />,
        label: viewType === 'card' ? 'Table View' : 'Card View',
        onClick: toggleViewMode
      }}
    >
      {viewType === 'card' ? (
        <AutomationList 
          automations={filteredAutomations}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <AutomationTable 
          automations={filteredAutomations} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </Page>
  );
}
