/**
 * Source connection icon definitions
 * 
 * Single source of truth for all source connection icons
 */

import { ConnectionOption } from '@/app/console/sources/_common/types/source';

// Define all connection types with their respective icon configurations
export const CONNECTION_ICONS: Record<string, ConnectionOption> = {
  AZURE_BLOB: {
    name: 'Azure Blob Storage',
    iconName: 'Boxes',
    iconColor: 'red-600',
    iconSize: 'md',
    iconBg: 'bg-red-100',
    hoverBorder: 'hover:border-red-200'
  },
  BIGQUERY: {
    name: 'BigQuery',
    iconName: 'Database',
    iconColor: 'blue-600',
    iconSize: 'md',
    iconBg: 'bg-blue-100',
    hoverBorder: 'hover:border-blue-200'
  },
  SNOWFLAKE: {
    name: 'Snowflake',
    iconName: 'Snowflake',
    iconColor: 'cyan-600',
    iconSize: 'md',
    iconBg: 'bg-cyan-100',
    hoverBorder: 'hover:border-cyan-200'
  },
  DATABRICKS: {
    name: 'Databricks',
    iconName: 'Layers',
    iconColor: 'red-600',
    iconSize: 'md',
    iconBg: 'bg-red-100',
    hoverBorder: 'hover:border-red-200'
  },
  GOOGLE_ANALYTICS: {
    name: 'Google Analytics',
    iconName: 'BarChart4',
    iconColor: 'amber-600',
    iconSize: 'md',
    iconBg: 'bg-amber-100',
    hoverBorder: 'hover:border-amber-200'
  },
  POSTGRESQL: {
    name: 'PostgreSQL',
    iconName: 'Database',
    iconColor: 'green-600',
    iconSize: 'md',
    iconBg: 'bg-green-100',
    hoverBorder: 'hover:border-green-200'
  },
  MYSQL: {
    name: 'MySQL',
    iconName: 'Database',
    iconColor: 'orange-600',
    iconSize: 'md',
    iconBg: 'bg-orange-100',
    hoverBorder: 'hover:border-orange-200'
  },
  REDSHIFT: {
    name: 'Amazon Redshift',
    iconName: 'CloudCog',
    iconColor: 'purple-600',
    iconSize: 'md',
    iconBg: 'bg-purple-100',
    hoverBorder: 'hover:border-purple-200'
  },
  CUSTOM: {
    name: 'Custom Source',
    iconName: 'LayoutGrid',
    iconColor: 'slate-600',
    iconSize: 'md',
    iconBg: 'bg-slate-100',
    hoverBorder: 'hover:border-slate-200'
  }
};

// Helper to get the connection icon by key
export function getConnectionIcon(key: keyof typeof CONNECTION_ICONS): ConnectionOption {
  return CONNECTION_ICONS[key];
}

// Helper to get all available connection icons as an array
export function getAllConnectionIcons(): ConnectionOption[] {
  return Object.values(CONNECTION_ICONS);
}

// Map from source type string to icon key
export const SOURCE_TYPE_TO_ICON: Record<string, keyof typeof CONNECTION_ICONS> = {
  'BigQuery': 'BIGQUERY',
  'Snowflake': 'SNOWFLAKE',
  'Amazon Redshift': 'REDSHIFT',
  'PostgreSQL': 'POSTGRESQL',
  'MySQL': 'MYSQL',
  'Azure Blob Storage': 'AZURE_BLOB',
  'Databricks': 'DATABRICKS',
  'Google Analytics': 'GOOGLE_ANALYTICS',
  'Custom': 'CUSTOM'
};

// Helper to get the connection icon by source type
export function getConnectionIconByType(sourceType: string): ConnectionOption {
  const iconKey = SOURCE_TYPE_TO_ICON[sourceType] || 'CUSTOM';
  return CONNECTION_ICONS[iconKey];
}