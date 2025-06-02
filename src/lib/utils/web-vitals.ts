import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric, WebVitalsMetric } from 'web-vitals';

type MetricName = 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';

export type WebVitalMetric = {
  id: string;
  name: MetricName;
  value: number;
  delta: number;
};

/**
 * Report Web Vitals metrics to your analytics provider of choice
 * This collects Core Web Vitals and sends them to your analytics
 */
export async function reportWebVitals(
  metric: WebVitalsMetric & { name: MetricName }
): Promise<void> {
  // Process the metric data
  const vitalsData: WebVitalMetric = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
  };

  // Log metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Web Vitals] ${metric.name}:`, Math.round(metric.value * 100) / 100);
  }

  // Send to your analytics service (example with fetch)
  try {
    if (process.env.NODE_ENV === 'production') {
      // Example implementation - replace with your analytics solution
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalsData),
        // Keep the connection alive in the background
        keepalive: true,
      });
    }
  } catch (error) {
    console.error('[Web Vitals Error]', error);
  }
}

/**
 * Initialize web vitals collection on the client-side
 * Call this function in your app root layout or entry point
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window !== 'undefined') {
    // Dynamically import web-vitals to avoid SSR issues
    const webVitals = await import('web-vitals');
    webVitals.onCLS((metric) => reportWebVitals({ ...metric, name: 'CLS' }));
    webVitals.onFCP((metric) => reportWebVitals({ ...metric, name: 'FCP' }));
    webVitals.onFID((metric) => reportWebVitals({ ...metric, name: 'FID' }));
    webVitals.onLCP((metric) => reportWebVitals({ ...metric, name: 'LCP' }));
    webVitals.onTTFB((metric) => reportWebVitals({ ...metric, name: 'TTFB' }));
  }
}