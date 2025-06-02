import { sourcesConnectionsMockData } from '@/lib/db/mock-data/sources';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, we're returning mock data
    return Response.json({
      success: true,
      data: sourcesConnectionsMockData
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching sources: ${error}`
      },
      { status: 500 }
    );
  }
}