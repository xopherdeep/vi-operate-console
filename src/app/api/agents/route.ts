import { agentsMockData } from '@/lib/db/mock-data/agents';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: agentsMockData
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching agents: ${error}`
      },
      { status: 500 }
    );
  }
}