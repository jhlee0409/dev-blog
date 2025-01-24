"use client";

import { motion, MotionProps, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "../utils";

interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {}

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();
  const [hasScroll, setHasScroll] = useState(false);
  const pathname = usePathname();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  useEffect(() => {
    const checkScroll = () => {
      const hasScrollbar =
        document.documentElement.scrollHeight > window.innerHeight;
      setHasScroll(hasScrollbar);
    };

    checkScroll();
  }, [pathname]);

  if (!hasScroll) return null;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] h-1 origin-left bg-gradient-to-r from-[#f45f57] via-[#f8bc2f] to-[#28c841]",
        className
      )}
      style={{
        scaleX,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
