/**
 * Calendar page for browsing and selecting mood boards
 * Implements the 5-day week view as specified in context.md
 * Features navigation between weeks and displays moodboards by date
 * Locked to 6 weeks, starting from Monday, 18 Aug 2025
 * Minimal, glassmorphic style
 * Shows 1 image by default, 2 more on hover (all moodboard-specific)
 * Main image is right-aligned by default, slides left on hover to reveal 2 more images
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { format } from 'date-fns'
import Image from 'next/image'
import moodboardsData from '@/data/moodboards.json'

// Fixed challenge start date: Monday, 18 Aug 2025
const CHALLENGE_START = new Date('2025-08-18T00:00:00')
const WEEKS = 6
const DAYS_PER_WEEK = 5
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK

// Generate all challenge dates (Mon–Fri, 6 weeks)
function getChallengeDates() {
  const dates: Date[] = []
  let d = new Date(CHALLENGE_START)
  for (let i = 0; i < TOTAL_DAYS; i++) {
    dates.push(new Date(d))
    // Move to next day
    d.setDate(d.getDate() + 1)
    // Skip weekends
    if ((i + 1) % DAYS_PER_WEEK === 0) {
      d.setDate(d.getDate() + 2)
    }
  }
  return dates
}
const CHALLENGE_DATES = getChallengeDates()

// Map moodboards to challenge dates
const moodboardsWithDates = moodboardsData.slice(0, TOTAL_DAYS).map((mb, i) => ({
  ...mb,
  challengeDate: CHALLENGE_DATES[i],
  week_number: Math.floor(i / DAYS_PER_WEEK) + 1,
  day_number: i + 1,
  is_main_moodboard: true,
  // Ensure related_images is always an array of at least 2 images
  related_images: mb.related_images && mb.related_images.length >= 2 ? mb.related_images : [mb.coverImageUrl, mb.coverImageUrl],
}))

const PLACEHOLDER_IMG = '/placeholder.jpg'

export default function CalendarPage() {
  // Week index: 0–5
  const [weekIdx, setWeekIdx] = useState(0)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  // SSR-safe mobile detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    }
  }, [])

  // Get dates for the current week
  const weekDates = CHALLENGE_DATES.slice(weekIdx * DAYS_PER_WEEK, (weekIdx + 1) * DAYS_PER_WEEK)

  // Get moodboard for a specific date
  const getMoodboardForDate = (date: Date) => {
    return moodboardsWithDates.find(mb => format(mb.challengeDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  // Navigation handlers (locked to 0–5)
  const canGoPrev = weekIdx > 0
  const canGoNext = weekIdx < WEEKS - 1
  const goPrev = () => canGoPrev && setWeekIdx(weekIdx - 1)
  const goNext = () => canGoNext && setWeekIdx(weekIdx + 1)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FCFDFF]">
        <div className="max-w-[1920px] mx-auto px-0 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 px-[30px]">
            <div className="flex flex-col gap-1">
              <h1 className="text-[36px] font-bold text-black font-['SF Pro Display'] leading-[43px]">Booking Dashboard</h1>
              <span className="text-[18px] text-black font-['SF Pro'] font-medium leading-[21px]">Browse and book your next photo session</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={goPrev} disabled={!canGoPrev} className="border-2 border-black w-8 h-8 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-[32px] font-medium text-black font-['SF Pro'] leading-[38px] w-[100px] text-center">Week {weekIdx + 1}</div>
              <Button variant="outline" size="icon" onClick={goNext} disabled={!canGoNext} className="border-2 border-black w-8 h-8 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2 w-[231px]">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-medium text-black font-['SF Pro']">Available Shoot</span>
                <div className="w-[21px] h-[21px] bg-[#081116]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-medium text-black font-['SF Pro']">Booked By Other</span>
                <div className="w-[21px] h-[21px] bg-[#DC1E1E]" />
              </div>
            </div>
          </div>

          {/* Calendar Rows */}
          <div className="flex flex-col items-center gap-0">
            {weekDates.map((date, i) => {
              const moodboard = getMoodboardForDate(date)
              const isBooked = moodboard?.isBooked
              const verticalLineColor = isBooked ? '#DC1E1E' : '#000000'
              // Prepare similar images with placeholder fallback
              const similarImages = [
                moodboard?.related_images?.[0] || PLACEHOLDER_IMG,
                moodboard?.related_images?.[1] || PLACEHOLDER_IMG,
              ]
              return (
                <div
                  key={date.toISOString()}
                  className={`flex flex-col justify-center items-center py-[10px] gap-[10px] w-[1869px] h-[333px] bg-white ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer'} group`}
                  style={{ marginBottom: 0 }}
                >
                  {/* Divider */}
                  <div className="w-[1809px] h-[3px] bg-[#4D4D4D]" />
                  {/* Row Content */}
                  <div className="flex flex-row justify-between items-start w-[1809px] h-[300px] gap-[0px]">
                    {/* Left - Date */}
                    <div className="flex flex-row items-start gap-[10px] w-[134px] h-[300px]">
                      <div
                        className="w-[4px] h-[300px]"
                        style={{ background: verticalLineColor, transform: 'rotate(-90deg)' }}
                      />
                      <div className="flex flex-col justify-center items-start w-[82px] h-[107px]" style={{ margin: '-12px 0px' }}>
                        <div className="text-[64px] leading-[92px] font-semibold text-black font-['Jost']">{format(date, 'd').padStart(2, '0')}</div>
                        <div className="text-[18px] leading-[27px] font-semibold text-[#4D4D4D] font-['Poppins']">{format(date, 'EEEE')}</div>
                      </div>
                    </div>
                    {/* Middle - Moodboard Details & Images */}
                    <div className="flex flex-row items-start gap-[10px] w-[750.5px] h-[300px]">
                      {moodboard ? (
                        <>
                          {/* Details */}
                          <div className="flex flex-col justify-center items-start gap-[10px] w-[264px] h-[98px]">
                            <h3 className="text-[24px] leading-[36px] font-semibold text-black font-['Poppins']">{moodboard.name}</h3>
                            <div className="text-[18px] leading-[21px] font-bold text-[#4D4D4D]">Shoot Date: {format(moodboard.challengeDate, 'MMM d, yyyy')}</div>
                            <div className="text-[18px] leading-[21px] font-bold text-[#4D4D4D] max-w-[282px]">Tags: {moodboard.themeTags.slice(0, 3).join('/')}</div>
                          </div>
                          {/* Main image and hover images */}
                          <motion.div
                            className={`relative flex items-start h-[300px] group/calendar-row overflow-hidden ${isBooked ? 'pointer-events-none' : ''}`}
                            onMouseEnter={() => !isMobile && !isBooked && setHoveredDay(i)}
                            onMouseLeave={() => !isMobile && setHoveredDay(null)}
                            style={{ width: 476.5, justifyContent: 'flex-end' }}
                            animate={isBooked ? { scale: 1.01, boxShadow: '0 0 16px #DC1E1E33' } : {}}
                            transition={{ duration: 0.2 }}
                          >
                            {/* All images in the same container */}
                            <div className="flex flex-row gap-[10px] h-full relative">
                              {/* Main image: right-aligned by default, slides left on hover */}
                              <motion.div
                                layout
                                initial={false}
                                animate={{ x: hoveredDay === i && !isBooked && !isMobile ? -340 : 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="w-[476.5px] h-[300px] relative z-10 flex-shrink-0"
                                style={{ borderRadius: 0 }}
                              >
                                <Image
                                  src={moodboard.coverImageUrl}
                                  alt={moodboard.name}
                                  fill
                                  className="object-cover w-full h-full rounded"
                                />
                                {/* Booked overlay: Disney+ logo */}
                                {isBooked && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                                    <Image src="/disney-logo.png" alt="Disney+" width={120} height={120} className="opacity-90" />
                                  </div>
                                )}
                              </motion.div>
                              
                              {/* Similar images: always present but hidden until hover */}
                              <motion.div
                                className="flex flex-row gap-[10px] h-full"
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ 
                                  opacity: hoveredDay === i && !isBooked && !isMobile ? 1 : 0,
                                  x: hoveredDay === i && !isBooked && !isMobile ? 0 : 20
                                }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                <div className="w-[330px] h-[300px] relative flex-shrink-0">
                                  <Image
                                    src={similarImages[0]}
                                    alt={moodboard.name + ' alt 1'}
                                    fill
                                    className="object-cover rounded h-full"
                                  />
                                </div>
                                <div className="w-[330px] h-[300px] relative flex-shrink-0">
                                  <Image
                                    src={similarImages[1]}
                                    alt={moodboard.name + ' alt 2'}
                                    fill
                                    className="object-cover rounded h-full"
                                  />
                                </div>
                              </motion.div>
                            </div>
                            
                            {/* Clickable overlay for available moodboards */}
                            {!isBooked && hoveredDay === i && !isMobile && (
                              <Link href={`/moodboard/${moodboard.id}`} className="absolute inset-0 z-30" />
                            )}
                          </motion.div>
                        </>
                      ) : (
                        <div className="w-full text-zinc-400 py-8 text-center">No mood board scheduled for this day</div>
                      )}
                    </div>
                    {/* Right - Additional thumbnails (not used here, but keep for layout) */}
                    <div className="flex items-start gap-[10px] w-[660px] h-[300px]" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
} 