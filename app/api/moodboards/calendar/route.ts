/**
 * Calendar Moodboards API
 * Simple endpoint for calendar view data
 * Updated for 30-day challenge structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCalendarMoodboards } from '@/lib/data/moodboard-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weeks = parseInt(searchParams.get('weeks') || '6')
    
    // Get only main moodboards assigned to specific days (first 30)
    const moodboards = await getCalendarMoodboards(weeks)
    
    // Set cache headers
    const response = NextResponse.json(moodboards)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Error fetching calendar moodboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 