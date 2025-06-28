/**
 * Search Moodboards API
 * Simple endpoint for searching moodboards
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchMoodboards } from '@/lib/data/moodboard-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }
    
    const moodboards = await searchMoodboards(query.trim())
    
    // Set cache headers
    const response = NextResponse.json(moodboards)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Error searching moodboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 