'use client';

import { Metadata } from 'next';
import { Layout } from '@/components/common/layout/layout';
import { OutboundDashboard } from '@/app/[console]/dashboards/outbound-call-center/outbound-dashboard';
import { getDashboardData } from '@/app/[console]/dashboards/_common/services/dashboard.service';

// Metadata is defined in metadata.ts

export default function OutboundCallCenterPage() {
  return (
    <Layout
      title="Outbound Campaign Performance"
      actionButton={{
        label: 'Run New Campaign',
        onClick: () => {}
      }}
    >
      <OutboundDashboard />
    </Layout>
  );
}
