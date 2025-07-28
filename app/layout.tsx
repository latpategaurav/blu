/**
 * Root Layout Component for 303030
 * Provides global configuration and providers for the entire application
 * Implements the minimalist design philosophy with Inter font
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ModalProvider } from '@/components/providers/modal-provider'
import { Header } from '@/components/header'

// Configure Inter font with Latin subset
// Inter provides clean, modern typography perfect for minimalist design
const inter = Inter({ subsets: ['latin'] })

/**
 * Metadata configuration for SEO and social sharing
 * Defines how 303030 appears in search results and social media
 */
export const metadata: Metadata = {
  title: '303030 - Mood Board Booking Platform',
  description: 'Revolutionizing the modeling industry through curated mood boards. Book transparent, theme-based photoshoots with clarity.',
  keywords: 'mood boards, modeling, photoshoot booking, fashion photography, 303030',
  authors: [{ name: 'Appurva Shah' }],
  openGraph: {
    title: '303030 - Mood Board Booking Platform',
    description: 'Book transparent, theme-based photoshoots with curated mood boards',
    type: 'website',
    locale: 'en_IN',
    url: 'https://303030.in',
    siteName: '303030',
  },
  twitter: {
    card: 'summary_large_image',
    title: '303030 - Mood Board Booking Platform',
    description: 'Book transparent, theme-based photoshoots with curated mood boards',
  },
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

/**
 * Root Layout Component
 * Wraps all pages with:
 * - Font configuration
 * - Toast notifications
 * - Global styles
 * - HTML language attribute
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider />
        {/* Global Header */}
        <Header />
        {/* Main application content */}
        {children}
        
        {/* Global toast notifications */}
        {/* Positioned at top-center with custom styling */}
        <Toaster 
          position="top-center"
          toastOptions={{
            // Default toast styling
            style: {
              background: '#333',
              color: '#fff',
            },
            // Success toast styling
            success: {
              style: {
                background: '#22c55e',
              },
            },
            // Error toast styling
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
