import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../hooks/usePremiumMotion';

const INTERACTIVE = 'a, button, summary, input, textarea, select, [role="button"]';

/**
 * A copper ring that trails the pointer and opens over anything clickable.
 *
 * It sits *alongside* the system cursor rather than replacing it. Hiding the
 * real cursor on a storefront costs the reader the arrow-versus-hand signal
 * that tells them what is clickable, which is a poor trade for a shop with a
 * bag and dialogs in it — so `cursor: none` is deliberately not used.
 *
 * Mouse and trackpad only, and never under reduced motion: on touch the
 * component returns null and binds no listeners at all.
 */
export function CursorRing() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !fine || reduced) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let running = false;
    let frame = 0;

    const step = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Park the loop once it has caught up. An idle pointer should not hold a
      // frame callback open for the life of the page.
      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        running = false;
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(step);
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      ring.dataset.visible = 'true';
      ring.dataset.over = (event.target as Element | null)?.closest(INTERACTIVE) ? 'true' : 'false';
      kick();
    };

    const onLeave = () => { ring.dataset.visible = 'false'; };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return <div ref={ringRef} className="cursor-ring" data-visible="false" data-over="false" aria-hidden="true" />;
}
