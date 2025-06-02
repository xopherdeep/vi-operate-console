'use client';

export function useApiContent() {
  return {
    apiContent: [
      {
        title: 'Forecast Data API',
        children:
          'Exposes forecast data to external systems. Endpoint: /api/forecasts'
      },
      {
        title: 'Schedule API',
        children:
          'Provides scheduling integration points. Endpoint: /api/schedules'
      },
      {
        title: 'Resource Allocation API',
        children:
          'Interfaces with labor allocation systems. Endpoint: /api/resources'
      }
    ]
  };
}
