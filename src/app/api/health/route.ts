import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - can be extended with database/redis checks
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NEXT_PUBLIC_APP_ENV || 'dev',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

export async function HEAD() {
  // Simple HEAD request for basic health check
  return new NextResponse(null, { status: 200 });
}
