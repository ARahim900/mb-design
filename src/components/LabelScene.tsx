import { useRef } from 'react';
import { copy, localize } from '../data/content';
import { pinnedProgress, useScrollProgress } from '../hooks/useScrollProgress';
import type { Locale } from '../types';

interface LabelSceneProps {
  readonly locale: Locale;
}

/** The neckline the label hangs from, shared by the fabric edge, collar band and seam. */
const NECKLINE = 'M0 150 Q300 250 600 150';

export function LabelScene({ locale }: LabelSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);
  useScrollProgress(sceneRef, pinnedProgress);

  return (
    <section ref={sceneRef} id="signature" aria-labelledby="signature-title" className="label-scene relative bg-[#1C0E15] text-pearl">
      <div className="label-scene__pin sticky top-0 grid h-svh overflow-hidden px-safe [--gutter:1.25rem] sm:[--gutter:2rem] lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:[--gutter:3.5rem] lg:[direction:ltr]">
        <div className="label-scene__copy relative z-10 max-w-md self-start pt-[calc(6.5rem+env(safe-area-inset-top))] lg:self-center lg:pt-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <h2 id="signature-title" className="display-heading text-[clamp(2.8rem,5vw,5rem)] leading-[1.1]">
            {localize(copy.label.title, locale)}
          </h2>
          <span className="my-5 block h-px w-14 bg-copper lg:my-7" aria-hidden="true" />
          <p className="text-base leading-8 text-pearl/80 sm:text-lg sm:leading-9">{localize(copy.label.body, locale)}</p>
        </div>

        <div className="label-scene__stage" role="img" aria-label={localize(copy.label.sceneAlt, locale)}>
          <div className="label-scene__garment">
            <svg className="label-scene__fabric" viewBox="0 0 600 600" aria-hidden="true">
              <defs>
                <filter id="crepe" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.05" numOctaves="2" seed="7" />
                  <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0.16 0" />
                </filter>
                <linearGradient id="fold" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#000" stopOpacity="0.45" />
                  <stop offset="0.5" stopColor="#000" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.45" />
                </linearGradient>
                <radialGradient id="sheen" cx="0.42" cy="0.34" r="0.55">
                  <stop offset="0" stopColor="#B86A86" stopOpacity="0.38" />
                  <stop offset="1" stopColor="#B86A86" stopOpacity="0" />
                </radialGradient>
                <clipPath id="garment-shape">
                  <path d={`${NECKLINE} L600 600 L0 600 Z`} />
                </clipPath>
                <mask id="seam-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
                  <path className="label-scene__seam-reveal" d={NECKLINE} fill="none" stroke="#fff" strokeWidth="12" pathLength={1} />
                </mask>
              </defs>
              <g clipPath="url(#garment-shape)">
                <rect width="600" height="600" fill="#3B1A2B" />
                <rect width="600" height="600" fill="url(#sheen)" />
                <rect width="600" height="600" filter="url(#crepe)" />
                <rect width="600" height="600" fill="url(#fold)" />
              </g>
              <path d={NECKLINE} fill="none" stroke="#4A2236" strokeWidth="34" />
              <path d={NECKLINE} fill="none" stroke="#F0C4A0" strokeOpacity="0.16" strokeWidth="2" transform="translate(0 -15)" />
              <path d={NECKLINE} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" transform="translate(0 18)" />
              <path d={NECKLINE} fill="none" stroke="#B8744D" strokeWidth="1.4" strokeDasharray="5 5" transform="translate(0 11)" mask="url(#seam-reveal)" />
            </svg>

            <div className="label-scene__label">
              <span className="label-scene__stitch label-scene__stitch--start" aria-hidden="true" />
              <img src="/brand/mb-design-logo-light.svg" alt="" width={597} height={445} className="relative h-[92%] w-auto" />
              <span className="label-scene__stitch label-scene__stitch--end" aria-hidden="true" />
            </div>

            <div className="label-scene__caption" aria-hidden="true">
              <span className="label-scene__leader" />
              <span className={locale === 'ar' ? 'text-sm text-copper' : 'font-latin text-xs uppercase tracking-editorial text-copper'}>
                {localize(copy.label.caption, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
