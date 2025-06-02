// filepath: /home/xopher/www/vi/transform/vi-operate-console/src/lib/mock-data/archetypes.ts
import { Archetype } from '@/types/archetype';

export const archetypesMockData: Archetype[] = [
  {
    id: 1,
    name: 'Labor Staffing',
    description: 'Combines staffing schedules and patient census data for labor analysis',
    type: 'forecasting',
    configParams: {
      timeFrame: 'Every 15 minutes',
      sourceMaterials: [
        'Staffing Schedules',
        'Patient Census',
        'Labor Hours',
        'Department Metrics'
      ]
    },
    status: 'active',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-14')
  },
  {
    id: 2,
    name: 'Inventory Management',
    description: 'Tracks supply usage and procurement records for inventory reporting',
    type: 'support',
    configParams: {
      timeFrame: 'Every 30 minutes',
      sourceMaterials: [
        'Supply Records',
        'Purchase Orders',
        'Procurement Logs',
        'Usage Metrics'
      ]
    },
    status: 'active',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-04-10')
  },
  {
    id: 3,
    name: 'Operating Room Utilization',
    description: 'Links schedules and procedure logs to analyze operating room use',
    type: 'scheduling',
    configParams: {
      timeFrame: 'Hourly',
      sourceMaterials: [
        'OR Schedules',
        'Procedure Logs',
        'Staff Assignments',
        'Equipment Usage'
      ]
    },
    status: 'inactive',
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-04-05')
  }
];