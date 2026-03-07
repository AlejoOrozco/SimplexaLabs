import { type ReactNode, useRef, useState, useEffect } from 'react';

interface LazySectionProps {
  children: ReactNode;
  /** Min height of the placeholder to preserve scroll layout (default: 50vh) */
  minHeight?: string;
  /** Start loading when section is this many px from viewport (default: 200) */
  rootMargin?: string;
}

/**
 * Renders children only when the section enters the viewport.
 * Uses Intersection Observer to defer mounting until the user scrolls near the section.
 * Preserves scroll layout with a placeholder of minHeight until then.
 */
export function LazySection({
  children,
  minHeight = '50vh',
  rootMargin = '200px',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (inView) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ minHeight }}
      data-lazy-section-placeholder
    />
  );
}
