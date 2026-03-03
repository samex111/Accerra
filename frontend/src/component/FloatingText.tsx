"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

// Added more relevant and distinct items
const items = [
  { text: "ELECTROSTATICS", pos: "top-left", delay: 0 },
  { text: "VECTORS", pos: "top-right", delay: 1 },
  { text: "ORGANIC CHEM", pos: "mid-right", delay: 2 },
  { text: "CALCULUS", pos: "bottom-left", delay: 3 },
  { text: "MECHANICS", pos: "bottom-right", delay: 4 },
];

export default function FloatingText() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoother spring configuration
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      // Reduced the divisor for slightly more noticeable movement
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const positions: Record<string, string> = {
    "top-left": "top-24 left-[10%]",
    "top-right": "top-32 right-[10%]",
    "mid-left": "top-1/2 left-[5%] -translate-y-1/2",
    "mid-right": "top-[45%] right-[8%] -translate-y-1/2",
    "bottom-left": "bottom-32 left-[12%]",
    "bottom-right": "bottom-24 right-[15%]",
  };

  return (
    <div className="absolute inset-0 pointer-events-none perspective-[1000px] z-0 overflow-hidden">
      {items.map((item, i) => {
        // Tamed the rotation for a more professional feel
        const rotateX = useTransform(springY, (v) => v * 0.1);
        const rotateY = useTransform(springX, (v) => v * 0.1);

        return (
          <motion.div
            key={i}
            style={{ x: springX, y: springY, rotateX, rotateY }}
            // Smoother floating animation
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: {
                duration: 5 + i * 0.5, // staggered durations
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay * 0.2 // staggered start
              },
            }}
            className={`absolute ${positions[item.pos]} hidden md:block`} // Hide on very small screens to prevent clutter
          >
            <div
              className="flex items-center gap-3 px-4 py-2.5 
              backdrop-blur-md bg-white/40 
              border border-slate-200/50 
              rounded-lg shadow-sm
              text-xs font-semibold tracking-wider text-slate-600 uppercase"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
              {item.text}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}