import { Fragment } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, localize } from '../data/content';
import { useExitProgress, useMagnetic } from '../hooks/usePremiumMotion';
import type { Locale } from '../types';

interface HeroProps {
  readonly locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const exit = useExitProgress();

  const title = localize(copy.hero.title, locale);
  // Split on whitespace ONLY. Arabic letters join to their neighbours, so
  // wrapping individual characters would force every letter into its isolated
  // form and destroy the word — the usual "split the headline into chars"
  // flourish is simply not available in this script.
  const words = title.split(' ');

  return (
    /**
     * The hero is pinned behind the page rather than scrolling away with it:
     * the collection climbs over it and floods the first piece's colour across
     * the screen, so the two sections read as one move instead of two.
     *
     * `position: sticky` holds it there natively — nothing is hijacked, and
     * because the containing block is <main> it releases on its own at the end.
     *
     * The parallax that used to sit on this image is gone: a pinned image has
     * nothing to drift against, and it would have been a second writer on the
     * same transform as the exit scale.
     *
     * A pinned panel taller than the screen never shows its lower part, so the
     * tablet height is capped at the viewport rather than fixed at 820px.
     * Under reduced motion it is not pinned at all and simply scrolls away.
     */
    <section id="top" className="sticky top-0 z-0 h-svh overflow-hidden bg-date text-pearl motion-reduce:relative sm:max-lg:h-[min(820px,100svh)] lg:h-svh lg:min-h-[720px]">
      <img
        src="/assets/collection-v2/hero-plum.webp"
        alt={localize(copy.hero.imageAlt, locale)}
        className="absolute inset-0 h-full w-full object-cover object-[35%_center] sm:object-[42%_center] lg:object-center"
        // Recedes as it is covered, so the handover reads as the image pulling
        // back rather than the page sliding over a static picture.
        style={{
          transform: `scale(${1 - exit * 0.08})`,
          willChange: exit > 0 && exit < 1 ? 'transform' : 'auto',
        }}
        decoding="async"
      />
      <div className="hero-wash absolute inset-0" aria-hidden="true" />
      {/* Deepens as the collection climbs over it. Opacity only. */}
      <div className="absolute inset-0 bg-date" style={{ opacity: exit * 0.55 }} aria-hidden="true" />

      <div
        className="relative mx-auto grid h-full max-w-[1600px] px-safe pb-[calc(2rem+env(safe-area-inset-bottom))] pt-28 [--gutter:1.25rem] sm:pb-[calc(4rem+env(safe-area-inset-bottom))] sm:[--gutter:2rem] sm:max-lg:[@media(min-height:700px)]:pt-36 lg:grid-cols-2 lg:pb-16 lg:pt-28 lg:[--gutter:2.5rem] lg:[direction:ltr]"
        // The type leaves a little sooner than the image. That offset is what
        // stops the handover feeling like one flat sheet moving.
        style={{
          opacity: Math.max(0, 1 - exit * 1.35),
          transform: `translate3d(0, ${exit * -28}px, 0)`,
        }}
      >
        <div
          className="mt-auto w-full max-w-[350px] justify-self-end text-end sm:max-w-[430px] lg:col-start-2 lg:mb-10 lg:mt-0 lg:max-w-[560px] lg:self-center lg:justify-self-center"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* The heading carries its own accessible name so the cascade below is
              never read out word by word with a pause between each. */}
          <h1
            key={locale}
            aria-label={title}
            className="display-heading text-[clamp(3.8rem,17vw,8.5rem)] leading-[0.98] text-pearl [text-shadow:0_3px_24px_rgba(28,20,23,0.42)] sm:text-[clamp(4.2rem,8vw,8.5rem)]"
          >
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span
                  aria-hidden="true"
                  className="hero-word"
                  style={{ animationDelay: `${120 + index * 110}ms` }}
                >
                  <span>{word}</span>
                </span>
                {/* A real text node, not a space inside the span: an
                    inline-block trims its own trailing whitespace, which runs
                    the words together. Kept outside so the line can still
                    break between words. */}
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <span className="hero-enter my-5 block h-px w-16 bg-copper lg:my-8" style={{ animationDelay: `${120 + words.length * 110}ms` }} aria-hidden="true" />
          <a
            ref={ctaRef}
            className="hero-cta hero-enter group min-h-14 w-full max-w-[320px] px-6 py-3.5 sm:w-auto sm:min-w-[240px]"
            style={{ animationDelay: `${200 + words.length * 110}ms` }}
            href="#collection"
          >
            <span>{localize(copy.hero.action, locale)}</span>
            <DirectionArrow aria-hidden="true" size={18} strokeWidth={1.35} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </div>

        <a
          href="#collection"
          className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center text-copper transition-colors hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper sm:flex short:hidden"
          aria-label={localize(copy.hero.action, locale)}
        >
          <ArrowDown aria-hidden="true" size={22} strokeWidth={1.2} />
        </a>
      </div>
    </section>
  );
}
