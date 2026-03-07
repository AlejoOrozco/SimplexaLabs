import { useState, useEffect } from 'react';

/**
 * Returns true when the user has scrolled past the given section (by id).
 * Used for header: center title after leaving the hero.
 */
export function useScrollPastSection(sectionId: string, threshold = 0.5): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPast(!entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId, threshold]);

  return past;
}
