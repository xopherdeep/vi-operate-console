'use client';

import React from 'react';
import { AutomationTab } from '@/app/console/automations/types/automation';
import { Input } from '@/ui/input';
import { Search } from 'lucide-react';
import { AutomationCard } from './automation-card';

interface AutomationListProps {
  automations: AutomationTab[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function AutomationList({
  automations,
  searchTerm,
  setSearchTerm
}: AutomationListProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search automations..."
            className="pl-10 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No automations found. Try a different search term.
          </div>
        ) : (
          automations.map((automation) => (
            <AutomationCard
              key={automation.value}
              name={automation.name}
              description={automation.description || ''}
              icon={automation.icon}
              status={automation.status || 'Active'}
              lastRun={automation.lastRun || 'Never'}
              onView={() => console.log(`View automation: ${automation.name}`)}
              onEdit={() => console.log(`Edit automation: ${automation.name}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}