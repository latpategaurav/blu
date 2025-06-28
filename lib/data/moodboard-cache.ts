/**
 * Simple Moodboard Cache System
 * Fast, JSON-based data access with in-memory caching
 * Updated for 30-day challenge structure
 */

import fs from 'fs/promises'
import path from 'path'

// Enhanced moodboard type with proper day assignment
export interface MoodboardData {
  id: number
  name: string
  description: string
  date: string
  coverImageUrl: string
  related_images: string[]
  isBooked: boolean
  clientInitial: string | null
  modelIds: number[]
  themeTags: string[]
  isPublic: boolean
  recommended: number[]
  // Enhanced fields for 30-day challenge
  day_number?: number          // 1-30 for main moodboards assigned to days
  week_number?: number         // 1-6 weeks
  is_main_moodboard?: boolean  // True if assigned to a specific day
  is_similar_moodboard?: boolean // True if used for recommendations only
  linked_moodboard?: number    // ID of main moodboard this is similar to
  status?: 'published' | 'draft'
  booking_price?: number
  look_feel_images?: string[]
  mood_shots?: string[]
  hair_makeup_images?: string[]
}

export interface ModelData {
  id: number
  name: string
  status: string
  payment: string
  agency: string | null
  contact: string | null
  location: string | null
  stats: string | null
  shoeSize: string | null
  instagram: string | null
  address: string | null
  email: string | null
  height: string
  modelCategory: string
  bio: string
  images: string[]
  ratePerDay: number
  availability: Record<string, any>
}

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 15 // 15 minutes
const DATA_DIR = path.join(process.cwd(), 'data')

// In-memory cache
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()

/**
 * Simple cache management
 */
function isExpired(entry: CacheEntry<any>): boolean {
  return Date.now() - entry.timestamp > CACHE_DURATION
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry || isExpired(entry)) {
    cache.delete(key)
    return null
  }
  return entry.data
}

/**
 * Load and cache moodboard data with proper 30-day challenge structure
 */
export async function getMoodboards(): Promise<MoodboardData[]> {
  const cacheKey = 'moodboards'
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const filePath = path.join(DATA_DIR, 'moodboards.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const moodboards: MoodboardData[] = JSON.parse(fileContent)
    
    // Enhance data with 30-day challenge structure
    const enhancedMoodboards = moodboards.map((moodboard, index) => {
      const dayNumber = index + 1
      const weekNumber = Math.ceil(dayNumber / 5)
      
      // Determine if this is a main moodboard (first 30) or similar moodboard
      const isMainMoodboard = dayNumber <= 30
      
      return {
        ...moodboard,
        day_number: isMainMoodboard ? dayNumber : undefined,
        week_number: isMainMoodboard ? weekNumber : undefined,
        is_main_moodboard: isMainMoodboard,
        is_similar_moodboard: !isMainMoodboard,
        status: 'published' as const,
        booking_price: 50000, // Default price
        look_feel_images: moodboard.related_images || [],
        mood_shots: [],
        hair_makeup_images: []
      }
    })
    
    setCache(cacheKey, enhancedMoodboards)
    return enhancedMoodboards
    
  } catch (error) {
    console.error('Error loading moodboards:', error)
    return []
  }
}

/**
 * Load and cache model data
 */
export async function getModels(): Promise<ModelData[]> {
  const cacheKey = 'models'
  const cached = getCache<ModelData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const filePath = path.join(DATA_DIR, 'models.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const models: ModelData[] = JSON.parse(fileContent)
    
    setCache(cacheKey, models)
    return models
    
  } catch (error) {
    console.error('Error loading models:', error)
    return []
  }
}

/**
 * Get calendar view data (optimized for weekly display)
 * Shows ALL main moodboards assigned to days, regardless of booking status
 */
export async function getCalendarMoodboards(weeks = 6): Promise<MoodboardData[]> {
  const cacheKey = `calendar-${weeks}`
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const allMoodboards = await getMoodboards()
  
  // Get only main moodboards assigned to specific days (first 30)
  const calendarData = allMoodboards
    .filter(m => m.is_main_moodboard && m.isPublic && m.status === 'published')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  setCache(cacheKey, calendarData)
  return calendarData
}

/**
 * Get discover view data (shows all moodboards including similar ones)
 */
export async function getDiscoverMoodboards(
  limit = 50,
  offset = 0,
  tagFilter?: string[]
): Promise<MoodboardData[]> {
  const cacheKey = `discover-${limit}-${offset}-${tagFilter?.join(',') || 'all'}`
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const allMoodboards = await getMoodboards()
  let filtered = allMoodboards.filter(m => m.isPublic && m.status === 'published')
  
  // Apply tag filter
  if (tagFilter && tagFilter.length > 0) {
    filtered = filtered.filter(m => 
      m.themeTags.some(tag => tagFilter.includes(tag))
    )
  }
  
  // Apply pagination
  const paginatedData = filtered.slice(offset, offset + limit)
  
  setCache(cacheKey, paginatedData)
  return paginatedData
}

/**
 * Get main moodboards for a specific week
 */
export async function getWeekMoodboards(weekNumber: number): Promise<MoodboardData[]> {
  const cacheKey = `week-${weekNumber}`
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const allMoodboards = await getMoodboards()
  
  // Get main moodboards for the specific week (5 days per week)
  const startDay = (weekNumber - 1) * 5 + 1
  const endDay = weekNumber * 5
  
  const weekData = allMoodboards.filter(m => 
    m.is_main_moodboard && 
    m.day_number && 
    m.day_number >= startDay && 
    m.day_number <= endDay &&
    m.isPublic && 
    m.status === 'published'
  )
  
  setCache(cacheKey, weekData)
  return weekData
}

/**
 * Get similar moodboards for a specific main moodboard
 */
export async function getSimilarMoodboards(mainMoodboardId: number): Promise<MoodboardData[]> {
  const cacheKey = `similar-${mainMoodboardId}`
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const allMoodboards = await getMoodboards()
  const mainMoodboard = allMoodboards.find(m => m.id === mainMoodboardId)
  
  if (!mainMoodboard) {
    return []
  }
  
  // Get similar moodboards based on recommended array
  const similar = allMoodboards.filter(m => 
    mainMoodboard.recommended.includes(m.id) && 
    m.isPublic && 
    m.status === 'published'
  )
  
  setCache(cacheKey, similar)
  return similar
}

/**
 * Get detailed moodboard with models and similar moodboards
 */
export async function getMoodboardDetails(id: number): Promise<{
  moodboard: MoodboardData
  models: ModelData[]
  similar: MoodboardData[]
} | null> {
  const cacheKey = `details-${id}`
  const cached = getCache<any>(cacheKey)
  
  if (cached) {
    return cached
  }

  const [allMoodboards, allModels] = await Promise.all([
    getMoodboards(),
    getModels()
  ])
  
  const moodboard = allMoodboards.find(m => m.id === id)
  if (!moodboard) {
    return null
  }
  
  // Get associated models with enhanced image paths
  const models = allModels.filter(m => moodboard.modelIds.includes(m.id)).map(model => ({
    ...model,
    // Ensure profile image path uses /models folder
    profile_image: model.images && model.images.length > 0 
      ? model.images[0] 
      : `/models/${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}/profile.jpg`
  }))
  
  // Get similar moodboards (only if this is a main moodboard)
  const similar = moodboard.is_main_moodboard 
    ? await getSimilarMoodboards(moodboard.id)
    : []
  
  const result = { moodboard, models, similar }
  setCache(cacheKey, result)
  return result
}

/**
 * Get moodboard image paths (handles fallbacks)
 */
export function getMoodboardImages(moodboard: MoodboardData) {
  const baseFolder = `/moodboards`
  const moodboardFolder = `${moodboard.id}_${moodboard.name.replace(/[^a-zA-Z0-9]/g, '')}`
  
  return {
    main: moodboard.coverImageUrl || `${baseFolder}/${moodboardFolder}/main.jpg`,
    lookFeel: moodboard.look_feel_images || [`${baseFolder}/${moodboardFolder}/look-feel-1.jpg`],
    moodShots: moodboard.mood_shots || [`${baseFolder}/${moodboardFolder}/mood-1.jpg`],
    hairMakeup: moodboard.hair_makeup_images || [`${baseFolder}/${moodboardFolder}/hair-makeup-1.jpg`]
  }
}

/**
 * Search moodboards by title, description, or tags
 */
export async function searchMoodboards(query: string): Promise<MoodboardData[]> {
  const cacheKey = `search-${query.toLowerCase()}`
  const cached = getCache<MoodboardData[]>(cacheKey)
  
  if (cached) {
    return cached
  }

  const allMoodboards = await getMoodboards()
  const searchTerm = query.toLowerCase()
  
  const results = allMoodboards.filter(m => 
    m.isPublic && (
      m.name.toLowerCase().includes(searchTerm) ||
      m.description.toLowerCase().includes(searchTerm) ||
      m.themeTags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  )
  
  setCache(cacheKey, results)
  return results
}

/**
 * Clear all cache (useful for development or data updates)
 */
export function clearCache(): void {
  cache.clear()
}

/**
 * Preload critical data for faster initial page loads
 */
export async function preloadData(): Promise<void> {
  // Preload most commonly accessed data
  await Promise.all([
    getCalendarMoodboards(2), // Current 2 weeks
    getDiscoverMoodboards(20, 0), // First 20 for discover
    getMoodboards() // All moodboards for quick access
  ])
}

/**
 * Get cache statistics (useful for monitoring)
 */
export function getCacheStats() {
  const entries = Array.from(cache.entries())
  const expired = entries.filter(([_, entry]) => isExpired(entry))
  
  return {
    total: cache.size,
    expired: expired.length,
    active: cache.size - expired.length,
    keys: entries.map(([key]) => key)
  }
} 