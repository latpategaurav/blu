'use client'

import Image from 'next/image'

export default function MoodboardCard() {
  return (
    <div>
      <div className="text-3xl font-bold mb-4 md:mb-0 px-10 py-10">Relevant shoots</div>
      
      {/* Cards Container */}
      <div className="flex gap-4 px-10">
        {/* Left Card - Retro Minimal */}
        <div className="w-1/2 bg-white shadow-md overflow-hidden">
          <div className="flex">
            {/* Image - Left Side */}
            <div className="relative w-1/2 h-80">
              <Image
                src="/moodboards/pietro maximoff aesthetic.jpeg"
                alt="Retro Minimal"
                fill
                className="object-cover"
              />
              {/* UI Icons */}
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-3 h-3 bg-white border border-white"></div>
                <div className="w-3 h-3 bg-transparent border border-white"></div>
              </div>
            </div>
            {/* Text Content - Right Side */}
            <div className="w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-black mb-1">Retro Minimal</h3>
              <p className="text-sm text-black mb-2">Metallic, retro, surreal</p>
              <p className="text-sm text-black">
                A sleek fusion of vintage aesthetics and clean modern lines,
                capturing the essence of 'retro minimal' with timeless simplicity.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card - Chromatic Aberration */}
        <div className="w-1/2 bg-white shadow-md overflow-hidden">
          <div className="flex">
            {/* Image - Left Side */}
            <div className="relative w-1/2 h-80">
              <Image
                src="/moodboards/17_Ascension.jpeg"
                alt="Chromatic Aberration"
                fill
                className="object-cover"
              />
              {/* UI Icons */}
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-3 h-3 bg-white border border-white"></div>
                <div className="w-3 h-3 bg-transparent border border-white"></div>
              </div>
            </div>
            {/* Text Content - Right Side */}
            <div className="w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-black mb-1">Chromatic Aberration</h3>
              <p className="text-sm text-black mb-2">Ethereal, dreamy, surreal</p>
              <p className="text-sm text-black">
                Embrace the vibrant imperfections: our 'Chromatic Aberration' shoot
                transforms optical distortion into breathtaking, color-fringed art.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Section */}
      <div className="px-10 py-8">
        <h1 className="text-3xl font-bold mb-2">Cybercigilism</h1>
        <p className="text-sm text-gray-600 mb-6">Any additional customization will be considered only after the advanced payment is received.</p>

        {/* Booking Details */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">📷</span>
            <h2 className="font-bold">Booking Details</h2>
          </div>
          <div className="flex items-center mb-1">
            <span className="text-lg mr-2">📅</span>
            <span>Shoots date: July 6, 2025</span>
          </div>
          <div className="ml-6">
            <span>Fashion Editorial - Cybercigilism</span>
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">👥</span>
            <h2 className="font-bold text-orange-600">Model Selection Required</h2>
          </div>
          <p className="mb-2">Please select your models before proceeding with payment.</p>
          <a href="#" className="text-orange-600 underline">Select Models Now</a>
        </div>

        {/* Pricing Breakdown */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-xl mr-2">📄</span>
            <h2 className="font-bold">Pricing Breakdown</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Shoot Price</span>
              <span className="font-bold">₹5,50,000.00</span>
            </div>
            <div className="flex justify-between">
              <div>
                <span>Due Today</span>
                <div className="text-sm text-gray-600">Deposit (10%)</div>
              </div>
              <span className="font-bold">₹50,000.00</span>
            </div>
            <div className="flex justify-between">
              <div>
                <span>Due on Shoot Day</span>
                <div className="text-sm text-gray-600">July 6, 2025</div>
              </div>
              <span className="font-bold">₹5,00,000.00</span>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <button className="w-full bg-black text-white py-3 px-6 rounded font-semibold mb-4">
          Book Slot & Pay Deposit
        </button>

        {/* Footer/Disclaimer */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>By proceeding, you agree to our <a href="#" className="text-orange-600 underline">terms and conditions</a>.</p>
          <p className="text-orange-600">Deposit is non-refundable within 48 hours of shoot date.</p>
        </div>
      </div>
    </div>
  )
}
