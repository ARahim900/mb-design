import { useEffect } from 'react';

/**
 * Body properties the lock owns. Whatever the page had inline before the lock is
 * captured so the release restores it instead of blindly clearing it.
 */
const LOCKED_PROPERTIES = [
  'position',
  'top',
  'left',
  'right',
  'width',
  'overflow',
  'padding-inline-end',
] as const;

interface RestorePoint {
  readonly scrollY: number;
  readonly scrollBehavior: string;
  readonly body: ReadonlyArray<readonly [property: string, value: string]>;
}

let lockCount = 0;
let restorePoint: RestorePoint | null = null;

function applyLock() {
  const root = document.documentElement;
  const { body } = document;
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - root.clientWidth;

  restorePoint = {
    scrollY,
    scrollBehavior: root.style.scrollBehavior,
    body: LOCKED_PROPERTIES.map((property) => [property, body.style.getPropertyValue(property)] as const),
  };

  // `scroll-behavior: smooth` is set globally; restoring the scroll position must be instant.
  root.style.scrollBehavior = 'auto';

  // Pinning the body is the only scroll lock iOS Safari honours reliably. It also parks the
  // document at offset 0 for as long as the dialog is open, so a browser that mispositions a
  // top-layer dialog still lands it inside the viewport instead of above it.
  body.style.setProperty('position', 'fixed');
  body.style.setProperty('top', `${-scrollY}px`);
  body.style.setProperty('left', '0');
  body.style.setProperty('right', '0');
  body.style.setProperty('width', '100%');
  body.style.setProperty('overflow', 'hidden');
  if (scrollbarWidth > 0) body.style.setProperty('padding-inline-end', `${scrollbarWidth}px`);
}

function releaseLock() {
  if (!restorePoint) return;

  const root = document.documentElement;
  const { body } = document;
  const { scrollY, scrollBehavior, body: previous } = restorePoint;
  restorePoint = null;

  previous.forEach(([property, value]) => {
    if (value) body.style.setProperty(property, value);
    else body.style.removeProperty(property);
  });

  window.scrollTo(0, scrollY);
  if (scrollBehavior) root.style.setProperty('scroll-behavior', scrollBehavior);
  else root.style.removeProperty('scroll-behavior');
}

/**
 * Freezes the page behind a modal and returns the reader to their exact place on close.
 * Reference counted, so handing over from one dialog to another (product -> bag) keeps
 * the page still instead of unlocking and relocking at a different offset.
 */
export function useModalScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    if (lockCount === 1) applyLock();

    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [active]);
}
