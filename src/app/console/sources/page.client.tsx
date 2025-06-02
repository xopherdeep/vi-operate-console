'use client';

import React, { useState } from 'react';
import ConnectionOptions from './_common/components/connection-options';
import ExistingSources from './_common/components/existing-sources';
import SourcesTable from './_common/components/sources-table';
import { Page } from '@/components/common/layout';
import { actionButton } from './_common/components/artifacts';
import { LayoutGrid, List } from 'lucide-react';
import { useSources } from './_common/hooks/useSources';

export default function SourcesClientPage() {
  const [viewType, setViewType] = useState<'card' | 'table'>('table');
  const { sources, isLoading, error } = useSources();
  
  // Toggle view between card and table
  const toggleViewMode = () => {
    setViewType(prev => prev === 'card' ? 'table' : 'card');
  };

  return (
    <Page
      title="Data Sources"
      actionButton={actionButton}
      variant="container"
      isLoading={isLoading}
      error={error ? (error as Error).message : null}
      secondaryActionButton={{
        icon: viewType === 'card' ? <List className="h-4 w-4 mr-2" /> : <LayoutGrid className="h-4 w-4 mr-2" />,
        label: viewType === 'card' ? 'Table View' : 'Card View',
        onClick: toggleViewMode
      }}
    >
      {/* Connection options are always shown at the top */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a New Source</h2>
        <ConnectionOptions />
      </div>
      
      {/* Toggle between card and table view for existing sources */}
      {viewType === 'card' ? (
        <ExistingSources />
      ) : (
        <SourcesTable sources={sources} />
      )}
    </Page>
  );
}
