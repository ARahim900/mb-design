import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/usePremiumMotion';

const SESSION_KEY = 'mb-design:entered';
/** Hard ceiling. The panel leaves on this schedule whether or not anything else finished. */
const HOLD_MS = 1050;
const EXIT_MS = 1000;
/** Any of these means the reader is already reaching for the page, so the panel parts at once. */
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

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
 *    A tap, key, wheel or touch sends it away early, and it never takes a
 *    pointer event in the meantime.
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

    let toExit = 0;
    let toDone = 0;

    const leave = () => {
      window.clearTimeout(toExit);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, leave));
      setPhase('out');
      toDone = window.setTimeout(() => setPhase('done'), EXIT_MS);
    };

    toExit = window.setTimeout(leave, HOLD_MS);
    INTERACTION_EVENTS.forEach((type) => window.addEventListener(type, leave, { passive: true }));

    return () => {
      window.clearTimeout(toExit);
      window.clearTimeout(toDone);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, leave));
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
      {/* Centred in the safe area, not the raw screen, so on a phone on its side the lockup is
          never pushed towards the notch or the home indicator. */}
      <div className="absolute inset-0 flex items-center justify-center pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)]">
        <img
          src="/brand/mb-design-logo-light.svg"
          alt="MB Design"
          width={597}
          height={445}
          className="preloader__mark h-auto w-36 sm:w-44"
          decoding="async"
        />
      </div>
    </div>
  );
}
