import { NextRequest, NextResponse } from 'next/server'

/**
 * API route that pings the Render application to keep it alive
 * This prevents the free tier from going to sleep after 15 minutes of inactivity
 */
export async function GET(request: NextRequest) {
  try {
    const renderUrl = process.env.RENDER_HEALTH_URL
    
    if (!renderUrl) {
      console.error(`[${new Date().toISOString()}] ❌ RENDER_HEALTH_URL environment variable is not set`)
      return NextResponse.json({
        success: false,
        error: 'RENDER_HEALTH_URL environment variable is not configured',
        message: 'Cannot ping Render app - missing configuration',
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }
    
    console.log(`[${new Date().toISOString()}] Pinging Render app at: ${renderUrl}`)
    
    // Make request to Render app health check endpoint
    const response = await fetch(renderUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Cron-Ping/1.0',
      },
      // Set timeout to 10 seconds
      signal: AbortSignal.timeout(10000),
    })
    
    if (response.ok) {
      const responseText = await response.text()
      console.log(`[${new Date().toISOString()}] ✅ Render app is alive. Status: ${response.status}`)
      
      return NextResponse.json({
        success: true,
        status: response.status,
        message: 'Render app pinged successfully',
        timestamp: new Date().toISOString(),
        renderResponse: responseText.slice(0, 200), // Limit response size in logs
      })
    } else {
      console.warn(`[${new Date().toISOString()}] ⚠️ Render app responded with status: ${response.status}`)
      
      return NextResponse.json({
        success: false,
        status: response.status,
        message: 'Render app responded with non-200 status',
        timestamp: new Date().toISOString(),
      }, { status: 200 }) // Still return 200 to Vercel cron so it doesn't retry
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error pinging Render app:`, error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to ping Render app',
      timestamp: new Date().toISOString(),
    }, { status: 200 }) // Still return 200 to Vercel cron so it doesn't retry
  }
}

// Also support POST method in case needed
export async function POST(request: NextRequest) {
  return GET(request)
}