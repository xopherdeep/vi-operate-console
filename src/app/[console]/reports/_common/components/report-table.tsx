'use client';

import React from 'react';
import { ReportViewModel } from '@/types/report';
import { StandardTable, StandardRow } from '@/components';
import { Badge } from '@/ui/badge';
import { Eye, Download, FileText } from 'lucide-react';

interface ReportTableProps {
  reports: ReportViewModel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function ReportTable({
  reports,
  searchTerm,
  setSearchTerm
}: ReportTableProps) {
  // Define table columns
  const columns = [
    {
      key: 'title',
      label: 'Report Name',
      sortable: true
    },
    {
      key: 'description',
      label: 'Description',
      hideOnMobile: true
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

  // Row rendering function for the table
  const renderRow = (report: ReportViewModel) => {
    // Column rendering configurations
    const columnConfig = [
      {
        key: 'title',
        renderCell: (item: ReportViewModel) => (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5" />
            </span>
            <span className="font-medium">{item.title}</span>
          </div>
        )
      },
      {
        key: 'description',
        hideOnMobile: true,
        renderCell: (item: ReportViewModel) => (
          <span className="line-clamp-1">{item.description}</span>
        )
      },
      {
        key: 'type',
        hideOnMobile: true,
        renderCell: (item: ReportViewModel) => (
          <div className="flex gap-1">
            {item.badges?.map((badge, index) => (
              <Badge key={index} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>
        )
      },
      {
        key: 'lastUpdated',
        hideOnMobile: true,
        renderCell: (item: ReportViewModel) => (
          <span>{item.lastUpdated}</span>
        )
      }
    ];

    return (
      <StandardRow 
        key={report.id || report.title}
        item={report}
        columns={columnConfig}
        viewHref={`/console/reports/${report.id || encodeURIComponent(report.title)}`}
        actions={[
          {
            icon: <Eye className="h-4 w-4" />,
            label: 'View',
            onClick: () => console.log(`View report: ${report.title}`)
          },
          {
            icon: <Download className="h-4 w-4" />,
            label: 'Export',
            onClick: () => console.log(`Export report: ${report.title}`)
          }
        ]}
      />
    );
  };

  return (
    <StandardTable
      data={reports}
      columns={columns}
      renderRow={renderRow}
      currentOffset={0}
      totalItems={reports.length}
      basePath="/console/reports"
      searchable={true}
      searchValue={searchTerm}
      onSearch={setSearchTerm}
    />
  );
}