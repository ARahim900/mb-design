import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/usePremiumMotion';

const SESSION_KEY = 'rizza:entered';
/** Hard ceiling. The panel leaves on this schedule whether or not anything else finished. */
const HOLD_MS = 1050;
const EXIT_MS = 1000;

/** sessionStorage throws outright in some privacy modes, so every touch is guarded. */
function alreadyEntered(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markEntered(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode — the sequence simply plays again next time */
  }
}

/**
 * The entry sequence: the lockup settles on the deep ground, then the panel
 * lifts away to the hero behind it.
 *
 * Three rules it must never break.
 *  - It cannot gate the page. The exit is on a fixed timer, never on a load
 *    event, so a stalled font or image can never leave a reader staring at it.
 *  - It plays once per tab, not once per navigation.
 *  - Under reduced motion it does not exist at all.
 *
 * It is `aria-hidden` and takes no focus, so assistive tech goes straight to
 * the page underneath while it is still on screen.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'in' | 'out' | 'done'>('idle');

  useEffect(() => {
    if (reduced || alreadyEntered()) {
      setPhase('done');
      return;
    }

    markEntered();
    setPhase('in');

    const toExit = window.setTimeout(() => setPhase('out'), HOLD_MS);
    const toDone = window.setTimeout(() => setPhase('done'), HOLD_MS + EXIT_MS);

    return () => {
      window.clearTimeout(toExit);
      window.clearTimeout(toDone);
    };
  }, [reduced]);

  if (phase === 'done' || phase === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      className={`preloader fixed inset-0 z-[60] ${phase === 'out' ? 'preloader--out' : ''}`}
    >
      <div className="preloader__half preloader__half--top" />
      <div className="preloader__half preloader__half--bottom" />
      <img
        src="/brand/rizza-primary-light.svg"
        alt=""
        className="preloader__mark absolute left-1/2 top-1/2 w-32 -translate-x-1/2 -translate-y-1/2 sm:w-40"
        decoding="async"
      />
    </div>
  );
}
