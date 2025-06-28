/**
 * Simple React Hooks for Moodboard Data
 * Uses the JSON-based cache system
 * Updated for 30-day challenge structure
 */

'use client'

import { useState, useEffect } from 'react'
import type { MoodboardData, ModelData } from '@/lib/data/moodboard-cache'

/**
 * Hook for calendar moodboards (main moodboards only)
 */
export function useCalendarMoodboards(weeks = 6) {
  const [data, setData] = useState<MoodboardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/moodboards/calendar?weeks=${weeks}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calendar data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [weeks])

  return { data, loading, error }
}

/**
 * Hook for discover moodboards (all moodboards including similar ones)
 */
export function useDiscoverMoodboards(limit = 20, offset = 0, tags?: string[]) {
  const [data, setData] = useState<MoodboardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
          ...(tags && tags.length > 0 && { tags: tags.join(',') })
        })
        
        const response = await fetch(`/api/moodboards/discover?${params}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch discover data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit, offset, tags])

  return { data, loading, error }
}

/**
 * Hook for similar moodboards
 */
export function useSimilarMoodboards(mainMoodboardId: number) {
  const [data, setData] = useState<MoodboardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/moodboards/similar?main_id=${mainMoodboardId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch similar moodboards')
      } finally {
        setLoading(false)
      }
    }

    if (mainMoodboardId) {
      fetchData()
    } else {
      setData([])
      setLoading(false)
    }
  }, [mainMoodboardId])

  return { data, loading, error }
}

/**
 * Hook for moodboard details with models and similar moodboards
 */
export function useMoodboardDetails(moodboardId: number) {
  const [data, setData] = useState<{
    moodboard: MoodboardData
    models: ModelData[]
    similar: MoodboardData[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch moodboard details
        const detailsResponse = await fetch(`/api/moodboards/${moodboardId}`)
        
        if (!detailsResponse.ok) {
          throw new Error(`HTTP ${detailsResponse.status}`)
        }
        
        const details = await detailsResponse.json()
        
        // Fetch similar moodboards if this is a main moodboard
        let similar: MoodboardData[] = []
        if (details.is_main_moodboard) {
          const similarResponse = await fetch(`/api/moodboards/similar?main_id=${moodboardId}`)
          if (similarResponse.ok) {
            similar = await similarResponse.json()
          }
        }
        
        setData({
          moodboard: details,
          models: details.models || [],
          similar
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch moodboard details')
      } finally {
        setLoading(false)
      }
    }

    if (moodboardId) {
      fetchData()
    } else {
      setData(null)
      setLoading(false)
    }
  }, [moodboardId])

  return { data, loading, error }
}

/**
 * Hook for searching moodboards
 */
export function useSearchMoodboards(query: string) {
  const [data, setData] = useState<MoodboardData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setData([])
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/moodboards/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search moodboards')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 300) // Debounce search
    return () => clearTimeout(timeoutId)
    
  }, [query])

  return { data, loading, error }
}

/**
 * Hook for all moodboards (admin use)
 */
export function useAllMoodboards() {
  const [data, setData] = useState<MoodboardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/moodboards/all')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch moodboards')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
} 