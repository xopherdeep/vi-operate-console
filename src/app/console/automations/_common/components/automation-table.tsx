'use client';

import React from 'react';
import { AutomationTab } from '@/app/console/automations/types/automation';
import { StandardTable, StandardRow } from '@/components';
import { Badge } from '@/ui/badge';
import { Eye, Edit, Play, Pause, Zap } from 'lucide-react';

interface AutomationTableProps {
  automations: AutomationTab[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function AutomationTable({
  automations,
  searchTerm,
  setSearchTerm
}: AutomationTableProps) {
  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'description',
      label: 'Description',
      hideOnMobile: true
    },
    {
      key: 'status',
      label: 'Status',
      width: '150px'
    },
    {
      key: 'lastRun',
      label: 'Last Run',
      hideOnMobile: true
    }
  ];

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Paused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Row rendering function for the table
  const renderRow = (automation: AutomationTab) => {
    // Column rendering configurations
    const columnConfig = [
      {
        key: 'name',
        renderCell: (item: AutomationTab) => (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Zap className="h-5 w-5" />
            </span>
            <span className="font-medium">{item.name}</span>
          </div>
        )
      },
      {
        key: 'description',
        hideOnMobile: true,
        renderCell: (item: AutomationTab) => (
          <span className="line-clamp-1">{item.description || 'No description'}</span>
        )
      },
      {
        key: 'status',
        renderCell: (item: AutomationTab) => (
          <Badge 
            variant="outline" 
            className={getStatusVariant(item.status || 'Active')}
          >
            {item.status || 'Active'}
          </Badge>
        )
      },
      {
        key: 'lastRun',
        hideOnMobile: true,
        renderCell: (item: AutomationTab) => (
          <span>{item.lastRun || 'Never'}</span>
        )
      }
    ];

    return (
      <StandardRow 
        key={automation.value}
        item={automation}
        columns={columnConfig}
        viewHref={`/console/automations/${automation.value}`}
        actions={[
          {
            icon: <Eye className="h-4 w-4" />,
            label: 'View',
            onClick: () => console.log(`View automation: ${automation.name}`)
          },
          {
            icon: <Edit className="h-4 w-4" />,
            label: 'Edit',
            onClick: () => console.log(`Edit automation: ${automation.name}`)
          },
          automation.status === 'Paused' 
            ? {
                icon: <Play className="h-4 w-4" />,
                label: 'Resume',
                onClick: () => console.log(`Resume automation: ${automation.name}`)
              }
            : {
                icon: <Pause className="h-4 w-4" />,
                label: 'Pause',
                onClick: () => console.log(`Pause automation: ${automation.name}`)
              }
        ]}
      />
    );
  };

  return (
    <StandardTable
      data={automations}
      columns={columns}
      renderRow={renderRow}
      currentOffset={0}
      totalItems={automations.length}
      basePath="/console/automations"
      searchable={true}
      searchValue={searchTerm}
      onSearch={setSearchTerm}
    />
  );
}