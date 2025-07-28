'use client'

import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './ui/login-modal';

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start p-4 md:p-6 border-b">
        <div className="text-4xl font-bold mb-4 md:mb-0">303030</div>
        <nav className="space-y-2 md:space-y-0 md:space-x-4 text-lg text-center md:text-right">
          <Link href="/calendar" className="block md:inline hover:underline">Shoot Calendar</Link>
          <Link href="/discover" className="block md:inline hover:underline">Discover</Link>
          <Link href="/about-us" className="block md:inline hover:underline">About Us</Link>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="block md:inline hover:underline bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
          <Link href="/signup" className="block md:inline hover:underline">Signup</Link>
        </nav>
      </header>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
} 