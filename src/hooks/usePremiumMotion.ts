import { useEffect, useRef, useState, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Tracks a media query and re-renders when it flips. Returns false during the
 * first render on the server or before the effect runs, so every caller must
 * treat "false" as "not yet proven true" and degrade to the plain experience.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** True when the reader has asked for less motion. Everything decorative checks this. */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION);
}

/**
 * True only for a mouse or trackpad. Touch and pen are excluded, so the cursor
 * ring and the magnetic pull never cost a phone anything — they are not merely
 * hidden there, they are never mounted or bound.
 */
export function useFinePointer(): boolean {
  return useMediaQuery(FINE_POINTER);
}

/**
 * Header behaviour: hide while the reader is moving down the page, bring it
 * back the moment they move up. Stays put near the top and whenever `locked`
 * is true, so an open menu or dialog can never be left with a header that
 * slides away underneath it.
 */
export function useScrollDirection(locked: boolean): boolean {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (locked) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        // 6px of slack keeps trackpad jitter and iOS rubber-banding from flickering it.
        if (Math.abs(y - lastY.current) > 6) {
          setHidden(y > 160 && y > lastY.current);
          lastY.current = y;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [locked]);

  return hidden;
}

/**
 * Drifts an element against the page as it passes through the viewport.
 *
 * Writes only `transform`, and only while the element is actually on screen —
 * an IntersectionObserver gates the scroll listener so offscreen sections cost
 * nothing. `strength` is a percentage of the element's own height, so it must
 * be given enough overflow to cover the travel (the hero image runs at 114%).
 */
export function useParallax<T extends HTMLElement>(strength: number): RefObject<T> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || strength === 0) return;

    let frame = 0;
    let onScreen = false;

    const apply = () => {
      frame = 0;
      const host = element.parentElement ?? element;
      const rect = host.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      if (span <= 0) return;

      // 0 as the element enters from below, 1 as it leaves past the top.
      const progress = (window.innerHeight - rect.top) / span;
      const clamped = Math.min(1, Math.max(0, progress));
      element.style.transform = `translate3d(0, ${(clamped - 0.5) * strength}%, 0)`;
    };

    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = window.requestAnimationFrame(apply);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? false;
        if (onScreen) {
          element.style.willChange = 'transform';
          apply();
        } else {
          // Released the moment it leaves; a permanent layer per image is how
          // a page ends up holding memory it never gives back.
          element.style.willChange = 'auto';
        }
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(element.parentElement ?? element);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.transform = '';
      element.style.willChange = 'auto';
    };
  }, [reduced, strength]);

  return ref;
}

/**
 * Pulls a control gently toward the pointer while it is over it. Mouse and
 * trackpad only, and inert under reduced motion — on a touch screen the
 * listeners are never attached.
 */
export function useMagnetic<T extends HTMLElement>(pull = 0.28): RefObject<T> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || !fine) return;

    let frame = 0;

    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) * pull;
        const dy = (event.clientY - (rect.top + rect.height / 2)) * pull * 1.3;
        element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };

    const enter = () => { element.style.willChange = 'transform'; };
    const leave = () => {
      if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
      element.style.transform = '';
      element.style.willChange = 'auto';
    };

    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);

    return () => {
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.transform = '';
      element.style.willChange = 'auto';
    };
  }, [fine, pull, reduced]);

  return ref;
}
