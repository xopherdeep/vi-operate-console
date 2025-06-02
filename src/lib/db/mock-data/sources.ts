import { SourceConnection, ConnectionOption } from './types';
import { 
  CONNECTION_ICONS, 
  getConnectionIconByType 
} from '@/constants/connection-icons';

export const sourcesConnectionsMockData = [
  {
    id: 1,
    name: 'Primary Data Lake',
    type: 'BigQuery',
    status: 'healthy',
    ...getConnectionIconByType('BigQuery'),
    datasets: 42,
    models: 6,
    lastRefresh: '1 hour ago',
    refreshInterval: '6 hours',
    schema: {
      tables: 65,
      views: 23
    },
    health: {
      status: 'Healthy',
      metrics: {
        availability: '99.9%',
        latency: '54ms',
        errors: '0.01%'
      }
    }
  },
  {
    id: 2,
    name: 'Patient Demographics and History',
    type: 'Snowflake',
    status: 'healthy',
    ...getConnectionIconByType('Snowflake'),
    datasets: 18,
    models: 4,
    lastRefresh: '3 hours ago',
    refreshInterval: '12 hours',
    schema: {
      tables: 32,
      views: 14
    },
    health: {
      status: 'Healthy',
      metrics: {
        availability: '99.8%',
        latency: '125ms',
        errors: '0.02%'
      }
    }
  },
  {
    id: 3,
    name: 'Specialist Scheduling Data',
    type: 'Amazon Redshift',
    status: 'profiling',
    ...getConnectionIconByType('Amazon Redshift'),
    datasets: 12,
    models: 3,
    lastRefresh: '2 days ago',
    refreshInterval: '1 day',
    schema: {
      tables: 18,
      views: 7
    },
    health: {
      status: 'Profiling',
      metrics: {
        availability: '98.2%',
        latency: '210ms',
        errors: '1.2%'
      }
    }
  },
  {
    id: 4,
    name: 'Discharge and Follow-Up Logs',
    type: 'PostgreSQL',
    status: 'healthy',
    ...getConnectionIconByType('PostgreSQL'),
    datasets: 9,
    models: 2,
    lastRefresh: '5 hours ago',
    refreshInterval: '8 hours',
    schema: {
      tables: 14,
      views: 5
    },
    health: {
      status: 'Healthy',
      metrics: {
        availability: '99.7%',
        latency: '87ms',
        errors: '0.05%'
      }
    }
  }
];

// Use the getAllConnectionIcons helper to get all available connection options
export const connectionOptionsMockData = Object.values(CONNECTION_ICONS);
