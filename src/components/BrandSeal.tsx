import { type PointerEvent, useRef } from 'react';

const MAX_TILT_DEG = 14;

/**
 * The header logo as a domed seal: the brand's maroon mark in a copper-ringed disc. It tilts
 * towards a mouse pointer and its light follows it. Touch and reduced motion get the still seal.
 */
export function BrandSeal() {
  const discRef = useRef<HTMLSpanElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const disc = discRef.current;
    if (!disc || event.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = disc.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    disc.style.setProperty('--ry', `${(x * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
    disc.style.setProperty('--rx', `${(-y * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
    disc.style.setProperty('--lx', `${((x + 0.5) * 100).toFixed(1)}%`);
    disc.style.setProperty('--ly', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    const disc = discRef.current;
    if (!disc) return;
    for (const name of ['--rx', '--ry', '--lx', '--ly']) disc.style.removeProperty(name);
  };

  return (
    <span className="brand-seal" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <span ref={discRef} className="brand-seal__disc">
        <img src="/brand/mb-design-symbol.svg" alt="" width={1000} height={1000} className="brand-seal__mark" />
        <span className="brand-seal__light" aria-hidden="true" />
        <span className="brand-seal__sheen" aria-hidden="true" />
      </span>
    </span>
  );
}
