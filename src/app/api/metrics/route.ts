import { NextRequest, NextResponse } from 'next/server';
import { WebVitalMetric } from '@/lib/utils/web-vitals';

/**
 * API endpoint to collect Web Vitals metrics
 * You can extend this to store metrics in a database or send to analytics
 */
export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();
    
    // Log metrics in development server logs
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Server Web Vitals] ${metric.name}:`, metric.value);
    }

    // In a production app, you would store these metrics in a database
    // or forward them to your analytics service
    // Example: await db.insert({ table: 'web_vitals' }).values(metric);
    
    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Web Vitals API Error]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to store metrics' },
      { status: 500 }
    );
  }
}