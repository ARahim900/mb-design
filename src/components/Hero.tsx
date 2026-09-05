import { Fragment } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { copy, localize } from '../data/content';
import { useMagnetic, useParallax } from '../hooks/usePremiumMotion';
import type { Locale } from '../types';

interface HeroProps {
  readonly locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const DirectionArrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const imageRef = useParallax<HTMLImageElement>(9);
  const ctaRef = useMagnetic<HTMLAnchorElement>();

  const title = localize(copy.hero.title, locale);
  // Split on whitespace ONLY. Arabic letters join to their neighbours, so
  // wrapping individual characters would force every letter into its isolated
  // form and destroy the word — the usual "split the headline into chars"
  // flourish is simply not available in this script.
  const words = title.split(' ');

  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-date text-pearl sm:min-h-[820px] lg:h-svh lg:min-h-[720px]">
      <img
        ref={imageRef}
        src="/assets/collection-v2/hero-plum.webp"
        alt={localize(copy.hero.imageAlt, locale)}
        // 114% of the frame so the parallax travel never exposes an edge.
        className="absolute inset-0 h-[114%] w-full object-cover object-[35%_center] sm:object-[42%_center] lg:object-center"
        decoding="async"
      />
      <div className="hero-wash absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-svh max-w-[1600px] px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-28 sm:min-h-[820px] sm:px-8 sm:pb-16 sm:pt-36 lg:h-full lg:min-h-[720px] lg:grid-cols-2 lg:px-10 lg:pb-16 lg:pt-28 lg:[direction:ltr]">
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
          className="absolute bottom-5 start-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center text-copper transition-colors hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-copper sm:flex"
          aria-label={localize(copy.hero.action, locale)}
        >
          <ArrowDown aria-hidden="true" size={22} strokeWidth={1.2} />
        </a>
      </div>
    </section>
  );
}
