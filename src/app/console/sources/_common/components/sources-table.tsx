'use client';

import React, { useState } from 'react';
import { Source } from '@/app/console/sources/_common/types/source';
import { StandardTable, StandardRow } from '@/components';
import { Badge } from '@/ui/badge';
import { AlertTriangle, Eye, Settings, RefreshCw } from 'lucide-react';

interface SourcesTableProps {
  sources: Source[];
}

export default function SourcesTable({ sources }: SourcesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter sources based on search term
  const filteredSources = sources.filter(
    (source) =>
      searchTerm === '' ||
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'type',
      label: 'Type',
      width: '120px'
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px'
    },
    {
      key: 'datasets',
      label: 'Datasets',
      hideOnMobile: true,
      width: '100px'
    },
    {
      key: 'models',
      label: 'Models',
      hideOnMobile: true,
      width: '100px'
    },
    {
      key: 'lastRefresh',
      label: 'Last Refresh',
      hideOnMobile: true
    }
  ];

  // Row rendering function for the table
  const renderRow = (source: Source) => {
    // Column rendering configurations
    const columnConfig = [
      {
        key: 'name',
        renderCell: (item: Source) => (
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${item.iconBg || 'bg-blue-100'}`}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
          </div>
        )
      },
      {
        key: 'type',
        renderCell: (item: Source) => (
          <Badge variant="outline">{item.type}</Badge>
        )
      },
      {
        key: 'status',
        renderCell: (item: Source) => (
          <div className="flex items-center">
            {item.status === 'Healthy' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-green-600">Healthy</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-amber-600">{item.status || 'Unknown'}</span>
              </>
            )}
          </div>
        )
      },
      {
        key: 'datasets',
        hideOnMobile: true,
        renderCell: (item: Source) => (
          <span>{item.datasets || 0}</span>
        )
      },
      {
        key: 'models',
        hideOnMobile: true,
        renderCell: (item: Source) => (
          <span>{item.models || 0}</span>
        )
      },
      {
        key: 'lastRefresh',
        hideOnMobile: true,
        renderCell: (item: Source) => (
          <span>{item.lastRefresh}</span>
        )
      }
    ];

    return (
      <StandardRow 
        key={source.id}
        item={source}
        columns={columnConfig}
        viewHref={`/console/sources/${source.id}`}
        actions={[
          {
            icon: <Eye className="h-4 w-4" />,
            label: 'View',
            onClick: () => console.log(`View source: ${source.name}`)
          },
          {
            icon: <RefreshCw className="h-4 w-4" />,
            label: 'Refresh',
            onClick: () => console.log(`Refresh source: ${source.name}`)
          },
          {
            icon: <Settings className="h-4 w-4" />,
            label: 'Settings',
            onClick: () => console.log(`Edit source: ${source.name}`)
          }
        ]}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Existing Sources</h2>
      </div>

      <StandardTable
        data={filteredSources}
        columns={columns}
        renderRow={renderRow}
        currentOffset={0}
        totalItems={filteredSources.length}
        basePath="/console/sources"
        searchable={true}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search sources..."
      />
    </div>
  );
}