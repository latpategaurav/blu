'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import MoodboardCard from '../../components/ui/relevant-shoot'

export default function WhispersSpringPage() {
  return (
    <div>
      {/* First Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/spring/zeroth.jpg"
          alt="Whispers of Spring Image 1"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/spring/first.jpg"
          alt="Whispers of Spring Image 2"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/spring/second.jpg"
          alt="Whispers of Spring Image 3"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      {/* Fourth Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/spring/third.jpg"
          alt="Whispers of Spring Image 4"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      
      
     <MoodboardCard />
    </div>
  )
} 