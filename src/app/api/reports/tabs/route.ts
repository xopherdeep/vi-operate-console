import { reportTabsMockData } from '@/lib/db/mock-data/reports';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: reportTabsMockData
    });
  } catch (error) {
    console.error('Error fetching report tabs:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching report tabs: ${error}`
      },
      { status: 500 }
    );
  }
}