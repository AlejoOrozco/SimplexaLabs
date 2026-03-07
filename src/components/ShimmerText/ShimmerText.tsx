import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import './ShimmerText.css';

interface ShimmerTextProps {
  text: string;
  className?: string;
  /** Seconds for one shimmer pass (default: 5) */
  duration?: number;
}

export function ShimmerText({ text, className, duration = 5 }: ShimmerTextProps) {
  return (
    <motion.span
      className={cn('shimmer-text', className)}
      animate={{ backgroundPosition: ['200% 50%', '-200% 50%'] }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      {text}
    </motion.span>
  );
}

