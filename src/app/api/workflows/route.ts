import { workflowsMockData } from '@/lib/db/mock-data/workflows';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return Response.json({
      success: true,
      data: workflowsMockData
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return Response.json(
      {
        success: false,
        message: `Error fetching workflows: ${error}`
      },
      { status: 500 }
    );
  }
}