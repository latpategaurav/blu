'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import MoodboardCard from '../../components/ui/relevant-shoot'

export default function CyberMoodboardPage() {
  return (
    <div>
      {/* First Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/cyber/80085b8313a3073d90e5bb2ac48c7cff7b9c2372.jpg"
          alt="Cyber Image 1"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/cyber/1e3a3f05494ff3ebae22990feec476cd75c9b8fe (1).jpg"
          alt="Cyber Image 3"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/cyber/6e2bd706a464adb8da9558a2df195b92ba40f390.jpg"
          alt="Cyber Image 4"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div> 

      {/* Second Full Width Image */}
      <div className="relative w-full h-auto px-6 py-3">
        <Image
          src="/moodboards/cyber/a994a5fdb92496eabab79f4a7ff7bd3fd76262e2.jpg"
          alt="Cyber Image 2"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="text-3xl font-bold mb-4 md:mb-0 px-10 py-10">Relevant shoots</div>
      <MoodboardCard />
    </div>
  )
}
