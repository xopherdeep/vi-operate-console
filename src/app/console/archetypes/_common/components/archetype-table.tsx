'use client';

import React from 'react';
import { ArchetypeViewModel } from '@/types/archetype';
import { StandardTable, StandardRow } from '@/components';
import { Badge } from '@/ui/badge';
import { PencilIcon, PlayIcon, PauseIcon } from 'lucide-react';

interface ArchetypeTableProps {
  archetypes: ArchetypeViewModel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function ArchetypeTable({
  archetypes,
  searchTerm,
  setSearchTerm
}: ArchetypeTableProps) {
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
      key: 'tablesCount',
      label: 'Tables',
      hideOnMobile: true
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      hideOnMobile: true
    }
  ];

  // Get status badge variant based on archetype status
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
  const renderRow = (item: unknown, index: number) => {
    const archetype = item as ArchetypeViewModel;
    // Column rendering configurations
    const columnConfig = [
      {
        key: 'name',
        renderCell: (item: ArchetypeViewModel) => (
          <span className="font-medium">{item.name}</span>
        )
      },
      {
        key: 'description',
        hideOnMobile: true,
        renderCell: (item: ArchetypeViewModel) => (
          <span className="line-clamp-1">{item.description}</span>
        )
      },
      {
        key: 'status',
        renderCell: (item: ArchetypeViewModel) => (
          <Badge 
            variant="outline" 
            className={getStatusVariant(item.status)}
          >
            {item.status}
          </Badge>
        )
      },
      {
        key: 'tablesCount',
        hideOnMobile: true,
        renderCell: (item: ArchetypeViewModel) => (
          <span>{item.tablesCount}</span>
        )
      },
      {
        key: 'lastUpdated',
        hideOnMobile: true,
        renderCell: (item: ArchetypeViewModel) => (
          <span>{item.lastUpdated}</span>
        )
      }
    ];

    return (
      <StandardRow 
        key={archetype.id}
        item={archetype}
        columns={columnConfig}
        viewHref={`/console/archetypes/${archetype.id}`}
        actions={[
          {
            icon: <PencilIcon className="h-4 w-4" />,
            label: 'Edit',
            onClick: () => console.log(`Edit archetype ${archetype.id}`)
          },
          archetype.status === 'Paused' 
            ? {
                icon: <PlayIcon className="h-4 w-4" />,
                label: 'Resume',
                onClick: () => console.log(`Resume archetype ${archetype.id}`),
                variant: 'default'
              }
            : {
                icon: <PauseIcon className="h-4 w-4" />,
                label: 'Pause',
                onClick: () => console.log(`Pause archetype ${archetype.id}`),
                variant: 'destructive'
              }
        ]}
      />
    );
  };

  return (
    <StandardTable
      title="Archetypes"
      itemsPerPage={10}
      data={archetypes}
      columns={columns}
      renderRow={renderRow}
      currentOffset={0}
      totalItems={archetypes.length}
      basePath="/console/archetypes"
      searchable={true}
      onSearch={setSearchTerm}
    />
  );
}