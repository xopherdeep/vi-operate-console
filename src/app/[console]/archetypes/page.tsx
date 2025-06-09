'use client';

import { Page } from '@/components/common/layout';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { archetypesApi } from '@/lib/api/endpoints';
import { ArchetypeList } from './_common/components/archetype-list';
import { ArchetypeTable } from './_common/components/archetype-table';
import { actionButton } from './_common/components/artifacts';

export default function ArchetypesPage() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
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

  return (
    <Page 
      title="Archetypes" 
      actionButton={actionButton} 
      variant="container"
      isLoading={isLoading}
      error={error ? (error as Error).message : null}
    >
      <ArchetypeTable 
          archetypes={filteredArchetypes} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
    </Page>
  );
}
