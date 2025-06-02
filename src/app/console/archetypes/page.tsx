'use client';

import { Page } from '@/components/common/layout';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { archetypesApi } from '@/lib/api/endpoints';
import { ArchetypeList } from './_common/components/archetype-list';
import { ArchetypeTable } from './_common/components/archetype-table';
import { LayoutGrid, List } from 'lucide-react';
import { actionButton } from './_common/components/artifacts';

export default function ArchetypesPage() {
  // State for view type (card or table) - changed default to 'table'
  const [viewType, setViewType] = useState<'card' | 'table'>('table');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Expansion state for cards
  const [expandedArchetypeId, setExpandedArchetypeId] = useState<number | null>(null);
  
  // Fetch data using Tanstack Query
  const { 
    data: archetypes = [], 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ['archetypes'],
    queryFn: archetypesApi.getArchetypes
  });

  // Filter archetypes based on search term
  const filteredArchetypes = archetypes.filter(
    (archetype) =>
      archetype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archetype.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle expanded state for cards
  const toggleExpand = (id: number) => {
    setExpandedArchetypeId(expandedArchetypeId === id ? null : id);
  };

  // Toggle view between card and table
  const toggleViewMode = () => {
    setViewType(prev => prev === 'card' ? 'table' : 'card');
  };

  return (
    <Page 
      title="Archetypes" 
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
      {viewType === 'card' ? (
        <ArchetypeList 
          archetypes={filteredArchetypes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expandedArchetypeId={expandedArchetypeId}
          toggleExpand={toggleExpand}
        />
      ) : (
        <ArchetypeTable 
          archetypes={filteredArchetypes} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </Page>
  );
}
