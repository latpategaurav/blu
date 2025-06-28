/**
 * All Moodboards API
 * Simple endpoint for admin access to all moodboards
 */

import { NextRequest, NextResponse } from 'next/server'
import { getMoodboards } from '@/lib/data/moodboard-cache'

export async function GET(request: NextRequest) {
  try {
    const moodboards = await getMoodboards()
    
    // Set shorter cache for admin data
    const response = NextResponse.json(moodboards)
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300')
    
    return response
    
  } catch (error) {
    console.error('Error fetching all moodboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 