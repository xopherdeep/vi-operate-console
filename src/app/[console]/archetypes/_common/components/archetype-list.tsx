'use client';

import React from 'react';
import { ArchetypeViewModel } from '@/types/archetype';
import { ArchetypeCard } from './archetype-card';
import { Input } from '@/ui/input';
import { Search } from 'lucide-react';

interface ArchetypeListProps {
  archetypes: ArchetypeViewModel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  expandedArchetypeId: number | null;
  toggleExpand: (id: number) => void;
}

export function ArchetypeList({
  archetypes,
  searchTerm,
  setSearchTerm,
  expandedArchetypeId,
  toggleExpand
}: ArchetypeListProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search archetypes..."
            className="pl-10 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {archetypes.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No archetypes found. Try a different search term.
          </div>
        ) : (
          archetypes.map((archetype) => (
            <ArchetypeCard
              key={archetype.id}
              {...archetype}
              expandedId={expandedArchetypeId}
              onToggleExpandAction={toggleExpand}
            />
          ))
        )}
      </div>
    </div>
  );
}