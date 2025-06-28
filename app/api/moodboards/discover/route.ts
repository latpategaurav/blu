/**
 * Discover Moodboards API
 * Simple endpoint for discover view with filtering
 * Updated for 30-day challenge structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDiscoverMoodboards } from '@/lib/data/moodboard-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const showMainOnly = searchParams.get('main_only') === 'true'
    
    // Get all moodboards (main and similar) for discover view
    const moodboards = await getDiscoverMoodboards(limit, offset, tags)
    
    // Filter to show only main moodboards if requested
    const filteredMoodboards = showMainOnly 
      ? moodboards.filter(m => m.is_main_moodboard)
      : moodboards
    
    // Set cache headers
    const response = NextResponse.json(filteredMoodboards)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Error fetching discover moodboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 