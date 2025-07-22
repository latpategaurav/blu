/**
 * Individual Moodboard API
 * Get detailed moodboard information with models
 * Updated for 30-day challenge structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { getMoodboardDetails } from '@/lib/data/moodboard-cache'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const moodboardId = parseInt(context.params.id)
    
    if (!moodboardId || isNaN(moodboardId)) {
      return NextResponse.json(
        { error: 'Invalid moodboard ID' },
        { status: 400 }
      )
    }
    
    // Get moodboard details with models
    const details = await getMoodboardDetails(moodboardId)
    
    if (!details) {
      return NextResponse.json(
        { error: 'Moodboard not found' },
        { status: 404 }
      )
    }
    
    // Set cache headers
    const response = NextResponse.json(details.moodboard)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Error fetching moodboard details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 