"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

function FloatingPaths({ position, colorClass }: { position: number; colorClass: string }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className={cn("h-full w-full", colorClass)} viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.18 + path.id * 0.015}
            initial={{ pathLength: 0.3, opacity: 0.55 }}
            animate={{
              pathLength: 1,
              opacity: [0.35, 0.75, 0.35],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

type BackgroundPathsProps = {
  className?: string;
};

export function BackgroundPaths({ className }: BackgroundPathsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden>
      <FloatingPaths position={1} colorClass="text-[rgba(91,94,244,0.95)]" />
      <FloatingPaths position={-1} colorClass="text-[rgba(34,211,238,0.9)]" />
    </div>
  );
}
