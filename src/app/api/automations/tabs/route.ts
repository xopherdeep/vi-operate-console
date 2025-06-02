import { automationTabsMockData } from '@/lib/db/mock-data/automations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: automationTabsMockData
    });
  } catch (error) {
    console.error('Error fetching automation tabs:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching automation tabs: ${error}`
      },
      { status: 500 }
    );
  }
}