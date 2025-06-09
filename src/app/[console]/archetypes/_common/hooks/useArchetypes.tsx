'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { archetypesApi } from '@/lib/api/endpoints';

export function useArchetypes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArchetypeId, setExpandedArchetypeId] = useState<number | null>(null);

  // Use Tanstack Query to fetch archetypes
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

  // Toggle expanded state
  const toggleExpand = (id: number) => {
    setExpandedArchetypeId(expandedArchetypeId === id ? null : id);
  };

  return {
    archetypes,
    filteredArchetypes,
    searchTerm,
    setSearchTerm,
    expandedArchetypeId,
    toggleExpand,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}
