import { useEffect } from 'react';

interface Snapshot {
  readonly element: HTMLElement;
  readonly property: string;
  readonly value: string;
}

let lockCount = 0;
let snapshots: Snapshot[] = [];

/** Sets an inline style, remembering whatever was there so the release can put it back. */
function lockStyle(element: HTMLElement, property: string, value: string) {
  snapshots.push({ element, property, value: element.style.getPropertyValue(property) });
  element.style.setProperty(property, value);
}

function applyLock() {
  const root = document.documentElement;
  const { body } = document;
  const scrollbarWidth = window.innerWidth - root.clientWidth;

  // Hiding overflow on both the root and the body is what stops the page scrolling behind an
  // open dialog, Safari included. The document is deliberately NOT moved: the older trick of
  // pinning the body at a negative offset displaces anything the browser happens to position
  // against the body, which is the exact failure being fixed here. If some engine ignores this
  // and lets the page scroll anyway, the dialog stays pinned regardless — the page just drifts
  // behind it, which is cosmetic.
  lockStyle(root, 'overflow', 'hidden');
  lockStyle(body, 'overflow', 'hidden');

  // Removing the scrollbar would otherwise shift the page sideways under the backdrop.
  if (scrollbarWidth > 0) lockStyle(body, 'padding-inline-end', `${scrollbarWidth}px`);
}

function releaseLock() {
  for (let index = snapshots.length - 1; index >= 0; index -= 1) {
    const { element, property, value } = snapshots[index];
    if (value) element.style.setProperty(property, value);
    else element.style.removeProperty(property);
  }
  snapshots = [];
}

/**
 * Freezes the page behind a modal without moving it, so the reader keeps their place and
 * nothing can be displaced. Reference counted, so handing over from one dialog to another
 * (product -> bag) never releases and re-applies in between.
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
