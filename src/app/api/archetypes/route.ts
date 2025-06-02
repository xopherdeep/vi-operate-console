import { archetypesMockData } from '@/lib/db/mock-data/archetypes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: archetypesMockData
    });
  } catch (error) {
    console.error('Error fetching archetypes:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching archetypes: ${error}`
      },
      { status: 500 }
    );
  }
}