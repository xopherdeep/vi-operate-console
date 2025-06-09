'use client';

import { Page } from '@/components/common/layout';
import { actionButton } from './_common/components/artifacts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { automationsApi } from '@/lib/api/endpoints';
import { AutomationList } from './_common/components/automation-list';
import { AutomationTable } from './_common/components/automation-table';
export default function AutomationsPage() {
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

  return (
    <Page 
      title="Automations" 
      actionButton={actionButton} 
      variant="container"
      isLoading={isLoadingAutomations}
      error={automationsError ? (automationsError as Error).message : null}
    >
      <AutomationTable 
        automations={filteredAutomations} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Page>
  );
}
