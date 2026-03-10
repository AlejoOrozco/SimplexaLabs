import { useEffect, type RefObject } from 'react';

const TITLE_LEFT_PX = 24; // 1.5rem

/**
 * Links the header title position to scroll by updating the title's transform
 * directly in the scroll handler. No setState → no React re-renders during scroll,
 * so the movement stays on the compositor and feels natural.
 */
export function useScrollLinkedTitle(
  sectionId: string,
  titleRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const title = titleRef.current;
    const container = containerRef.current;
    if (!title || !container) return;
    if (!sectionId) {
      title.style.left = '';
      title.style.willChange = '';
      title.style.transform = 'translateY(-50%)';
      return;
    }
    const section = document.getElementById(sectionId);
    if (!section) return;

    let rafId: number;

    function update() {
      const sec = document.getElementById(sectionId);
      if (!sec || !titleRef.current || !containerRef.current) return;
      const titleEl = titleRef.current;
      const containerEl = containerRef.current;

      const rect = sec.getBoundingClientRect();
      const height = rect.height;
      const top = rect.top;
      const progress = height > 0 ? Math.min(1, Math.max(0, -top / height)) : 0;

      const containerWidth = containerEl.offsetWidth;
      const titleWidth = titleEl.offsetWidth;
      const centerOffset = containerWidth / 2 - TITLE_LEFT_PX - titleWidth / 2;

      const translateX = progress * centerOffset;
      titleEl.style.transform = `translate(${translateX}px, -50%)`;
    }

    function onScroll() {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    title.style.left = `${TITLE_LEFT_PX}px`;
    title.style.transform = `translateY(-50%)`;
    title.style.willChange = 'transform';
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (titleRef.current) {
        titleRef.current.style.willChange = '';
      }
    };
  }, [sectionId, titleRef, containerRef]);
}
