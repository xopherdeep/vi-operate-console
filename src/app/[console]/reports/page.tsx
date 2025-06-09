'use client';

import { Page } from '@/components/common/layout';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api/endpoints';
import { actionButton } from './_common/components/artifacts';
import { ReportList } from './_common/components/report-list';
import { ReportTable } from './_common/components/report-table';
export default function ReportsPage() {
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

  return (
    <Page 
      title="Reports" 
      actionButton={actionButton} 
      variant="container"
      isLoading={isLoadingReports}
      error={reportsError ? (reportsError as Error).message : null}
    >
      <ReportTable 
        reports={filteredReports} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Page>
  );
}
