'use client';

export function useDataContent() {
  return {
    dataContent: [
      {
        title: 'Labor Data',
        children:
          'Staffing metrics and performance data for operational analysis'
      },
      {
        title: 'Inventory Data',
        children:
          'Supply chain and inventory management information'
      },
      {
        title: 'Operational Metrics',
        children:
          'KPIs and performance indicators for business operations'
      }
    ]
  };
}
