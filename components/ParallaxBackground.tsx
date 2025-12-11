
import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

export const ParallaxBackground: React.FC = () => {
  const { scrollY } = useScroll();
  // Physics-based smoothing for the scroll value to prevent jitter
  const smoothScrollY = useSpring(scrollY, { damping: 30, stiffness: 200 });

  // Mouse Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
       const { clientX, clientY } = e;
       const { innerWidth, innerHeight } = window;
       // Normalize -0.5 to 0.5
       mouseX.set((clientX / innerWidth) - 0.5);
       mouseY.set((clientY / innerHeight) - 0.5);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- Layer 1: Stars (Deep Background) ---
  // Moves very slowly with scroll (creates infinite depth feel) and reacts subtly to mouse
  const yStarsScroll = useTransform(smoothScrollY, [0, 2000], [0, -150]); 
  const xStarsMouse = useTransform(mouseX, [-0.5, 0.5], [15, -15]); 
  const yStarsMouse = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  
  const yStars = useMotionTemplate`calc(${yStarsScroll}px + ${yStarsMouse}px)`;

  // --- Layer 2: Perspective Grid (Middle Background) ---
  // Moves faster than stars but slower than foreground content
  const yGridScroll = useTransform(smoothScrollY, [0, 2000], [0, -400]);
  const xGridMouse = useTransform(mouseX, [-0.5, 0.5], [30, -30]);
  const yGridMouse = useTransform(mouseY, [-0.5, 0.5], [30, -30]);
  
  const yGrid = useMotionTemplate`calc(${yGridScroll}px + ${yGridMouse}px)`;

  // --- Layer 3: Atmospheric Glows ---
  // Drifts between grid and stars
  const yGlowScroll = useTransform(smoothScrollY, [0, 2000], [0, -250]);
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
      
      {/* Stars Layer */}
      <motion.div 
        style={{ y: yStars, x: xStarsMouse }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div className="stars opacity-40"></div>
      </motion.div>

      {/* Grid Layer */}
      <motion.div 
        style={{ y: yGrid, x: xGridMouse }}
        className="absolute inset-0 z-1 origin-top will-change-transform"
      >
        <div className="perspective-grid opacity-25"></div>
      </motion.div>

      {/* Ambient Glows */}
      <motion.div 
        style={{ y: yGlowScroll }}
        className="absolute inset-0 z-2"
      >
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[150px] mix-blend-screen" 
         />
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 rounded-full blur-[150px] mix-blend-screen" 
         />
         {/* Vignette Overlay for focus */}
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/90"></div>
      </motion.div>
      
      {/* Scanlines (Static overlay) */}
      <div className="scanlines z-10 opacity-15"></div>
    </div>
  );
};
