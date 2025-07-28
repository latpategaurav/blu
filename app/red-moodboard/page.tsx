'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import MoodboardCard from '../../components/ui/relevant-shoot'

export default function RedMoodboardPage() {
  return (
    <div>
      {/* First Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/red/1.jpg"
          alt="Red Moodboard Image 1"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/red/2.jpg"
          alt="Red Moodboard Image 2"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/red/3.jpg"
          alt="Red Moodboard Image 3"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      {/* Fourth Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/red/4.jpg"
          alt="Red Moodboard Image 4"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      
      <MoodboardCard />
    </div>
  )
} 