import { useId } from 'react';
import type { ReactNode } from 'react';

/** Path length for the rounded rect (viewBox 0 0 200 48, rect inset 2, rx 8) ≈ 466 */
const BORDER_PATH_LENGTH = 466;
const STRIPE_LENGTH = 48;

type Props = { children: ReactNode; outline?: boolean };

export function CtaBorderWrap({ children, outline = false }: Props) {
  const gradientId = useId();
  return (
    <span className={`cta-border-wrap${outline ? ' cta-border-wrap--outline' : ''}`}>
      <svg
        className="cta-border-stripe"
        viewBox="0 0 200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect
          className="cta-border-stripe-path"
          x="2"
          y="2"
          width="196"
          height="44"
          rx="8"
          ry="8"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeDasharray={`${STRIPE_LENGTH} ${BORDER_PATH_LENGTH - STRIPE_LENGTH}`}
        />
      </svg>
      {children}
    </span>
  );
}
