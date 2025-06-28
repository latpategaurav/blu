/**
 * TypeScript type definitions for 303030 database schema
 * These types mirror the PostgreSQL tables defined in lib/db/schema.sql
 * Used throughout the application for type safety
 * Uses Supabase Auth for authentication (auth.users table)
 */

/**
 * User profile entity - Links to Supabase Auth users
 * Stores additional user information beyond what's in auth.users
 */
export interface Profile {
  id: string                                    // References auth.users(id)
  phone_number?: string                         // Redundant with auth.users but useful for queries
  email?: string                               // Redundant with auth.users but useful for queries
  name?: string                                // User's personal name
  brand_name?: string                          // Company/brand name for business accounts
  role: 'client' | 'admin'                     // Access control role
  avatar_url?: string                          // Profile picture URL
  bio?: string                                 // User bio/description
  created_at: string
  updated_at: string
}

/**
 * Model entity representing individual models available for booking
 * Models are created and managed exclusively by admins
 */
export interface Model {
  id: string
  name: string                                 // Model's name
  email?: string                              // Model's email
  phone?: string                              // Model's phone number
  bio?: string                                // Model's bio/description
  one_liner?: string                          // Short tagline/one liner
  height?: string                             // Model's height
  bust?: string                               // Model's bust measurement
  waist?: string                              // Model's waist measurement
  hips?: string                               // Model's hip measurement
  shoe_size?: string                          // Model's shoe size
  hair_color?: string                         // Model's hair color
  eye_color?: string                          // Model's eye color
  experience_level?: string                   // Experience level
  hourly_rate?: number                        // Hourly rate for bookings
  is_active: boolean                          // Whether model is available for bookings
  profile_image?: string                      // Profile image URL
  portfolio_images?: string[]                 // Array of portfolio image URLs
  created_at: string
  updated_at: string
}

/**
 * Moodboard entity representing visual collections for inspiration
 * Each moodboard is a curated theme available for booking
 */
export interface Moodboard {
  id: string
  title: string                               // Moodboard title
  description?: string                        // Moodboard description
  liner?: string                              // Short tagline/liner text
  date?: string                               // Scheduled date for the moodboard (ISO string)
  model_count?: number                        // Number of models in this moodboard
  is_booked?: boolean                         // Whether moodboard is booked
  main_image?: string                         // Primary image URL
  images?: string[]                           // Array of image URLs
  tags?: string[]                             // Array of tags for categorization
  style?: string                              // Style category
  color_palette?: string[]                    // Array of color codes
  is_active: boolean                          // Whether moodboard is available
  created_by?: string                         // Creator of the moodboard (references profiles.id)
  created_at: string
  updated_at: string
}

/**
 * Moodboard-Model relationship entity
 * Links moodboards with available models (many-to-many)
 */
export interface MoodboardModel {
  id: string
  moodboard_id: string                        // References moodboards(id)
  model_id: string                            // References models(id)
  created_at: string
}

/**
 * Similar moodboards relationship entity
 * Used for recommendations and "Similar Shoots" section
 */
export interface SimilarMoodboard {
  id: string
  moodboard_id: string                        // References moodboards(id)
  similar_moodboard_id: string                // References moodboards(id)
  similarity_score?: number                   // Similarity score (0-1)
  created_at: string
}

/**
 * Booking entity - Main booking records
 * Tracks all client bookings with detailed information
 */
export interface Booking {
  id: string
  client_id: string                           // Client making the booking (references profiles.id)
  model_id?: string                           // Model being booked (references models.id)
  moodboard_id?: string                       // Associated moodboard (references moodboards.id)
  booking_date: string                        // Date of the booking
  start_time: string                          // Start time
  end_time: string                            // End time
  duration_hours: number                      // Duration in hours
  location?: string                           // Booking location
  requirements?: string                       // Special requirements
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: number                        // Total booking amount
  deposit_amount?: number                     // Deposit amount paid
  deposit_paid: boolean                       // Whether deposit is paid
  full_payment_paid: boolean                  // Whether full payment is paid
  notes?: string                              // Additional notes
  created_at: string
  updated_at: string
}

/**
 * Payment entity - Payment records
 * Tracks all payment attempts and successful transactions
 */
export interface Payment {
  id: string
  booking_id: string                          // References bookings(id)
  amount: number                              // Payment amount
  payment_type: 'deposit' | 'full' | 'refund' // Type of payment
  payment_method?: string                     // Payment method used
  transaction_id?: string                     // External transaction ID
  status: 'pending' | 'completed' | 'failed'  // Payment status
  payment_date?: string                       // When payment was made
  created_at: string
}

/**
 * Notification entity - System notifications
 * Tracks system notifications for users
 */
export interface Notification {
  id: string
  user_id: string                             // References profiles(id)
  title: string                               // Notification title
  message: string                             // Notification message
  type: 'booking' | 'payment' | 'system'      // Type of notification
  is_read: boolean                            // Whether notification is read
  related_entity_type?: string                // Related entity type (e.g., 'booking')
  related_entity_id?: string                  // Related entity ID
  created_at: string
}

/**
 * Setting entity - Application settings
 * Stores global settings managed by admins
 */
export interface Setting {
  id: string
  key: string                                 // Setting key
  value?: string                              // Setting value (JSON for complex settings)
  description?: string                        // Setting description
  created_at: string
  updated_at: string
}

/**
 * Database schema types - Union of all table types
 * Used for type-safe database operations
 */
export type Database = {
  profiles: Profile
  models: Model
  moodboards: Moodboard
  moodboard_models: MoodboardModel
  similar_moodboards: SimilarMoodboard
  bookings: Booking
  payments: Payment
  notifications: Notification
  settings: Setting
}

/**
 * Supabase Auth user type (from @supabase/supabase-js)
 * This is the user object from Supabase Auth
 */
export interface AuthUser {
  id: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
  email_confirmed_at?: string
  phone_confirmed_at?: string
  last_sign_in_at?: string
  app_metadata: Record<string, any>
  user_metadata: Record<string, any>
  aud: string
  role: string
}

/**
 * Extended user type combining Supabase Auth user with profile data
 * Used when you need both authentication and profile information
 */
export interface ExtendedUser extends AuthUser {
  profile?: Profile
} 