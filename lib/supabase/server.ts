/**
 * Server-side Supabase client configuration
 * Used for server-side operations like API routes and server components
 * Part of the 303030 mood board booking platform
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates and returns a Supabase client instance for server-side operations
 * This client respects server-side cookies and handles authentication state
 * 
 * @returns Promise resolving to Supabase client instance configured with environment variables
 * @example
 * const supabase = await createClient()
 * const { data } = await supabase.from('moodboards').select()
 */
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Retrieves all cookies from the Next.js cookie store
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Sets multiple cookies in the Next.js cookie store
         * Wrapped in try-catch to handle Server Component restrictions
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a user profile in the profiles table when a user signs up
 * This function should be called after successful Supabase Auth signup
 * 
 * @param userId - The user ID from Supabase Auth
 * @param phone - The user's phone number
 * @param email - The user's email (optional)
 * @returns Promise with the created profile or error
 */
export async function createUserProfile(userId: string, phone?: string, email?: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        phone_number: phone,
        email: email,
        role: 'client', // Default role for new users
        name: null,
        brand_name: null,
        avatar_url: null,
        bio: null
      })
      .select()
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected profile creation error:', err)
    return { data: null, error: err as Error }
  }
}

/**
 * Gets a user's profile by their Supabase Auth user ID
 * 
 * @param userId - The user ID from Supabase Auth
 * @returns Promise with the user's profile or null
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected profile fetch error:', err)
    return null
  }
}

/**
 * Updates a user's profile
 * 
 * @param userId - The user ID from Supabase Auth
 * @param updates - The profile fields to update
 * @returns Promise with the updated profile or error
 */
export async function updateUserProfile(userId: string, updates: Partial<{
  name: string
  brand_name: string
  avatar_url: string
  bio: string
}>) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected profile update error:', err)
    return { data: null, error: err as Error }
  }
} 