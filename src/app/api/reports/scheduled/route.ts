import { scheduledReportsMockData } from '@/lib/db/mock-data/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: scheduledReportsMockData
    });
  } catch (error) {
    console.error('Error fetching scheduled reports:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching scheduled reports: ${error}`
      },
      { status: 500 }
    );
  }
}