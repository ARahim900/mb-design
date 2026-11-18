import { type RefObject, useEffect } from 'react';

type Measure = (element: HTMLElement) => number;

/** Progress through a tall wrapper whose child is sticky: 0 as it pins, 1 as it releases. */
export const pinnedProgress: Measure = (element) => {
  const rect = element.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  return travel > 0 ? -rect.top / travel : 1;
};

/**
 * Writes scroll progress (0..1) to `--p` on the element. Set straight on the style once per
 * frame, never through React state, so a scroll-linked animation costs no re-render. Under
 * reduced motion it pins `--p` at 1 and the scene shows its finished state.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, measure: Measure): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const write = () => {
      frame = 0;
      const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, measure(element)));
      element.style.setProperty('--p', progress.toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, [ref, measure]);
}
