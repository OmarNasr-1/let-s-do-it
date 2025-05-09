"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundParticlesProps {
  theme: string;
  themeConfig: any;
}

export default function BackgroundParticles({ theme, themeConfig }: BackgroundParticlesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    size: number;
    left: string;
    duration: number;
    delay: number;
  }>>([]);
  
  // Initialize bubbles but keep them hidden
  useEffect(() => {
    // Generate bubble configuration
    const bubbleCount = 10;
    const generatedBubbles = Array(bubbleCount).fill(0).map((_, i) => {
      return {
        id: i,
        size: Math.floor(Math.random() * 80) + 20, // Size between 20 and 100px
        left: `${Math.random() * 100}%`,
        duration: Math.floor(Math.random() * 15) + 15, // Duration between 15-30s
        delay: Math.random() * 5 + (i * 0.5) // Staggered delay
      };
    });
    
    setBubbles(generatedBubbles);
    
    // Show bubbles after page has loaded
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1400); // Wait for page content to load and animate
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to handle theme changes - regenerate some bubbles
  useEffect(() => {
    if (isVisible) {
      // Create a few new bubbles when theme changes for visual refresh
      const newBubbles = Array(5).fill(0).map((_, i) => {
        return {
          id: Date.now() + i,
          size: Math.floor(Math.random() * 80) + 20,
          left: `${Math.random() * 100}%`,
          duration: Math.floor(Math.random() * 15) + 15,
          delay: Math.random() * 3
        };
      });
      
      setBubbles(prev => [...prev.slice(-10), ...newBubbles]);
    }
  }, [theme, isVisible]);
  
  // Get bubble style based on current theme
  const getBubbleStyle = (theme: string) => {
    switch (theme) {
      case 'dark':
        return {
          backgroundColor: 'rgba(244, 114, 182, 0.08)',
          border: '1px solid rgba(244, 114, 182, 0.2)',
          boxShadow: '0 0 10px rgba(244, 114, 182, 0.1)'
        };
      case 'light':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.1)'
        };
      case 'navy':
        return {
          backgroundColor: 'rgba(147, 197, 253, 0.08)',
          border: '1px solid rgba(147, 197, 253, 0.2)',
          boxShadow: '0 0 10px rgba(147, 197, 253, 0.1)'
        };
      default:
        return {
          backgroundColor: 'rgba(244, 114, 182, 0.08)',
          border: '1px solid rgba(244, 114, 182, 0.2)',
          boxShadow: '0 0 10px rgba(244, 114, 182, 0.1)'
        };
    }
  };
  
  // Function to add a new bubble at the bottom
  const addNewBubble = () => {
    if (!isVisible) return;
    
    const newBubble = {
      id: Date.now(),
      size: Math.floor(Math.random() * 80) + 20,
      left: `${Math.random() * 100}%`,
      duration: Math.floor(Math.random() * 15) + 15,
      delay: 0
    };
    
    setBubbles(prev => [...prev.slice(-14), newBubble]);
  };
  
  // Add new bubbles periodically
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      addNewBubble();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {isVisible && bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.left,
              bottom: '-15%', // Start below the viewport
              ...getBubbleStyle(theme)
            }}
            initial={{ 
              y: 0, 
              opacity: 0,
              scale: 0.6
            }}
            animate={{ 
              y: -window.innerHeight - bubble.size - 50, // Move up beyond the viewport
              opacity: [0, 0.7, 0.3, 0],
              scale: [0.6, 1, 1.1, 0.9]
            }}
            exit={{ 
              opacity: 0 
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "linear",
              opacity: {
                duration: bubble.duration,
                times: [0, 0.1, 0.8, 1]
              },
              scale: {
                duration: bubble.duration / 2,
                repeat: 2,
                repeatType: "reverse"
              }
            }}
          >
            {/* Inner highlight effect for realistic bubble look */}
            <div 
              className="absolute rounded-full w-1/4 h-1/4"
              style={{
                top: '25%',
                left: '25%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}