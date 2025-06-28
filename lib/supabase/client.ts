/**
 * Client-side Supabase client configuration
 * Used for browser-side operations like authentication and data fetching
 * Part of the 303030 mood board booking platform
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates and returns a Supabase client instance for client-side operations
 * This client respects browser cookies and handles authentication state
 * 
 * @returns Supabase client instance configured with public environment variables
 * @example
 * const supabase = createClient()
 * const { data } = await supabase.from('moodboards').select()
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) 