'use client';

import { Page } from '@/components/common/layout';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/endpoints';
import { actionButton } from './_common/components/artifacts';
import { ReportList } from './_common/components/report-list';
import { ReportTable } from './_common/components/report-table';
import { LayoutGrid, List } from 'lucide-react';

export default function ReportsPage() {
  // State for view type (card or table) - changed default to 'table'
  const [viewType, setViewType] = useState<'card' | 'table'>('table');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch reports data using Tanstack Query
  const { 
    data: reports = [], 
    error: reportsError, 
    isLoading: isLoadingReports 
  } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsApi.getReports,
    select: (data) => data.map((report: any) => ({
      ...report,
      // Simple transformation if needed
    }))
  });

  // Filter reports based on search term
  const filteredReports = reports.filter(
    (report: any) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle view between card and table
  const toggleViewMode = () => {
    setViewType(prev => prev === 'card' ? 'table' : 'card');
  };

  return (
    <Page 
      title="Reports" 
      actionButton={actionButton} 
      variant="container"
      isLoading={isLoadingReports}
      error={reportsError ? (reportsError as Error).message : null}
      secondaryActionButton={{
        icon: viewType === 'card' ? <List className="h-4 w-4 mr-2" /> : <LayoutGrid className="h-4 w-4 mr-2" />,
        label: viewType === 'card' ? 'Table View' : 'Card View',
        onClick: toggleViewMode
      }}
    >
      {viewType === 'card' ? (
        <ReportList 
          reports={filteredReports}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <ReportTable 
          reports={filteredReports} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </Page>
  );
}
