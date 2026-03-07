import { useState, useEffect } from 'react';

/**
 * Returns a progress value 0–1 based on how much the hero section has left the viewport.
 * 0 = hero fully visible (title at left), 1 = hero fully past (title at center).
 * Uses scroll position + getBoundingClientRect for smooth, fluent updates (no discrete thresholds).
 */
export function useHeroScrollProgress(sectionId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    let rafId: number;

    function update() {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      const top = rect.top;
      // progress 0 when hero top is at or below viewport top (not scrolled past)
      // progress 1 when hero top is at -height (fully scrolled past)
      const raw = height > 0 ? -top / height : 0;
      const next = Math.min(1, Math.max(0, raw));
      setProgress(next);
    }

    function onScroll() {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [sectionId]);

  return progress;
}
