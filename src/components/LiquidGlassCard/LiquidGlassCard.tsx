/**
 * Liquid Glass Card - ported from Kokonut UI concept.
 * Uses SVG filter + box-shadow for the glass effect. No Tailwind/shadcn dependency.
 */

import { useId, type HTMLAttributes, type ReactNode } from 'react';
import './LiquidGlassCard.css';

const DEFAULT_GLASS_FILTER_SCALE = 30;

interface GlassFilterProps {
  id: string;
  scale?: number;
}

function GlassFilter({ id, scale = DEFAULT_GLASS_FILTER_SCALE }: GlassFilterProps) {
  return (
    <svg className="liquid-glass-card__svg-filter" aria-hidden>
      <defs>
        <filter
          id={id}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves={1}
            seed={1}
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" result="blurredNoise" stdDeviation="2" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            result="displaced"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="B"
          />
          <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glassEffect?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'bar';
}

export function LiquidGlassCard({
  className = '',
  children,
  glassEffect = true,
  size = 'default',
  ...props
}: LiquidGlassCardProps) {
  const rawId = useId();
  const filterId = rawId.replace(/:/g, '-');

  return (
    <div
      className={`liquid-glass-card liquid-glass-card--${size} ${className}`.trim()}
      {...props}
    >
      <div className="liquid-glass-card__shadow" aria-hidden />
      {glassEffect && (
        <>
          <div
            className="liquid-glass-card__backdrop"
            style={{ backdropFilter: `url("#${filterId}")` }}
            aria-hidden
          />
          <GlassFilter id={filterId} scale={DEFAULT_GLASS_FILTER_SCALE} />
        </>
      )}
      <div className="liquid-glass-card__content">{children}</div>
      <div className="liquid-glass-card__hover" aria-hidden />
    </div>
  );
}
