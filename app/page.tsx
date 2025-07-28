'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
// Root HomePage component
export default function HomePage() {
  return (
    <main className="font-sans text-[18px] md:text-[20px]">
      <HeroSection />
      <ReserveSection />
      <FeaturedSection title="Featured Themes & Shoots" />
      <FeaturedSection title="Featured Themes & Shoots" />
      <OurWorkSection />
      <GalleryGrid />
      <ShootCards />
      <FinalCTA />
    </main>
  );
}



// Hero Section
function HeroSection() {
  return (
    <section className="text-center py-8 md:py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Shoot with Blu</h1>
      <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 mb-8 md:mb-12">
        Set within a light-filled industrial loft with exposed brick walls, soaring ceilings, curated backdrops and custom lighting rigs inspired by the stories we're there to tell. Space Called Blu is built to immerse you in the craft. Whether it's a portrait session, a fashion shoot, or a future expedition, you'll have full access to our styling zone, gear library and on-site creative suite—everything you need to collaborate, experiment and refine every frame until it feels unmistakably yours.
      </p>
      <div className="bg-gray-100 h-64 md:h-96 flex items-center justify-center">
        <span className="text-4xl">📹 ▶️</span>
      </div>
    </section>
  );
}

// Reserve Section
function ReserveSection() {
  return (
    <section className="text-center py-8 md:py-12">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Reserve your shot →</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-12">
        <div className="relative h-60 md:h-80 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"
            alt="Minimal Studio"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="relative h-60 md:h-80 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
            alt="Clean Portrait"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
}

// Featured Section (reusable)
function FeaturedSection({ title }: { title: string }) {
  const featuredShoots = [
    {
      title: "Urban Streetwear",
      description: "Modern street fashion with an edge",
      image: "/moodboards/UrbanStreetwear.jpg"
    },
    {
      title: "Vintage Reveal", 
      description: "Classic looks reimagined",
      image: "/moodboards/VintageReveal.jpg"
    },
    {
      title: "Studio Minimalist",
      description: "Clean lines and subtle tones", 
      image: "/moodboards/StudioMinimalist.jpg"
    },
    {
      title: "Nature Escape",
      description: "Outdoor setting with natural light",
      image: "/moodboards/NatureEscape.jpg"
    }
  ];

  return (
    <section className="px-4 md:px-6 py-8 md:py-10">
      <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8">{title}</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col">
          <div className="relative h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
              alt="Fashion City"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">Fashion City</h3>
            <p className="text-sm text-gray-600">Urban editorial shoot</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
              alt="Studio Minimal"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">Studio Minimal</h3>
            <p className="text-sm text-gray-600">Clean studio portrait</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
              alt="Soft Outdoor"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">Soft Outdoor</h3>
            <p className="text-sm text-gray-600">Natural light, soft tones</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
              alt="Editorial Urban"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">Editorial Urban</h3>
            <p className="text-sm text-gray-600">Street style editorial</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Our Work Section
function OurWorkSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-6 py-8 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src="/moodboards/26_LightTrack.jpeg"
            alt="Light Track"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src="/moodboards/pietro maximoff aesthetic.jpeg"
            alt="Pietro Maximoff Aesthetic"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Our Work</h2>
        <p className="text-sm md:text-base text-gray-600">
          Explore our portfolio of premium photography sessions and creative collaborations with brands and models.
        </p>
      </div>
    </section>
  );
}

// Gallery Grid with Bento Animation and random images
const defaultMoodboardImages = [
  '/moodboards/1_Sunny.png',
  '/moodboards/2_WhispersOfSpring.png',
  '/moodboards/5_MinimalistStudio.jpeg',
  '/moodboards/10_RetroAutumn.jpeg',
  '/moodboards/12_NeoMatrix.jpeg',
  '/moodboards/14_AngelsThesis.jpeg',
  '/moodboards/15_EveningDespire.jpeg',
  '/moodboards/16_AdreanKing.jpeg',
  '/moodboards/17_Ascension.jpeg',
];

function getRandomImages(arr: string[], n: number): string[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function GalleryGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const images = [
    '/moodboards/1_Sunny.png',
    '/moodboards/2_WhispersOfSpring.png',
    '/moodboards/5_MinimalistStudio.jpeg',
    '/moodboards/10_RetroAutumn.jpeg',
    '/moodboards/12_NeoMatrix.jpeg',
    '/moodboards/14_AngelsThesis.jpeg',
    '/moodboards/15_EveningDespire.jpeg',
    '/moodboards/16_AdreanKing.jpeg',
    '/moodboards/17_Ascension.jpeg',
  ];

  // Grid layout configuration - 4x2 matrix (now with E+F combined)
  const gridItems = [
    { img: '/moodboards/Screenshot 2025-06-01 114330.png', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 3, className: 'h-full', link: '/cyber-moodboard' }, // A
    { img: '/moodboards/2_WhispersOfSpring.png', colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 2, className: 'aspect-square min-h-[12rem]', link: '/whispers-spring' }, // B
    { img: '/moodboards/1_Sunny.png', colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2, className: 'aspect-square min-h-[12rem]', link: '/cyber-moodboard' }, // C
    { img: '/moodboards/Screenshot 2025-06-01 114216.png', colStart: 4, colEnd: 5, rowStart: 1, rowEnd: 3, className: 'h-full', link: '/red-moodboard' }, // D
    { img: '/moodboards/10_RetroAutumn.jpeg', colStart: 2, colEnd: 4, rowStart: 2, rowEnd: 3, className: 'aspect-[2/1] min-h-[12rem]', link: '/whispers-spring' }, // E+F combined, wide box
  ];

  return (
    <section className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 py-8 md:py-10">
      {gridItems.map((item, i) => {
        const isHovered = hoveredIndex === i;
        const isAnyHovered = hoveredIndex !== null;
        return (
          <motion.div
            key={i}
            className={`relative ${item.className} cursor-pointer flex items-center justify-center transition-all duration-300 text-2xl font-bold select-none overflow-hidden ${
              isHovered ? 'ring-4 ring-yellow-300 shadow-xl z-10' : ''
            }`}
            style={{
              gridColumn: `${item.colStart} / ${item.colEnd}`,
              gridRow: `${item.rowStart} / ${item.rowEnd}`,
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{
              boxShadow: isHovered ? '0 8px 32px rgba(0,0,0,0.12)' : '0 0px 0px rgba(0,0,0,0)',
              zIndex: isHovered ? 10 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Link href={item.link} className="w-full h-full">
              <Image
                src={item.img}
                alt={`Grid item ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Link>
            {isAnyHovered && !isHovered && (
              <div className="absolute inset-0 bg-white/50"></div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}

// Shoot Cards Section
function ShootCards() {
  const shoots = [
    { title: 'Urban Streetwear Collection', subtitle: 'StreetStyle Magazine' },
    { title: 'Minimalist Studio Series', subtitle: 'Modern Apparel' },
    { title: 'Vintage Revival Lookbook', subtitle: 'Retro Brands Co.' }
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 py-8 md:py-10">
      {shoots.map((s, i) => (
        <div key={i} className="bg-white shadow p-4">
          <div className="bg-gray-300 h-32 md:h-48 mb-4"></div>
          <h3 className="text-base md:text-lg font-semibold">{s.title}</h3>
          <p className="text-xs md:text-sm text-gray-500">{s.subtitle}</p>
          <div className="text-right text-xs mt-2 bg-gray-100 px-2 py-1 inline-block">2024</div>
        </div>
      ))}
    </section>
  );
}

// Final Call to Action
function FinalCTA() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center px-6 py-10 text-sm text-gray-600">
      <ul className="list-disc ml-4 space-y-1">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
        <li>Ut enim ad minim veniam.</li>
        <li>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</li>
      </ul>
      <div className="text-right">
        <p>Inspired? See the full calendar and book your next shoot with our crew.</p>
        <a href="#" className="font-semibold text-blue-600 hover:underline">Book Now →</a>
      </div>
    </footer>
  );
}
