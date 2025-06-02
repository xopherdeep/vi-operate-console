import { connectionOptionsMockData } from '@/lib/db/mock-data/sources';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, we're returning mock data
    return Response.json({
      success: true,
      data: connectionOptionsMockData
    });
  } catch (error) {
    console.error('Error fetching connection options:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching connection options: ${error}`
      },
      { status: 500 }
    );
  }
}