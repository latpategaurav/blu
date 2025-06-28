/**
 * API route for searching models
 * GET /api/models/search?q=query
 */

import { NextResponse } from 'next/server'
import { getModels } from '@/lib/data/moodboard-cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase()
    
    if (!query) {
      return NextResponse.json([])
    }
    
    // Get all models
    const allModels = await getModels()
    
    // Search in name, bio, category, and location
    const searchResults = allModels.filter(model => 
      model.name.toLowerCase().includes(query) ||
      model.bio?.toLowerCase().includes(query) ||
      model.modelCategory?.toLowerCase().includes(query) ||
      model.location?.toLowerCase().includes(query) ||
      model.agency?.toLowerCase().includes(query)
    )
    
    // Add profile image paths
    const modelsWithImages = searchResults.map(model => ({
      ...model,
      profile_image: model.images && model.images.length > 0 
        ? model.images[0] 
        : `/models/${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}/profile.jpg`,
      portfolio_folder: `/models/${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}/`
    }))
    
    return NextResponse.json(modelsWithImages, {
      headers: {
        'Cache-Control': 'public, s-maxage=60'
      }
    })
  } catch (error) {
    console.error('Error searching models:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
} 