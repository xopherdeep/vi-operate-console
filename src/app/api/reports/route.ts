import { reportsMockData } from '@/lib/db/mock-data/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: reportsMockData
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching reports: ${error}`
      },
      { status: 500 }
    );
  }
}