import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

type Props = {
  value: number;
  /** Count up from this on mount (e.g. 0). Omit to start at `value`. */
  from?: number;
  format?: (n: number) => string;
  /** Seconds the tween takes. 0.5-1.0 for hero numerals. */
  duration?: number;
  className?: string;
};

const defaultFormat = (n: number) => Math.round(n).toLocaleString("en-US");

/** Tweens through every intermediate value and always lands exactly (no spring tail). */
export function AnimatedNumber({ value, from, format = defaultFormat, duration = 0.9, className = "" }: Props) {
  const mv = useMotionValue(from ?? value);
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [mv, value, duration]);
  const text = useTransform(mv, (n) => format(n));
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>;
}
