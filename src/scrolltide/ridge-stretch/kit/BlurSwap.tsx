import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Cross-dissolve with blur + slight rise. Old and new share one grid cell, so nothing jumps.
 * Change `swapKey` to trigger. Use for labels, qualitative values ("Weekend" -> "1 week"), titles.
 */
export function BlurSwap({
  swapKey,
  children,
  className = "",
  y = 6,
  blur = 6,
  duration = 0.32,
}: {
  swapKey: string | number;
  children: ReactNode;
  className?: string;
  y?: number;
  blur?: number;
  duration?: number;
}) {
  return (
    <span className={`inline-grid ${className}`}>
      <AnimatePresence initial={false}>
        <motion.span
          key={swapKey}
          className="[grid-area:1/1]"
          initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -y, filter: `blur(${blur}px)` }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
