/**
 * About Us Page for 303030
 * Refined design matching specifications
 * Uses Tailwind utility classes and shadcn components
 */

'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'

/**
 * About Us page component
 * Sections:
 * 1. BluStudio - Studio introduction
 * 2. BluStudio Visit - CTA link to studio
 * 3. Appurva Shah - Founder section  
 * 4. Website Link - External portfolio link
 */
export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-slate-50">
        {/* BluStudio Section */}
        <section className="flex flex-col lg:flex-row min-h-screen">
          {/* Left - Title */}
          <div className="flex flex-col items-center justify-center py-16 lg:py-20 px-4 lg:w-1/3 bg-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black font-serif tracking-tight"
            >
              STUDIOBLU
            </motion.h1>
          </div>
          
          {/* Right - Content */}
          <div className="flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 lg:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-4xl"
            >
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                A space built for your next bold move. This is where ideas take shape, campaigns come to life, and moments get captured. Whether you're a brand shooting a lookbook, a model building your portfolio, or a team crafting visual stories—our studio is your blank canvas.
              </p>
              
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                We know what shoots demand—because we've hosted hundreds. That's why our space is open, modular, and fully equipped for a wide range of visual production. From seamless paper drops to concrete textures, from soft daylight to blackout control, every element is there to support your process. Need grip gear, a makeup station, or a quiet lounge between setups? We've got it. We're not just renting you a space—we're giving you the setting to do your best work.
              </p>
              
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                We've worked with everyone from fashion brands and streetwear labels to independent photographers and production teams. Our studio has been the backdrop to seasonal lookbooks, casting calls, editorials, social campaigns, and even music videos. But no matter who walks in the door—what matters most is the creative energy they bring. We're proud to host projects that feel fresh, boundary-pushing, and beautifully executed. Every shoot is different. That's why we keep it simple. Book the time you need, bring your team, and take full control of the space. We're here if you need us—and invisible when you don't. If you're ready to create something unforgettable, you've just found the place to make it happen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* BluStudio Visit Section */}
        <section className="relative bg-black/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-white hover:text-gray-200 hover:bg-transparent p-0 h-auto"
              >
                <a 
                  href="https://blustudious.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight">
                    STUDIOBLU
                  </span>
                  <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Appurva Shah Section */}
        <section className="flex flex-col lg:flex-row min-h-screen">
          {/* Left - Title */}
          <div className="flex flex-col items-center justify-center py-16 lg:py-20 px-4 lg:w-1/3 bg-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black font-serif tracking-tight text-center"
            >
              APPURVA SHAH
            </motion.h2>
          </div>
          
          {/* Right - Content */}
          <div className="flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 lg:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-4xl"
            >
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                A visionary creative director and photographer with over a decade of experience in fashion and commercial photography. Appurva recognized the gap between brands' creative vision and execution in photoshoots, leading to the creation of this innovative platform.
              </p>
              
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                With a background in fashion photography and creative direction, Appurva has worked with numerous brands, models, and creative teams. His expertise spans from conceptual development to final execution, ensuring every project meets the highest standards of visual storytelling.
              </p>
              
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-900 font-medium">
                Through his work, Appurva has built a reputation for creating compelling visual narratives that capture the essence of brands and individuals. His approach combines technical excellence with creative innovation, making him a sought-after collaborator in the fashion and photography industry.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Website Link Section */}
        <section className="relative bg-black/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-white hover:text-gray-200 hover:bg-transparent p-0 h-auto"
              >
                <a 
                  href="https://appurvashah.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight">
                    WEBSITE LINK
                  </span>
                  <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
} 