/**
 * Simple hooks for working with models
 * Provides easy access to model data with proper image paths
 */

'use client'

import { useState, useEffect } from 'react'
import type { ModelData } from '@/lib/data/moodboard-cache'

/**
 * Get models by category
 */
export function useModelsByCategory(category?: string) {
  const [data, setData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch(`/api/models${category ? `?category=${category}` : ''}`)
        if (!res.ok) throw new Error('Failed to fetch models')
        
        const models = await res.json()
        setData(models)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [category])

  return { data, loading, error }
}

/**
 * Get available models for a specific date
 */
export function useAvailableModels(date: string) {
  const [data, setData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch(`/api/models/available?date=${date}`)
        if (!res.ok) throw new Error('Failed to fetch available models')
        
        const models = await res.json()
        setData(models)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [date])

  return { data, loading, error }
}

/**
 * Search models
 */
export function useSearchModels(query: string) {
  const [data, setData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query) {
      setData([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/models/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error('Search failed')
        
        const models = await res.json()
        setData(models)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return { data, loading, error }
} 