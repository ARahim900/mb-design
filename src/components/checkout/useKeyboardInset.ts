import { type RefObject, useEffect } from 'react';

/**
 * Publishes the on-screen keyboard height as `--keyboard-inset` on the given element.
 * iOS overlays the keyboard without shrinking a 100dvh dialog, so the scroll region uses
 * this to pad itself and to keep the focused field above the keyboard.
 */
export function useKeyboardInset(target: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    const element = target.current;
    const viewport = window.visualViewport;
    if (!active || !element || !viewport) return;

    const update = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      element.style.setProperty('--keyboard-inset', `${Math.round(inset)}px`);
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      element.style.removeProperty('--keyboard-inset');
    };
  }, [target, active]);
}
