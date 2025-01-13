"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

interface MotionFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
}

const MotionFadeIn = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  blur = "6px",
}: MotionFadeInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px",
    amount: 0.3, // Trigger animation when 30% of element is visible
  });

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className={className}
        initial={{
          opacity: 0,
          y: yOffset,
          filter: `blur(${blur})`,
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : yOffset,
          filter: isInView ? "blur(0px)" : `blur(${blur})`,
        }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionFadeIn;
