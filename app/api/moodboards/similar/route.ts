/**
 * Similar Moodboards API
 * Get similar moodboards for a specific main moodboard
 * Updated for 30-day challenge structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSimilarMoodboards } from '@/lib/data/moodboard-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mainMoodboardId = parseInt(searchParams.get('main_id') || '0')
    
    if (!mainMoodboardId) {
      return NextResponse.json(
        { error: 'Main moodboard ID is required' },
        { status: 400 }
      )
    }
    
    // Get similar moodboards for the specified main moodboard
    const similarMoodboards = await getSimilarMoodboards(mainMoodboardId)
    
    // Set cache headers
    const response = NextResponse.json(similarMoodboards)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Error fetching similar moodboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 