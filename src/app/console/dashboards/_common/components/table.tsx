'use client';

import React from 'react';
import { StandardTable, StandardRow } from '@/components';
import { TrendingUp, Phone, PhoneOutgoing, Users, Calendar, Gauge } from 'lucide-react';
import { Badge } from '@/ui/badge';

interface DashboardTableProps {
  dashboards: any[];
  basePath: string;
  currentOffset: number;
  itemsPerPage?: number;
}

export function DashboardTable({
  dashboards,
  basePath,
  currentOffset,
  itemsPerPage = 10
}: DashboardTableProps) {
  // Define table columns
  const columns = [
    {
      key: 'title',
      label: 'Dashboard',
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
      key: 'type',
      label: 'Type',
      hideOnMobile: true
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      hideOnMobile: true
    }
  ];

  // Map dashboard icon by type
  const iconMap: Record<string, React.ReactNode> = {
    'inbound-call-center': <Phone className="h-5 w-5" />,
    'outbound-call-center': <PhoneOutgoing className="h-5 w-5" />,
    'agent-performance': <Users className="h-5 w-5" />,
    'workforce-management': <Calendar className="h-5 w-5" />,
    'quality-monitoring': <Gauge className="h-5 w-5" />
  };

  // Map status to badge variants
  const statusVariantMap: Record<string, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    development: 'bg-amber-50 text-amber-700 border-amber-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  // Row rendering function for the table
  const renderRow = (dashboard: any) => {
    // Column rendering configurations
    const columnConfig = [
      {
        key: 'title',
        renderCell: (item: any) => (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              {iconMap[item.id] || <Gauge className="h-5 w-5" />}
            </span>
            <span className="font-medium">{item.title}</span>
          </div>
        )
      },
      {
        key: 'description',
        hideOnMobile: true,
        renderCell: (item: any) => (
          <span className="line-clamp-1">{item.description}</span>
        )
      },
      {
        key: 'status',
        renderCell: (item: any) => {
          const status = item.status || 'inactive';
          const statusLabel = 
            status === 'active' ? 'Active' : 
            status === 'development' ? 'In Development' : 
            'Inactive';
            
          return (
            <Badge 
              variant="outline" 
              className={statusVariantMap[status]}
            >
              {statusLabel}
            </Badge>
          );
        }
      },
      {
        key: 'type',
        hideOnMobile: true,
        renderCell: (item: any) => {
          const type = item.type || 'Unknown';
          return <span className="capitalize">{type.replace(/-/g, ' ')}</span>;
        }
      },
      {
        key: 'lastUpdated',
        hideOnMobile: true,
        renderCell: (item: any) => (
          <div className="flex items-center">
            {item.trend ? (
              <div className="flex items-center">
                <span className={`text-${item.trend.direction === 'up' ? 'green' : 'red'}-500 font-medium mr-1`}>
                  {item.trend.direction === 'up' ? '↑' : '↓'} {item.trend.value}
                </span>
              </div>
            ) : (
              <span>{item.lastUpdated || 'Not available'}</span>
            )}
          </div>
        )
      }
    ];

    return (
      <StandardRow 
        key={dashboard.id}
        item={dashboard}
        columns={columnConfig}
        viewHref={`/console/dashboards/${dashboard.id}`}
        onDelete={dashboard.status !== 'active' ? () => console.log(`Delete dashboard ${dashboard.id}`) : undefined}
      />
    );
  };

  return (
    <StandardTable
      data={dashboards}
      columns={columns}
      title="Dashboards"
      description="View and manage your dashboards"
      renderRow={renderRow}
      itemsPerPage={itemsPerPage}
      currentOffset={currentOffset}
      totalItems={dashboards.length} // In a real app, this would come from an API count
      basePath={basePath}
      createButtonLabel="Create Dashboard"
      onCreateClick={() => console.log('Create dashboard clicked')}
      searchable={true}
      onSearch={(query) => console.log('Search dashboards:', query)}
    />
  );
}