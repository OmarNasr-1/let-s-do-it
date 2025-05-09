"use client"

import { Orbitron } from 'next/font/google'
import Link from 'next/link';
import { useEffect, useState } from 'react'

const orbitron = Orbitron({ subsets: ['latin'] })

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM:SS AM/PM
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      // Format date as M/D/YYYY
      const dateString = now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <footer className="w-full py-4 absolute bottom-0 left-0 z-10 flex justify-between items-center px-6 " >
      <div className="flex items-center">
        <p className={`${orbitron.className} text-xs sm:text-sm md:text-2xl opacity-80 tracking-wide transition-colors duration-700`}>
          {currentDate}, {currentTime}
        </p>
      </div>
      <Link target='_blank' href='https://www.datac.com'  className={`${orbitron.className} text-xs sm:text-sm md:text-2xl opacity-50 tracking-wider transition-colors duration-700`}>
        DATAC © 2025
      </Link>
    </footer>
  )
}