'use client';

import React from 'react';
import { ReportViewModel } from '@/types/report';
import { Input } from '@/ui/input';
import { Search } from 'lucide-react';
import { ReportCard } from './report-card';

interface ReportListProps {
  reports: ReportViewModel[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function ReportList({
  reports,
  searchTerm,
  setSearchTerm
}: ReportListProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reports..."
            className="pl-10 w-full max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No reports found. Try a different search term.
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard
              key={report.title}
              title={report.title}
              description={report.description}
              icon={report.icon}
              badges={report.badges}
              lastUpdated={report.lastUpdated}
              onViewReport={() => console.log(`View report: ${report.title}`)}
              onExport={() => console.log(`Export report: ${report.title}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}