/**
 * Homepage component for 303030
 * Fully responsive design using Tailwind and shadcn patterns
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

/**
 * Main homepage component with responsive design
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 px-4 md:px-8 bg-white">
        <div className="container max-w-7xl mx-auto text-center space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 font-sans">
              Shoot with Blu
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <p className="text-base md:text-lg lg:text-xl text-slate-700 leading-relaxed font-medium">
              Set within a light-filled industrial loft with exposed brick walls, soaring ceilings, curated backdrops and custom lighting rigs inspired by the stories we're there to tell, Space Called Blu is built to immerse you in the craft. Whether it's a portrait session, a fashion shoot, or a nature expedition, you'll have full access to our styling lounge, gear library and on-site creative suite—everything you need to collaborate, experiment and refine every frame until it feels unmistakably yours.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 text-lg font-medium">
              Hero Image Coming Soon
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <Link href="/calendar">
              <Button size="lg" className="text-xl md:text-2xl lg:text-3xl px-8 py-6 h-auto font-semibold bg-slate-900 hover:bg-slate-800">
                Reserve your shot
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>

          {/* How this works */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-16"
          >
            <Card className="aspect-video">
              <CardContent className="h-full flex items-center justify-center p-6">
                <span className="text-slate-600 text-lg font-medium">Process Overview</span>
              </CardContent>
            </Card>
            <Card className="aspect-video">
              <CardContent className="h-full flex items-center justify-center p-6">
                <span className="text-slate-600 text-lg font-medium">Studio Tour</span>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Themes & Shoots */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white border-t border-slate-100">
        <div className="container max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Featured Themes & Shoots
            </h2>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Theme Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="/moodboards/1_Sunny.png"
                    alt="Urban Streetwear Collection"
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Urban Streetwear
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Modern street fashion with an edge
                  </p>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full font-medium">
                      View Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="/moodboards/2_WhispersOfSpring.png"
                    alt="Vintage Reveal"
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Vintage Reveal
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Classic looks reimagined
                  </p>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full font-medium">
                      View Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="/moodboards/5_MinimalistStudio.jpeg"
                    alt="Studio Minimalist"
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Studio Minimalist
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clean lines and subtle tones
                  </p>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full font-medium">
                      View Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Card 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="/moodboards/10_RetroAutumn.jpeg"
                    alt="Nature Escape"
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Nature Escape
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Outdoor setting with natural light
                  </p>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full font-medium">
                      View Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Recent Collections
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <Card key={index} className="aspect-[3/4] group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="h-full flex items-center justify-center p-6 bg-slate-200 group-hover:bg-slate-300 transition-colors">
                  <span className="text-slate-600 text-lg font-medium">Collection {index}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Portfolio Showcase */}
            <div className="lg:col-span-2">
              <Card className="aspect-video border-0 shadow-lg">
                <CardContent className="h-full flex items-center justify-center p-8 bg-slate-100">
                  <span className="text-slate-600 text-xl font-medium">Portfolio Showcase</span>
                </CardContent>
              </Card>
            </div>
            
            {/* Text Section */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900">
                Our Work
              </h2>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                Explore our portfolio of premium photography sessions and creative collaborations with brands and models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Large card spanning 2 rows on desktop */}
            <Card className="md:col-span-1 lg:row-span-2 aspect-square lg:aspect-[1/2] border-0 shadow-lg">
              <CardContent className="h-full flex items-center justify-center p-6 bg-slate-100">
                <span className="text-slate-600 text-lg font-medium">Featured 1</span>
              </CardContent>
            </Card>
            
            {/* Regular cards */}
            <Card className="aspect-square border-0 shadow-lg">
              <CardContent className="h-full flex items-center justify-center p-6 bg-slate-100">
                <span className="text-slate-600 text-lg font-medium">Featured 2</span>
              </CardContent>
            </Card>
            
            <Card className="aspect-square border-0 shadow-lg">
              <CardContent className="h-full flex items-center justify-center p-6 bg-slate-100">
                <span className="text-slate-600 text-lg font-medium">Featured 3</span>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1 lg:row-span-2 aspect-square lg:aspect-[1/2] border-0 shadow-lg">
              <CardContent className="h-full flex items-center justify-center p-6 bg-slate-100">
                <span className="text-slate-600 text-lg font-medium">Featured 4</span>
              </CardContent>
            </Card>
            
            {/* Wide card spanning 2 columns */}
            <Card className="md:col-span-2 aspect-video border-0 shadow-lg">
              <CardContent className="h-full flex items-center justify-center p-6 bg-slate-100">
                <span className="text-slate-600 text-lg font-medium">Featured 5</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Cards Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-600 text-lg font-medium">Project Image</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900">
                        Urban Streetwear Collection
                      </h3>
                      <p className="text-sm text-slate-600">
                        StreetStyle Magazine
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                      2023
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-600 text-lg font-medium">Project Image</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900">
                        Minimalist Studio
                      </h3>
                      <p className="text-sm text-slate-600">
                        Fashion Weekly
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                      2023
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-600 text-lg font-medium">Project Image</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900">
                        Vintage Collection
                      </h3>
                      <p className="text-sm text-slate-600">
                        Retro Magazine
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                      2023
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-slate-900 text-white">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to create your next masterpiece?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Inspired? See the full calendar and book your next shoot with our crew.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/calendar">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/about-us">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
